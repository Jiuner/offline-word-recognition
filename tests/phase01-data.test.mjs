import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {validateWordData} from '../js/data.js';
const root=path.resolve(new URL('../',import.meta.url).pathname);
const words=JSON.parse(fs.readFileSync(path.join(root,'data/words.json'),'utf8'));
test('phase 1 has 10-20 starter words and valid schema',()=>{assert.ok(words.length>=10&&words.length<=20);assert.equal(validateWordData(words),true);});
test('all declared local assets exist',()=>{for(const w of words){for(const p of [w.audioPath,...w.chunkAudioPaths,...w.imagePaths]) assert.ok(fs.existsSync(path.join(root,p)),`${w.id}: ${p}`);}});
test('garden has multiple real-photo assets and expected chunks',()=>{const g=words.find(w=>w.id==='garden');assert.deepEqual(g.chunks,['gar','den']);assert.ok(g.imagePaths.length>=3);for(const p of g.imagePaths){const s=fs.statSync(path.join(root,p));assert.ok(s.size>5000,'image should be substantive');}});
test('audio assets are non-empty mp3 files',()=>{for(const w of words){const s=fs.statSync(path.join(root,w.audioPath));assert.ok(s.size>1000);assert.match(w.audioPath,/\.mp3$/);}});
