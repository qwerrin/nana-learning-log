# HTML/CSS 超速習 Day 6 — CSS Grid とレスポンシブデザイン

## 今日のゴール

- CSS Grid の基本(2次元レイアウト)が分かる
- `grid-template-columns` で列を定義できる
- `repeat()` / `minmax()` / `auto-fit` で**レスポンシブグリッド**が書ける
- Flexbox と Grid の使い分けが判断できる
- メディアクエリ(`@media`)で画面サイズ別のスタイルを書ける
- **モバイルファースト**の発想が分かる
- `clamp()` で画面サイズに応じたフォントサイズを設定できる

**所要時間の目安: 2〜2.5時間**

---

## 0. 今日のスタンス

Day 5 の Flexbox は「**1次元(横一列 or 縦一列)**」のレイアウトでした。今日学ぶ Grid は「**2次元(行 × 列)**」を扱えます。

例えば、**ダッシュボード**や**雑誌風のレイアウト**のような、行・列が複雑に絡む配置は Grid が圧倒的に楽。

そしてもう一つの重要トピックが **レスポンシブデザイン**。スマホ・タブレット・PC、それぞれの画面サイズで見やすく表示するための技法を学びます。

2025-2026年は **モバイルから見るユーザーが過半数**。「PC前提で作って、スマホは後付け」は時代遅れ。**最初からモバイルファースト**で設計するのが現代の標準です。

---

## 1. Grid の基本(25分)

### 1-1. Grid とは

Grid は「**格子状のレイアウト**」を作るための仕組み。

```
┌────┬────┬────┐
│ A  │ B  │ C  │
├────┼────┼────┤
│ D  │ E  │ F  │
└────┴────┴────┘
```

これを CSS で表現するのが Grid です。Flexbox では**行を作る** or **列を作る**のどちらか1次元でしたが、Grid は**両方同時**に扱えます。

### 1-2. 基本構文

`day6/` に `index.html` と `style.css` を作って試してみましょう。

**`index.html`**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Grid の練習</title>
</head>
<body>
  <div class="grid">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
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
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: 100px 100px 100px;  /* 3列、各100px */
  gap: 16px;
}

.item {
  background-color: #3b82f6;
  color: white;
  padding: 16px;
  text-align: center;
  border-radius: 4px;
}
```

ブラウザで開くと、**3列×2行のグリッド**ができます。

### 1-3. ⭐ grid-template-columns

「**列をどう分けるか**」を定義します。

```css
/* 固定幅3列 */
grid-template-columns: 100px 100px 100px;

/* 1:2:1の比率(fr単位 = 余ったスペースの比率) */
grid-template-columns: 1fr 2fr 1fr;

/* 全部同じ幅(4列均等) */
grid-template-columns: 1fr 1fr 1fr 1fr;

/* 混在(固定 + 可変) */
grid-template-columns: 200px 1fr 200px;  /* 左右固定、中央可変 */

/* repeat() で短く */
grid-template-columns: repeat(3, 1fr);   /* 1fr 1fr 1fr と同じ */
grid-template-columns: repeat(12, 1fr);  /* 12カラムグリッド */
```

**`fr`** 単位は「fraction(分数)」の略。「**余ったスペースを比率で分ける**」と覚えてください。

### 1-4. gap — 行・列の隙間

Flexbox と同じく、`gap` で隙間を空けられます。

```css
gap: 16px;             /* 縦・横とも16px */
gap: 16px 8px;          /* 行間16px、列間8px */
row-gap: 16px;          /* 行間だけ */
column-gap: 8px;        /* 列間だけ */
```

### 1-5. grid-template-rows

「**行**」の高さも指定できます。

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 200px;  /* 1行目100px、2行目200px */
  gap: 16px;
}
```

ただし、**行の高さは中身に応じて自動調整**されることが多いので、`grid-template-rows` を書く機会は少なめです。

### 🔧 ミニ演習1

次の3パターンのグリッドを作ってください。

1. 4列の均等グリッド
2. サイドバー付きレイアウト(左 250px、右 残りすべて)
3. 12カラムグリッド(`repeat(12, 1fr)`)

<details>
<summary>解答例</summary>

```css
/* パターン1: 4列均等 */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* パターン2: サイドバー付き */
.grid {
  display: grid;
  grid-template-columns: 250px 1fr;  /* 固定 + 残り */
  gap: 24px;
}

/* パターン3: 12カラム */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
}
```

3つそれぞれ違うレイアウトになるはず。**Grid の柔軟さ**を実感してください。
</details>

---

