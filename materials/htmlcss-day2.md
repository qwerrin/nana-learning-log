# HTML/CSS 超速習 Day 2 — セマンティックHTMLと文書構造

## 今日のゴール

- セマンティックHTMLが**なぜ重要か**を理解する
- ページの骨格を `<header>` / `<nav>` / `<main>` / `<footer>` などで構造化できる
- `<article>` / `<section>` / `<aside>` の使い分けができる
- `<figure>` / `<time>` / `<details>` などの便利タグを使える
- アクセシビリティの第一歩を踏み出す

**所要時間の目安: 2〜2.5時間**

---

## 0. 今日のスタンス

Day 1 では「タグを使えば文章が構造化できる」を学びました。今日はそれを一歩進めて、「**意味の伝わるHTML**」を書けるようになります。

**セマンティック(semantic)** とは「意味的な」という意味の英単語。`<div>` のように何でもない箱ではなく、`<header>` のように **「ヘッダーですよ」と意味のあるタグ**を使うのがセマンティックHTML。

これにより、**検索エンジン**、**読み上げソフト**、**未来のあなた**(コードを読み返す自分)、**AI** などが、ページの構造を正しく理解できるようになります。

> **2025年からは「実質的な要件」に**
>
> 2025-2026年現在、セマンティックHTMLは**ベストプラクティス**を超えて**実質的な要件**になっています。WCAG 2.2(アクセシビリティのガイドライン)準拠を政府サイトが求めるようになり、Next.js などの主要フレームワークもデフォルトでセマンティックHTMLを推奨しています。

---

## 1. なぜセマンティックHTMLか(15分)

### 1-1. ❌ セマンティックでないコード

```html
<div class="header">
  <div class="logo">MyBlog</div>
  <div class="nav">
    <div class="nav-item">ホーム</div>
    <div class="nav-item">記事一覧</div>
  </div>
</div>
<div class="content">
  <div class="article">
    <div class="title">記事タイトル</div>
    <div class="body">本文...</div>
  </div>
</div>
<div class="footer">© 2026</div>
```

`<div>` だらけ。これでも見た目は作れますが、**コンピューターにとっては「箱が並んでいる」だけ**で、どこがヘッダーかナビかすら分かりません。

### 1-2. ✅ セマンティックなコード

```html
<header>
  <h1>MyBlog</h1>
  <nav>
    <ul>
      <li><a href="/">ホーム</a></li>
      <li><a href="/articles">記事一覧</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h2>記事タイトル</h2>
    <p>本文...</p>
  </article>
</main>
<footer>© 2026</footer>
```

**同じ見た目**を作れるのに、構造が明確。「ここがヘッダー、ここがナビ、ここがメインコンテンツ」と一目で分かります。

### 1-3. セマンティックHTMLの4つのメリット

1. **検索エンジンに優しい(SEO)**: Google などが正しく内容を理解し、検索結果に出やすくなる
2. **読み上げソフトに優しい(アクセシビリティ)**: 視覚障害者の方が「ナビゲーション部分にスキップ」のような操作ができる
3. **コードが読みやすい**: 半年後の自分やチームメンバーが構造を即理解できる
4. **AI/自動化に優しい**: 検索エンジンクローラー、AIモデルなどがページ構造を抽出しやすい

「**ちょっと工夫するだけで、これだけ得がある**」のでやらない理由がない、というのが現代の認識です。

---

## 2. ⭐ ページの骨格を作るタグ(40分)

ここがこの章の最重要セクション。**HTML5で追加されたランドマーク要素**を覚えます。

### 2-1. 全体像

典型的なページの構造はこうなります。

```html
<body>
  <header>     <!-- サイトのヘッダー(ロゴ、グローバルナビ) -->
    <nav>      <!-- ナビゲーション -->
  </header>
  
  <main>       <!-- ページのメインコンテンツ -->
    <article>  <!-- 独立した記事/投稿 -->
    <section>  <!-- セクション -->
    <aside>    <!-- 補足情報、サイドバー -->
  </main>
  
  <footer>     <!-- サイトのフッター -->
</body>
```

それぞれ詳しく見ていきましょう。

### 2-2. `<header>` — ヘッダー

ページや**セクションのヘッダー部分**を表します。

