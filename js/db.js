const DB_NAME='wordRecognitionDB';
let adapter=null;
export function __setAdapter(value){ adapter=value; }
export function __resetAdapter(){ adapter=null; }
export const DB_VERSION=1;
export const STORES=Object.freeze(['wordProgress','gameProgress','reviewHistory','settings','appMetadata','todayPlans','imageRotation']);

export function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('wordProgress')) db.createObjectStore('wordProgress',{keyPath:'wordId'});
      if(!db.objectStoreNames.contains('gameProgress')) db.createObjectStore('gameProgress',{keyPath:'id'});
      if(!db.objectStoreNames.contains('reviewHistory')){const s=db.createObjectStore('reviewHistory',{keyPath:'id'});s.createIndex('wordId','wordId');s.createIndex('playedAt','playedAt');}
      if(!db.objectStoreNames.contains('settings')) db.createObjectStore('settings',{keyPath:'key'});
      if(!db.objectStoreNames.contains('appMetadata')) db.createObjectStore('appMetadata',{keyPath:'key'});
      if(!db.objectStoreNames.contains('todayPlans')) db.createObjectStore('todayPlans',{keyPath:'date'});
      if(!db.objectStoreNames.contains('imageRotation')) db.createObjectStore('imageRotation',{keyPath:'wordId'});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function withStore(name,mode,fn){
  const db=await openDB();
  try{return await new Promise((resolve,reject)=>{const tx=db.transaction(name,mode);const store=tx.objectStore(name);let val;try{val=fn(store,tx,resolve,reject);}catch(e){reject(e)}tx.oncomplete=()=>{if(val!==undefined)resolve(val)};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('transaction aborted'));});}
  finally{db.close();}
}

export async function put(storeName,value){if(adapter)return adapter.put(storeName,value);return withStore(storeName,'readwrite',(s)=>s.put(value));}
export async function get(storeName,key){if(adapter)return adapter.get(storeName,key);return withStore(storeName,'readonly',(s,tx,resolve,reject)=>{const r=s.get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function getAll(storeName){if(adapter)return adapter.getAll(storeName);return withStore(storeName,'readonly',(s,tx,resolve,reject)=>{const r=s.getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);});}
export async function del(storeName,key){if(adapter)return adapter.del(storeName,key);return withStore(storeName,'readwrite',(s)=>s.delete(key));}
export async function clear(storeName){if(adapter)return adapter.clear(storeName);return withStore(storeName,'readwrite',(s)=>s.clear());}
export async function clearAll(){for(const s of STORES) await clear(s);}

export async function ensureDefaults(){
  const defaults={dailyNewWords:5,maxDailyReviews:20,autoPlayAudio:true,picturePolicy:'rotate',reviewMode:'adaptive',disabledWords:[]};
  for(const [key,value] of Object.entries(defaults)) if((await get('settings',key))===undefined) await put('settings',{key,value});
  if((await get('appMetadata','schemaVersion'))===undefined) await put('appMetadata',{key:'schemaVersion',value:DB_VERSION});
  return defaults;
}

export async function getSettings(){
  const rows=await getAll('settings');return Object.fromEntries(rows.map(r=>[r.key,r.value]));
}
export async function setSetting(key,value){return put('settings',{key,value});}

export async function upsertWordProgress(wordId,patch={}){
  const now=new Date().toISOString();
  const old=await get('wordProgress',wordId)||{wordId,status:'unlearned',learned:false,mastered:false,masteryLevel:0,correctCount:0,wrongCount:0,consecutiveCorrect:0};
  const next={...old,...patch,wordId,updatedAt:now};await put('wordProgress',next);return next;
}

export async function recordAttempt({wordId,gameType,correct,responseTimeMs=0,metadata={}}){
  const now=new Date().toISOString();
  const id=(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`);
  const hist={id,wordId,gameType,correct:Boolean(correct),responseTimeMs:Number(responseTimeMs)||0,playedAt:now,metadata};
  await put('reviewHistory',hist);
  const gpId=`${wordId}::${gameType}`;
  const gp=await get('gameProgress',gpId)||{id:gpId,wordId,gameType,correctCount:0,wrongCount:0,totalResponseTimeMs:0,attempts:0};
  gp.attempts++;gp.totalResponseTimeMs+=hist.responseTimeMs;if(correct)gp.correctCount++;else gp.wrongCount++;gp.lastPlayedAt=now;gp.averageResponseTimeMs=Math.round(gp.totalResponseTimeMs/gp.attempts);await put('gameProgress',gp);
  const wp=await get('wordProgress',wordId)||{wordId,status:'learning',learned:true,mastered:false,masteryLevel:0,correctCount:0,wrongCount:0,consecutiveCorrect:0,firstLearnedAt:now};
  wp.learned=true;wp.status=wp.status==='unlearned'?'learning':wp.status;wp.firstLearnedAt=wp.firstLearnedAt||now;wp.lastReviewedAt=now;if(correct){wp.correctCount=(wp.correctCount||0)+1;wp.consecutiveCorrect=(wp.consecutiveCorrect||0)+1;}else{wp.wrongCount=(wp.wrongCount||0)+1;wp.consecutiveCorrect=0;}await put('wordProgress',wp);
  return {history:hist,gameProgress:gp,wordProgress:wp};
}