## 2. ⭐ minmax と auto-fit で本格レスポンシブ(25分)

ここが今日の白眉。**画面サイズに応じて列数が自動で変わる**カードグリッドを Grid で書きます。

### 2-1. minmax() — 最小と最大を指定

```css
grid-template-columns: minmax(200px, 1fr);
```

「**最小200px、最大は余ったスペース**」という意味。**最小を下回らない**範囲で柔軟に伸縮します。

### 2-2. auto-fit / auto-fill — 自動で列数を決める

```css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

**この一行が現代CSS の最強パターン**です。意味:

- **`auto-fit`**: 画面に入る分だけ列を作る
- **`minmax(200px, 1fr)`**: 各列の最小200px、伸縮可能

これだけで:
- 画面が広い(1200px超)→ **6列**
- 中くらい(800px)→ **4列**
- スマホ(400px)→ **2列**
- 狭い(300px)→ **1列**

…と**自動で並ぶカードグリッド**ができます。**メディアクエリすら不要**。

### 2-3. 実装してみる

```html
<div class="card-grid">
  <article class="card">カード1</article>
  <article class="card">カード2</article>
  <article class="card">カード3</article>
  <article class="card">カード4</article>
  <article class="card">カード5</article>
  <article class="card">カード6</article>
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

ブラウザでウィンドウサイズを変えてみてください。**スムーズに列数が変わる**はず。

### 2-4. auto-fit と auto-fill の違い

ほぼ同じですが、**カードが少ないとき**に差が出ます。

```css
/* auto-fit: 少ない時は伸びる */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
/* カードが3個しかなく画面が広い → カードが伸びて画面を埋める */

/* auto-fill: 少なくても列の数を維持 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* カードが3個しかなく画面が広い → 空の列ができる */
```

**実用上は `auto-fit` を使う**ことが多いです。「**伸びてくれるほうが嬉しい**」場面が多いから。

### 🔧 ミニ演習2

ブログ記事のカードグリッドを作ってください。

仕様:
- 各カードは**最小250px**、それ以下にならない
- 画面サイズに応じて列数自動変化
- カード間の隙間は **20px**

<details>
<summary>解答例</summary>

```css
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.article-card {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

これだけ。**現代CSS の威力**です。
</details>

---

## 3. grid-template-areas で名前付き領域(20分)

Grid のもう一つの便利機能。**領域に名前を付けて配置**できます。

### 3-1. 典型的なページレイアウト

```
┌─────────────────────────┐
│        header           │
├─────────┬───────────────┤
│         │               │
│ sidebar │     main      │
│         │               │
├─────────┴───────────────┤
│        footer           │
└─────────────────────────┘
```

これを書いてみます。

```html
<div class="layout">
  <header class="header">ヘッダー</header>
  <aside class="sidebar">サイドバー</aside>
  <main class="main">メインコンテンツ</main>
  <footer class="footer">フッター</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;       /* 2列 */
  grid-template-rows: auto 1fr auto;       /* 3行 */
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  gap: 16px;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**`grid-template-areas`** に**視覚的に**領域を書きます。同じ名前を並べると、そのセルが結合されます。

各要素には **`grid-area: 名前`** で「どの領域に入るか」を指定。

### 3-2. メリット

- **見て分かる**: コードを見ただけでレイアウトが想像できる
- **配置の変更が楽**: `grid-template-areas` を書き換えるだけ

### 3-3. 行・列の番号で指定する書き方(参考)

`grid-template-areas` を使わず、**番号で位置を指定**する方法もあります。

```css
.header {
  grid-column: 1 / 3;  /* 1列目から3列目まで(=2列分)*/
  grid-row: 1;
}

.sidebar {
  grid-column: 1;
  grid-row: 2;
}
```

ただ、**`grid-template-areas` の方が読みやすい**ので、まずはそちらを使うのがおすすめ。

---

## 4. Flexbox vs Grid の使い分け(10分)

両方学んだので、**使い分けの判断基準**を整理します。

### 4-1. 判断フロー

```
1次元レイアウト(横一列 or 縦一列)?
  → Yes: Flexbox
  → No(行と列の両方を考える): Grid
```

### 4-2. 典型的な使い分け

| やりたいこと | 道具 |
|---|---|
| ナビゲーションバー(ロゴ+メニュー) | **Flexbox** |
| カード横並び(レスポンシブ) | **Grid**(`auto-fit`) |
| フォームのボタン整列 | **Flexbox** |
| ページ全体のレイアウト(ヘッダー・サイド・メイン・フッター) | **Grid**(`template-areas`) |
| ダッシュボード(複雑な配置) | **Grid** |
| 縦横中央寄せ | **Flexbox**(または Grid) |
| 文章中のインライン要素 | (Flexbox/Grid不要、ふつうに書く) |

