import {loadWords} from './data.js';import {getAll,getSettings,get,put} from './db.js';
export function localDateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function generateTodayPlan({words,progress,settings,dateKey=localDateKey()}){
 const pmap=new Map(progress.map(p=>[p.wordId,p]));
 const disabled=new Set(settings.disabledWords||[]);
 const due=progress.filter(p=>p.learned&&!p.mastered&&!disabled.has(p.wordId)&&p.nextReviewAt&&String(p.nextReviewAt).slice(0,10)<=dateKey).sort((a,b)=>String(a.nextReviewAt).localeCompare(String(b.nextReviewAt))).slice(0,settings.maxDailyReviews??20).map(p=>p.wordId);
 const fresh=words.filter(w=>w.enabled&&!disabled.has(w.id)&&!pmap.get(w.id)?.learned).slice(0,settings.dailyNewWords??5).map(w=>w.id);
 return {date:dateKey,newWords:fresh,reviewWords:due,sessionWords:[...due,...fresh]};
}
export async function getTodayPlan({force=false}={}){
 const date=localDateKey(); if(!force){const saved=await get('todayPlans',date);if(saved)return saved;}
 const [words,progress,settings]=await Promise.all([loadWords(),getAll('wordProgress'),getSettings()]);
 const plan=generateTodayPlan({words,progress,settings,dateKey:date});await put('todayPlans',plan);return plan;
}
export async function regenerateTodayPlan(){return getTodayPlan({force:true});}
