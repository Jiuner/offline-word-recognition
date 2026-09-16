import {get,getAll,upsertWordProgress} from './db.js';
export function calculateMastery({wordProgress={},gameProgress=[],history=[]}){
  const passed=new Set(gameProgress.filter(g=>(g.correctCount||0)>0).map(g=>g.gameType));
  const learned=Boolean(wordProgress.learned||history.length);
  if(!learned)return {level:0,mastered:false,passedGames:[]};
  let level=0;
  if(passed.has('listenFind')) level=Math.max(level,1);
  if(passed.has('wordPicture')) level=Math.max(level,2);
  if(passed.has('fixWord')||passed.has('buildWord')) level=Math.max(level,3);
  if(passed.size>=4&&passed.has('listenFind')&&(passed.has('fixWord')||passed.has('buildWord'))) level=Math.max(level,4);
  const dates=new Set(history.filter(h=>h.correct).map(h=>String(h.playedAt).slice(0,10)));
  const masteryEvidence=dates.size>=2&&passed.has('listenFind')&&passed.has('buildWord')&&passed.has('wordHunt');
  if(masteryEvidence)level=5;
  return {level,mastered:level===5,passedGames:[...passed],distinctCorrectDates:dates.size};
}
export async function updateMastery(wordId){
  const [wp,gps,hist]=await Promise.all([get('wordProgress',wordId),getAll('gameProgress'),getAll('reviewHistory')]);
  const result=calculateMastery({wordProgress:wp||{},gameProgress:gps.filter(x=>x.wordId===wordId),history:hist.filter(x=>x.wordId===wordId)});
  return upsertWordProgress(wordId,{masteryLevel:result.level,mastered:result.mastered,status:result.mastered?'mastered':(wp?.status==='review'?'review':'learning')});
}
