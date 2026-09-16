const INTERVALS=[1,3,7,14,30];
const REVIEW_GAMES=['listenFind','fixWord','wordPicture','buildWord','wordHunt'];
export function addDaysISO(date,days){const d=new Date(date);d.setUTCDate(d.getUTCDate()+days);return d.toISOString();}
export function scheduleNextReview(progress={},success=true,now=new Date()){
  const step=Math.max(0,Number(progress.reviewStep)||0);
  if(!success){return {reviewStep:Math.max(0,step-1),nextReviewAt:addDaysISO(now,1),status:'review'};}
  const nextStep=Math.min(step+1,INTERVALS.length-1);
  const interval=INTERVALS[Math.min(step,INTERVALS.length-1)];
  return {reviewStep:nextStep,nextReviewAt:addDaysISO(now,interval),status:progress.mastered?'mastered':'learning'};
}
export function accuracy(row){const total=(row?.correctCount||0)+(row?.wrongCount||0);return total?((row.correctCount||0)/total):0;}
export function selectReviewGames(gameRows=[],count=3){
  const map=new Map(gameRows.map(r=>[r.gameType,r]));
  const ranked=REVIEW_GAMES.map((gameType,i)=>({gameType,score:accuracy(map.get(gameType)),attempts:(map.get(gameType)?.correctCount||0)+(map.get(gameType)?.wrongCount||0),priority:i})).sort((a,b)=>a.score-b.score||a.attempts-b.attempts||b.priority-a.priority);
  const chosen=ranked.slice(0,Math.max(2,Math.min(count,3))).map(x=>x.gameType);
  if(!chosen.includes('wordHunt')&&chosen.length>=3)chosen[chosen.length-1]='wordHunt';
  return [...new Set(chosen)];
}
export function reviewIntervals(){return [...INTERVALS];}
