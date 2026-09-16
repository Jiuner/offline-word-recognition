# PRD.md — Offline English Word Recognition App

**Version:** v1.0  
**Date:** 2026-09-16  
**Product type:** Standalone offline learning app  
**Primary device:** 10-inch Windows tablet / laptop  
**Secondary device:** iPhone  
**Primary learner:** approximately 5 years old  
**Parent interface language:** Traditional Chinese  
**Child learning interface language:** English only  

---

# 1. 產品目標和使用場景

## 1.1 產品目標

本產品是一個獨立的英文單字視覺辨識 APP，核心目標不是重新教孩子英文意思，而是把孩子已經存在的「聽力詞彙」轉換成「閱讀詞彙」。

典型狀態：

- 聽到 `garden`：知道意思
- 看到花園：知道是 garden
- 看到 `garden`：還不能立即讀出

APP 的任務是建立：

> **已知英文聲音 ↔ 英文單字字形 ↔ 單字概念**

最終希望孩子：

- 看到熟悉單字時能快速讀出
- 不需要逐字母慢慢猜
- 在一般句子中也能辨識該單字
- 經過數天或數週後仍保留辨識能力

## 1.2 核心學習原則

1. 不以中文翻譯為主要學習方式。
2. 兒童學習介面不顯示中文。
3. 圖片只用來建立或確認概念，不取代文字辨識。
4. 使用真實照片，不使用 emoji 或卡通圖片作為主要單字圖片。
5. 一個單字應有多種練習方式，而不是反覆看同一張字卡。
6. 「玩過」不等於「學會」。
7. 單字必須經過間隔複習後仍可辨識，才算真正熟練。
8. 所有核心功能應可完全離線使用。

## 1.3 使用場景

### 情境 A：第一次把聽力詞彙轉成閱讀詞彙

孩子原本會聽 `garden`，第一次在 APP 中進入完整 6 關學習流程。

### 情境 B：每日複習

系統根據複習排程，抽出今天要複習的單字。

### 情境 C：弱項補強

若某單字在某類遊戲中經常答錯，例如 Build the Word 表現較弱，複習時增加該類題型。

### 情境 D：家長查看進度

家長查看：

- 已學幾個單字
- 已熟練幾個單字
- 正在學哪些單字
- 哪些單字需要複習
- 哪些題型較弱

### 情境 E：完全離線使用

在無 Wi-Fi、無行動網路的情況下，仍可：

- 學單字
- 播放單字音檔
- 顯示真實圖片
- 記錄學習紀錄
- 排定複習
- 查看統計
- 備份與恢復

---

# 2. 整體頁面框架和導航結構

## 2.1 兒童區

兒童區只顯示英文。

### 主要頁面

1. **Home**
2. **Today**
3. **Word Session**
4. **My Words**
5. **Session Complete**

### 底部導航

第一版建議只保留：

- Home
- My Words
- Parent

遊戲關卡本身不放在底部導航，避免孩子任意跳關。

## 2.2 家長區

家長區使用繁體中文。

### 主要頁面

1. 學習紀錄
2. 單字庫
3. 學習設定
4. 備份與恢復
5. App 資料資訊

## 2.3 整體資訊架構

```text
App
├── Child Area
│   ├── Home
│   ├── Today
│   │   ├── New Words
│   │   ├── Review Words
│   │   └── Start
│   ├── Word Session
│   │   ├── Game 1 Listen & Find
│   │   ├── Game 2 Break & Blend
│   │   ├── Game 3 Fix the Word
│   │   ├── Game 4 Word & Picture
│   │   ├── Game 5 Build the Word
│   │   └── Game 6 Word Hunt
│   ├── My Words
│   │   ├── Learning
│   │   ├── Mastered
│   │   └── Review
│   └── Session Complete
│
└── Parent Area
    ├── 學習紀錄
    ├── 單字庫
    ├── 學習設定
    ├── 備份與恢復
    └── App 資料資訊
```

---

# 3. 首頁的內容結構

首頁應保持簡單，優先讓孩子知道今天要做什麼。

