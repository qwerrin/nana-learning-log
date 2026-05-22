# HTML/CSS 超速習 Day 7 — 現代CSS応用とアニメーション

## 今日のゴール

- **CSS Nesting**(ネスト構文)で構造的にCSSを書ける
- **`:has()`** で親セレクタを活用できる(JS が不要になる場面を知る)
- **Container Queries** の概念を理解する
- **`transition`** でスムーズな変化を作れる
- **`@keyframes` + `animation`** でアニメーションを書ける
- **`prefers-reduced-motion`** に配慮できる
- **ダークモード対応**を CSS変数で実装できる
- **`color-mix()`** でホバー色を自動生成できる

**所要時間の目安: 2〜2.5時間**

---

## 0. 今日のスタンス

CSS 編の最終日です。Day 1〜6 で「**動く・並ぶ・整う**」までは完成しました。今日は**仕上げ**として:

- **コードを綺麗に書く**(CSS Nesting)
- **動きを付ける**(transition、animation)
- **賢く反応する**(`:has()`、Container Queries)
- **ユーザー設定に応じる**(ダークモード、reduced-motion)

を学びます。**「2026年のCSS」**を体感する回。

---

## 1. ⭐ CSS Nesting(ネスト構文)(20分)

### 1-1. なぜネストか

これまで書いてきた CSS は、**フラット**な構造でした。

```css
.card {
  background: white;
  padding: 16px;
}

.card h3 {
  color: blue;
}

.card p {
  color: gray;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

毎回 `.card` を書くのが面倒ですよね。Sass(プリプロセッサ)などで「ネスト構文」を使っていた方も多いはず。

### 1-2. CSS Nesting

**2023年12月、Baseline newly available** で、CSS 標準としてネストが書けるようになりました。

```css
.card {
  background: white;
  padding: 16px;

  h3 {
    color: blue;
  }

  p {
    color: gray;
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
```

**`.card` の中**にスタイルをまとめて書けます。

### 1-3. `&` の意味

ネストの中で `&` は「**親セレクタ**」を表します。

```css
.btn {
  background: blue;

  &:hover { background: darkblue; }     /* .btn:hover */
  &:focus { outline: 2px solid; }       /* .btn:focus */
  &.large { font-size: 1.5rem; }        /* .btn.large(同じ要素に両方のクラス)*/
  & + & { margin-left: 8px; }           /* .btn + .btn(連続する.btn)*/
}
```

`:hover` のような疑似クラスや、複数クラス組み合わせを書くときは `&` が必須。

### 1-4. 子要素のネストでは `&` は不要(2023年末以降)

```css
.card {
  padding: 16px;

  h3 {           /* .card h3 と同じ(& 不要) */
    color: blue;
  }
}
```

「**子要素のネスト**」では `&` を書かなくてOK(緩いシンタックス)。これは 2023年末 のアップデートで簡略化されました。

### 1-5. メディアクエリもネスト可能

```css
.container {
  padding: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }
}
```

**メディアクエリを要素ごとに書ける**ので、関連スタイルがバラけません。

### 1-6. ⚠️ ネストしすぎない

「3階層以内」のルール:

```css
/* ❌ 深すぎ */
.card {
  .header {
    .title {
      .icon {
        color: blue;
      }
    }
  }
}

/* ✅ 適度に */
.card {
  & .header { ... }
  & .title { ... }
}

.card-icon {
  color: blue;
}
```

ネストが深くなると、**詳細度が上がりすぎ**たり、**コードが読みにくくなったり**します。「**3階層以内**」を目安にしてください。

### 🔧 ミニ演習1

次のフラットなCSSをネストで書き直してください。

```css
.button {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
}

.button:hover {
  background: #2563eb;
}

.button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}