```html
<header>
  <h1>サイト名</h1>
  <p>キャッチコピー</p>
</header>
```

**注意**: `<header>` は**ページに1つだけ**ではなく、**`<article>` の中にも書けます**(記事のヘッダー)。

```html
<article>
  <header>
    <h2>記事のタイトル</h2>
    <p>2026年5月16日 by Alice</p>
  </header>
  <p>本文...</p>
</article>
```

### 2-3. `<nav>` — ナビゲーション

**主要なナビゲーション**(リンク集)を表します。

```html
<nav>
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/about">私について</a></li>
    <li><a href="/contact">問い合わせ</a></li>
  </ul>
</nav>
```

**全てのリンクに `<nav>` を付ける必要はない**ことに注意。「ナビゲーションとしての意味があるもの」だけ。フッター下部のSNSリンクなどは普通の `<ul>` で十分です。

### 2-4. ⭐ `<main>` — メインコンテンツ

**ページの主要な内容**を1つの場所に。

```html
<body>
  <header>...</header>
  <main>
    <h1>このページの主題</h1>
    <p>...</p>
  </main>
  <footer>...</footer>
</body>
```

**重要なルール**:
- **`<main>` はページに1つだけ**
- `<header>` や `<footer>` の**外**に置く
- 「このページのテーマ」となるコンテンツを入れる

これにより、読み上げソフトで「メインコンテンツへ飛ぶ」が可能になり、アクセシビリティが向上します。

### 2-5. `<footer>` — フッター

```html
<footer>
  <p>&copy; 2026 山田太郎</p>
  <ul>
    <li><a href="/privacy">プライバシーポリシー</a></li>
    <li><a href="/terms">利用規約</a></li>
  </ul>
</footer>
```

`<footer>` も `<header>` 同様、**ページ全体だけでなく `<article>` の中にも**書けます(記事のフッター)。

### 🔧 ミニ演習1

Day 1 で作った `profile.html` を、`<header>` / `<main>` / `<footer>` で構造化してみてください。

- 「自己紹介」の大見出し部分を `<header>` で囲む
- 本文を `<main>` で囲む
- 連絡先や著作権表示を `<footer>` で囲む

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自己紹介 - 山田太郎</title>
</head>
<body>
  <header>
    <h1>こんにちは、山田太郎です</h1>
    <p>プログラミングを学習中の社会人です。</p>
  </header>
  
  <main>
    <section>
      <h2>学んでいること</h2>
      <p>現在は HTML/CSS の基礎を学んでいます。</p>
    </section>
    
    <section>
      <h2>興味のあること</h2>
      <ul>
        <li>Webサイトのデザイン</li>
        <li>個人開発でアプリを作ること</li>
        <li>新しい技術のキャッチアップ</li>
      </ul>
    </section>
  </main>
  
  <footer>
    <p>連絡先: <a href="https://github.com/" target="_blank">GitHub</a></p>
    <p><small>&copy; 2026 山田太郎</small></p>
  </footer>
</body>
</html>
```

`<small>` は「補足情報」を表すタグ。`&copy;` は `©` の文字実体参照(HTMLで特殊文字を書く方法)。
</details>

---

## 3. コンテンツを分けるタグ(30分)

### 3-1. `<article>` — 独立した記事

「**それだけ取り出しても意味が通じる単位**」を表します。

```html
<article>
  <h2>TypeScriptを学ぶメリット</h2>
  <p>TypeScriptは...</p>
  <p>導入することで...</p>
</article>
```

**使うシーン**:
- ブログ記事
- ニュース記事
- 製品カード
- ユーザーのコメント

「**この部分を別のサイトに貼り付けても通じるか?**」で判断できます。

### 3-2. `<section>` — セクション

「**主題ごとのグループ**」を表します。

```html
<section>
  <h2>第1章: はじめに</h2>
  <p>...</p>
</section>

<section>
  <h2>第2章: 基本</h2>
  <p>...</p>