## 3.1 首頁第一區：Today's Plan

顯示：

- New Words
- Review Words
- Total tasks
- Start 按鈕

範例：

```text
Today's Plan

New Words      5
Review Words  12

[ Start ]
```

## 3.2 首頁第二區：My Progress

顯示：

- Words Learned
- Words Mastered
- Learning
- Review

範例：

```text
Words Learned     120
Words Mastered     78
Learning           30
Review             12
```

## 3.3 首頁第三區：快速入口

只提供必要入口：

- Today
- My Words
- Parent

## 3.4 首頁設計原則

- 兒童區不出現中文
- 大按鈕
- 一眼可理解
- 不放複雜圖表
- 不放太多設定入口
- 不要求孩子閱讀長文字

---

# 4. 每個模組的用途

# 4.1 Today

用途：

- 整理今天需要學習的新單字
- 整理今天需要複習的舊單字
- 決定今日學習順序
- 進入 Word Session

第一版 Today 包含：

- New Words
- Review Words
- Start Session

---

# 4.2 Word Session

用途：

針對一個單字，以不同方式建立文字辨識能力。

新單字第一次學習時，原則上走完整 6 個遊戲。

複習單字不必每次走完整 6 關，可以依弱項挑 2–3 關。

---

# 4.3 Game 1 — Listen & Find

## 用途

建立：

> 聽到英文聲音 → 找到正確英文文字

## 畫面

- Listen 按鈕
- 3 個英文單字選項
- 無中文

範例：

```text
🔊 Listen

garden
green
game
```

## 交互規則

- 正確答案位置每次隨機
- 干擾字順序每次隨機
- 題目開始後，位置固定
- 不可讓 garden 永遠出現在固定位置
- 答對：`Great! ★`
- 答錯：`Try again!`

## 第一版最必要資料

- targetWord
- audioPath
- distractorWords[]
- answerOrder[]
- correct / wrong
- responseTimeMs

---

# 4.4 Game 2 — Break & Blend

## 用途

把熟悉的聲音與單字內部結構建立連結。

例如：

```text
gar | den
    ↓
 garden
```

## 重要說明

`gar | den` 是兒童友善的 chunk / syllable-like 分段提示，用來協助孩子讀出完整單字。

最終仍要回到完整：

```text
garden
```

## 交互

- 點 `gar` 可播放該段本地音檔
- 點 `den` 可播放該段本地音檔
- 點完整 `garden` 播放完整單字
- 無中文

## 第一版最必要資料

- word
- chunks[]
- chunkAudioPaths[]
- wholeWordAudioPath
- completion status

---

# 4.5 Game 3 — Fix the Word

## 用途

讓孩子真正注意單字不同位置的字母，而不是只記整個字的輪廓。

## 例子

同一個 `garden` 連續練不同位置：

```text
g _ rden
_ arden
ga _ den
gar _ en
gard _ n
garde _
```

## 交互規則

- 一個單字至少可出 4–6 題
- 缺字位置每題改變
- 每題提供 3 個字母選項
- 答對後自動進下一題
- 答錯時留在原題
- 不只固定缺同一個字母

## 第一版最必要資料

- targetWord
- missingIndex
- correctLetter
- distractorLetters[]
- roundIndex
- correct / wrong
- attemptCount

---

# 4.6 Game 4 — Word & Picture

## 用途

建立：

> 英文文字 ↔ 單字概念

## 兩種模式

### A. Word → Picture

看到：

```text
garden
```

從三張真實照片中選出正確圖片。

### B. Picture → Word

看到一張真實花園照片。

從三個英文單字中選出：

```text
garden
```

## 圖片規則

- 使用真實照片
- 不使用 emoji 當主要圖片
- 不使用卡通圖作主要圖片
- 同一單字建議至少 2–4 張不同照片
- 每次啟動或每次重新出題時隨機換圖
- 避免短時間內連續使用同一張圖
- 正確圖片位置每次隨機
- 文字選項順序每次隨機
- 題目顯示後不可再改位置

## 第一版最必要資料

