let current=null;
export async function playLocalAudio(path){
  if(!path) throw new Error('Missing audio path');
  if(current){current.pause();current.currentTime=0;}
  current=new Audio(path);await current.play();return current;
}
export function stopAudio(){if(current){current.pause();current.currentTime=0;current=null;}}
