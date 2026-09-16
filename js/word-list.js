import {getAll} from './db.js';import {loadWords} from './data.js';
export function categorizeWords(words,progress){
 const pmap=new Map(progress.map(p=>[p.wordId,p]));
 const out={learning:[],mastered:[],review:[]};
 for(const w of words){const p=pmap.get(w.id);if(!p?.learned)continue;const row={...w,progress:p};if(p.mastered||p.status==='mastered')out.mastered.push(row);else if(p.status==='review')out.review.push(row);else out.learning.push(row);}
 return out;
}
export async function getCategorizedWords(){const [words,p]=await Promise.all([loadWords(),getAll('wordProgress')]);return categorizeWords(words,p);}