- targetWord
- imagePaths[]
- imageRotationHistory[]
- distractorImageIds[]
- distractorWords[]
- mode
- shuffledOptions[]
- correct / wrong

---

# 4.7 Game 5 — Build the Word

## 用途

讓孩子依照聽到的單字，自行重新排列完整拼字。

## garden 範例

上方：

```text
_  _  _  _  _  _
```

下方顯示全部字母，但順序打亂：

```text
d   g   n   a   e   r
```

孩子重新排列成：

```text
g   a   r   d   e   n
```

## 交互規則

- 上方空格數 = 單字字母數
- 下方必須包含全部字母
- 字母順序每次隨機
- 點字母，自動填入下一個空格
- 可點已填空格，把字母退回字母池
- 提供 Undo
- 提供 Reset
- 完成後按 Check
- 不顯示中文
- 不預先顯示完整 `garden`

## 第一版最必要資料

- targetWord
- letters[]
- shuffledLetters[]
- currentAnswer[]
- attemptCount
- correct / wrong
- responseTimeMs

---

# 4.8 Game 6 — Word Hunt

## 用途

確認孩子不只在字卡上認得單字，在一般句子中也能找出目標單字。

## 範例

指示：

```text
Find garden.
```

內容：

```text
The dog likes to run.
We play in the garden.
I see many flowers.
```

## 核心規則

句子裡的 `garden`：

- 不加粗
- 不變色
- 不放底線
- 不放框線
- 不放特殊背景
- 不改字體大小

必須和其他單字完全相同樣式。

## 交互

- 每個單字都可點
- 點 garden → 成功
- 點其他字 → `Try again!`

## 第一版最必要資料

- targetWord
- sentences[]
- tokenList[]
- targetTokenIndex
- clickedWord
- correct / wrong
- responseTimeMs

---

# 4.9 My Words

## 用途

讓孩子與家長知道目前單字學習狀態。

## 第一版分類

### Learning

已正式學習，但尚未熟練。

### Mastered

經過間隔複習後仍能穩定辨識。

### Review

需要重新複習的單字。

## 第一版最必要資料

- word
- status
- masteryLevel
- firstLearnedAt
- lastReviewedAt
- nextReviewAt

---

# 4.10 學習紀錄

家長區功能。

## 用途

讓家長查看：

- 已學單字數
- 已熟練單字數
- 學習中單字數
- 待複習單字數
- 每日學習量
- 單字答對 / 答錯情況
- 六種遊戲各自表現

---

# 4.11 單字庫

家長區功能。

## 用途

管理 APP 中可使用的單字資料。

第一版必要操作：

- 查看單字
- 啟用 / 停用單字
- 查看音檔
- 查看圖片
- 查看 chunk 分段
- 查看例句

第一版可以先以內建資料為主，不要求家長自行建立完整單字內容。

---

# 4.12 學習設定

第一版必要設定：

- 每日新單字數
- 每日最大複習量
- 是否自動播放單字音檔
- 圖片提示策略
- 新字 / 複習字比例

---

# 4.13 備份與恢復

## 用途

確保本機資料可以：

- 匯出
- 保存
- 搬到另一台裝置
- 發生資料問題時恢復

詳見第 7 節。

---

# 5. 每個模組第一版最必要的資料和操作

## 5.1 words

單字主資料。

```json
{
  "id": "garden",
  "word": "garden",
  "chunks": ["gar", "den"],
  "audioPath": "audio/garden.mp3",
  "chunkAudioPaths": [
    "audio/chunks/gar.mp3",
    "audio/chunks/den.mp3"
  ],
  "imagePaths": [
    "images/garden_01.webp",
    "images/garden_02.webp",
    "images/garden_03.webp"
  ],
  "sentences": [
    "We play in the garden.",
    "There are flowers in the garden."
  ],
  "enabled": true
}
```

## 5.2 wordProgress

```json
{
  "wordId": "garden",
  "status": "learning",
  "learned": true,
  "mastered": false,
  "masteryLevel": 3,
  "firstLearnedAt": "2026-09-16",
  "lastReviewedAt": "2026-09-16",
  "nextReviewAt": "2026-09-17",
  "correctCount": 8,
  "wrongCount": 2,
  "consecutiveCorrect": 4
}
```

