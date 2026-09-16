let cache=null;
export async function loadWords(){
  if(cache) return cache;
  const res=await fetch('./data/words.json',{cache:'no-store'});
  if(!res.ok) throw new Error(`words.json ${res.status}`);
  const data=await res.json();
  validateWordData(data);
  cache=data;
  return cache;
}
export function validateWordData(data){
  if(!Array.isArray(data)||data.length===0) throw new Error('Word data must be a non-empty array');
  const ids=new Set();
  for(const w of data){
    for(const k of ['id','word','audioPath']) if(!w[k]) throw new Error(`Missing ${k}`);
    if(ids.has(w.id)) throw new Error(`Duplicate id: ${w.id}`);ids.add(w.id);
    if(!Array.isArray(w.chunks)||w.chunks.length<1) throw new Error(`${w.id}: chunks required`);
    if(!Array.isArray(w.chunkAudioPaths)||w.chunkAudioPaths.length!==w.chunks.length) throw new Error(`${w.id}: chunk audio mismatch`);
    if(!Array.isArray(w.imagePaths)||w.imagePaths.length<2) throw new Error(`${w.id}: at least 2 images required`);
    if(!Array.isArray(w.sentences)||w.sentences.length<1) throw new Error(`${w.id}: sentence required`);
    if(!Array.isArray(w.distractors)||w.distractors.length<2) throw new Error(`${w.id}: distractors required`);
  }
  return true;
}
export function getWord(data,id){return data.find(w=>w.id===id)||null;}
