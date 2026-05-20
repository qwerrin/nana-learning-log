# HTML/CSS 超速習 Day 5 — Flexbox 集中講座

## 今日のゴール

- Flexbox の基本概念(主軸・交差軸)を理解する
- `display: flex` で横並びレイアウトが作れる
- `gap` で要素間の余白を一発で設定できる
- `justify-content` / `align-items` で整列が自在
- `flex-wrap` で折り返しレイアウト
- `flex: 1` の意味と実用パターンが分かる
- ナビバー、カード横並び、センタリングが書ける

**所要時間の目安: 2〜2.5時間**

---

## 0. 今日のスタンス

これまで HTML 要素は**素朴に縦に並ぶ**だけでした。今日からは **Flexbox**(フレックスボックス)を使って、**自由に配置**できるようになります。

Flexbox は**1次元のレイアウト**(横一列 または 縦一列)を作るための仕組みで、2010年代後半に普及しました。それ以前は `float` という古い手法でレイアウトしていましたが、**Flexbox が圧倒的に楽**で、現代では事実上の標準。

**今日学べば、こんなレイアウトが作れる**ようになります:
- ナビゲーションバー(左にロゴ、右にメニュー)
- 3列のカードリスト
- フォームの横並びボタン
- ヘッダー・フッターの整列
- 縦横センタリング(これがCSS界の長年の難題でした!)

「**CSS が一気に楽しくなる**」回です。

---

## 1. Flexbox の基本概念(15分)

### 1-1. 何ができるのか

```html
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

**何もしないと**:
```
A
B
C
```
(縦に並ぶ)

**Flexbox を使うと**:
```
A  B  C
```
(横に並ぶ!)

たった**1行のCSS**で実現できます。

```css
.container {
  display: flex;
}
```

### 1-2. 親と子の関係

Flexbox は **「親要素」と「子要素」**の関係で動きます。

```html
<div class="container">    <!-- 親(Flex コンテナ) -->
  <div class="item">A</div> <!-- 子(Flex アイテム) -->
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

- **親に `display: flex` を書く** → 子が横並びになる
- 子要素を**Flexアイテム**と呼ぶ

### 1-3. ⭐ 主軸と交差軸

これが Flexbox 理解の鍵。

```
[ 主軸(main axis) ] →

┌─────────────────┐
│ A    B    C    D │  ← デフォルトでは横方向が主軸
│                 │
│                 │  ← 縦方向が交差軸(cross axis)
└─────────────────┘
```

- **主軸(main axis)**: アイテムが並ぶ方向
- **交差軸(cross axis)**: 主軸と直角の方向

「**横並び**」をデフォルトとして、主軸は**横方向**になります。これからこの2軸を意識して操作していきます。

---

## 2. はじめての Flexbox(20分)

実際に手を動かしてみましょう。

### 2-1. 準備

`day5/` フォルダに `index.html` と `style.css` を作ってください。

**`index.html`**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Flexbox の練習</title>
</head>
<body>
  <div class="container">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
  </div>
</body>
</html>
```

**`style.css`**:
```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  padding: 20px;
}

.container {
  background-color: #f3f4f6;
  padding: 16px;
}