</section>
```

`<section>` は**見出し(`<h2>`など)とセットで使う**のが原則。

### 3-3. `<article>` vs `<section>` の使い分け

似ていてややこしいですが、基本ルールは:

| 判断基準 | タグ |
|---|---|
| 単独で完結する内容(記事、カードなど) | `<article>` |
| ページ内の章・節・グループ | `<section>` |
| ただ装飾的にグループ化したい | `<div>` |

迷ったら:
1. 「**取り出せるか?**」 → Yes → `<article>`
2. 「**見出しが付くか?**」 → Yes → `<section>`
3. それ以外 → `<div>`

### 3-4. `<aside>` — 補足情報

**本筋から外れる補足**を表します。

```html
<article>
  <h2>記事タイトル</h2>
  <p>本文...</p>
  
  <aside>
    <h3>関連記事</h3>
    <ul>
      <li><a href="...">関連記事1</a></li>
    </ul>
  </aside>
</article>
```

**使うシーン**:
- サイドバー
- 関連記事
- 引用ブロック
- 用語解説

「**本筋から取り除いても、本文の理解に支障がない**」のが `<aside>` の特徴。

### 3-5. `<div>` の役割

ここまで「セマンティックなタグを使え」と言ってきましたが、**`<div>` も依然として必要**です。

- 純粋に「**CSSのためにグループ化したい**」とき
- 意味的な役割が**特に無い**箱が欲しいとき

```html
<!-- 純粋にレイアウト用のラッパー -->
<div class="card-grid">
  <article>...</article>
  <article>...</article>
  <article>...</article>
</div>
```

「**まずセマンティックなタグを試す。なければ `<div>`**」が判断順序です。

### 🔧 ミニ演習2

次の文章を、適切なタグで構造化してください。

```
[ブログのトップページ]

- サイト名:「Tech Blog」
- ナビゲーション: ホーム、記事一覧、私について
- 記事1:
  - タイトル: 「TypeScriptを学ぶメリット」
  - 本文: 「TypeScriptを使うと型安全に書けます」
- 記事2:
  - タイトル: 「Reactの始め方」
  - 本文: 「ReactはUIライブラリです」
- フッター: © 2026
```

<details>
<summary>解答例</summary>

```html
<body>
  <header>
    <h1>Tech Blog</h1>
    <nav>
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/articles">記事一覧</a></li>
        <li><a href="/about">私について</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <h2>TypeScriptを学ぶメリット</h2>
      <p>TypeScriptを使うと型安全に書けます。</p>
    </article>
    
    <article>
      <h2>Reactの始め方</h2>
      <p>ReactはUIライブラリです。</p>
    </article>
  </main>
  
  <footer>
    <p><small>&copy; 2026</small></p>
  </footer>
</body>
```

各記事を `<article>` で囲んだのがポイント。記事ひとつひとつが「独立して取り出せる単位」だからです。
</details>

---

## 4. その他の便利タグ(25分)

### 4-1. `<figure>` / `<figcaption>` — 図とキャプション

画像と説明文をセットで扱います。

```html
<figure>
  <img src="cherry.jpg" alt="満開の桜">
  <figcaption>2026年4月、東京の桜</figcaption>
</figure>
```

**使うシーン**:
- 画像 + キャプション
- コード例 + 説明
- グラフ + タイトル

ただの `<img>` より「**この画像とキャプションは関連している**」がはっきり伝わります。

### 4-2. `<time>` — 日付・時間

```html
<p>投稿日: <time datetime="2026-05-16">2026年5月16日</time></p>
<p>イベント: <time datetime="2026-12-25T19:00">12月25日 19:00〜</time></p>
```

`datetime` 属性に**機械可読な形式**(YYYY-MM-DD)を入れます。検索エンジンや AI に「これは日付」と正確に伝えられます。

### 4-3. ⭐ `<details>` / `<summary>` — アコーディオン

**JavaScriptなしで開閉できる**箱を作れます。

```html
<details>
  <summary>クリックで開く</summary>
  <p>ここに隠れているコンテンツです</p>
</details>
```

これはブラウザがネイティブで対応している機能なので、JavaScriptを書かずに開閉動作が動きます。**FAQ ページに最適**。

```html
<h2>よくある質問</h2>

<details>
  <summary>Q. このアプリは無料ですか?</summary>
  <p>はい、完全無料です。</p>
</details>

<details>
  <summary>Q. 対応OSは?</summary>
  <p>Windows、macOS、Linuxに対応しています。</p>