### 4-3. 組み合わせもOK

「ページ全体は Grid、ナビ内部は Flexbox」のように**入れ子で使う**のが現代の主流。

```css
.page {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
}

.header {
  display: flex;  /* ヘッダー内部は Flex */
  justify-content: space-between;
}
```

「**こっちは Grid、こっちは Flexbox**」と使い分けるのが普通です。

---

## 5. ⭐ レスポンシブデザインの基礎(25分)

ここから今日のもう一つの主題。**画面サイズに応じてデザインを変える**技法です。

### 5-1. viewport meta(復習)

Day 1 で書いたこの一行が、**レスポンシブの大前提**です。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

これを書かないと、スマホで PC 用デザインがそのまま縮小表示されて、**極小サイズに**なります。

「**スマホで横スクロールが出るんだけど?**」というトラブルの90%は、これを忘れているか、コンテンツが画面より広いかのどちらか。

### 5-2. メディアクエリ(@media)

「**画面サイズに応じてCSSを変える**」のがメディアクエリ。

```css
/* デフォルト(モバイル用)*/
.container {
  padding: 16px;
}

/* 画面幅が 768px 以上のとき */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
}

/* 画面幅が 1024px 以上のとき */
@media (min-width: 1024px) {
  .container {
    padding: 48px;
  }
}
```

書き方:
- **`@media (条件) { CSS }`**
- 条件が真のとき、中の CSS が適用される

主な条件:
- `min-width: 768px`: **768px 以上**のとき
- `max-width: 767px`: **767px 以下**のとき
- `prefers-color-scheme: dark`: ダークモード設定のとき(Day 7で詳しく)
- `prefers-reduced-motion`: 動きを減らす設定(Day 7で詳しく)

### 5-3. ⭐ モバイルファースト

**「スマホ用を先に書き、PC 用を上書きで追加する**」が現代の標準です。

```css
/* ====== モバイル(デフォルト) ====== */
.container {
  padding: 16px;
}

.menu {
  display: flex;
  flex-direction: column;  /* スマホでは縦並び */
}

/* ====== タブレット以上 ====== */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
  
  .menu {
    flex-direction: row;  /* タブレット以上では横並び */
  }
}

/* ====== デスクトップ ====== */
@media (min-width: 1024px) {
  .container {
    max-width: 60rem;
    margin: 0 auto;
  }
}
```

**なぜモバイルファースト?**:
- モバイルユーザーが多い(2025-2026年は過半数)
- モバイル向けのCSSの方が**シンプル**なことが多い
- 「狭い画面で見やすい」を最優先に設計すると、結果的に PC でも見やすい

### 5-4. 一般的なブレイクポイント

「**画面サイズの区切り**」をブレイクポイントと呼びます。プロジェクトによりますが、よくある区切り:

| 名前 | 幅 |
|---|---|
| モバイル | 〜 767px |
| タブレット | 768px 〜 1023px |
| デスクトップ | 1024px 〜 |
| ワイド | 1280px 〜 |

```css
/* 中庸プロジェクト向けの定石 */
:root {
  --bp-tablet: 48rem;   /* 768px */
  --bp-desktop: 64rem;  /* 1024px */
}

@media (min-width: 48rem) { ... }
@media (min-width: 64rem) { ... }
```

**`em` / `rem` を使う**のが現代的(ユーザーのフォントサイズ設定にも追従するため)。

### 5-5. レスポンシブの3つのテクニック

レスポンシブには「**3つのレベル**」があります。

#### レベル1: メディアクエリ不要(現代CSSの基本)

これまで学んだ Flexbox の `flex-wrap: wrap` や Grid の `auto-fit` だけで、**メディアクエリ不要**のレスポンシブが書けます。

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

これだけで、**画面サイズに応じて列数が自動変化**。

#### レベル2: メディアクエリで微調整

複雑なレイアウト変更にはメディアクエリ。

```css
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
}

@media (min-width: 768px) {
  .layout {
    grid-template-areas:
      "header  header"
      "main    sidebar"
      "footer  footer";
    grid-template-columns: 1fr 250px;
  }
}
```

スマホでは縦一列、タブレット以上では2列レイアウト。

#### レベル3: コンテナクエリ(発展、Day 7で軽く)

「**コンポーネント自体のサイズ**」に応じてスタイルを変える、最新の技法。Day 7 で概念だけ紹介します。