.item {
  background-color: #3b82f6;
  color: white;
  padding: 16px 24px;
  font-size: 24px;
  text-align: center;
}
```

Live Server で表示すると、青い箱が縦に3つ並んでいるはずです。

### 2-2. display: flex を追加

`.container` に1行追加するだけ:

```css
.container {
  background-color: #f3f4f6;
  padding: 16px;
  display: flex;  /* ← これを追加! */
}
```

保存すると、**横並び**に変わります!

```
[A][B][C]
```

これが Flexbox の魔法。

### 2-3. ⭐ gap — 要素間の余白(現代の必修)

要素同士がくっついているので、隙間を空けましょう。

```css
.container {
  display: flex;
  gap: 16px;  /* ← 要素間の余白 */
}
```

```
[A]  [B]  [C]
```

`gap` プロパティは**「要素間の余白」**を一発で設定できる優れもの。昔は `margin-right` でちまちま空けていましたが、**現代は `gap` 一択**です。

### 2-4. flex-direction で方向を変える

主軸の方向を変えられます。

```css
.container {
  display: flex;
  flex-direction: row;          /* デフォルト: 横並び(左→右)*/
  flex-direction: row-reverse;  /* 横並び(右→左)*/
  flex-direction: column;       /* 縦並び(上→下)*/
  flex-direction: column-reverse; /* 縦並び(下→上)*/
}
```

`column` にすると、Flexbox を使いながら**縦並び**にできます。「あれ?」と思いますよね。実は **「縦並びでもFlexboxを使うメリット」**があります(整列やgap、伸縮)。次のセクションで分かります。

### 🔧 ミニ演習1

3つの色違いの箱を、それぞれ次のように並べてください(別々に試す)。

1. デフォルトの横並び(間隔 20px)
2. 縦並び(間隔 10px)
3. 横並び・逆順(C → B → A)

<details>
<summary>解答例</summary>

```css
/* パターン1: 横並び */
.container {
  display: flex;
  gap: 20px;
}

/* パターン2: 縦並び */
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* パターン3: 横並び逆順 */
.container {
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
}
```

3つの違いを目で見て、`flex-direction` の威力を体感してください。
</details>

---

## 3. ⭐ 整列 — justify-content と align-items(30分)

Flexbox で**最も重要な2つのプロパティ**です。「**整列**」を自在に操ります。

### 3-1. justify-content — 主軸方向の整列

```css
.container {
  display: flex;
  justify-content: flex-start;     /* デフォルト: 左寄せ */
  justify-content: flex-end;       /* 右寄せ */
  justify-content: center;         /* 中央寄せ */
  justify-content: space-between;  /* 端から端へ均等配置 */
  justify-content: space-around;   /* 各要素の周りに均等な余白 */
  justify-content: space-evenly;   /* 余白すべて均等 */
}
```

図で見ると:

```
flex-start    [A][B][C]      
flex-end                  [A][B][C]
center            [A][B][C]
space-between [A]    [B]    [C]
space-around   [A]  [B]  [C]
space-evenly    [A]  [B]  [C]
```

**最も使う3つ**:
- `flex-start`: デフォルト、左寄せ
- `center`: 中央寄せ
- `space-between`: 「ロゴ左 / メニュー右」のナビバーで定番

### 3-2. align-items — 交差軸方向の整列

```css
.container {
  display: flex;
  height: 200px;  /* 縦方向の整列を見るため、高さを与える */
  
  align-items: stretch;     /* デフォルト: 引き伸ばす */
  align-items: flex-start;  /* 上寄せ */
  align-items: flex-end;    /* 下寄せ */
  align-items: center;      /* 中央寄せ */
  align-items: baseline;    /* 文字のベースラインで揃える */
}
```

主軸が横方向のとき、交差軸は縦方向。「**縦の整列**」を決めるのが `align-items` です。

### 3-3. ⭐ 縦横センタリングの呪文

CSS 界で**長年難題だった「縦横中央寄せ」**が、Flexbox なら2行で解決。

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  
  height: 100vh;  /* 画面全体の高さ */
}
```

これで、`.container` の**中の要素が縦横中央**に来ます。`100vh` は画面全体の高さなので、**画面のど真ん中**に表示されます。

ローディング画面、エラーメッセージ、ヒーローセクションなど、よく使うパターン。

### 3-4. justify-content と align-items の覚え方

- **justify** = 主軸方向(横)
- **align** = 交差軸方向(縦)

「主・横、交・縦」と覚えてください。

### 🔧 ミニ演習2

次の3パターンを試してください。

1. 3つの箱を**横並び・中央寄せ**
2. 3つの箱を**横並び・両端寄せ**(`space-between`)
3. 1つの箱を**画面の中央**(縦横ともに)

<details>
<summary>解答例</summary>

```css
/* パターン1 */
.container {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* パターン2 */
.container {
  display: flex;
  justify-content: space-between;
}

/* パターン3 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;  /* 画面の高さ */
  background-color: #f3f4f6;
}

.item {
  /* 中央に置く対象は1つ */
}
```

