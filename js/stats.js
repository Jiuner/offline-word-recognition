import {getAll} from './db.js';
export function summarizeProgress(rows){
  const learned=rows.filter(r=>r.learned).length;
  const mastered=rows.filter(r=>r.mastered||r.status==='mastered').length;
  const review=rows.filter(r=>r.status==='review').length;
  const learning=rows.filter(r=>r.learned&&!r.mastered&&r.status!=='review').length;
  return {learned,mastered,learning,review};
}
export async function getProgressSummary(){return summarizeProgress(await getAll('wordProgress'));}
