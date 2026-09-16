export function shuffle(input,rng=Math.random){
 const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;
}
export function sample(input,count,rng=Math.random){return shuffle(input,rng).slice(0,Math.max(0,count));}
export function createSeededRandom(seed=1){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