パターン3はランディングページのヒーローセクションでよく使うやつ。
</details>

---

## 4. flex-wrap で折り返し(15分)

「**画面に入り切らない時に折り返す**」設定です。

### 4-1. デフォルト: 折り返さない

```css
.container {
  display: flex;
}
```

要素が多すぎても**1行に押し込まれて、はみ出る**ことがあります。

### 4-2. flex-wrap: wrap で折り返す

```css
.container {
  display: flex;
  flex-wrap: wrap;  /* 折り返しを有効に */
  gap: 16px;
}

.item {
  width: 200px;  /* 各アイテムの幅 */
}
```

これで、コンテナの幅を超えると**自動で次の行に**折り返します。**レスポンシブの基本パターン**。

### 4-3. カードグリッドの定石

「**画面サイズに応じて自動で列数が変わる**」レイアウトを作ってみましょう。

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 250px;  /* 最小250px、伸縮可能 */
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

`flex: 1 1 250px` の意味:
- `1`(伸びる): 余ったスペースを使って広がる
- `1`(縮む): 必要なら縮む
- `250px`(基本サイズ): 250px を目安に

これで、画面が狭ければ**1列**、広ければ**3列**、もっと広ければ**4列**…と**自動で並ぶカードグリッド**になります。

実は **CSS Grid のほうがもっと洗練された書き方**ができるのですが(Day 6で学習)、Flexbox でもこのパターンが書けます。

---

## 5. ⭐ flex プロパティ(20分)

各アイテム側の設定です。

### 5-1. flex: 1 — 余ったスペースを埋める

```html
<div class="container">
  <div class="item">A</div>
  <div class="item grow">B(伸びる)</div>
  <div class="item">C</div>
</div>
```

```css
.container {
  display: flex;
  gap: 16px;
}

.grow {
  flex: 1;  /* 余ったスペースを全部使う */
}
```

```
[A][B               ][C]
```

**`flex: 1`** は「**余ったスペースを使って広がる**」の定番。フォームの入力欄を横幅いっぱい広げたいとき、ナビゲーションのスペーサーとして、頻繁に登場します。

### 5-2. flex: 1 を複数に

複数のアイテムに `flex: 1` を付けると、**スペースを均等に分配**します。

```css
.item {
  flex: 1;  /* 全部に */
}
```

```
[A    ][B    ][C    ]   ← 均等に分割
```

### 5-3. 比率を変える

```css
.left { flex: 1; }
.center { flex: 2; }
.right { flex: 1; }
```

```
[left ][  center  ][right]
  1     :    2    :   1
```

サイドバー付きのレイアウトなどで使えます。

### 5-4. ⭐ flex-grow / flex-shrink / flex-basis

`flex: 1` は実は3つのプロパティの**短縮形**。

```css
.item {
  flex: 1;
  /* これは以下と同じ */
  flex-grow: 1;     /* 余ったスペースで広がる比率 */
  flex-shrink: 1;   /* 縮む比率 */
  flex-basis: 0;    /* 基本サイズ */
}
```

実務では**ほぼ `flex: 1` か `flex: 1 1 250px` のような短縮形**で書きます。3つを個別に書くことは稀。

### 5-5. flex-shrink: 0 — 縮ませない

「**この要素は絶対に縮めるな**」を表現。

```css
.logo {
  flex-shrink: 0;  /* 縮まない */
}
```

ロゴやアイコンなど、サイズを保ちたい要素に。これがないと、コンテナが狭くなったとき潰れることがあります。

---

## 6. 実用パターン集(25分)

ここからが実用編。**コピペで使える定番パターン**を紹介します。

### 6-1. ⭐ ナビゲーションバー(ロゴ左、メニュー右)

```html
<header class="navbar">
  <div class="logo">MySite</div>
  <nav>
    <ul class="menu">
      <li><a href="#">ホーム</a></li>
      <li><a href="#">記事</a></li>
      <li><a href="#">問い合わせ</a></li>
    </ul>
  </nav>
</header>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;  /* ロゴ左・メニュー右 */
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.menu {
  display: flex;     /* メニュー項目も横並びに */
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu a {
  color: #1f2937;
  text-decoration: none;
}

.menu a:hover {
  color: #3b82f6;
}
```

