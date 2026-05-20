# HTML/CSS 超速習 Day 4 — CSS基礎・セレクタ・ボックスモデル

## 今日のゴール

- CSSをHTMLに適用する3つの方法を理解する
- 基本的なセレクタ(要素、クラス、ID、疑似クラス、結合子)を使える
- カスケード・継承・詳細度の仕組みが分かる
- **ボックスモデル**と **`box-sizing: border-box`** を理解する
- 色の指定方法(hex / rgb / oklch)が分かる
- **CSS変数** を使えるようになる

**所要時間の目安: 2〜2.5時間**

---

## 0. CSS編の始まり

ここから CSS 編です!HTML で作った骨組みに、ようやく**色・余白・配置**を付けていきます。

CSS は「**C**ascading **S**tyle **S**heets」の略。「カスケードする(連鎖する)スタイルシート」という意味で、後で説明する「カスケード」が中核概念です。

CSS 編で目指すのは、Day 9 で作る**ポートフォリオサイト**。今日はその土台となる**基本文法と原理**を一気に押さえます。

---

## 1. CSS を HTML に適用する3つの方法(15分)

### 1-1. 方法1: インライン

```html
<p style="color: red; font-size: 20px;">赤い文字</p>
```

タグの `style` 属性に直接書きます。**最も詳細度が高い**(後述)が、**避けるべき方法**。

理由:
- HTML と CSS が混ざって読みにくい
- 同じスタイルを複数箇所で使い回せない
- メンテナンスが大変

### 1-2. 方法2: `<style>` タグ

```html
<head>
  <style>
    p {
      color: red;
      font-size: 20px;
    }
  </style>
</head>
```

HTML ファイル内の `<head>` に書きます。**1ファイルで完結したい小規模な例**には便利ですが、ファイルが分かれていないので大規模では使いにくい。

### 1-3. ⭐ 方法3: 外部CSSファイル(推奨)

CSS を別ファイルに書き、HTML から読み込みます。**これが基本のスタイル**。

**`day4/style.css`**:
```css
p {
  color: red;
  font-size: 20px;
}
```

**`day4/index.html`**:
```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

メリット:
- HTMLとCSSが分離して読みやすい
- 複数ページで同じCSSを使い回せる
- ブラウザがCSSをキャッシュして高速化

これからは**外部CSSファイルを基本**に進めます。

### 1-4. はじめての CSS

`day4/` フォルダに `index.html` と `style.css` を作ってください。

**`index.html`**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>CSS のテスト</title>
</head>
<body>
  <h1>こんにちは、CSS!</h1>
  <p>これは段落です。</p>
  <p>これも段落です。</p>
</body>
</html>
```

**`style.css`**:
```css
h1 {
  color: blue;
}

p {
  color: gray;
  font-size: 18px;
}
```

Live Server で開いて、青い見出しと灰色の段落が表示されればOK!

---

## 2. CSS の基本構文(15分)

### 2-1. 構造

```css
セレクタ {
  プロパティ: 値;
  プロパティ: 値;
}
```

- **セレクタ**: どの要素にスタイルを適用するか
- **プロパティ**: 何を変えるか(色、サイズ、余白など)
- **値**: どう変えるか
- **`;`**(セミコロン): プロパティの終わり(最後の1つでも書く習慣に)

具体例:
```css
h1 {
  color: blue;
  font-size: 24px;
  margin-bottom: 16px;
}
```

「**`h1` という要素の、文字色を青、文字サイズを 24px、下の余白を 16px に**」という意味。

### 2-2. コメント

```css
/* これはコメントです。ブラウザには無視されます */

h1 {
  color: blue;  /* 行末コメントも書ける */
}
```

HTML の `<!-- -->` と違って、CSS は `/* */` です。

---

## 3. セレクタ — どの要素を指定するか(30分)

ここがCSS の腕の見せどころ。**「狙った要素にだけ」**スタイルを当てる技術。

### 3-1. 要素セレクタ

タグ名で指定。

```css
p {
  color: gray;
}

h1 {
  color: blue;
}
```

**そのタグ全部**に適用されます。

### 3-2. ⭐ クラスセレクタ(最重要)

HTML で `class="..."` を付けた要素に。CSS では **`.クラス名`** で指定します。

**HTML**:
```html
<p class="warning">注意!</p>
<p class="info">お知らせです</p>
<p>普通の段落</p>
```