## 5.3 gameProgress

```json
{
  "wordId": "garden",
  "listenFind": {
    "correct": 2,
    "wrong": 0
  },
  "breakBlend": {
    "completed": 1
  },
  "fixWord": {
    "correct": 5,
    "wrong": 1
  },
  "wordPicture": {
    "correct": 2,
    "wrong": 0
  },
  "buildWord": {
    "correct": 1,
    "wrong": 1
  },
  "wordHunt": {
    "correct": 1,
    "wrong": 0
  }
}
```

## 5.4 reviewHistory

```json
{
  "id": "uuid",
  "wordId": "garden",
  "gameType": "buildWord",
  "correct": true,
  "responseTimeMs": 4200,
  "playedAt": "2026-09-16T10:30:00+08:00"
}
```

## 5.5 settings

```json
{
  "dailyNewWords": 5,
  "maxDailyReviews": 20,
  "autoPlayAudio": true,
  "picturePolicy": "rotate",
  "reviewMode": "adaptive"
}
```

---

# 6. 首頁、今日計畫和各模組之間的關係

## 6.1 基本流程

```text
Home
 ↓
Today's Plan
 ↓
Start
 ↓
Word Session
 ↓
Game 1–6
 ↓
Word Result
 ↓
Next Word
 ↓
Session Complete
```

## 6.2 New Word Flow

新單字：

```text
Today
→ New Word
→ Game 1
→ Game 2
→ Game 3
→ Game 4
→ Game 5
→ Game 6
→ 更新 mastery
→ 排定 nextReviewAt
```

## 6.3 Review Word Flow

複習單字不一定跑全部 6 關。

系統依照：

- 歷史答錯
- 熟練度
- 上次複習時間
- 哪個遊戲表現較差

挑出 2–3 個最需要的遊戲。

例如：

```text
Review garden
→ Listen & Find
→ Build the Word
→ Word Hunt
→ 更新 mastery
```

## 6.4 Home 與 My Words 的關係

Home 顯示統計摘要。

My Words 顯示詳細單字清單。

Home 的：

- Words Learned
- Words Mastered
- Learning
- Review

都必須直接由 IndexedDB 中的實際資料計算。

---

# 7. 本地資料文件、備份和恢復要求

## 7.1 完全離線要求

第一版核心功能不可依賴：

- 線上 API
- 線上 TTS
- 雲端資料庫
- 線上圖片
- 帳號登入
- 網路搜尋

## 7.2 本地檔案

APP 需內建：

```text
/data/
  words.json

/audio/
  garden.mp3
  ...

/audio/chunks/
  gar.mp3
  den.mp3
  ...

/images/
  garden_01.webp
  garden_02.webp
  garden_03.webp
  ...
```

## 7.3 IndexedDB

IndexedDB 至少保存：

- wordProgress
- gameProgress
- reviewHistory
- settings
- appMetadata

## 7.4 備份格式

建議使用 JSON。

範例：

```json
{
  "app": "offline-word-recognition",
  "backupVersion": 1,
  "exportedAt": "2026-09-16T10:00:00+08:00",
  "wordProgress": [],
  "gameProgress": [],
  "reviewHistory": [],
  "settings": {},
  "metadata": {}
}
```

## 7.5 備份內容

需包含：

- 已學單字紀錄
- 熟練度
- 各遊戲表現
- 複習歷史
- 下次複習日期
- 家長設定

## 7.6 不需要重複備份的內容

APP 內建的：

- 圖片
- 音檔
- 內建單字資料

若這些資源與 APP 版本綁定，可不重複放入備份。

## 7.7 匯出要求

家長可按：

> 建立並下載備份檔

檔名範例：

```text
word-app-backup-2026-09-16.json
```

## 7.8 恢復要求

匯入備份後，APP 必須先：

