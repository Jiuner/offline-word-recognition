export function memoryAdapter(){
  const db=new Map();
  const store=n=>{if(!db.has(n))db.set(n,new Map());return db.get(n)};
  const keyOf=(n,v)=> n==='wordProgress'||n==='imageRotation'?v.wordId:n==='gameProgress'||n==='reviewHistory'?v.id:n==='todayPlans'?v.date:v.key;
  return {
    async put(n,v){store(n).set(keyOf(n,v),structuredClone(v));return v},
    async get(n,k){const v=store(n).get(k);return v===undefined?undefined:structuredClone(v)},
    async getAll(n){return [...store(n).values()].map(v=>structuredClone(v))},
    async del(n,k){store(n).delete(k)},
    async clear(n){store(n).clear()},
    _db:db
  };
}
