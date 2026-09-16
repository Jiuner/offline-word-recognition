import {getAll,get,put,clear} from './db.js';
export const BACKUP_APP='offline-word-recognition';
export const BACKUP_VERSION=1;
export const BACKUP_STORES=['wordProgress','gameProgress','reviewHistory','settings','appMetadata'];
export async function createBackupObject(now=new Date()){
  const [wordProgress,gameProgress,reviewHistory,settingsRows,metadataRows]=await Promise.all(BACKUP_STORES.map(s=>getAll(s)));
  const settings=Object.fromEntries(settingsRows.map(r=>[r.key,r.value]));
  const metadata=Object.fromEntries(metadataRows.map(r=>[r.key,r.value]));
  return {app:BACKUP_APP,backupVersion:BACKUP_VERSION,exportedAt:now.toISOString(),wordProgress,gameProgress,reviewHistory,settings,metadata};
}
export function backupFilename(now=new Date()){const d=now.toISOString().slice(0,10);return `word-app-backup-${d}.json`;}
export async function exportBackup(){
  const obj=await createBackupObject();const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=backupFilename();document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return obj;
}
export function validateBackup(data){
  if(!data||typeof data!=='object')throw new Error('Invalid backup: object required');
  if(data.app!==BACKUP_APP)throw new Error('Invalid backup: app id');
  if(data.backupVersion!==BACKUP_VERSION)throw new Error('Unsupported backup version');
  for(const k of ['wordProgress','gameProgress','reviewHistory'])if(!Array.isArray(data[k]))throw new Error(`Invalid backup: ${k}`);
  if(!data.settings||typeof data.settings!=='object'||Array.isArray(data.settings))throw new Error('Invalid backup: settings');
  if(!data.metadata||typeof data.metadata!=='object'||Array.isArray(data.metadata))throw new Error('Invalid backup: metadata');
  return true;
}
export function previewBackup(data){validateBackup(data);return {version:data.backupVersion,date:data.exportedAt||'',learned:data.wordProgress.filter(x=>x.learned).length,mastered:data.wordProgress.filter(x=>x.mastered||x.status==='mastered').length,records:data.reviewHistory.length};}
export async function restoreBackup(data){
  validateBackup(data);
  const rowsByStore={wordProgress:data.wordProgress,gameProgress:data.gameProgress,reviewHistory:data.reviewHistory,settings:Object.entries(data.settings).map(([key,value])=>({key,value})),appMetadata:Object.entries(data.metadata).map(([key,value])=>({key,value}))};
  for(const s of BACKUP_STORES)await clear(s);
  for(const [store,rows] of Object.entries(rowsByStore))for(const row of rows)await put(store,row);
  return previewBackup(data);
}
export async function parseBackupFile(file){const text=await file.text();let data;try{data=JSON.parse(text);}catch{throw new Error('Invalid JSON');}validateBackup(data);return data;}