1. 檢查 JSON 格式
2. 檢查 app id
3. 檢查 backupVersion
4. 顯示備份日期
5. 顯示已學單字數
6. 顯示已熟練單字數
7. 顯示答題紀錄數
8. 讓家長確認
9. 才可覆蓋目前 IndexedDB

不可一選檔就直接覆蓋。

## 7.9 恢復前提醒

必須提示：

> 恢復後會取代目前本機學習進度。

並建議先備份目前資料。

---

# 8. 第一版必須完成的功能

## Core

- [ ] 完全離線
- [ ] Windows 10 吋平板 / 筆電可操作
- [ ] iPhone 可正常顯示
- [ ] 兒童區 English only
- [ ] 家長區繁體中文

## Home / Today

- [ ] Home
- [ ] Today's Plan
- [ ] New Words 數量
- [ ] Review Words 數量
- [ ] Start Session
- [ ] Words Learned
- [ ] Words Mastered
- [ ] Learning
- [ ] Review

## Six Games

- [ ] Game 1 Listen & Find
- [ ] Game 2 Break & Blend
- [ ] Game 3 Fix the Word
- [ ] Game 4 Word & Picture
- [ ] Game 5 Build the Word
- [ ] Game 6 Word Hunt

## Randomization

- [ ] Listen & Find 選項每次洗牌
- [ ] Word & Picture 正確圖片位置每次洗牌
- [ ] Picture → Word 選項每次洗牌
- [ ] Build the Word 字母每次洗牌
- [ ] 同一單字多張真實圖輪換
- [ ] 避免連續重複同一張圖片

## Learning Data

- [ ] IndexedDB
- [ ] 已學單字統計
- [ ] 已熟練單字統計
- [ ] 學習中單字統計
- [ ] 待複習單字統計
- [ ] 每個單字熟練度
- [ ] 每種遊戲正確 / 錯誤紀錄
- [ ] responseTimeMs
- [ ] firstLearnedAt
- [ ] lastReviewedAt
- [ ] nextReviewAt

## Review

- [ ] 基本間隔複習
- [ ] Review Word 可只抽部分遊戲
- [ ] 答錯後可提前再次複習

## Parent

- [ ] 學習紀錄
- [ ] 我的單字庫
- [ ] 學習設定
- [ ] 備份
- [ ] 備份預覽
- [ ] 恢復
- [ ] 恢復前確認

---

# 9. 第一版暫時不做的功能

- [ ] 雲端同步
- [ ] 帳號登入
- [ ] 多使用者帳號
- [ ] 社群功能
- [ ] 排行榜
- [ ] 線上 TTS
- [ ] AI 即時生成圖片
- [ ] AI 即時生成例句
- [ ] OCR
- [ ] 語音辨識自動評分
- [ ] 麥克風錄音評分
- [ ] 影像辨識
- [ ] 家長跨裝置即時同步
- [ ] 線上後台
- [ ] 遠端資料庫
- [ ] 完整 phonics 課程
- [ ] 完整英文文法課程
- [ ] 完整閱讀理解課程
- [ ] 手寫辨識
- [ ] 競賽系統

---

# 10. 可以實際檢查的驗收標準

以下標準必須能由開發者或家長實際操作檢查。

## 10.1 離線驗收

### Given
裝置關閉 Wi-Fi 與行動網路。

### Then

- APP 可以啟動
- 可以完成 6 個遊戲
- 可以播放單字音檔
- 可以顯示圖片
- 可以記錄答題
- 關閉 APP 再開後資料仍存在

---

## 10.2 Listen & Find 隨機驗收

連續開啟同一個單字至少 10 次。

必須確認：

- 正確答案不是永遠在同一位置
- 3 個文字選項順序有變化
- 題目顯示後，選項不再移動

---

## 10.3 Break & Blend 驗收

以 garden 為例：

- 可看到 `gar | den`
- 可分別點 gar 與 den
- 可點 garden
- 可播放本地音檔
- 介面不出現中文

---

## 10.4 Fix the Word 驗收

garden 至少可依序出現不同位置：