これだけで、**現代的なナビゲーションバー**の完成!

### 6-2. ⭐ カード横並び(3列、レスポンシブ)

```html
<div class="card-list">
  <article class="card">
    <h3>カード1</h3>
    <p>説明文がここに入ります。</p>
  </article>
  <article class="card">
    <h3>カード2</h3>
    <p>説明文がここに入ります。</p>
  </article>
  <article class="card">
    <h3>カード3</h3>
    <p>説明文がここに入ります。</p>
  </article>
</div>
```

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 250px;  /* 最低250px、伸縮可能 */
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

ブラウザ幅を変えると、**3列 → 2列 → 1列** と自動で変化します。

### 6-3. フォームのインライン配置

```html
<form class="search-form">
  <input type="search" placeholder="検索...">
  <button type="submit">検索</button>
</form>
```

```css
.search-form {
  display: flex;
  gap: 8px;
}

.search-form input {
  flex: 1;  /* 入力欄を横いっぱいに */
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.search-form button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

検索欄が広がり、ボタンが必要なサイズだけ取る、典型レイアウト。

### 6-4. ヒーローセクション(縦横中央)

```html
<section class="hero">
  <div class="hero-content">
    <h1>ようこそ、私のサイトへ</h1>
    <p>Webエンジニアを目指して勉強中です</p>
    <button>もっと見る</button>
  </div>
</section>
```

```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;  /* 画面の80%の高さ */
  background-color: #1f2937;
  color: white;
}

.hero-content {
  text-align: center;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}
```

ランディングページの定番セクション。**Flexbox で縦横中央**を実現しています。

### 6-5. 固定フッター(コンテンツが少なくても下に貼り付く)

長年の問題「**コンテンツが少ないとフッターが画面の真ん中に来てしまう**」もFlexboxで解決。

```html
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
```

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;  /* 画面全体の高さを確保 */
  margin: 0;
}

main {
  flex: 1;  /* 余ったスペースを main で埋める */
}
```

これで、**コンテンツが少なくてもフッターが画面下に固定**されます。シンプルですが感動するテクニック。

### 🔧 ミニ演習3

「**プロフィールカード**」を作ってください。

仕様:
- 横並び:左にアバター画像(円)、右に名前と紹介文
- アバターは縮まない(`flex-shrink: 0`)
- 右側の内容は残りのスペースを使う
- カード全体に背景、padding、角丸、影

HTML:
```html
<article class="profile-card">
  <div class="avatar">A</div>
  <div class="info">
    <h3>山田太郎</h3>
    <p>Webエンジニアを目指して学習中。HTML/CSSを修行中です。</p>
  </div>
</article>
```

<details>
<summary>解答例</summary>

```css
.profile-card {
  display: flex;
  gap: 16px;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;          /* 円形 */
  background-color: #3b82f6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  flex-shrink: 0;              /* 縮ませない */
}

.info {
  flex: 1;
}

.info h3 {
  margin: 0 0 4px;
}

.info p {
  margin: 0;
  color: #6b7280;
}
```

ポイント:
- `.avatar` に `flex-shrink: 0` で、画面が狭くなっても潰れない
- `.info` に `flex: 1` で、残りのスペースを使う
- アバターの中も Flexbox で「A」の文字を中央寄せ(Flexboxの入れ子!)
</details>

---

## 7. ⚠️ Flexbox でよくつまずくポイント(15分)

### 7-1. 子要素がいない / 親が container じゃない

```css
.item {
  display: flex;  /* ❌ これは Flex"アイテム" 側 */
}
```

`display: flex` は**子要素を並べる親側**に書きます。たまに混同して `.item` 側に書いてしまうミスがあります。

### 7-2. 高さが定まらず縦の整列が見えない

```css
.container {
  display: flex;
  align-items: center;  /* 高さがないと効果が見えない */
}
```

`align-items: center` の効果を見るには、**コンテナに高さが必要**です。`min-height: 100vh` などを付けると見えます。