---

## 6. ⭐ clamp() — Fluid Typography(15分)

「**画面サイズに応じてフォントサイズが変わる**」現代的なテクニック。

### 6-1. clamp() の基本

```css
font-size: clamp(最小値, 推奨値, 最大値);
```

例:

```css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

意味:
- 画面が小さいとき: **最小 1.5rem(24px)** 以上
- 画面が大きいとき: **最大 3rem(48px)** 以下
- その間: **4vw**(画面幅の 4%)に応じて変化

### 6-2. 何がうれしいのか

メディアクエリを使わずに、**画面サイズに応じてフォントサイズがスムーズに変化**します。

```css
/* 古い書き方(段階的) */
h1 {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 3rem;
  }
}

/* 現代の書き方(滑らか) */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

**1行で済む**し、変化が**滑らか**です。

### 6-3. 余白にも使える

```css
.container {
  padding: clamp(1rem, 5vw, 3rem);
}
```

画面が広いほど内側余白も広くなる、現代的な書き方。

### 6-4. 実用パターン

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

p {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
}
```

これで、PC でもスマホでも**バランスの取れたタイポグラフィ**になります。

### 🔧 ミニ演習3

次のスタイルを `clamp()` で書き直してください。

**Before**(メディアクエリ):
```css
.hero h1 {
  font-size: 2rem;
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }
}

@media (min-width: 1280px) {
  .hero h1 {
    font-size: 4rem;
  }
}
```

<details>
<summary>解答例</summary>

```css
.hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

3つのメディアクエリが**1行**に。値の計算は感覚ですが、`5vw` あたりが多くのケースで自然なフィットになります。
</details>

---

## 7. 章末演習(25分)

### 🎯 2カラム → 1カラム切り替えのレスポンシブレイアウト

`day6/responsive.html` として、次のページを作ってください。

**構造**:
```
┌──────────────────────────────┐
│         ヘッダー              │
├─────────────┬────────────────┤
│             │                │
│   メイン     │  サイドバー    │  ← デスクトップは2カラム
│             │                │
├─────────────┴────────────────┤
│         フッター              │
└──────────────────────────────┘

スマホでは:
┌───────────────┐
│   ヘッダー     │
├───────────────┤
│              │
│   メイン       │
│              │
├───────────────┤
│  サイドバー    │
├───────────────┤
│   フッター     │
└───────────────┘
```

**要件**:
- **モバイル(〜767px)**: 縦一列
- **デスクトップ(768px〜)**: メイン + サイドバーの2カラム
- メインには**カードグリッド** (`auto-fit` + `minmax`)
- ヒーローのタイトルに `clamp()` でFluid Typography
- CSS変数で色管理

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="responsive.css">
  <title>レスポンシブの練習</title>
</head>
<body>
  <div class="layout">
    <header class="header">
      <h1>レスポンシブのテスト</h1>
    </header>
    
    <main class="main">
      <section class="hero">
        <h2>大きなタイトル</h2>
        <p>画面サイズで文字サイズが変わります</p>
      </section>
      
      <section>
        <h2>記事一覧</h2>
        <div class="card-grid">
          <article class="card">
            <h3>記事1</h3>
            <p>記事の概要</p>
          </article>
          <article class="card">
            <h3>記事2</h3>
            <p>記事の概要</p>
          </article>
          <article class="card">
            <h3>記事3</h3>
            <p>記事の概要</p>
          </article>
          <article class="card">
            <h3>記事4</h3>
            <p>記事の概要</p>
          </article>
        </div>
      </section>
    </main>
    
    <aside class="sidebar">
      <h2>サイドバー</h2>
      <ul>
        <li>リンク1</li>
        <li>リンク2</li>
        <li>リンク3</li>
      </ul>
    </aside>
    
    <footer class="footer">
      <p>&copy; 2026</p>
    </footer>
  </div>
</body>
</html>
```

```css
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
  --color-bg: #f9fafb;
  --color-surface: white;
  --color-border: #e5e7eb;
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

/* ===== モバイル(デフォルト) ===== */
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.main    { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer  { grid-area: footer; }

.header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-lg);
}

.main {
  padding: var(--space-lg);
}

.sidebar {
  background-color: var(--color-surface);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

.footer {
  background-color: var(--color-text);
  color: white;
  padding: var(--space-lg);
  text-align: center;
}

/* ===== ヒーローと clamp ===== */
.hero {
  background-color: var(--color-surface);
  padding: clamp(1rem, 5vw, 3rem);
  border-radius: var(--radius);
  margin-bottom: var(--space-xl);
}

.hero h2 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  margin: 0 0 var(--space-md);
}