- `g _ rden`
- `_ arden`
- `ga _ den`
- `gar _ en`
- `gard _ n`
- `garde _`

不可只固定缺同一位置。

---

## 10.5 Word & Picture 隨機驗收

同一個 garden 至少測試 10 次。

必須確認：

- 正確照片位置有變化
- 圖片使用真實照片
- garden 至少可輪換 2 張以上圖片
- 不會每次都使用同一張圖
- Picture → Word 的文字選項位置也會變化

---

## 10.6 Build the Word 驗收

garden 必須：

- 顯示 6 個空格
- 顯示全部 6 個字母
- 字母一開始為打亂順序
- 每次重新開始順序可不同
- 可點字母填入
- 可退回字母
- 可 Undo
- 可 Reset
- 可 Check
- 拼成 garden 後判定成功
- 拼錯時不可判定成功
- 遊戲開始時不預先顯示完整答案

---

## 10.7 Word Hunt 驗收

句子：

```text
We play in the garden.
```

必須確認 garden：

- 不加粗
- 不變色
- 不加底線
- 不加背景
- 字體大小與其他字相同
- 點 garden 才成功
- 點其他字顯示 Try again

---

## 10.8 已學單字統計驗收

若同一個 garden 做 30 題：

> Words Learned 只能增加 1

不能增加 30。

---

## 10.9 已熟練統計驗收

一個單字只有在符合熟練條件後才能進入 Mastered。

第一版至少要求：

- 不只完成一次
- 經過不同日期複習
- 仍可正確辨識

---

## 10.10 資料持久化驗收

完成 garden 後：

1. 關閉 APP
2. 重新開啟
3. 查看 My Words

必須仍能看到：

- garden 的狀態
- 熟練度
- 答對 / 答錯
- 上次學習時間
- 下次複習時間

---

## 10.11 備份驗收

點擊備份：

- 可產生 JSON 檔
- JSON 可正常開啟
- 包含學習紀錄
- 包含設定
- 包含版本資訊

---

## 10.12 恢復驗收

匯入有效備份時：

- 必須先顯示預覽
- 不可立即覆蓋
- 顯示備份日期
- 顯示已學單字數
- 顯示已熟練單字數
- 顯示紀錄數
- 家長確認後才可恢復

匯入錯誤 JSON：

- 不可寫入 IndexedDB
- 必須顯示錯誤訊息

---

## 10.13 響應式驗收

至少測試：

- 約 320 px 寬手機
- iPhone 常見尺寸
- 10 吋 Windows 平板
- 桌面瀏覽器

要求：

- 不產生頁面級橫向捲動
- 選項可點
- 文字不被截斷
- 按鈕大小足夠兒童觸控

---

# 11. 單字熟練度與複習基礎規則

第一版可使用簡單 0–5 級。

| Level | 定義 |
|---|---|
| 0 | 尚未學習 |
| 1 | 聽到後可找到文字 |
| 2 | 可辨識文字與圖片 |
| 3 | 可完成 Fix / Build |
| 4 | 可快速辨識單字 |
| 5 | 經間隔複習後仍能在句子中辨識 |

建議基本複習間隔：

- 當天
- +1 天
- +3 天
- +7 天
- +14 天
- +30 天

若答錯：

- 提前 nextReviewAt
- 優先重新出弱項遊戲

---

# 12. 第一版技術原則

建議：

- HTML
- CSS
- JavaScript
- IndexedDB
- 本地 JSON
- 本地 MP3 / AAC / OGG
- 本地 WebP / JPEG
- PWA 或後續包裝成 APP

核心原則：

> **APP 必須先以完全離線架構開發，而不是先依賴線上服務後再改離線。**

---

# 13. 產品核心定義

> 一個專門把孩子已經會聽的英文單字，轉化成「看到就會讀」的完全離線英文認字 APP。

第一版核心循環：

```text
Today's Plan
→ Word
→ 6 Games
→ Progress
→ Review
→ Mastered
```

核心成功指標不是「做了多少題」，而是：

> **有多少原本只會聽的英文單字，最後變成看到就能辨識的閱讀詞彙。**
