import { defineConfig } from 'vite';
export default defineConfig({
  build:{target:'es2022'},
  server:{fs:{deny:['.env','.env.*','*.{crt,pem,key}','**/.git/**','**/data/**','**/server/**','**/migrations/**','**/var/**','**/*.sqlite*']}}
});