**CSS**:
```css
.warning {
  color: red;
  font-weight: bold;
}

.info {
  color: blue;
}
```

クラスは**何度でも使い回せる**ので、CSS で最も頻繁に使うセレクタです。

#### 複数クラスを付ける

スペース区切りで複数指定できます。

```html
<p class="warning bold large">超重要!</p>
```

```css
.warning { color: red; }
.bold { font-weight: bold; }
.large { font-size: 24px; }
```

3つのクラスすべてが適用されます。

### 3-3. ID セレクタ

`id="..."` を付けた要素に。CSS では **`#ID名`** で指定。

```html
<header id="main-header">...</header>
```

```css
#main-header {
  background-color: lightblue;
}
```

**重要なルール**:
- ID は**ページに1つだけ**(同じIDを複数の要素に付けない)
- スタイル目的では**クラスを使う**ほうが推奨

ID は主に**JavaScript からの参照**や**ページ内リンク**(`href="#section1"`)に使い、**CSSでは避ける**のが現代のベストプラクティスです(詳細度の問題で後でハマる)。

### 3-4. 属性セレクタ

属性で指定。

```css
/* type="email" の input だけ */
input[type="email"] {
  border-color: blue;
}

/* href が "https://" で始まる a タグ */
a[href^="https://"] {
  color: green;
}

/* href が ".pdf" で終わる a タグ */
a[href$=".pdf"]::after {
  content: " (PDF)";
}
```

実用上、フォーム要素の見た目を変えるときによく使います。

### 3-5. 結合子(子・子孫・隣接)

要素の関係でも指定できます。

```css
/* article の中の p すべて(子孫セレクタ) */
article p {
  line-height: 1.6;
}

/* article の直接の子の p だけ(子セレクタ) */
article > p {
  margin-bottom: 16px;
}

/* h2 の直後の p(隣接兄弟セレクタ) */
h2 + p {
  font-size: 18px;
}
```

- **(スペース)**: 子孫(何階層下でも)
- **`>`**: 直接の子だけ
- **`+`**: すぐ後ろの要素
- **`~`**: 後の要素すべて

### 3-6. ⭐ 疑似クラス

「状態」を表すセレクタ。`:` を使います。

```css
/* マウスホバー時 */
button:hover {
  background-color: blue;
}

/* フォーカス時(クリックされたりタブで選ばれたり) */
input:focus {
  border-color: blue;
  outline: 2px solid skyblue;
}

/* 最初の子要素 */
li:first-child {
  font-weight: bold;
}

/* 最後の子要素 */
li:last-child {
  margin-bottom: 0;
}

/* n番目の子要素 */
li:nth-child(odd) {
  background-color: #f5f5f5;  /* 奇数行を縞模様に */
}

/* チェックされたチェックボックス */
input:checked {
  /* スタイル */
}

/* 無効化された入力欄 */
input:disabled {
  background-color: #eee;
}
```

「**マウスを乗せたら色を変える**」「**フォーカスされたら枠線**」など、インタラクティブな見た目はほぼ疑似クラスで作れます。

### 3-7. ⭐ `:focus-visible` — アクセシビリティに優しい

`:focus` には現代的な親戚があります。

```css
/* 古い: マウスクリックでもフォーカス枠が出る(うるさい) */
button:focus {
  outline: 2px solid blue;
}

/* 現代: キーボード操作のときだけフォーカス枠が出る */
button:focus-visible {
  outline: 2px solid blue;
}
```

**マウスユーザーには邪魔だけど、キーボードユーザーには必須**なフォーカス枠を、賢く切り替えてくれる現代CSS。**`:focus` ではなく `:focus-visible`** を使うのが2025-2026年の主流です。

### 3-8. 現代の便利な疑似クラス: `:is()` / `:where()` / `:has()`

#### `:is()` — まとめて書ける

```css
/* 長い書き方 */
header h1, header h2, header h3 { color: blue; }

/* :is() で短く */
header :is(h1, h2, h3) { color: blue; }
```

#### `:where()` — `:is()` と同じだが詳細度が0

詳細度の話は次のセクションで。**「上書きされやすい初期スタイル**」を書きたいときに便利。

#### ⭐ `:has()` — 親セレクタ(2023年Baseline)

**「中にこれを持つ要素」**を選ぶ画期的なセレクタ。