### 7-3. margin auto で揃える(知ってると便利)

```css
.container {
  display: flex;
}

.spacer {
  margin-left: auto;  /* これより後の要素を右端に */
}
```

```
[A][B][C][spacer]      [D][E]
```

これは現代でも使える**便利な書き方**。「**ここから右側**」を作りたいときに。

### 7-4. flex の値の挙動を理解する

```css
.item {
  flex: 1;          /* = flex: 1 1 0 */
  flex: 1 1 200px;  /* 最小200px、伸縮可能 */
  flex: 0 0 200px;  /* 固定200px、伸びも縮みもしない */
  flex: none;       /* = flex: 0 0 auto */
  flex: auto;       /* = flex: 1 1 auto */
}
```

最初は混乱しますが、**`flex: 1` か `flex: 1 1 200px` か `flex: 0 0 auto` の3パターン**を覚えれば実用上OKです。

---

## 8. 練習サイト紹介(おまけ)

Flexbox の練習に**最適なゲームサイト**があります。

### Flexbox Froggy

**https://flexboxfroggy.com/**(日本語対応)

カエルを蓮の葉に乗せる**24問のパズル**。CSSの `justify-content` / `align-items` / `flex-direction` などを使って解いていきます。

**全クリで1〜2時間程度**。学習中に1回はやっておくと、Flexboxの感覚がぐっと身につきます。

> 「明日Grid を学ぶ前に Flexbox Froggy をやっておく」のがおすすめ。

---

## 9. 章末演習(25分)

### 🎯 ランディングページの上半分を作る

`day5/landing.html` として、次のレイアウトを作ってください。

**構造**:
```
┌─────────────────────────────────────┐
│ [ロゴ]              [ナビメニュー]    │ ← ナビバー
├─────────────────────────────────────┤
│                                     │
│       大きなタイトル                │
│       サブテキスト                  │ ← ヒーロー(縦横中央)
│       [CTAボタン]                   │
│                                     │
├─────────────────────────────────────┤
│ [カード1] [カード2] [カード3]      │ ← 3カラム
└─────────────────────────────────────┘
```

**仕様**:
- ナビバー: ロゴ左、メニュー右
- ヒーロー: 画面の60vh、縦横中央
- カード: 横並び、レスポンシブ(画面が狭ければ縦に)
- CSS変数で色管理
- すべて `:focus-visible` でフォーカス対応

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="landing.css">
  <title>ランディングページ</title>
</head>
<body>
  <header class="navbar">
    <div class="logo">MySite</div>
    <nav>
      <ul class="menu">
        <li><a href="#">ホーム</a></li>
        <li><a href="#">サービス</a></li>
        <li><a href="#">料金</a></li>
        <li><a href="#">お問い合わせ</a></li>
      </ul>
    </nav>
  </header>
  
  <section class="hero">
    <div class="hero-content">
      <h1>あなたの学習を加速する</h1>
      <p>初学者でも、楽しく学べる教材を提供します</p>
      <button class="btn-primary">今すぐ始める</button>
    </div>
  </section>
  
  <section class="features">
    <article class="card">
      <h3>機能1</h3>
      <p>使いやすいインターフェース</p>
    </article>
    <article class="card">
      <h3>機能2</h3>
      <p>豊富な学習コンテンツ</p>
    </article>
    <article class="card">
      <h3>機能3</h3>
      <p>コミュニティサポート</p>
    </article>
  </section>
</body>
</html>
```

```css
/* landing.css */

/* ===== Reset & Tokens ===== */
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #f9fafb;
  --color-surface: white;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --radius: 0.5rem;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
}

/* ===== Navbar ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  background-color: var(--color-surface);
  box-shadow: var(--shadow);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}

.menu {
  display: flex;
  gap: var(--space-lg);
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.menu a:hover {
  color: var(--color-primary);
}

.menu a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

/* ===== Hero ===== */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.hero-content {
  text-align: center;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin: 0 0 var(--space-md);
}

.hero-content p {
  font-size: 1.25rem;
  margin: 0 0 var(--space-lg);
  opacity: 0.9;
}

