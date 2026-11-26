import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { createStore } from './store.mjs';

process.umask(0o077);
const dev=process.argv.includes('--dev');
const host=process.env.HOST || '127.0.0.1';
const port=Number(process.env.PORT || 5173);
const managedOrigin=process.env.RENDER_EXTERNAL_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://'+process.env.RAILWAY_PUBLIC_DOMAIN : undefined);
const origin=new URL(process.env.APP_ORIGIN || managedOrigin || ('http://'+host+':'+port)).origin;
const store=createStore(process.env.AFCAT_DB || 'var/afcat.sqlite',{
  adminPassword:process.env.AFCAT_ADMIN_PASSWORD,aiKey:process.env.OPENAI_API_KEY,aiModel:process.env.OPENAI_MODEL
});
const vite=dev?await (await import('vite')).createServer({server:{middlewareMode:true,hmr:false},appType:'spa'}):null;
const root=resolve('dist');
const mimes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon'};
function send(res,status,payload) {
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(payload));
}
const server=createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  if(!dev) res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/healthz' && ['GET','HEAD'].includes(req.method)){
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
    res.end(req.method==='HEAD'?undefined:'ok');
    return;
  }
  if(!url.pathname.startsWith('/api/')){
    if(vite){
      const protectedPath=/(^|\/)(data|server|migrations|var|\.git|\.env)(\/|\.|$)/;
      let decoded;
      try {decoded=decodeURIComponent(url.pathname);} catch {send(res,400,{error:'Invalid path.'});return;}
      if(protectedPath.test(decoded)){send(res,404,{error:'File not found.'});return;}
      vite.middlewares(req,res,()=>send(res,404,{error:'Page not found.'}));return;}
    if(!['GET','HEAD'].includes(req.method)){send(res,405,{error:'Method not allowed.'});return;}
    const path=resolve(root,'.'+url.pathname);
    if(path!==root&&!path.startsWith(root+sep)){send(res,404,{error:'Page not found.'});return;}
    let file=path;
    try { if(!statSync(file).isFile()) file=resolve(root,'index.html'); }
    catch { if(extname(url.pathname)){send(res,404,{error:'File not found.'});return;}file=resolve(root,'index.html'); }
    try { statSync(file); } catch {send(res,503,{error:'Run npm run build first.'});return;}
    res.writeHead(200,{'Content-Type':mimes[extname(file)]||'application/octet-stream','Cache-Control':file.startsWith(resolve(root,'assets')+sep)?'public, max-age=31536000, immutable':'no-cache'});
    if(req.method==='HEAD') res.end(); else createReadStream(file).pipe(res);
    return;
  }
  if(req.method!=='POST'){send(res,405,{error:'Method not allowed.'});return;}
  if(req.headers.origin!==origin || !req.headers['content-type']?.toLowerCase().startsWith('application/json')){
    send(res,403,{error:'Request origin or content type rejected.'});return;
  }
  const token=(req.headers.cookie??'').match(/(?:^|;\s*)afcat_sid=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1]??'';
  try {
    let bytes=0;const chunks=[];
    for await(const chunk of req) {
      bytes+=chunk.length;
      if(bytes>5*1024*1024){send(res,413,{error:'The request exceeds 5 MB.'});return;}
      chunks.push(chunk);
    }
    let data;
    try {data=JSON.parse(Buffer.concat(chunks).toString());} catch {send(res,400,{error:'Invalid JSON.'});return;}
    if(!data || typeof data!=='object' || Array.isArray(data)){send(res,400,{error:'Expected a JSON object.'});return;}
    const result=await store.api(url.pathname.slice(5),data,token,req.socket.remoteAddress);
    if(Object.hasOwn(result,'cookie')) res.setHeader('Set-Cookie','afcat_sid='+result.cookie+'; Path=/; HttpOnly; SameSite=Lax; Max-Age='+(result.cookie?2592000:0)+(origin.startsWith('https:')?'; Secure':''));
    send(res,200,Object.hasOwn(result,'cookie')?result.value:result);
  } catch(error) {
    if(error.name==='ZodError'){send(res,400,{error:error.issues.map(issue=>[issue.path.join('.'),issue.message].filter(Boolean).join(' ')).join('; ')});return;}
    if(!error.status) console.error(error);
    send(res,error.status||500,{error:error.status?error.message:'Something went wrong. Please retry.'});
  }
});
const sweep=setInterval(()=>{try{store.expire();}catch(error){console.error(error);}},20_000);
sweep.unref();
server.listen(port,host,()=>console.log('AFCAT Command Center listening at '+host+':'+port+' (origin '+origin+')'));
for(const signal of ['SIGTERM','SIGINT']) process.once(signal,()=>{clearInterval(sweep);server.close(async()=>{await vite?.close();store.close();});});