```css
/* チェックされた input を含む li */
li:has(input:checked) {
  text-decoration: line-through;
  opacity: 0.5;
}

/* 画像を含む article */
article:has(img) {
  padding: 20px;
}
```

これは「**JSが必要だった処理がCSSだけで済む**」というインパクトを持つ機能。Day 7 で本格的に扱いますが、ここでは存在だけ覚えておいてください。

### 🔧 ミニ演習1

次のHTMLにCSSでスタイルを当ててください。

```html
<ul>
  <li class="item">アイテム1</li>
  <li class="item important">重要なアイテム!</li>
  <li class="item">アイテム3</li>
</ul>

<button>クリック</button>
<input type="text">
```

要件:
1. すべての `.item` の文字色を青に
2. `.important` の文字色を赤に(青を上書き)
3. 最初の `<li>` を太字に
4. `<button>` に hover で背景色変更
5. `<input>` がフォーカスされたら枠線を緑に

<details>
<summary>解答例</summary>

```css
.item {
  color: blue;
}

.important {
  color: red;
}

li:first-child {
  font-weight: bold;
}

button:hover {
  background-color: lightblue;
  cursor: pointer;
}

input:focus {
  border-color: green;
  outline: none;  /* デフォルトの青い枠線を消す */
}
```

`cursor: pointer` でマウスカーソルが指マークに変わります。ボタンっぽさを演出する小ワザ。
</details>

---

## 4. ⭐ カスケード・継承・詳細度(20分)

CSS でつまずく**最大のポイント**です。ここを理解すれば、「**なぜ思った通りにスタイルが当たらないのか**」が分かるようになります。

### 4-1. カスケードとは

「**Cascading Style Sheets**」の **C** = Cascading(連鎖)。複数のCSSルールが重なる時の優先順位を決める仕組みです。

例えば:

```css
p { color: blue; }
p { color: red; }   /* 後のルール */
```

`<p>` は**赤**になります。**後に書いたルールが勝つ**(他の条件が同じなら)。

### 4-2. 継承

親要素のスタイルが**子要素に引き継がれる**プロパティもあります。

```css
body {
  color: gray;
  font-family: sans-serif;
}
```

これだけで、`<body>` の中の**すべての文字**(`<p>`, `<h1>`, `<li>` ...)が灰色になります。

**継承されるプロパティ**:
- `color`、`font-family`、`font-size`、`line-height` などフォント・テキスト系
- `text-align`、`text-indent`

**継承されないプロパティ**:
- `background-color`、`border`、`margin`、`padding` など、その要素自体の見た目

「**文字系は継承される、見た目系は継承されない**」と覚えておけば実用上OKです。

### 4-3. ⭐ 詳細度(Specificity)

複数のセレクタが同じ要素に適用されるとき、**どれを優先するか**のルール。

```css
p { color: blue; }              /* 要素セレクタ */
.warning { color: red; }        /* クラスセレクタ */
#main { color: green; }         /* IDセレクタ */
```

```html
<p class="warning" id="main">何色?</p>
```

→ **緑**になります(IDが最も強い)。

#### 詳細度の計算ルール(簡易版)

| セレクタの種類 | 詳細度の重み |
|---|---|
| インライン style属性 | 1000(最強) |
| ID セレクタ(`#id`) | 100 |
| クラス・属性・疑似クラス(`.cls`、`[type=...]`、`:hover`) | 10 |
| 要素・疑似要素(`p`、`::before`) | 1 |
| 全称セレクタ `*` | 0 |

複数組み合わせると足し算:

```css
ul li.item    /* 1 + 1 + 10 = 12 */
#nav a:hover  /* 100 + 1 + 10 = 111 */
```

**同じ詳細度なら、後に書いた方が勝つ**。

### 4-4. ⚠️ 詳細度のトラブル

CSS で**「スタイルが当たらない!」**となる典型は、詳細度の問題。

```css
.text { color: blue; }

ul li.text { color: red; }  /* こっちが勝つ(詳細度が高い) */
```

```html
<li class="text">何色?</li>
```

→ **赤**。`.text` だけ書いたつもりが、別の場所で `ul li.text` と書かれていると、そちらが勝ちます。

**実用的なルール**:
1. **IDセレクタを CSS で使わない**(詳細度が極端に上がってトラブルの元)
2. **クラスを基本に**(`.btn-primary` のように意味のある名前)
3. **詳細度を上げすぎない**(`.card .title .text` のような長い連鎖を避ける)

