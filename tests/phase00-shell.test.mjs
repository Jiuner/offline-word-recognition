import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const root=new URL('../',import.meta.url);
test('phase 0 project shell has required files',()=>{
 for(const f of ['index.html','css/app.css','js/app.js','js/router.js','package.json']) assert.equal(fs.existsSync(new URL(f,root)),true,f);
});
test('index has app mount and responsive viewport',()=>{const s=fs.readFileSync(new URL('index.html',root),'utf8');assert.match(s,/id="app"/);assert.match(s,/viewport/);});
test('router defines required routes',()=>{const s=fs.readFileSync(new URL('js/router.js',root),'utf8');for(const r of ['home','today','session','words','parent','complete']) assert.match(s,new RegExp(`['\"]${r}['\"]`));});
