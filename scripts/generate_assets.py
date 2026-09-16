from pathlib import Path
from PIL import Image, ImageEnhance
import numpy as np
from skimage import data
import subprocess, json, shutil, tempfile

ROOT=Path('/mnt/data/offline-word-recognition')
IMGDIR=ROOT/'images/words'; AUD=ROOT/'audio/words'; CH=ROOT/'audio/chunks'
for p in [IMGDIR,AUD,CH]: p.mkdir(parents=True,exist_ok=True)

user_garden=Path('/mnt/data/b48ebac9-52ee-4ae2-b048-6fb6e6c7e81f.png')

sources={
 'garden': Image.open(user_garden).convert('RGB'),
 'flower': Image.open(user_garden).convert('RGB'),
 'tree': Image.open(user_garden).convert('RGB'),
 'grass': Image.open(user_garden).convert('RGB'),
 'lion': Image.open('/opt/pyvenv/lib/python3.13/site-packages/gradio/media_assets/images/lion.jpg').convert('RGB'),
 'cheetah': Image.open('/opt/pyvenv/lib/python3.13/site-packages/gradio/media_assets/images/cheetah.jpg').convert('RGB'),
 'tower': Image.open('/opt/pyvenv/lib/python3.13/site-packages/gradio/media_assets/images/tower.jpg').convert('RGB'),
 'cat': Image.fromarray(data.chelsea()).convert('RGB'),
 'coffee': Image.fromarray(data.coffee()).convert('RGB'),
 'rocket': Image.fromarray(data.rocket()).convert('RGB'),
 'astronaut': Image.fromarray(data.astronaut()).convert('RGB'),
 'camera': Image.fromarray(data.camera()).convert('RGB'),
}

def crop_for(word, im, variant):
    w,h=im.size
    if word=='flower':
        boxes=[(0,int(h*.45),w,h),(0,int(h*.55),int(w*.75),h),(int(w*.2),int(h*.45),w,h)]
    elif word=='tree':
        boxes=[(0,0,w,int(h*.62)),(0,0,int(w*.7),int(h*.7)),(int(w*.25),0,w,int(h*.68))]
    elif word=='grass':
        boxes=[(0,int(h*.22),w,int(h*.68)),(int(w*.08),int(h*.28),int(w*.82),int(h*.72)),(int(w*.2),int(h*.2),w,int(h*.64))]
    else:
        margins=[0,.07,.13]
        m=margins[variant]
        x=int(w*m); y=int(h*m)
        boxes=[(x,y,w-x,h-y)]*3
    return im.crop(boxes[variant])

for word,im in sources.items():
    for i in range(3):
        c=crop_for(word,im,i)
        c.thumbnail((900,700), Image.Resampling.LANCZOS)
        if i==1: c=ImageEnhance.Contrast(c).enhance(1.03)
        if i==2: c=ImageEnhance.Brightness(c).enhance(1.02)
        c.save(IMGDIR/f'{word}_{i+1:02d}.webp','WEBP',quality=84,method=6)

chunks={
 'garden':['gar','den'], 'flower':['flow','er'], 'tree':['tree'], 'grass':['grass'],
 'lion':['li','on'], 'cheetah':['chee','tah'], 'tower':['tow','er'], 'cat':['cat'],
 'coffee':['cof','fee'], 'rocket':['rock','et'], 'astronaut':['as','tro','naut'], 'camera':['cam','er','a']
}

def tts(text,out):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/'x.wav'
        subprocess.run(['espeak','-v','en-us','-s','135','-w',str(wav),text],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-q:a','5',str(out)],check=True)

for word in sources:
    tts(word,AUD/f'{word}.mp3')
    for idx,ch in enumerate(chunks[word]):
        tts(ch,CH/f'{word}_{idx+1}.mp3')

words=[]
for word in sources:
    all_words=list(sources)
    distractors=[x for x in all_words if x!=word][:6]
    sentence_map={
      'garden':['We play in the garden.','There are flowers in the garden.'],
      'flower':['I see a flower.','The flower is in the garden.'],
      'tree':['The tree is tall.','I see a tree in the garden.'],
      'grass':['The grass is green.','We walk on the grass.'],
      'lion':['The lion is big.','I see a lion.'],
      'cheetah':['The cheetah can run fast.','I see a cheetah.'],
      'tower':['The tower is tall.','I can see the tower.'],
      'cat':['The cat is here.','I see a cat.'],
      'coffee':['The coffee is hot.','I see a cup of coffee.'],
      'rocket':['The rocket goes up.','I see a rocket.'],
      'astronaut':['The astronaut is in space.','I see an astronaut.'],
      'camera':['This is a camera.','I see a camera.']
    }
    words.append({
      'id':word,'word':word,'chunks':chunks[word],
      'audioPath':f'audio/words/{word}.mp3',
      'chunkAudioPaths':[f'audio/chunks/{word}_{i+1}.mp3' for i in range(len(chunks[word]))],
      'imagePaths':[f'images/words/{word}_{i+1:02d}.webp' for i in range(3)],
      'sentences':sentence_map[word],
      'distractors':distractors,
      'enabled':True
    })
(ROOT/'data/words.json').write_text(json.dumps(words,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'generated {len(words)} words, {len(list(IMGDIR.glob("*.webp")))} images')