これだけ意識すれば、詳細度の悩みはほぼ消えます。

### 4-5. `!important` は最終手段

```css
.warning {
  color: red !important;  /* 他のルールを無視して強制適用 */
}
```

これは**他のルールを全部蹴散らす**強制ボタン。便利そうですが**乱用は厳禁**です。

理由: 一度 `!important` を書くと、それを上書きするのに**もう一つ `!important` が必要**になり、地獄が始まります。

「**やむを得ない場合のみ**」(例: サードパーティライブラリのスタイルを上書きするとき)に限定してください。

---

## 5. ⭐ ボックスモデル(25分)

すべての HTML 要素は「**箱(ボックス)**」として扱われます。これを理解するのが CSS の基礎中の基礎。

### 5-1. 4つの層

各要素は内側から外側へ、4つの層で構成されます。

```
┌─────────────────────────┐
│       margin(外側余白)        │
│  ┌──────────────────┐  │
│  │    border(枠線)    │  │
│  │  ┌────────────┐ │  │
│  │  │ padding(内側) │  │
│  │  │ ┌────────┐ │ │  │
│  │  │ │ content │ │ │  │
│  │  │ │ (中身) │ │ │  │
│  │  │ └────────┘ │ │  │
│  │  └────────────┘ │  │
│  └──────────────────┘  │
└─────────────────────────┘
```

- **content**: テキストや画像など、要素の中身
- **padding**: content と border の間の余白(内側)
- **border**: 枠線
- **margin**: border の外側の余白(他の要素との間)

### 5-2. それぞれのプロパティ

```css
.box {
  width: 200px;
  height: 100px;
  
  padding: 16px;       /* 全方向に内側余白 */
  border: 2px solid black;
  margin: 24px;        /* 全方向に外側余白 */
  
  background-color: lightblue;
}
```

#### 方向ごとに指定

```css
.box {
  /* 個別に指定 */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  
  /* または短縮形 */
  padding: 10px 20px;          /* 上下 左右 */
  padding: 10px 20px 30px;      /* 上 左右 下 */
  padding: 10px 20px 30px 40px; /* 上 右 下 左(時計回り) */
}
```

`margin` も同じ書き方。

### 5-3. ⭐ box-sizing — これを最初に書く

ここがハマりポイント。デフォルトの `box-sizing: content-box` だと、**`width` は中身(content)のサイズだけを指す**ので、padding や border の分**実際の幅が広くなります**。

```css
/* デフォルト */
.box {
  width: 200px;
  padding: 20px;     /* +40px 増える */
  border: 2px solid; /* +4px 増える */
  /* 実際の幅は 244px! */
}
```

これは直感的じゃないので、現代では **`border-box`** を使うのが標準です。

```css
* {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* 実際の幅も 200px(padding と border が中に含まれる) */
}
```

**全要素にこれを適用する**のが現代CSSのお約束。**新しいCSSファイルを作ったら、最初にこれを書く**習慣を付けてください。

### 5-4. CSSリセット(簡易版)

`box-sizing` と一緒に、ブラウザのデフォルトスタイルもリセットしておきます。

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}

h1, h2, h3, p, ul, ol {
  margin-top: 0;
}
```

これを `style.css` の先頭に書いておくと、ブラウザごとの違いを減らせます。

> **「CSS Reset」「Normalize.css」**などのライブラリもありますが、初学者は上記くらいで十分。

### 5-5. display プロパティ

各要素には「**ブロック要素**」「**インライン要素**」という性質があります。

- **ブロック要素**(`<div>`, `<p>`, `<h1>` など): 縦に並ぶ、width/height が効く
- **インライン要素**(`<span>`, `<a>`, `<strong>` など): 横に並ぶ、width/height が効かない

`display` プロパティで変えられます。

```css
.inline { display: inline; }         /* インラインに */
.block { display: block; }           /* ブロックに */
.inline-block { display: inline-block; }  /* 中間(横に並ぶがwidth有効) */
.none { display: none; }             /* 非表示(空間も消える) */
```

`display: flex` と `display: grid` は次の章で詳しく。今は「**こんなプロパティがある**」と知っておけばOK。

### 🔧 ミニ演習2

次のHTMLとCSSを書いて、見た目を確認してください。

```html
<div class="card">
  <h2>カードタイトル</h2>
  <p>カードの説明文がここに入ります。</p>
