import {getProgressSummary} from './stats.js';
import {getSettings} from './db.js';
import {getTodayPlan} from './today.js';
import {getCategorizedWords} from './word-list.js';
import {getParentData} from './parent.js';

export function nav(active='home'){
  return `<nav class="bottom-nav" aria-label="Main navigation">
    <button data-nav="home" class="${active==='home'?'active':''}">Home</button>
    <button data-nav="words" class="${active==='words'?'active':''}">My Words</button>
    <button data-nav="parent" class="${active==='parent'?'active':''}">Parent</button>
  </nav>`;
}
export async function homeView(){
  const [stats,plan]=await Promise.all([getProgressSummary(),getTodayPlan()]);
  return `<main class="stack" data-view="home">
    <section class="card"><div class="eyebrow">TODAY'S PLAN</div><div class="grid-2" style="margin:14px 0">
      <div><div class="muted">New Words</div><div class="big-number">${plan.newWords.length}</div></div>
      <div><div class="muted">Review Words</div><div class="big-number">${plan.reviewWords.length}</div></div>
    </div><button class="btn primary" data-action="start">Start</button></section>
    <section class="card"><div class="eyebrow">MY PROGRESS</div><div class="grid-2" style="margin-top:14px">
      <div><div class="muted">Words Learned</div><div class="big-number" data-stat="learned">${stats.learned}</div></div>
      <div><div class="muted">Words Mastered</div><div class="big-number" data-stat="mastered">${stats.mastered}</div></div>
      <div><div class="muted">Learning</div><div class="big-number" data-stat="learning">${stats.learning}</div></div>
      <div><div class="muted">Review</div><div class="big-number" data-stat="review">${stats.review}</div></div>
    </div></section>
    <section class="card"><div class="row wrap"><button class="btn" data-nav="today">Today</button><button class="btn" data-nav="words">My Words</button><button class="btn" data-nav="parent">Parent</button></div></section>
  </main>${nav('home')}`;
}
export async function todayView(){
 const plan=await getTodayPlan();
 return `<main class="stack" data-view="today"><section class="card"><div class="eyebrow">TODAY</div><h1>Today's Plan</h1><div class="grid-2"><div><div class="muted">New Words</div><div class="big-number">${plan.newWords.length}</div></div><div><div class="muted">Review Words</div><div class="big-number">${plan.reviewWords.length}</div></div></div><button class="btn primary" data-action="start">Start Session</button></section><section class="card"><h2>New Words</h2><p>${plan.newWords.join(' · ')||'—'}</p><h2>Review</h2><p>${plan.reviewWords.join(' · ')||'—'}</p></section></main>${nav('home')}`;
}

export async function wordsView(){
 const groups=await getCategorizedWords();
 const section=(title,rows)=>`<section class="card"><div class="row between"><h2>${title}</h2><strong>${rows.length}</strong></div>${rows.length?`<div class="row wrap">${rows.map(x=>`<button class="btn" data-word-id="${x.id}">${x.word} · ${'★'.repeat(x.progress.masteryLevel||0)}${'☆'.repeat(5-(x.progress.masteryLevel||0))}</button>`).join('')}</div>`:'<p class="muted">—</p>'}</section>`;
 return `<main class="stack" data-view="words"><section class="card"><div class="eyebrow">MY WORDS</div><h1>My Words</h1></section>${section('Learning',groups.learning)}${section('Mastered',groups.mastered)}${section('Review',groups.review)}</main>${nav('words')}`;
}

export async function parentView(){
 const d=await getParentData();
 return `<main class="stack parent-only" data-view="parent"><section class="card"><div class="eyebrow">PARENT</div><h1>家長設定</h1><p class="muted">學習資料只儲存在本機裝置。</p></section>
 <section class="card"><h2>學習紀錄</h2><div class="grid-2"><div><div class="muted">已學</div><div class="big-number">${d.stats.learned}</div></div><div><div class="muted">已熟練</div><div class="big-number">${d.stats.mastered}</div></div><div><div class="muted">學習中</div><div class="big-number">${d.stats.learning}</div></div><div><div class="muted">答題紀錄</div><div class="big-number">${d.historyCount}</div></div></div></section>
 <section class="card"><h2>學習設定</h2><form data-settings-form class="stack"><label>每日新單字數 <input name="dailyNewWords" type="number" min="1" max="20" value="${d.settings.dailyNewWords||5}"></label><label>每日最大複習量 <input name="maxDailyReviews" type="number" min="1" max="100" value="${d.settings.maxDailyReviews||20}"></label><label class="row"><input name="autoPlayAudio" type="checkbox" ${d.settings.autoPlayAudio?'checked':''}> 自動播放單字音檔</label><button class="btn primary" type="submit">儲存設定</button><div data-settings-result class="muted"></div></form></section>
 <section class="card"><h2>單字庫</h2><div class="stack">${d.library.map(w=>`<div class="row between wrap"><div><strong>${w.word}</strong><div class="muted">${w.images} images · audio ${w.audio?'✓':'✗'} · ${w.chunks} chunks · ${w.sentences} sentences</div></div><button class="btn" data-toggle-word="${w.id}" data-enabled="${w.enabled}">${w.enabled?'停用':'啟用'}</button></div>`).join('')}</div></section>
 <section class="card" data-backup-panel><h2>備份與恢復</h2><p class="muted">備份檔只包含學習紀錄與設定，不重複包含 App 內建圖片與音檔。</p><div class="row wrap"><button class="btn primary" data-export-backup>建立並下載備份檔</button><label class="btn">選擇備份檔<input data-import-backup type="file" accept="application/json,.json" hidden></label></div><div data-backup-message class="muted" style="margin-top:12px"></div><div data-restore-preview class="hidden" style="margin-top:14px"><div class="card" style="background:var(--soft)"><h3>備份內容預覽</h3><div data-preview-fields></div><p><strong>恢復後會取代目前本機學習進度。</strong></p><button class="btn primary" data-confirm-restore>確認恢復</button><button class="btn" data-cancel-restore>取消</button></div></div></section></main>${nav('parent')}`;
}

export function completeView(){return `<main class="stack" data-view="complete"><section class="card" style="text-align:center;padding:40px 20px"><div style="font-size:3rem">★</div><h1>Great Job!</h1><p class="muted">Today's practice is complete.</p><button class="btn primary" data-nav="home">Home</button></section></main>${nav('home')}`;}