.button.large {
  font-size: 1.25rem;
}
```

<details>
<summary>解答例</summary>

```css
.button {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;

  &:hover {
    background: #2563eb;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 4px;
  }

  &.large {
    font-size: 1.25rem;
  }
}
```

`.button` 関連の全てが**1つのブロック**にまとまり、関連性が一目で分かります。
</details>

---

## 2. ⭐ `:has()` の実用例(25分)

Day 4 で軽く紹介した **「親セレクタ」**。今日はその実用例を深掘りします。

### 2-1. `:has()` の基本

「**特定の子を持つ親**」を選ぶ。

```css
/* img を含む article */
article:has(img) {
  padding-left: 200px;  /* 画像のスペースを空ける */
}
```

**JavaScript なしで、子要素の有無に応じてスタイルを変えられる**のがポイント。

### 2-2. 実用例1: チェックボックスで装飾

```html
<ul class="todo">
  <li>
    <label>
      <input type="checkbox">
      牛乳を買う
    </label>
  </li>
  <li>
    <label>
      <input type="checkbox" checked>
      TypeScriptを学ぶ
    </label>
  </li>
</ul>
```

```css
.todo li:has(input:checked) {
  opacity: 0.5;
  text-decoration: line-through;
}
```

これだけで、**チェックされたアイテムが取り消し線+薄く**なります。Day 9 のToDoアプリで使うパターン。

### 2-3. 実用例2: フォームのエラー表示

```html
<form>
  <label>
    メール
    <input type="email" required>
  </label>
  <button>送信</button>
</form>
```

```css
/* 無効な入力を持つフォーム → 送信ボタンを無効化風に */
form:has(:invalid) button {
  opacity: 0.5;
  pointer-events: none;
}

/* 入力欄が無効ならエラー枠 */
input:invalid {
  border-color: red;
}
```

ボタンをグレーアウトするのに JS が不要。

### 2-4. 実用例3: 画像付きカード

```css
/* 画像のあるカードだけパディングを変える */
.card:has(img) {
  padding: 0;
}

.card:has(img) .content {
  padding: 16px;
}
```

「**画像が無いカード**」と「**画像があるカード**」で見た目を変えるパターン。

### 2-5. 実用例4: ナビゲーションの現在ページ

```html
<nav>
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/about" aria-current="page">私について</a></li>
    <li><a href="/contact">問い合わせ</a></li>
  </ul>
</nav>
```

```css
/* aria-current="page" を含む li を強調 */
li:has(a[aria-current="page"]) {
  background: #3b82f6;
  border-radius: 4px;
}

li:has(a[aria-current="page"]) a {
  color: white;
}
```

「現在ページの親 `<li>` だけ背景を変える」が CSS だけで可能に。

### 2-6. `:has()` のすごさ

これまで「**子要素の状態によって親のスタイルを変える**」のは、**JavaScript で `classList.add()` するしかない**問題でした。`:has()` の登場で、**CSS だけで宣言的に**書けるようになりました。

「**CSSが状態を持てる**」と言える革命的な機能です。

### 🔧 ミニ演習2

次の HTML に CSS を書いて、エラーのあるフィールドだけ赤い枠で強調してください。

```html
<form>
  <label>
    名前
    <input type="text" required minlength="2">
  </label>
  <label>
    メール
    <input type="email" required>
  </label>
  <button>送信</button>
</form>
```

要件:
- 入力が無効な `input` を赤い枠線に
- そのラベル全体も少し赤くしたい

<details>
<summary>解答例</summary>

```css
/* 無効な入力を持つラベル全体 */
label:has(input:invalid) {
  color: red;
}

/* 無効な入力欄自体 */
input:invalid {
  border-color: red;
  background-color: #fef2f2;
}
```

`label:has(input:invalid)` で、ラベルの中に invalid な input がある状態を捉えています。**JS 不要**で動的な装飾が完成。
</details>

---

## 3. Container Queries(概念だけ)(15分)

「**画面サイズではなく、コンポーネント自身のサイズ**」に応じてスタイルを変える、最新の技法。

### 3-1. メディアクエリの限界

メディアクエリは「**画面全体の幅**」しか見られません。

```css
/* 画面が広い時はカードを横長レイアウトに */
@media (min-width: 768px) {
  .card { display: flex; }
}
```

でも問題が:
- カードが**サイドバー内**に置かれたら、画面が広くても**カード自体**は狭い
- 「カードの幅」と「画面の幅」は別物のはず

### 3-2. Container Queries

「**コンポーネントの幅**」を基準にスタイルを変える。

```css
/* 親要素を「コンテナ」として宣言 */
.card-wrapper {
  container-type: inline-size;
}