</div>
```

CSS要件:
- カードの背景色を白
- 全方向に16pxの内側余白(padding)
- 1pxの灰色の枠線
- 角を丸く(`border-radius: 8px`)
- 上下に20pxの外側余白(margin)
- 幅は最大400px

<details>
<summary>解答例</summary>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #f5f5f5;
}

.card {
  background-color: white;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px;
  max-width: 400px;
}
```

`max-width` は「**この値より大きくならない**」を指定。`width` だと「**この値固定**」になるので、レスポンシブを考えると `max-width` が便利。

`#f5f5f5` は灰色の色コード(後で説明)。

DevTools の Elements パネルで要素を選んでみてください。**右側の図でボックスモデル**(margin/border/padding/content)が可視化されます。これがCSSデバッグの強力なツール。
</details>

---

## 6. 色の指定(15分)

CSS で色を指定する方法はいくつかあります。**現代では4種類**を知っていれば十分。

### 6-1. 色の名前

```css
color: red;
background-color: lightblue;
```

CSS には**100以上の色の名前**(`red`、`blue`、`gold`、`tomato`、`slategray` など)が定義されていますが、実務では**ほぼ使いません**。サンプルや学習中の便利機能と考えてOK。

### 6-2. 16進数(Hex)

```css
color: #ff0000;       /* 赤 */
color: #00ff00;       /* 緑 */
color: #0000ff;       /* 青 */
color: #f5f5f5;       /* 薄い灰色 */
color: #fff;          /* 白(短縮形)*/
```

`#` + RGB を 16進数で。**実務で最もよく使う**書き方です。

### 6-3. rgb() と rgba()

```css
color: rgb(255, 0, 0);        /* 赤 */
color: rgba(255, 0, 0, 0.5);  /* 半透明の赤(0=完全透明、1=不透明) */
```

`a` は alpha(透明度)。**半透明にしたいときに便利**。

最近は新記法も:
```css
color: rgb(255 0 0);       /* スペース区切り(現代) */
color: rgb(255 0 0 / 50%); /* 透明度 */
```

### 6-4. ⭐ oklch() — 現代の色指定

**OKLCH** は最新の色指定方法で、人間の色覚に基づいた直感的な指定が可能。

```css
color: oklch(0.7 0.15 240);  /* 明度 / 彩度 / 色相 */
```

- 第1引数: **明度**(0=黒、1=白)
- 第2引数: **彩度**(0=灰色、大きいほど鮮やか)
- 第3引数: **色相**(0=赤、120=緑、240=青)