</details>
```

実は本資料の中でも、`<details>` で**解答例を折りたたんで**います。今この瞬間、あなたが見ている形式そのものです。

#### name 属性でアコーディオン化

最近のブラウザでは、`name` 属性で「同一グループ内では1つだけ開く」アコーディオンも作れます。

```html
<details name="faq">
  <summary>質問1</summary>
  <p>...</p>
</details>

<details name="faq">
  <summary>質問2</summary>
  <p>...</p>
</details>
```

質問1を開くと質問2が自動で閉じる動作になります(2024年以降の機能)。

### 4-4. `<dialog>` — モーダルダイアログ

「**ポップアップで何か表示**」したいときに使う**現代的な方法**です。Day 3 で本格的に扱いますが、軽く紹介。

```html
<dialog id="myDialog">
  <p>このメッセージを表示中です</p>
  <button>閉じる</button>
</dialog>

<button>開く</button>
```

「`<div class="modal">`を自作」する時代は終わり、**ネイティブ `<dialog>` 要素**を使うのが2025-2026年の流儀。アクセシビリティも自動的に確保されます。

### 4-5. `<strong>` / `<em>` の復習

Day 1 でも学びましたが、念のため再確認。

| タグ | 意味 |
|---|---|
| `<strong>` | 重要性が高い |
| `<em>` | 強調 |
| `<mark>` | ハイライト(マーカー線) |
| `<small>` | 小さい注釈、補足 |

### 4-6. 引用: `<blockquote>` / `<q>`

```html
<blockquote cite="https://example.com/article">
  <p>これは長めの引用文です。複数行にわたる場合に使います。</p>
</blockquote>

<p>有名な言葉: <q>I have a dream</q></p>
```

- `<blockquote>`: ブロック引用(長め)
- `<q>`: インライン引用(短め、自動的に "引用符" が付く)

---

## 5. 廃止された古い書き方(10分)

「**やってはいけない例**」を知ることで、ベストプラクティスが身につきます。

### 5-1. 廃止タグ

| ❌ 古い書き方 | ✅ 現代の代替 |
|---|---|
| `<center>` | `text-align: center` または Flexbox |
| `<font color="red">` | CSS の `color` プロパティ |
| `<b>` (見た目だけ太字) | `<strong>`(意味的)または CSS |
| `<i>` (見た目だけ斜体) | `<em>`(意味的)または CSS |
| `<table>` でレイアウト | CSS Grid / Flexbox |
| `<frameset>` / `<frame>` | (使わない) |

### 5-2. やってはいけない例

```html
<!-- ❌ レイアウトのためのテーブル -->
<table>
  <tr>
    <td><img src="logo.png"></td>
    <td>メニュー</td>
  </tr>
</table>

<!-- ✅ Flexbox で(Day 5で学ぶ) -->
<header>
  <img src="logo.png" alt="ロゴ">
  <nav>...</nav>
</header>
```

```html
<!-- ❌ 見た目だけ太字 -->
<b>注意!</b>

<!-- ✅ 意味のある強調 -->
<strong>注意!</strong>

<!-- または装飾だけが目的なら CSS で -->
<span class="bold">少し太く</span>
```

「**見た目は CSS で。HTML は意味を表す**」が原則です。

---

## 6. アクセシビリティの第一歩(20分)

セマンティックHTMLは**アクセシビリティ**(障害のある方も含めて誰でも使えること)の基礎でもあります。最低限のポイントを押さえましょう。

### 6-1. 見出し階層を守る

```html
<!-- ✅ 階層を飛ばさない -->
<h1>ページタイトル</h1>
  <h2>セクション</h2>
    <h3>サブセクション</h3>
  <h2>別のセクション</h2>

<!-- ❌ 階層を飛ばしている -->
<h1>ページタイトル</h1>
  <h3>サブセクション</h3>  <!-- h2 を飛ばしている -->
```

読み上げソフトは「次の見出しへ」で移動できる機能があり、階層が壊れていると混乱します。

### 6-2. alt 属性の使い分け

```html
<!-- 意味のある画像 → 内容を説明 -->
<img src="chart.png" alt="2025年の売上推移グラフ。第3四半期に最大値">

<!-- 装飾画像 → 空にする -->
<img src="decoration.svg" alt="">

<!-- 重要なアイコン → 意味を書く -->
<a href="/cart">
  <img src="cart.svg" alt="カート">
