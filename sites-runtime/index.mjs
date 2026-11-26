import { createWorkerStore } from './store.mjs';
import { prepareCatalog } from './catalog.mjs';
import { assets, expectedOrigin } from './generated.mjs';

const headers={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'"
};
function json(body,status=200,extra={}) {
  return Response.json(body,{status,headers:{...headers,'Cache-Control':'no-store',...extra}});
}
async function input(request){
  const reader=request.body?.getReader();
  let size=0;
  const decoder=new TextDecoder();
  let text='';
  if(reader) for(;;){
    const {value,done}=await reader.read();if(done)break;
    size+=value.byteLength;
    if(size>5*1024*1024){
      await reader.cancel();
      throw Object.assign(Error('The request exceeds 5 MB.'),{status:413});
    }
    text+=decoder.decode(value,{stream:true});
  }
  text+=decoder.decode();
  const body=JSON.parse(text);
  if(!body||typeof body!=='object'||Array.isArray(body)) throw Object.assign(Error('Expected a JSON object.'),{status:400});
  return body;
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(url.pathname==='/healthz' && request.method==='GET') return json({ready:Boolean(env.DB)},env.DB?200:503);
    if(!url.pathname.startsWith('/api/')){
      if(!['GET','HEAD'].includes(request.method)) return json({error:'Method not allowed.'},405);
      const asset=Object.hasOwn(assets,url.pathname)?assets[url.pathname]:null;
      if(!asset) return json({error:'Page not found.'},404);
      const [type,encoded]=asset;
      const bytes=request.method==='HEAD'?null:Uint8Array.from(atob(encoded),char=>char.charCodeAt(0));
      return new Response(bytes,{headers:{...headers,'Content-Type':type,'Cache-Control':url.pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'}});
    }
    if(request.method!=='POST') return json({error:'Method not allowed.'},405);
    const origin=request.headers.get('Origin');
    const allowed=env.APP_ORIGIN||expectedOrigin||url.origin;
    if(origin!==allowed || !request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')){
      return json({error:'Request origin or content type rejected.'},403);
    }
    let body;
    try{body=await input(request);}catch(error){return json({error:error.status?error.message:'Invalid JSON.'},error.status||400);}
    try{
      if(!env.DB) throw Error('D1 database binding is unavailable');
      if(!await prepareCatalog(env.DB)) return json({error:'Preparing the question bank…',code:'initializing'},503,{'Retry-After':'1'});
      const store=createWorkerStore(env.DB,{adminPassword:env.AFCAT_ADMIN_PASSWORD,aiKey:env.OPENAI_API_KEY,aiModel:env.OPENAI_MODEL});
      const token=request.headers.get('Cookie')?.match(/(?:^|;\s*)afcat_sid=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1]??'';
      const result=await store.api(url.pathname.slice(5),body,token,request.headers.get('CF-Connecting-IP')??'local');
      if(Object.hasOwn(result,'cookie')) {
        const cookie='afcat_sid='+result.cookie+'; Path=/; HttpOnly; SameSite=Lax; Max-Age='+(result.cookie?2592000:0)+(allowed.startsWith('https:')?'; Secure':'');
        return json(result.value,200,{'Set-Cookie':cookie});
      }
      return json(result);
    }catch(error){
      if(error.name==='ZodError')return json({error:error.issues.map(issue=>[issue.path.join('.'),issue.message].filter(Boolean).join(' ')).join('; ')},400);
      if(!error.status)console.error(error);
      return json({error:error.status?error.message:'Something went wrong. Please retry.'},error.status||500);
    }
  }
};