メリット:
- **明度が均一**(rgb だと「青」を明るくしようとして#aaaaffにしても、見た目は暗いまま)
- **アクセシブルな色を作りやすい**
- **DesignSystem を作るときに便利**

```css
:root {
  --primary: oklch(60% 0.15 240);   /* 中明度の青 */
  --primary-light: oklch(80% 0.10 240); /* 同じ色相で明るく */
  --primary-dark: oklch(40% 0.20 240);  /* 同じ色相で暗く */
}
```

**ブラウザ対応**: Chrome 111+、Firefox 113+、Safari 15.4+ で動作。約95%のユーザー環境で動きます(2025-2026年)。

> **初学者の方針**: hex(`#3b82f6`)を基本に使いつつ、**OKLCH を「次世代の標準」として知っておく**。Day 7 でもう少し詳しく扱います。

### 6-5. 値の単位

色以外にも、CSS には様々な単位があります。

| 単位 | 意味 |
|---|---|
| `px` | ピクセル(絶対値) |
| `%` | 親要素に対する割合 |
| `em` | 親要素のフォントサイズ基準 |
| `rem` | ルート(`<html>`)のフォントサイズ基準 |
| `vw` / `vh` | ビューポート(画面)の幅/高さの1% |

**初学者の方針**:
- フォントサイズや余白: `rem` を基本に(`1rem` = ルートのフォントサイズ、デフォルト16px)
- 細かい線などの絶対値: `px`
- 画面サイズに対する比率: `vw` / `vh` / `%`

```css
html { font-size: 16px; }  /* デフォルト */
h1 { font-size: 2rem; }    /* 32px */
.container { max-width: 60rem; }  /* 960px */
.hero { min-height: 80vh; }  /* 画面高さの80% */
```

---

## 7. ⭐ CSS変数(Custom Properties)(15分)

ここがこの章の隠れ目玉。**「値に名前を付けて再利用できる」**機能で、現代CSSの基本武器です。

### 7-1. 基本

```css
:root {
  --primary-color: #3b82f6;
  --text-color: #333;
  --space-unit: 16px;
}

button {
  background-color: var(--primary-color);
  padding: var(--space-unit);
}

h1 {
  color: var(--text-color);
}
```

- **定義**: `--変数名: 値;`(`:root` という疑似クラスに書くのが慣習)
- **使う**: `var(--変数名)`

### 7-2. なぜ便利か

「**色を全部一括で変える**」が一瞬で可能。

```css
:root {
  --primary: #3b82f6;
}

.btn { background: var(--primary); }
.link { color: var(--primary); }
.border { border-color: var(--primary); }
```

これで `--primary` を `#10b981`(緑)に変えるだけで、**全部の要素が一気に緑に**変わります。

### 7-3. デザイントークン

実務では、よく使う値を**変数として最初にまとめる**のが定石。

```css
:root {
  /* カラー */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  
  /* スペーシング */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  
  /* フォント */
  --font-sans: system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  
  /* その他 */
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

これを「**デザイントークン**」と呼びます。CSS全体で一貫した値を使う基盤になります。

### 7-4. ダークモード対応の予告

CSS変数はダークモード対応にも使えます(Day 7 / 8 で詳しく)。

```css
:root {
  --color-bg: white;
  --color-text: #1f2937;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1f2937;
    --color-text: white;
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

これだけで、**OS設定がダークモードなら自動でダーク色に切り替わる**サイトができます。CSS変数の真価です。

### 🔧 ミニ演習3

次のスタイルを CSS変数を使って整理してください。

```css
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}

.btn-secondary {
  background-color: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 12px 24px;
  border-radius: 8px;
}

.card {
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 24px;
}
```

<details>
<summary>解答例</summary>

```css
:root {
  --color-primary: #3b82f6;
  --color-white: white;
  --space-md: 12px;
  --space-lg: 24px;
  --radius-md: 8px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
}

.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
}

.card {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}
```

色や寸法を一箇所(`:root`)で管理できるようになりました。デザイン変更も、変数の値を変えるだけ。
</details>

---

## 8. 章末演習(15分)

### 🎯 Day 2 のブログ記事ページにスタイルを当てる

Day 2 で作った `blog.html` を `day4/blog.html` にコピー(または再作成)し、`day4/style.css` でスタイルを当ててください。

**要件**:
- CSS変数で色とスペーシングを定義
- リセット系のスタイル(`box-sizing: border-box`、`body` の `margin: 0` など)
- **ヘッダー**: 背景色、白文字、内側余白
- **メインコンテンツ**: 中央寄せ、最大幅60rem
- **記事**: 背景色、内側余白、角丸、影
- **見出し**: 適切なフォントサイズ
- **リンク**: ホバー時に色変化
- **フォーカス**: `:focus-visible` で枠線
- 全体の文字色、行間(`line-height: 1.6` くらい)を `body` に

<details>
<summary>解答例</summary>

```css
/* ===== Reset ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
}

h1, h2, h3, p, ul, ol {
  margin-top: 0;
}

/* ===== Design Tokens ===== */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #f9fafb;
  --color-surface: white;
  --color-border: #e5e7eb;
  
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  --radius: 0.5rem;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.08);
}

/* ===== Header ===== */
header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-lg) var(--space-xl);
}

header h1 {
  margin: 0;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: var(--space-md) 0 0;
}

nav li {
  display: inline-block;
  margin-right: var(--space-md);
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

/* ===== Main ===== */
main {
  max-width: 60rem;
  margin: 0 auto;
  padding: var(--space-xl);
}

article {
  background-color: var(--color-surface);
  padding: var(--space-xl);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: var(--space-xl);
}

article h2 {
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

article header p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: var(--space-md);
}

section {
  margin-bottom: var(--space-lg);
}

section h3 {
  margin-bottom: var(--space-sm);
}

/* ===== Aside ===== */
aside {
  background-color: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

aside h2 {
  font-size: 1.2rem;
  margin-bottom: var(--space-sm);
}

/* ===== Details ===== */
details {
  background-color: var(--color-bg);
  padding: var(--space-md);
  border-radius: var(--radius);
  margin-bottom: var(--space-sm);
  border: 1px solid var(--color-border);
}

summary {
  cursor: pointer;
  font-weight: bold;
}

details[open] {
  background-color: white;
}

/* ===== Links ===== */
a {
  color: var(--color-primary);
}

a:hover {
  color: var(--color-primary-dark);
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ===== Footer ===== */
footer {
  background-color: var(--color-text);
  color: white;
  padding: var(--space-lg);
  text-align: center;
  margin-top: var(--space-xl);
}
```

ブラウザで開くと、いきなり**それっぽいブログサイト**っぽくなっているはず!

ポイント:
- 上から「Reset → Design Tokens → コンポーネント別」の順に整理
- 色・余白・角丸など、よく使う値は全部 CSS 変数化
- `:focus-visible` でキーボード操作にも対応
- 配置(横並び等)はまだ素朴。これは Day 5 の Flexbox で改善します
</details>

---

## 9. 今日のまとめ

### 覚えておきたいこと

1. **CSS は外部ファイル** に書いて `<link>` で読み込む
2. **セレクタ → プロパティ: 値;** の構造
3. **クラスセレクタ(`.cls`)** が基本。**ID(`#id`)はCSS で使わない**
4. **疑似クラス**(`:hover`、`:focus-visible`、`:checked` など)で状態を表現
5. **`:has()` で親セレクタ**(現代の新機能、Day 7 で詳しく)
6. **カスケード = 後に書いたものが勝つ**(同じ詳細度なら)
7. **詳細度**: インライン > ID > クラス > 要素
8. **`!important` は最終手段**
9. **ボックスモデル**: margin > border > padding > content
10. **`box-sizing: border-box`** を全要素に適用するのが現代の標準
11. **`color` は hex、rgb、oklch** で指定(将来は OKLCH 推奨)
12. **CSS変数(`--name`、`var(--name)`)** でデザイントークンを管理

### よく使うプロパティ早見表

| プロパティ | 用途 |
|---|---|
| `color` | 文字色 |
| `background-color` | 背景色 |
| `font-size` / `font-family` / `font-weight` | フォント |
| `line-height` | 行間 |
| `text-align` | テキストの揃え方 |
| `width` / `max-width` / `min-width` | 横幅 |
| `height` | 高さ |
| `padding` / `margin` | 内側/外側の余白 |
| `border` / `border-radius` | 枠線/角丸 |
| `box-shadow` | 影 |
| `display` | 表示方法 |
| `cursor` | マウスカーソルの形 |

---

## 明日の予告

Day 5 は **Flexbox** を集中的に学びます。「**横並び・縦並び**」がワンプロパティで自在に作れる、現代CSSのレイアウト技法。

これまで素朴に縦に並んでいた要素が、ナビゲーション・カードグリッド・フォーム・フッターなど、**それっぽいレイアウト**になっていきます。

CSS の「**書いて楽しい**」フェーズの本番です ☕

---

> 🎯 **コラム: CSSの「ピタゴラスイッチ感」**
>
> CSS には、初学者がよく感じる**「思った通りにならない!」**という壁があります。これには理由があって、CSSは:
>
> 1. **複数のスタイルが重なる**(カスケード)
> 2. **親から子に伝わる**(継承)
> 3. **詳細度で順位が決まる**
> 4. **ブラウザのデフォルト + 自分のCSS**
>
> という多重構造になっているからです。
>
> 攻略のコツは:
>
> 1. **DevTools を常に開く**(Elements パネルの右側、「適用されたスタイル」「打ち消されたスタイル」が見える)
> 2. **シンプルに保つ**(セレクタを長くしない、ID を使わない、`!important` を使わない)
> 3. **CSS変数で値を整理**(色や寸法を散らばせない)
>
> 「**CSS が思い通りにならない**」と感じたら、DevTools を見て「**今、どのルールが勝っているのか**」を確認する習慣を。これだけでデバッグ速度が劇的に変わります。
>
> CSS は最初は難しく感じますが、慣れると**パズルのような楽しさ**があります。明日のFlexbox で、その楽しさを本格的に味わいましょう。

お疲れさまでした!次の Day 5 で、**Flexbox の魔法**へ進みましょう ☕