/* カードの幅で分岐 */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

これにより、**カードがどこに置かれようが、自分の幅に応じてレイアウト変更**できます。

### 3-3. 2025-2026年の状況

Container Queries は **2025年8月に Baseline widely available**(全ブラウザで広く使える)になりました。React のような**コンポーネントベース**の設計と相性が良く、これからどんどん使われていく機能です。

### 3-4. 今日の方針

ただし**初学者の最初のCSS**としては、メディアクエリで十分なケースが大半です。本日は「**こういう機能がある**」「**React に進んだら本格的に使う**」と覚えておけば十分。

「**画面ベースのメディアクエリ → コンポーネントベースの Container Queries**」が現代CSS の流れ、と頭の片隅に。

---

## 4. ⭐ transition でスムーズな変化(25分)

「**ホバーすると色が滑らかに変わる**」あれを作ります。

### 4-1. transition の基本

```css
.button {
  background: blue;
  transition: background 0.3s;  /* 背景を0.3秒で変化 */
}

.button:hover {
  background: darkblue;
}
```

`transition: プロパティ名 時間;` の形。**変化が滑らか**になります。

### 4-2. 複数プロパティを変化

```css
.card {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* 上に少し浮く */
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

`transform: translateY(-4px)` で**少し上に浮く動き**を作れます。カードのホバー演出の定番。

### 4-3. `transition: all` の落とし穴

「**全プロパティを変化させる**」便利な書き方:

```css
.button {
  transition: all 0.3s;
}
```

でも**全部対象になる**ため:
- パフォーマンス低下(変化しない値も監視)
- 意図しないアニメーション

実務では**変化するプロパティを明示**するのが推奨。

```css
/* ✅ 推奨 */
transition: background 0.3s, transform 0.3s;
```

### 4-4. イージング(変化の速度カーブ)

```css
transition: background 0.3s ease;        /* デフォルト */
transition: background 0.3s linear;      /* 等速 */
transition: background 0.3s ease-in;     /* ゆっくり始まる */
transition: background 0.3s ease-out;    /* ゆっくり終わる */
transition: background 0.3s ease-in-out; /* 両端ゆっくり */
transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);  /* カスタム */
```

実用上は **`ease`** か **`ease-out`** が自然な感じになります。

### 4-5. transition のよく変化させるプロパティ

| プロパティ | 用途 |
|---|---|
| `background-color` | ホバー時の色変化 |
| `color` | 文字色の変化 |
| `transform` | 位置・回転・拡大の変化 |
| `opacity` | 透明度の変化(フェード) |
| `box-shadow` | 影の変化 |
| `border-color` | 枠線色の変化 |

**変化しないと困るのが `width` / `height` / `top` / `left`**。これらより `transform` の方が**滑らかで高速**です。

### 4-6. transform の便利な変換

```css
.box {
  transform: translateX(10px);     /* 横に移動 */
  transform: translateY(-4px);     /* 縦に移動(マイナスで上) */
  transform: translate(10px, 5px); /* 両方 */
  transform: scale(1.1);           /* 拡大 */
  transform: rotate(15deg);        /* 回転 */
  transform: scale(1.1) rotate(15deg);  /* 複数組み合わせ */
}
```

### 🔧 ミニ演習3

ボタンに以下の効果を transition で:

- 通常時: 青背景、白文字
- ホバー時: 濃い青、少し上に浮く(`translateY(-2px)`)、影が濃くなる
- 全て 0.2 秒で滑らかに変化

<details>
<summary>解答例</summary>

```css
.button {
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.button:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

ホバーすると**ボタンが浮き上がる**気持ちいい動き。Web サイトの「**完成度**」を一気に上げるテクニックです。
</details>

---

## 5. ⭐ keyframes でアニメーション(15分)

`transition` は「**A から B への変化**」、`keyframes` は「**ステップごとの動き**」を作れます。

### 5-1. 基本構文

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.5s ease-out;
}
```

ページを開いた瞬間、カードが**下からふわっと**現れます。

### 5-2. % で細かい制御

```css
@keyframes bounce {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-20px); }
  50%  { transform: translateY(0); }
  75%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.ball {
  animation: bounce 1s ease-in-out infinite;
}
```

`infinite` で**永遠にループ**。`0%`〜`100%`で**細かい動き**を定義できます。

### 5-3. animation プロパティの詳細

```css
.element {
  animation:
    fadeIn         /* 名前 */
    0.5s           /* 時間 */
    ease-out        /* イージング */
    0.2s            /* 遅延(0.2秒後に開始)*/
    1               /* 繰り返し回数(infinite で無限)*/
    forwards;       /* 終了後の状態を保持 */
}
```

短縮形なので、覚えるのは大変。**実用上はシンプルに**:

```css
.card {
  animation: fadeIn 0.5s ease-out;
}
```

これだけで十分なことが多いです。

### 5-4. よく使うアニメーション例

#### ローディングスピナー

```html
<div class="spinner"></div>
```

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

クルクル回るローディングインジケーターが完成。

#### スライドイン

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification {
  animation: slideIn 0.3s ease-out;
}
```

