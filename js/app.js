import {initRouter,onRouteChange,navigate} from './router.js';
import {ensureDefaults,getAll,get} from './db.js';
import {homeView,todayView,wordsView,parentView,completeView,nav} from './ui.js';
import {createSessionRuntime,renderSession} from './session.js';
import {saveLearningSettings,toggleWordEnabled} from './parent.js';
import {regenerateTodayPlan} from './today.js';
import {exportBackup,parseBackupFile,previewBackup,restoreBackup} from './backup.js';
import {loadWords,getWord} from './data.js';

export const APP_VERSION='1.0.0';export const DB_VERSION=1;export const ASSET_VERSION='1';
const app=document.querySelector('#app');let runtime=null;let pendingRestore=null;

function bindNav(){app.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));app.querySelectorAll('[data-action="start"]').forEach(b=>b.addEventListener('click',()=>{runtime=null;navigate('session')}));}
async function bindWords(){
 const words=await loadWords();const progress=await getAll('wordProgress');const pmap=new Map(progress.map(p=>[p.wordId,p]));
 app.querySelectorAll('[data-word-id]').forEach(b=>b.addEventListener('click',()=>{const w=getWord(words,b.dataset.wordId),p=pmap.get(w.id)||{};let panel=app.querySelector('[data-word-detail]');if(!panel){panel=document.createElement('section');panel.className='card';panel.dataset.wordDetail='';app.querySelector('main').appendChild(panel);}panel.innerHTML=`<div class="eyebrow">WORD DETAILS</div><h2>${w.word}</h2><div class="grid-2"><div><span class="muted">Mastery</span><br><strong>${p.masteryLevel||0} / 5</strong></div><div><span class="muted">Status</span><br><strong>${p.status||'unlearned'}</strong></div><div><span class="muted">First learned</span><br><strong>${p.firstLearnedAt?String(p.firstLearnedAt).slice(0,10):'—'}</strong></div><div><span class="muted">Next review</span><br><strong>${p.nextReviewAt?String(p.nextReviewAt).slice(0,10):'—'}</strong></div></div>`;}));
}
async function bindParent(){
 const form=app.querySelector('[data-settings-form]');if(form)form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form);await saveLearningSettings({dailyNewWords:fd.get('dailyNewWords'),maxDailyReviews:fd.get('maxDailyReviews'),autoPlayAudio:fd.get('autoPlayAudio')==='on'});await regenerateTodayPlan();form.querySelector('[data-settings-result]').textContent='已儲存';});
 app.querySelectorAll('[data-toggle-word]').forEach(b=>b.addEventListener('click',async()=>{const enabled=b.dataset.enabled==='true';await toggleWordEnabled(b.dataset.toggleWord,!enabled);await regenerateTodayPlan();await render('parent');}));
 const exp=app.querySelector('[data-export-backup]');if(exp)exp.addEventListener('click',async()=>{await exportBackup();app.querySelector('[data-backup-message]').textContent='備份檔已建立。';});
 const input=app.querySelector('[data-import-backup]');if(input)input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;const msg=app.querySelector('[data-backup-message]');try{pendingRestore=await parseBackupFile(file);const p=previewBackup(pendingRestore);app.querySelector('[data-preview-fields]').innerHTML=`版本：v${p.version}<br>備份日期：${p.date}<br>已學單字：${p.learned}<br>已熟練：${p.mastered}<br>答題紀錄：${p.records}`;app.querySelector('[data-restore-preview]').classList.remove('hidden');msg.textContent='已通過備份檔檢查，尚未寫入資料。';}catch(err){pendingRestore=null;app.querySelector('[data-restore-preview]').classList.add('hidden');msg.textContent=`無法讀取：${err.message}`;}});
 const confirm=app.querySelector('[data-confirm-restore]');if(confirm)confirm.addEventListener('click',async()=>{if(!pendingRestore)return;await restoreBackup(pendingRestore);pendingRestore=null;await regenerateTodayPlan();await render('parent');});
 const cancel=app.querySelector('[data-cancel-restore]');if(cancel)cancel.addEventListener('click',()=>{pendingRestore=null;app.querySelector('[data-restore-preview]').classList.add('hidden');app.querySelector('[data-backup-message]').textContent='已取消。';});
}
function placeholder(title,active='home'){return `<main class="stack"><section class="card"><div class="eyebrow">WORD STEPS</div><h1>${title}</h1></section></main>${nav(active)}`;}
export async function render(route){
 try{
  if(route==='home')app.innerHTML=await homeView();
  else if(route==='today')app.innerHTML=await todayView();
  else if(route==='words')app.innerHTML=await wordsView();
  else if(route==='parent')app.innerHTML=await parentView();
  else if(route==='complete')app.innerHTML=completeView();
  else if(route==='session'){runtime=runtime||await createSessionRuntime();if(runtime.controller.isComplete()){navigate('complete');return;}app.innerHTML='<main data-session-host></main>';await renderSession(app.querySelector('[data-session-host]'),runtime,{onComplete:()=>navigate('complete')});return;}
  else app.innerHTML=placeholder('Home','home');
  bindNav();if(route==='words')await bindWords();if(route==='parent')await bindParent();
 }catch(e){app.innerHTML=`<main class="card"><h1>App error</h1><pre>${String(e?.stack||e)}</pre><button class="btn" data-nav="home">Home</button></main>`;bindNav();}
}
async function boot(){await ensureDefaults();const start=initRouter();onRouteChange(r=>render(r));await render(start);if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
boot();