</a>

<!-- 周りのテキストで分かるアイコン → 空 -->
<a href="/cart">
  <img src="cart.svg" alt="">
  カートを見る
</a>
```

**「画像が無くても情報が伝わるか?」**を基準に判断してください。

### 6-3. ⭐ WAI-ARIA 第1原則: 「No ARIA is better than bad ARIA」

**WAI-ARIA**(ウェイ・アリア)は、HTML だけでは表現しきれないアクセシビリティ情報を補う仕組みです。

ただし**第1原則がこれ**:

> **「No ARIA is better than bad ARIA」(間違ったARIAより、ARIA無しの方がマシ)**

つまり、**ネイティブHTMLで同じ意味が表現できるなら、ARIAは使わない**のが正解です。

```html
<!-- ❌ 悪い例(div でボタンを作って ARIA で説明) -->
<div role="button" tabindex="0" aria-label="送信">送信</div>

<!-- ✅ 良い例(button タグを使うだけ) -->
<button>送信</button>
```

**`<button>` を使えば**、キーボード操作・読み上げ・フォーカス管理すべて自動で対応。これが**「セマンティックHTMLが最強のアクセシビリティ対策**」と言われる理由です。

### 6-4. 実用的な ARIA 属性(少しだけ)

それでもARIAが必要になる場面はあります。よく使うのは:

```html
<!-- 視覚的な代替が無いアイコンボタン -->
<button aria-label="閉じる">×</button>

<!-- 現在のページを示す(ナビで使う) -->
<a href="/" aria-current="page">ホーム</a>

<!-- アコーディオンの開閉状態 -->
<button aria-expanded="false">メニュー</button>
```

これだけ覚えれば、初学者レベルでは十分。「**まずセマンティックHTML、足りない部分だけARIA**」が現代のアクセシビリティです。

### 6-5. キーボード操作を妨げない

- `<a>` や `<button>` を使う(Tab で移動できる)
- `<div onclick>` のような「自作ボタン」は避ける
- フォーカスが見えるスタイル(CSS の `:focus-visible` で Day 4 以降)

これも**ネイティブHTMLを使えば自動で対応**されるので、特別なことは不要です。

---

## 7. 章末演習(15分)

### 🎯 ブログ記事ページを作る

次の要件を満たす HTML を `day2/blog.html` として作ってください。

**構造**:
- `<header>`: サイト名「Tech Diary」と、ナビゲーション(ホーム、記事、私について)
- `<main>`: 1つの記事を `<article>` で
  - 記事のヘッダー(タイトル、日付を `<time>`、著者名)
  - 本文(複数の `<section>` で章分け)
  - 図1枚(`<figure>` + `<figcaption>`)
  - FAQ セクション(`<details>` × 3)
- `<aside>`: 関連記事リンク
- `<footer>`: コピーライト

**ヒント**: 階層は **`<h1>` → `<h2>` → `<h3>`** の順を守る。

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>セマンティックHTMLを学ぼう - Tech Diary</title>
</head>
<body>
  <header>
    <h1>Tech Diary</h1>
    <nav>
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/articles">記事</a></li>
        <li><a href="/about">私について</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <header>
        <h2>セマンティックHTMLを学ぼう</h2>
        <p>
          投稿日: <time datetime="2026-05-16">2026年5月16日</time>
          / 著者: 山田太郎
        </p>
      </header>
      
      <section>
        <h3>はじめに</h3>
        <p>セマンティックHTMLは、ページの意味を明確にする書き方です。</p>
      </section>
      
      <section>
        <h3>主要なタグ</h3>
        <p><code>&lt;header&gt;</code>、<code>&lt;nav&gt;</code>、<code>&lt;main&gt;</code> などが代表的です。</p>
        
        <figure>
          <img src="diagram.png" alt="セマンティックHTMLの構造図">
          <figcaption>図1: 典型的なページ構造</figcaption>
        </figure>
      </section>
      
      <section>
        <h3>よくある質問</h3>
        
        <details>
          <summary>セマンティックHTMLは必須ですか?</summary>
          <p>必須ではありませんが、強く推奨されます。</p>
        </details>
        
        <details>
          <summary>div を使ってはいけませんか?</summary>
          <p>いいえ、レイアウトのための div は依然として必要です。</p>
        </details>
        
        <details>
          <summary>古いブラウザでも動きますか?</summary>
          <p>HTML5以降のブラウザならすべて動きます。</p>
        </details>
      </section>
      
      <footer>
        <p>この記事をシェア: <a href="#">X</a> / <a href="#">Facebook</a></p>
      </footer>
    </article>
    
    <aside>
      <h2>関連記事</h2>
      <ul>
        <li><a href="#">CSSの基礎を学ぼう</a></li>
        <li><a href="#">JavaScriptって何?</a></li>
      </ul>
    </aside>
  </main>
  
  <footer>
    <p><small>&copy; 2026 Tech Diary</small></p>
  </footer>
</body>
</html>
```

