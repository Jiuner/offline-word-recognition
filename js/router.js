export const ROUTES = Object.freeze(['home','today','session','words','parent','complete']);
let current = 'home';
const listeners = new Set();
export function getRoute(){ return current; }
export function navigate(route, detail={}){
  if(!ROUTES.includes(route)) throw new Error(`Unknown route: ${route}`);
  current = route;
  history.replaceState({route,detail},'',`#${route}`);
  for(const cb of listeners) cb(route,detail);
}
export function onRouteChange(cb){ listeners.add(cb); return ()=>listeners.delete(cb); }
export function initRouter(){
  const route = location.hash.slice(1);
  current = ROUTES.includes(route) ? route : 'home';
  return current;
}