通知バナーが左から滑り込んでくる動き。

---

## 6. ⭐ prefers-reduced-motion(アクセシビリティ)(10分)

「**動きを減らしてほしい**」というユーザー設定に対応する仕組みです。

### 6-1. なぜ必要か

動きの激しいアニメーションは、**前庭神経障害**(乗り物酔いに似た症状)を持つ人にとって**苦痛**になることがあります。OS設定で「動きを減らす」が選べるようになっており、Web もそれに応じるべき。

### 6-2. メディアクエリで対応

```css
.card {
  animation: fadeIn 0.5s ease-out;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-4px);
}

/* ユーザーが「動きを減らす」設定なら */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none;        /* アニメーションを無効化 */
    transition: none;       /* トランジションも無効化 */
  }
  
  .card:hover {
    transform: none;        /* ホバーの動きも止める */
  }
}
```

### 6-3. グローバルに対応

サイト全体で対応する書き方:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

これを最後に書いておけば、**全要素のアニメーションが瞬時に完了**(動きが見えない)になり、reduced-motion 対応完了。

### 6-4. 確認方法

確認するには:
- **macOS**: システム設定 → アクセシビリティ → 表示 → 視差効果を減らす
- **Windows**: 設定 → アクセシビリティ → 視覚効果 → アニメーション効果

これをONにすると、対応した Web サイトでアニメーションが止まります。

「**配慮の有無**」が現代Web の品質指標。1つのメディアクエリで対応できるので、**書く習慣**を付けましょう。

---

## 7. ⭐ ダークモード対応(15分)

「**OSがダークモードならサイトもダークに**」を実装します。

### 7-1. prefers-color-scheme

```css
/* デフォルト(ライトモード) */
:root {
  --color-bg: white;
  --color-text: #1f2937;
  --color-surface: #f9fafb;
}

/* OSがダークモードのとき */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1f2937;
    --color-text: white;
    --color-surface: #374151;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

**CSS変数を切り替える**だけで、サイト全体がダークになります。Day 4 で学んだ CSS 変数の真価。

### 7-2. 実用テクニック: 全色を変数化

ダークモード対応の鉄則は「**色を直接書かず、必ず変数経由**」。

```css
/* ❌ ダーク対応しづらい */
.card {
  background: white;
  color: #1f2937;
  border-color: #e5e7eb;
}