ポイント:
- `<article>` の中に `<header>` と `<footer>` がある(記事のヘッダー/フッター)
- 階層が `<h1>`(サイト) → `<h2>`(記事タイトル) → `<h3>`(セクション) と守られている
- `<aside>` で関連記事を分離
- `<details>` で FAQ を実装(JS不要)
- `<code>` でコード片を表示(タグの説明用、`&lt;` で `<` を表示)

DevTools の Elements パネルで構造を眺めてみてください。整然としているはず。
</details>

---

## 8. 今日のまとめ

### 覚えておきたいこと

1. **セマンティックHTML** = 「意味の伝わるHTML」
2. **ページの骨格** = `<header>` / `<nav>` / `<main>` / `<footer>`
3. **`<main>` はページに1つだけ**、`<header>`/`<footer>` は複数OK
4. **`<article>`** = 独立した記事、**`<section>`** = 主題のグループ
5. **迷ったら順序**: セマンティックタグ → `<div>`
6. **`<figure>`** で画像とキャプションをセット、**`<time>`** で日付
7. **`<details>` / `<summary>`** で JS なしのアコーディオン
8. **古い書き方は避ける**(`<center>` / `<font>` / `<b>` / `<i>` ・テーブルレイアウト)
9. **見出し階層を守る**(`<h1>` → `<h2>` → `<h3>`)
10. **WAI-ARIA 第1原則**: 「無いARIAより悪いARIA」。ネイティブHTMLを使え

### よく使うセマンティックタグ早見表

| タグ | 用途 |
|---|---|
| `<header>` | ページ/セクションのヘッダー |
| `<nav>` | 主要ナビゲーション |
| `<main>` | メインコンテンツ(1ページ1つ) |
| `<article>` | 独立した記事 |
| `<section>` | 主題でグループ化 |
| `<aside>` | 補足情報 |
| `<footer>` | ページ/セクションのフッター |
| `<figure>` / `<figcaption>` | 図とキャプション |
| `<time datetime="...">` | 日付・時間 |
| `<details>` / `<summary>` | 開閉できる箱 |
| `<dialog>` | モーダルダイアログ |

---

## 明日の予告

Day 3 では **フォーム要素**を学びます。お問い合わせフォーム、ログインフォーム、検索ボックスなど、Webサイトに必須の入力UI。さらに `<dialog>` 要素を本格的に使えるようになります。

JavaScript なしでも、HTMLだけで:
- 必須入力チェック
- メール形式の検証
- 入力欄の自動補完
- モバイルで適切なキーボードを出す

ができるようになります。「**HTMLって賢い**」と感じる回になるはず。

---

> 🎯 **コラム: AI時代こそセマンティックHTML**
>
> 2025-2026年は **AI が Web をクロールする時代**です。ChatGPT、Claude、Google の AI 検索、Perplexity など、AIが Web ページを読んで答えを生成する場面が増えています。
>
> このとき、**セマンティックHTML で書かれたページは AI にも正しく理解される**ため、コンテンツが引用されやすくなります。逆に `<div>` だらけのページは、AI にとって「ただの箱の集まり」にしか見えず、内容が伝わりにくい。
>
> SEO の時代から「**AI 対応(GEO: Generative Engine Optimization)**」の時代へ。セマンティックHTML はその基礎です。
>
> 「**人にも、機械にも、AI にも優しい HTML**」を書く—— これが2026年のWeb開発者の基本姿勢になりつつあります。

お疲れさまでした!次の Day 3 で、**フォームの世界**へ進みましょう ☕