.hero p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
}

/* ===== カードグリッド ===== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.card {
  background-color: var(--color-surface);
  padding: var(--space-md);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card h3 {
  margin: 0 0 var(--space-md);
  color: var(--color-primary);
}

.card p {
  margin: 0;
  color: #6b7280;
}

/* ===== デスクトップ(768px〜) ===== */
@media (min-width: 48rem) {
  .layout {
    grid-template-areas:
      "header  header"
      "main    sidebar"
      "footer  footer";
    grid-template-columns: 1fr 250px;
    gap: var(--space-lg);
    padding: var(--space-lg);
  }
  
  .sidebar {
    border-top: none;
    border-radius: var(--radius);
  }
}
```

ブラウザのウィンドウ幅を変えて挙動を確認してください:

1. **狭いとき**: ヘッダー → メイン → サイドバー → フッター の**縦一列**
2. **広いとき(768px〜)**: ヘッダー / [メイン + サイドバー] / フッター の**2カラム**
3. **ヒーローの文字**: 画面が広くなると文字サイズも**スムーズに増加**
4. **カード**: 画面が広いほど **4列→3列→2列→1列** と自動変化

これが**モダンなレスポンシブデザイン**です。
</details>

---

## 8. 今日のまとめ

### 覚えておきたいこと

1. **Grid = 2次元レイアウト**(行 × 列)
2. **`display: grid`** + **`grid-template-columns`** で列を定義
3. **`fr` 単位**で「余ったスペースの比率」を指定
4. **`repeat()`**、**`minmax()`**、**`auto-fit`** で柔軟なレイアウト
5. **`repeat(auto-fit, minmax(200px, 1fr))`** が現代のカードグリッド定石
6. **`grid-template-areas`** で名前付き領域(視覚的)
7. **Flexbox vs Grid**: 1次元なら Flex、2次元なら Grid、入れ子もOK
8. **`@media (min-width: ...)`** でメディアクエリ
9. **モバイルファースト**: スマホ用を先、PC用を上書き
10. **`clamp(min, prefer, max)`** で Fluid Typography

### よく使うパターン早見表

| やりたいこと | コード |
|---|---|
| 3列均等 | `grid-template-columns: repeat(3, 1fr)` |
| サイドバー付き | `grid-template-columns: 250px 1fr` |
| カードグリッド(自動) | `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` |
| 領域に名前を付ける | `grid-template-areas: "..."` + `grid-area: 名前` |
| 縦・横の隙間 | `gap: 16px` |
| 画面幅で分岐 | `@media (min-width: 768px) { ... }` |
| フォント可変 | `font-size: clamp(1rem, 2vw, 1.5rem)` |

---

## 明日の予告

Day 7 は **現代CSS応用とアニメーション**。今日までで「**基本のレイアウト**」は揃いました。明日はそれを**もっと洗練させる**現代CSS の応用編。

学ぶこと:
- **CSS Nesting**(ネスト構文、Sass不要に)
- **`:has()`** の実用例(JS が要らなくなる場面)
- **Container Queries** の概念(コンポーネント単位のレスポンシブ)
- **`transition`**(スムーズな変化)
- **`@keyframes` + `animation`**(アニメーション)
- **`prefers-reduced-motion`**(アクセシビリティ)
- **`color-mix()`** でホバー色を自動生成
- **ダークモード対応**

CSS 編の集大成、**「2026年のCSS」**を体感する回です ☕

---

> 🎯 **コラム: 「CSS だけでここまでできる」時代**
>
> 10年前、「**画面サイズで列数が変わるカードグリッド**」を作るには:
>
> 1. JavaScript で画面幅を監視
> 2. `resize` イベントを受けて列数を計算
> 3. 各カードの幅を JS で設定
> 4. ライブラリ(Masonry など)を入れる
> 5. ブラウザ差を埋めるためのコードを書く
>
> と、**JavaScriptと外部ライブラリ無しには無理**でした。
>
> 今や **CSS 1行で完了**:
>
> ```css
> grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
> ```
>
> 「**CSS にできることは CSS で、JS は最後の手段**」というのが現代Web開発の流儀です。「JS の方が柔軟」と思っても、まずは CSS だけでできないか考える習慣を。
>
> 結果として、コードは少なく、表示は速く、メンテナンスも楽になります。

お疲れさまでした!次の Day 7 で、**現代CSS応用**の世界へ進みましょう ☕