/* ✅ ダーク対応しやすい */
.card {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}
```

CSS変数を切り替えるだけでサイト全体が連動します。

### 7-3. 色の役割で命名する

「**色名**」ではなく「**役割**」で名付けるとダーク対応しやすい:

```css
:root {
  /* ❌ 色の名前(ダーク時に矛盾する) */
  --blue: #3b82f6;
  --gray-100: #f9fafb;
  
  /* ✅ 役割 */
  --color-primary: #3b82f6;
  --color-surface: #f9fafb;
  --color-text: #1f2937;
}
```

役割(text、surface、primary など)で命名すると、ダークでもライトでも違和感がありません。

### 🔧 ミニ演習4

簡単なカードに、ライト/ダーク両方対応してください。

```html
<article class="card">
  <h2>タイトル</h2>
  <p>本文がここに入ります</p>
</article>
```

要件:
- CSS変数で背景・文字色・枠線を管理
- ライトモード: 白背景、黒文字、薄い枠線
- ダークモード: 暗い背景、白文字、暗い枠線

<details>
<summary>解答例</summary>

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-surface: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
    --color-border: #374151;
    --color-surface: #1f2937;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, sans-serif;
  padding: 24px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
}

.card h2 {
  margin-top: 0;
}
```

OSの設定でダークモードに切り替えると、即座に色が反転します。
</details>

---

## 8. color-mix() でホバー色を自動生成(10分)

「**この色のちょっと暗いバージョンを作りたい**」を自動化。

### 8-1. color-mix の基本

```css
:root {
  --color-primary: #3b82f6;
  
  /* primary を黒と20%混ぜて少し暗く */
  --color-primary-dark: color-mix(in oklch, var(--color-primary), black 20%);
  
  /* primary を白と20%混ぜて少し明るく */
  --color-primary-light: color-mix(in oklch, var(--color-primary), white 20%);
}
```

これにより、**1色を定義するだけで、その派生色を自動生成**できます。

### 8-2. なぜ便利か

「**ボタンのホバー色**」「**枠線の薄い色**」など、**主色から派生する色**は、これまで全部 hex で書いていました。

```css
/* 古いやり方 */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;   /* 手で計算した暗い色 */
  --color-primary-light: #60a5fa;  /* 手で計算した明るい色 */
}
```

これだと、**主色を変えるたびに派生色も全部変える**必要があります。`color-mix()` なら**主色だけ変えれば全派生色が自動更新**。

### 8-3. 実用例

```css
:root {
  --color-primary: #3b82f6;
}

.button {
  background: var(--color-primary);
  
  &:hover {
    background: color-mix(in oklch, var(--color-primary), black 15%);
  }
  
  &:active {
    background: color-mix(in oklch, var(--color-primary), black 30%);
  }
}
```

ホバーで 15%暗く、押下で 30%暗く、を自動計算。

### 8-4. 透明度版

```css
.overlay {
  background: color-mix(in srgb, var(--color-primary) 80%, transparent);
  /* primary の透明度80%版 */
}
```

これは `rgba()` の代替としても使えます。

---

## 9. 「教えない機能」紹介(5分)

調査の結果、**現時点では教えない方が良い**と判断した機能たちです。「**こんなのもある**」と知っておくだけ。

| 機能 | 状態 | コメント |
|---|---|---|
| **View Transitions API** | Firefox 144(2025/10)で Baseline | ページ遷移アニメーション。SPA で本格活用。React + TS の章で出会う可能性あり |
| **Scroll-driven Animations** | Chrome 115+のみ | スクロールに連動したアニメーション。Safari/Firefox 未対応 |
| **`@layer`(カスケードレイヤー)** | Newly available 2022 | 詳細度の問題を解消する仕組み。デザインシステム構築時に有用 |
| **Subgrid** | Newly available 2023 | Grid の入れ子で同期できる機能。複雑なレイアウトで便利 |

これらは「**もう少し慣れてから学ぶもの**」のリスト。今日の段階では、ベーシックな機能を確実に使えるようになることを優先します。

---

## 10. 章末演習(25分)

### 🎯 アニメーション付きカードギャラリー

`day7/gallery.html` として、次のカードギャラリーを作ってください。

