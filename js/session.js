import {loadWords,getWord} from './data.js';
import {getTodayPlan} from './today.js';
import {recordAttempt,get,put,upsertWordProgress,getAll,getSettings} from './db.js';
import {playLocalAudio} from './audio.js';
import {renderListenFind} from '../games/listen-find.js';
import {renderBreakBlend} from '../games/break-blend.js';
import {renderFixWord} from '../games/fix-word.js';
import {createWordPictureRound,renderWordPicture} from '../games/word-picture.js';
import {renderBuildWord} from '../games/build-word.js';
import {renderWordHunt} from '../games/word-hunt.js';
import {selectReviewGames,scheduleNextReview} from './review-engine.js';
import {updateMastery} from './mastery.js';

export const FULL_GAME_ORDER=Object.freeze(['listenFind','breakBlend','fixWord','wordPicture','buildWord','wordHunt']);

export class SessionController{
  constructor(tasks=[]){this.tasks=tasks;this.index=0;}
  current(){return this.tasks[this.index]||null;}
  advance(){if(this.index<this.tasks.length)this.index++;return this.current();}
  isComplete(){return this.index>=this.tasks.length;}
  progress(){return {current:Math.min(this.index+1,this.tasks.length),total:this.tasks.length,completed:Math.min(this.index,this.tasks.length)};}
}
export function buildSessionTasks(plan,gameSelector=()=>FULL_GAME_ORDER){
  const tasks=[];
  for(const id of plan.sessionWords){const kind=plan.reviewWords.includes(id)?'review':'new';for(const gameType of gameSelector(id,kind))tasks.push({wordId:id,kind,gameType});}
  return tasks;
}

export async function createSessionRuntime(){
  const [words,plan,gameRows,settings]=await Promise.all([loadWords(),getTodayPlan(),getAll('gameProgress'),getSettings()]);
  const selector=(wordId,kind)=> kind==='new' ? FULL_GAME_ORDER : selectReviewGames(gameRows.filter(r=>r.wordId===wordId),3);
  const controller=new SessionController(buildSessionTasks(plan,selector));
  return {words,plan,controller,settings};
}

export async function renderSession(container,runtime,{onComplete}={}){
  const task=runtime.controller.current();
  if(!task){onComplete?.();return;}
  const word=getWord(runtime.words,task.wordId);if(!word)throw new Error(`Missing word ${task.wordId}`);
  const outer=document.createElement('div');
  const p=runtime.controller.progress();
  container.innerHTML=`<main class="stack" data-view="session"><section class="card"><div class="row between"><div><div class="eyebrow">WORD SESSION</div><strong>Practice</strong></div><div>${p.current} / ${p.total}</div></div><div class="progress-track" style="margin-top:12px"><div class="progress-fill" style="width:${p.total?p.completed/p.total*100:0}%"></div></div></section><div data-game></div></main>`;
  const gameHost=container.querySelector('[data-game]');
  let resolved=false;
  const handle=async(result)=>{
    await recordAttempt({wordId:word.id,gameType:task.gameType,correct:result.correct,responseTimeMs:result.responseTimeMs||0,metadata:result.metadata||{}});
    if(!result.correct){
      const wp=await get('wordProgress',word.id)||{};
      await upsertWordProgress(word.id,scheduleNextReview(wp,false,new Date()));
      return;
    }
    if(resolved)return;
    resolved=true;
    await upsertWordProgress(word.id,{learned:true,status:'learning'});
    const mastered=await updateMastery(word.id);
    const nextTask=runtime.controller.tasks[runtime.controller.index+1];
    const finishesWord=!nextTask||nextTask.wordId!==word.id;
    if(finishesWord)await upsertWordProgress(word.id,scheduleNextReview(mastered,true,new Date()));
    runtime.controller.advance();
    setTimeout(()=>renderSession(container,runtime,{onComplete}),250);
  };
  if(task.gameType==='listenFind'){renderListenFind(gameHost,{word,playAudio:playLocalAudio,onResult:handle});if(runtime.settings?.autoPlayAudio)playLocalAudio(word.audioPath).catch(()=>{});}
  else if(task.gameType==='breakBlend') renderBreakBlend(gameHost,{word,playAudio:playLocalAudio,onResult:handle});
  else if(task.gameType==='fixWord') renderFixWord(gameHost,{word,onResult:handle});
  else if(task.gameType==='wordPicture'){
    const rotation=await get('imageRotation',word.id)||{wordId:word.id,last:null,remaining:[]};
    const mode=(Date.now()+runtime.controller.index)%2===0?'wordToPicture':'pictureToWord';
    const round=createWordPictureRound({word,allWords:runtime.words,mode,targetRotation:rotation});
    await put('imageRotation',{wordId:word.id,...round.nextRotation});
    renderWordPicture(gameHost,{round,onResult:handle});
  }
  else if(task.gameType==='buildWord'){renderBuildWord(gameHost,{word,playAudio:playLocalAudio,onResult:handle});if(runtime.settings?.autoPlayAudio)playLocalAudio(word.audioPath).catch(()=>{});}
  else if(task.gameType==='wordHunt') renderWordHunt(gameHost,{word,onResult:handle});
  else throw new Error(`Unknown game ${task.gameType}`);
}