.btn-primary {
  background-color: white;
  color: var(--color-primary);
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius);
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:focus-visible {
  outline: 3px solid white;
  outline-offset: 4px;
}

/* ===== Features ===== */
.features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  flex: 1 1 250px;
  background-color: var(--color-surface);
  padding: var(--space-xl);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card h3 {
  margin: 0 0 var(--space-sm);
  color: var(--color-primary);
}

.card p {
  margin: 0;
  color: var(--color-text-light);
}
```

ブラウザで開いて、ブラウザ幅を狭めたり広げたりしてみてください。**カードが3列 → 2列 → 1列** と自動で変わるはず!

ポイント:
- ナビバー、ヒーロー、カードグリッド、各セクションそれぞれに Flexbox
- `flex: 1 1 250px` で**レスポンシブなカードグリッド**
- `linear-gradient` でグラデーション背景(おまけ)
- `transition` でホバー時の動きを滑らかに(Day 7で詳しく)
</details>

---

## 10. 今日のまとめ

### 覚えておきたいこと

1. **Flexbox = 1次元レイアウト**(横一列 or 縦一列)
2. **親に `display: flex`** を書く(子に書くのではない)
3. **`gap`** で要素間の余白(現代の必修)
4. **`flex-direction`** で主軸の方向を変える
5. **`justify-content`** = 主軸方向の整列(横の整列)
6. **`align-items`** = 交差軸方向の整列(縦の整列)
7. **`justify-content: center` + `align-items: center`** で**縦横中央**
8. **`flex-wrap: wrap`** で折り返し
9. **`flex: 1`** で余ったスペースを埋める
10. **`flex-shrink: 0`** で縮ませない
11. **`flex: 1 1 250px`** でレスポンシブなカードグリッド

### よく使うパターン早見表

| やりたいこと | コード |
|---|---|
| 横並び | `display: flex` |
| 縦並び | `display: flex; flex-direction: column` |
| 中央寄せ | `justify-content: center` |
| 両端寄せ | `justify-content: space-between` |
| 縦横中央 | `justify-content: center; align-items: center` |
| 折り返し | `flex-wrap: wrap` |
| 残りを埋める | `flex: 1`(子に) |
| 縮ませない | `flex-shrink: 0`(子に) |
| 要素間の余白 | `gap: 16px` |

---

## 明日の予告

Day 6 は **CSS Grid とレスポンシブデザイン**。Flexbox は**1次元**でしたが、Grid は**2次元**(行と列の両方)を扱えます。

学ぶこと:
- Grid の基本
- カードグリッドを Grid で書く(さらに洗練された方法)
- メディアクエリ(`@media`)で画面サイズ別のスタイル
- **モバイルファースト**の考え方
- `clamp()` で画面サイズに応じたフォントサイズ

これで「**どんな画面サイズでも見やすい**」サイトが作れるようになります 🚀

---

> 🎯 **コラム: Flexbox 以前と以後**
>
> 「**CSSのレイアウト**」は実は長らく難題でした。2010年代前半までは:
>
> - `float` でレイアウトを作る(回り込み解除の clearfix が必要)
> - `position: absolute` でゴリ押し
> - 縦横中央寄せは `transform: translate(-50%, -50%)` のような呪文
> - レスポンシブは `display: table-cell` などのハック
>
> という時代でした。それぞれのテクニックを覚える本が分厚く出版されていたほど。
>
> 2015年頃に Flexbox が広く普及し、**「あれ?簡単じゃん」**となりました。さらに 2017年の Grid 登場で、複雑なレイアウトも書けるように。
>
> **今この時代に CSS を学ぶ人は本当にラッキー**です。10年前の苦労をすっ飛ばして、Flexbox + Grid だけで現代Webサイトのほぼ全レイアウトが作れます。
>
> 古いコードベース(2015年以前のサイト)を見ると、`float` だらけで驚くことがありますが、**自分が新しく書くコードでは Flexbox / Grid を選ぶ**のが現代の正解です。

お疲れさまでした!次の Day 6 で、**Grid とレスポンシブ**の世界へ進みましょう ☕