**仕様**:
- レスポンシブなカードグリッド(Grid + auto-fit)
- 各カードに**ホバー時の浮き上がり**(transform)
- **ページロード時のフェードイン**(animation)
- **ダークモード対応**
- **prefers-reduced-motion** に対応(動きを無効化)
- CSS Nesting で書く
- 主色から派生色を `color-mix()` で

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="gallery.css">
  <title>カードギャラリー</title>
</head>
<body>
  <header class="hero">
    <h1>マイギャラリー</h1>
    <p>現代CSSの集大成</p>
  </header>
  
  <main>
    <div class="card-grid">
      <article class="card">
        <h3>カード1</h3>
        <p>説明文がここに入ります</p>
      </article>
      <article class="card">
        <h3>カード2</h3>
        <p>説明文がここに入ります</p>
      </article>
      <article class="card">
        <h3>カード3</h3>
        <p>説明文がここに入ります</p>
      </article>
      <article class="card">
        <h3>カード4</h3>
        <p>説明文がここに入ります</p>
      </article>
      <article class="card">
        <h3>カード5</h3>
        <p>説明文がここに入ります</p>
      </article>
      <article class="card">
        <h3>カード6</h3>
        <p>説明文がここに入ります</p>
      </article>
    </div>
  </main>
</body>
</html>
```

```css
*, *::before, *::after {
  box-sizing: border-box;
}

/* ===== ライトモード(デフォルト) ===== */
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: color-mix(in oklch, var(--color-primary), black 15%);
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --radius: 0.5rem;
}

/* ===== ダークモード ===== */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-surface: #1f2937;
    --color-text: #f9fafb;
    --color-text-muted: #9ca3af;
    --color-border: #374151;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
}

/* ===== アニメーション定義 ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== ヒーロー ===== */
.hero {
  background: var(--color-primary);
  color: white;
  padding: clamp(2rem, 8vw, 5rem) 1rem;
  text-align: center;

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin: 0 0 0.5rem;
  }

  p {
    font-size: clamp(1rem, 2vw, 1.25rem);
    margin: 0;
    opacity: 0.9;
  }
}

/* ===== カードグリッド ===== */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* ===== カード ===== */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  
  animation: fadeIn 0.5s ease-out;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  h3 {
    color: var(--color-primary);
    margin: 0 0 0.5rem;
  }

  p {
    color: var(--color-text-muted);
    margin: 0;
  }
}

