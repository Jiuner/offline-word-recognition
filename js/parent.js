import {loadWords} from './data.js';import {getSettings,setSetting,getAll} from './db.js';import {getProgressSummary} from './stats.js';
export async function getParentData(){
  const [words,settings,stats,history,games]=await Promise.all([loadWords(),getSettings(),getProgressSummary(),getAll('reviewHistory'),getAll('gameProgress')]);
  const disabled=new Set(settings.disabledWords||[]);
  const library=words.map(w=>({id:w.id,word:w.word,enabled:!disabled.has(w.id),images:w.imagePaths.length,audio:Boolean(w.audioPath),chunks:w.chunks.length,sentences:w.sentences.length}));
  return {words,settings,stats,historyCount:history.length,games,library};
}
export async function toggleWordEnabled(wordId,enabled){const settings=await getSettings();const disabled=new Set(settings.disabledWords||[]);if(enabled)disabled.delete(wordId);else disabled.add(wordId);await setSetting('disabledWords',[...disabled]);return !disabled.has(wordId);}
export function normalizeSettings(input){return {dailyNewWords:Math.max(1,Math.min(20,Number(input.dailyNewWords)||5)),maxDailyReviews:Math.max(1,Math.min(100,Number(input.maxDailyReviews)||20)),autoPlayAudio:Boolean(input.autoPlayAudio),picturePolicy:'rotate',reviewMode:'adaptive'};}
export async function saveLearningSettings(input){const n=normalizeSettings(input);for(const [k,v] of Object.entries(n))await setSetting(k,v);return n;}