/* ===== reduced-motion 対応 ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

完成すると:
- カードがロード時に**ふわっと現れる**
- ホバーで**少し浮く**(影が濃くなる)
- **OS設定でダーク**なら自動的に色が反転
- **OS設定で動きを減らす**なら動きが止まる

これが**2026年のモダンCSS**です。
</details>

---

## 11. 🎉 HTML/CSS 編 完了!

ここで HTML/CSS 編(Day 1〜7)が**完了**しました! 🎉

```
✅ HTML編 (Day 1〜3)
✅ CSS編 (Day 4〜7) ← 完走!
📘 次のステップ: TypeScript 本編(全20章)へ
📎 Day 8〜9 は「JavaScript だけで作りたい人向け」の参考資料として残しています
```

### HTML/CSS 編で学んだこと

- **Day 1**: Web の仕組み、HTML 基本タグ、DevTools
- **Day 2**: セマンティック HTML、アクセシビリティ
- **Day 3**: フォーム、ネイティブ validation、`<dialog>`
- **Day 4**: CSS 基本文法、セレクタ、ボックスモデル、CSS変数、OKLCH
- **Day 5**: Flexbox(1次元レイアウト)、整列、`flex: 1`、実用パターン
- **Day 6**: Grid(2次元)、`auto-fit`、レスポンシブ、`clamp()`
- **Day 7**: Nesting、`:has()`、Container Queries、アニメーション、ダークモード

ここまでで、**「見た目を整える」**スキルは完成です。次は **TypeScript 本編** で型のついたコードと一緒に、**「動く Web アプリ」**を作っていきます。

---

## 12. 今日のまとめ

### 覚えておきたいこと

1. **CSS Nesting** で関連スタイルをまとめて書ける(`&` で親セレクタ参照)
2. **`:has()`** で「子要素の状態に応じた親のスタイル変更」が JS なしで可能
3. **Container Queries**: コンポーネント単位のレスポンシブ(React の世界で本格活用)
4. **`transition`** で値の変化を滑らかに(`transform` 推奨)
5. **`@keyframes` + `animation`** でアニメーション
6. **`prefers-reduced-motion`** にグローバル対応する書き方を覚える
7. **`prefers-color-scheme: dark`** + CSS変数で**ダークモード対応**
8. **`color-mix()`** で派生色を自動生成
9. View Transitions / Scroll-driven / `@layer` / Subgrid は**次のステップ**

### よく使うパターン早見表

| やりたいこと | コード |
|---|---|
| ネスト | `.card { & h3 { ... } }` |
| ホバーで色変化 | `transition: background 0.3s` |
| ホバーで浮く | `transform: translateY(-4px)` |
| クルクル回転 | `animation: spin 1s linear infinite` |
| ダークモード | `@media (prefers-color-scheme: dark)` |
| 動きを減らす | `@media (prefers-reduced-motion: reduce)` |
| 派生色生成 | `color-mix(in oklch, var(--primary), black 15%)` |
| 子要素状態で親変える | `.card:has(img) { ... }` |

---

## 次のステップ

おめでとうございます! HTML/CSS 編(Day 1〜7)を完走しました。

ここから先は **TypeScript 本編(全20章)** に進むのがメインルートです。

```
1. HTML/CSS 超速習(Day 1〜7) ✅ 完了!
       ↓
2. TypeScript 本編(全20章) ← 次はここ
```

TypeScript 本編では:

- **第0〜1章**: TypeScript とは何か、開発環境の構築
- **第2〜7章**: 言語基礎(変数・関数・配列・クラスなど)を **JS と TS を統合して学ぶ**
- **第8〜12章**: 型システム(ジェネリクスなど)
- **第13〜17章**: DOM・Vite・React・Tailwind CSS・Express による実践
- **第18〜19章**: ベストプラクティスとリソース

を学びます。これまで作ってきた HTML/CSS のページに、いよいよ**型のついた動き**を加えていく段階です。

### Day 8〜9 はどう扱うか

Day 8〜9 は **「JavaScript だけで作りたい人向け」の参考資料** として残してあります。

- TypeScript 本編で同じ内容(DOM 操作・localStorage・ダークモード切り替えなど)を**より発展的な形**で学ぶので、**通常はスキップして OK** です
- 「素の JS で軽く触れてから TypeScript に進みたい」「JS だけで小さなページを作る場面で参考にしたい」場合は、Day 8〜9 を読んでから本編へ進んでも構いません

---

> 🎯 **コラム: 「2026年のCSS」の凄さ**
>
> 今日で学んだ機能の多くは、**5年前には無かった**ものです。
>
> - **CSS Nesting**: 2023年12月
> - **`:has()`**: 2023年12月
> - **Container Queries**: 2025年8月に Widely available
> - **`color-mix()`**: 2023年
>
> 5年前なら:
> - ネストは**Sass(プリプロセッサ)** が必須
> - 親セレクタは**JavaScript** で実装
> - コンポーネント単位のレスポンシブは**事実上不可能**
> - 派生色は**手で計算 or Sass の関数**
>
> でした。それが今や、**全部素のCSSで完結**します。
>
> Web の世界では、**良いものに置き換わるスピード**がとても速い。だからこそ、**「学び続ける**」のがWeb開発者の宿命であり、**楽しさ**でもあります。
>
> あなたが今学んでいる CSS は、**世界で最も新しいバージョン**。5年後にはまた新機能が追加されているはず。でも、今日学んだ「**Flexbox / Grid / 変数 / Nesting**」の基礎は、そのまま土台として活躍し続けます。
>
> 「**今学んだことは無駄にならない**」と確信して、TypeScript 本編へ進みましょう。

お疲れさまでした!**TypeScript 本編** で再会しましょう ☕
