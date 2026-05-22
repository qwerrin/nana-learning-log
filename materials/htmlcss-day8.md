# HTML/CSS 超速習 Day 8 — HTML/CSS/JS 統合の導入

## 今日のゴール

- DOM 操作の基本(`querySelector`、`addEventListener`)を復習する
- JS でクラスを切り替えて見た目を変えられる
- フォーム送信を JS で受けて処理できる
- **ダークモード切り替えトグル**を実装できる
- **`<dialog>` を JS で開閉**できる
- アクセシブルな状態変更(`aria-expanded`)が分かる
- **`localStorage`** で設定を永続化できる

**所要時間の目安: 2〜2.5時間**

---

## 0. この章の位置づけ

> 📎 **この章は「参考資料」です**
>
> Day 8〜9 は、**TypeScript 本編に進まず、JavaScript だけで Web ページに動きを加えたい人向け**の参考資料です。
>
> - **TypeScript 本編に進む人**(メインルート): この章はスキップして OK です。同じ内容(DOM 操作・localStorage・ダークモード切り替えなど)を、より発展的な形で **第13〜16章** で学びます
> - **JS だけで小さなページを作りたい人**: このまま読み進めてください

### この章で扱うこと

Day 7 までで、HTML/CSS だけで**かなり完成度の高いページ**が作れるようになりました。この章では **JavaScript と組み合わせて、動く Web** に進化させます。

### 前提知識

JavaScript の基本文法(変数、関数、配列、オブジェクト、`if`/`for` など)は既に知っている前提で進めます。もし JavaScript が初めてなら、**TypeScript 本編の第2〜7章** を先に進めることをおすすめします(JS と TS を同時に学べる構成になっています)。

「**HTML/CSS でできることは HTML/CSS で、JS が必要な部分だけ JS で**」という現代の流儀(Day 3 / 7 のコラム参照)を意識しつつ、JS の出番をしっかり押さえましょう。

Day 9 の総合演習で、**スタイル付き ToDo アプリ**と**ポートフォリオサイト**を完成させるための、**準備回**です。

---

## 1. DOM 操作の復習(20分)

### 1-1. JS をHTMLに読み込む

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>JSと統合</title>
</head>
<body>
  <h1>こんにちは</h1>
  <button id="myBtn">クリック</button>
  
  <script src="app.js"></script>
</body>
</html>
```

**`<script>` は `</body>` の直前**に置くのが定石。理由:

- ページの HTML が**先に読み込まれる**ので、JS から要素にアクセス可能
- ページ表示が**JSのロードで止まらない**

`type="module"` を付ければさらに `<head>` に書いてもOKですが、初学者の段階では `</body>` 直前が安全。

### 1-2. 要素を取得する

```javascript
// IDで取得
const btn = document.getElementById("myBtn");

// CSSセレクタで取得(最初の1つ)
const heading = document.querySelector("h1");

// CSSセレクタで取得(全部)
const allLi = document.querySelectorAll("li");
```

**`querySelector`** が現代の主流。CSS と同じセレクタ記法で書けるので分かりやすいです。

### 1-3. イベントを設定する

```javascript
const btn = document.querySelector("#myBtn");

btn.addEventListener("click", () => {
  console.log("クリックされた!");
});
```

`addEventListener("イベント名", コールバック関数)` の形。**「ボタンが押されたら何をするか**」を関数として渡します。

主なイベント:
- `click`: クリック
- `submit`: フォーム送信
- `input`: 入力中(リアルタイム)
- `change`: 値の変更(確定後)
- `keydown` / `keyup`: キー押下
- `mouseenter` / `mouseleave`: ホバー開始/終了
- `DOMContentLoaded`: ページ読み込み完了

### 1-4. 簡単な動作確認

`day8/index.html`:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>JS の練習</title>
</head>
<body>
  <h1 id="title">こんにちは!</h1>
  <button id="changeBtn">タイトルを変える</button>
  
  <script src="app.js"></script>
</body>
</html>
```

`day8/app.js`:
```javascript
const title = document.querySelector("#title");
const btn = document.querySelector("#changeBtn");

btn.addEventListener("click", () => {
  title.textContent = "クリックされた!";
});
```

ボタンを押すと、タイトルが変わるはず。これが DOM 操作の最小例です。

---

## 2. ⭐ クラスを切り替えてスタイル変更(25分)

「**JS で見た目を直接書き換える**」よりも、**CSS のクラスを切り替える**のが現代的なやり方です。

### 2-1. classList API

要素のクラスを操作する API です。

```javascript
const el = document.querySelector(".box");

el.classList.add("active");      // クラス追加
el.classList.remove("active");    // クラス削除
el.classList.toggle("active");    // 追加 ⇄ 削除を切り替え
el.classList.contains("active");  // 含むか?(boolean を返す)
```

**`toggle`** が特に便利。

### 2-2. 実例: メニューの開閉

```html
<nav>
  <button id="menuBtn">メニュー</button>
  <ul id="menu">
    <li><a href="#">項目1</a></li>
    <li><a href="#">項目2</a></li>
  </ul>
</nav>
```

```css
#menu {
  display: none;  /* デフォルトは非表示 */
}

#menu.open {
  display: block;  /* open クラスが付いたら表示 */
}
```

```javascript
const btn = document.querySelector("#menuBtn");
const menu = document.querySelector("#menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("open");
});
```

**ボタンを押すたびに**、メニューが**開閉**します。CSS は `.open` の有無を見ているだけ。**ロジックは JS、見た目は CSS** という役割分担。

### 2-3. CSS で `:has()` を使う方法もある

第7章で学んだ `:has()` を使えば、JS なしでも可能なケースがあります。

```html
<details>
  <summary>メニュー</summary>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</details>
```

`<details>` を使えば、JS なしで開閉できますね。**「JS が必要か?」を判断する目**を養いましょう。

ただし、ボタンの見た目を細かく制御したいときや、**他の要素も同時に動かす**ような場合は JS が必要になります。

### 🔧 ミニ演習1

「**ライト/ダーク テーマ切り替えボタン**」を作ってください。

要件:
- ボタンを押すと `<body>` に `dark` クラスが付いたり外れたり
- `body.dark` のとき、背景が黒、文字が白になる CSS を書く

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="theme.css">
  <title>テーマ切り替え</title>
</head>
<body>
  <button id="themeBtn">テーマ切り替え</button>
  <h1>こんにちは</h1>
  <p>これは段落です。</p>
  
  <script src="theme.js"></script>
</body>
</html>
```

```css
/* theme.css */
body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: white;
  color: #1f2937;
  transition: background 0.3s, color 0.3s;
}

body.dark {
  background: #1f2937;
  color: white;
}

button {
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
}
```

```javascript
// theme.js
const btn = document.querySelector("#themeBtn");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

ボタンを押すたびに、背景と文字色がスムーズに反転します。`transition` も効いて気持ちのいい挙動。
</details>

---

## 3. ⭐ ダークモード切り替えトグル(30分)

Day 7 で「**OSがダークモードなら自動でダーク**」を実装しました。今日は「**ユーザーがボタンで切り替えられる**」バージョンを作ります。

### 3-1. data 属性で状態を管理

「ライト」「ダーク」の状態を、**`<html>` 要素の `data-theme` 属性**で管理する手法が現代的。

```html
<html data-theme="light">
  <!-- ライトモード -->
</html>

<html data-theme="dark">
  <!-- ダークモード -->
</html>
```

### 3-2. CSS で属性セレクタを使う

```css
:root {
  --color-bg: white;
  --color-text: #1f2937;
}

[data-theme="dark"] {
  --color-bg: #111827;
  --color-text: white;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  transition: background 0.3s, color 0.3s;
}
```

**`[data-theme="dark"]`** で、`data-theme="dark"` 属性を持つ要素のスタイルを上書き。

### 3-3. JS で切り替える

```javascript
const toggle = document.querySelector("#themeToggle");

toggle.addEventListener("click", () => {
  const html = document.documentElement;  // <html> 要素
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
});
```

クリックで `data-theme` 属性の値を切り替え。CSS変数が連動して**サイト全体の色が変わる**仕組み。

### 3-4. ⭐ localStorage で設定を保存

このままだと、**ページをリロードするとライトに戻ってしまいます**。`localStorage` で設定を保存しましょう。

```javascript
const html = document.documentElement;
const toggle = document.querySelector("#themeToggle");

// ページ読み込み時に保存された設定を復元
const saved = localStorage.getItem("theme");
if (saved) {
  html.setAttribute("data-theme", saved);
}

// クリックで切り替え + 保存
toggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);  // 保存
});
```

**`localStorage`**:
- `setItem(キー, 値)`: 保存
- `getItem(キー)`: 取得(無ければ `null`)
- `removeItem(キー)`: 削除

ブラウザに**永続的に**保存されるので、リロードしても閉じても残ります。

### 3-5. OS設定と併用する応用パターン

「**最初は OS の設定に従い、ユーザーが明示的に選んだら優先**」する書き方:

```javascript
const html = document.documentElement;

// 初期化(優先順位: ユーザー設定 > OS設定)
const saved = localStorage.getItem("theme");
const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initial = saved || (osDark ? "dark" : "light");
html.setAttribute("data-theme", initial);

// 切り替えロジック
document.querySelector("#themeToggle").addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
```

`window.matchMedia("...")` でメディアクエリの結果をJSから読み取れます。

### 🔧 ミニ演習2

完全動作版のダークモード切り替えを作ってください。

要件:
- ボタンに `<button id="themeToggle">テーマ</button>`
- `<html>` の `data-theme` 属性を切り替え
- CSS変数で色を管理(`--color-bg`、`--color-text`)
- `localStorage` で保存
- OS 設定にも初期対応(指定なしの初回)

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="darkmode.css">
  <title>ダークモード</title>
</head>
<body>
  <header>
    <h1>マイサイト</h1>
    <button id="themeToggle">🌓 テーマ切り替え</button>
  </header>
  <main>
    <p>このページはダークモードに対応しています。</p>
  </main>
  
  <script src="darkmode.js"></script>
</body>
</html>
```

```css
/* darkmode.css */
:root {
  --color-bg: white;
  --color-text: #1f2937;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
}

[data-theme="dark"] {
  --color-bg: #111827;
  --color-text: white;
  --color-surface: #1f2937;
  --color-border: #374151;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  transition: background 0.3s, color 0.3s;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

button {
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}

main {
  padding: 2rem;
}
```

```javascript
// darkmode.js
const html = document.documentElement;
const toggle = document.querySelector("#themeToggle");

// 初期化
const saved = localStorage.getItem("theme");
const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initial = saved || (osDark ? "dark" : "light");
html.setAttribute("data-theme", initial);

// 切り替え
toggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
```

ブラウザの DevTools の Application → Local Storage で、`theme` キーが保存される様子も見られます。
</details>

---

## 4. フォーム送信を JS で受ける(20分)

Day 3 で学んだフォームを JS と連携させます。

### 4-1. submit イベント

```html
<form id="contactForm">
  <input type="text" id="name" required>
  <input type="email" id="email" required>
  <button type="submit">送信</button>
</form>
```

```javascript
const form = document.querySelector("#contactForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();  // ページリロードを止める!
  
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  
  console.log({ name, email });
  alert(`送信: ${name} / ${email}`);
});
```

**最重要**: `event.preventDefault()`。フォームのデフォルト送信(ページリロード)を**止める**ことで、JS で処理を引き受けられます。

### 4-2. FormData を使う(楽な書き方)

入力欄が多いとき、**`FormData`** で一括取得できます。

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);  // オブジェクトに変換
  
  console.log(data);  // { name: "Alice", email: "alice@..." }
});
```

`name` 属性を持つすべての入力欄が、**そのキーで取得**できます。`<input name="email">` なら `data.email` でアクセス。

### 4-3. リアルタイムの input イベント

入力中に**逐一反応**したいときは `input` イベント:

```html
<input type="text" id="liveInput">
<p id="output"></p>
```

```javascript
const input = document.querySelector("#liveInput");
const output = document.querySelector("#output");

input.addEventListener("input", (event) => {
  output.textContent = `入力中: ${event.target.value}`;
});
```

文字を打つたびに、下のテキストがリアルタイムで更新。

### 4-4. バリデーション結果を表示

```html
<form id="form">
  <label for="email">メール</label>
  <input type="email" id="email" required>
  <p id="error" class="error"></p>
  <button>送信</button>
</form>
```

```css
.error {
  color: red;
  font-size: 0.875rem;
  min-height: 1.2em;
}
```

```javascript
const emailInput = document.querySelector("#email");
const errorEl = document.querySelector("#error");

emailInput.addEventListener("input", () => {
  if (!emailInput.validity.valid) {
    errorEl.textContent = "有効なメールアドレスを入力してください";
  } else {
    errorEl.textContent = "";
  }
});
```

**`input.validity.valid`** で、ネイティブ validation の結果を取得できます。「**ネイティブvalidation の力をJSで活かす**」パターン。

---

## 5. ⭐ `<dialog>` を JS で開閉(15分)

Day 3 で紹介した `<dialog>` 要素を、JS で制御します。

### 5-1. 基本の開閉

```html
<button id="openBtn">開く</button>

<dialog id="myDialog">
  <p>これはダイアログです</p>
  <button id="closeBtn">閉じる</button>
</dialog>
```

```javascript
const dialog = document.querySelector("#myDialog");
const openBtn = document.querySelector("#openBtn");
const closeBtn = document.querySelector("#closeBtn");

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});
```

- **`showModal()`**: モーダル表示(背景が暗くなる、他の操作不可)
- **`close()`**: 閉じる
- **Escキー** で閉じる ← ブラウザがネイティブ対応

### 5-2. `<form method="dialog">` でJS不要に

Day 3 で紹介したパターン:

```html
<dialog id="myDialog">
  <form method="dialog">
    <p>確認しますか?</p>
    <button value="cancel">キャンセル</button>
    <button value="confirm">OK</button>
  </form>
</dialog>
```

`<form method="dialog">` の中のボタンを押すと、**自動的に閉じる**。`value` 属性で「**どのボタンが押されたか**」を JS で取得できます。

### 5-3. 押したボタンを判定する

```javascript
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "confirm") {
    console.log("OK が押された");
  } else {
    console.log("キャンセルが押された");
  }
});

openBtn.addEventListener("click", () => {
  dialog.showModal();
});
```

`dialog.returnValue` に、**最後に押されたボタンの `value`** が入ります。

### 5-4. 背景クリックで閉じる

```javascript
dialog.addEventListener("click", (event) => {
  // ダイアログ自体(背景)がクリックされた場合
  if (event.target === dialog) {
    dialog.close();
  }
});
```

実は最近のブラウザでは、HTML に `closedby="any"` 属性を付けるだけで対応できますが、サポートが広まるまでは JS で対応するのが安全。

### 🔧 ミニ演習3

「**削除確認ダイアログ**」を作ってください。

仕様:
- 「削除する」ボタンを押すと、確認ダイアログが開く
- 「キャンセル」「削除する」の2つのボタン
- 「削除する」が押されたら `alert("削除しました")` を表示
- 「キャンセル」が押されたら何もしない

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="dialog.css">
  <title>削除確認</title>
</head>
<body>
  <button id="deleteBtn">削除する</button>
  
  <dialog id="confirmDialog">
    <h2>削除確認</h2>
    <p>本当に削除しますか?</p>
    
    <form method="dialog">
      <button value="cancel">キャンセル</button>
      <button value="confirm">削除する</button>
    </form>
  </dialog>
  
  <script src="dialog.js"></script>
</body>
</html>
```

```css
dialog {
  border: none;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 400px;
}

dialog::backdrop {
  background: rgba(0,0,0,0.5);
}

dialog h2 {
  margin-top: 0;
}

dialog form {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

```javascript
const dialog = document.querySelector("#confirmDialog");
const deleteBtn = document.querySelector("#deleteBtn");

deleteBtn.addEventListener("click", () => {
  dialog.showModal();
});

dialog.addEventListener("close", () => {
  if (dialog.returnValue === "confirm") {
    alert("削除しました");
  }
});
```

ダイアログの背景は `::backdrop` 疑似要素でスタイル可能。`<form method="dialog">` のおかげで、閉じる動作は HTML だけで完結しています。
</details>

---

## 6. アクセシブルな状態変更(15分)

JS で見た目を変えるとき、**アクセシビリティ**も忘れずに。

### 6-1. aria-expanded の使い方

「**メニューが開いているか**」のような状態は、**`aria-expanded`** で読み上げソフトに伝えます。

```html
<button id="menuBtn" aria-expanded="false">メニュー</button>
<ul id="menu" hidden>
  <li>項目1</li>
  <li>項目2</li>
</ul>
```

```javascript
const btn = document.querySelector("#menuBtn");
const menu = document.querySelector("#menu");

btn.addEventListener("click", () => {
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!isOpen));
  menu.hidden = isOpen;  // 反転
});
```

- 視覚: メニューが表示/非表示
- 読み上げソフト: 「メニュー、展開済み」「メニュー、折りたたみ」と読まれる

### 6-2. `hidden` 属性 vs `display: none`

```html
<!-- HTML標準の hidden 属性 -->
<div hidden>非表示</div>
```

`hidden` 属性も `display: none` も**画面非表示**にしますが:

- **`hidden`** 属性: HTML標準、JSで `el.hidden = true/false` で切り替えられる
- **`display: none`**: CSS の機能

シンプルなケースでは **`hidden`** 属性 + JS が使いやすいです。

### 6-3. aria-current でナビゲーション

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
nav a[aria-current="page"] {
  font-weight: bold;
  color: var(--color-primary);
}
```

「**今のページ**」を表す `aria-current="page"` を付けるだけで、視覚的にも読み上げ的にも「現在地」が伝わります。

### 6-4. アクセシビリティの基本姿勢

「**全部完璧に対応**」は難しいですが、**できる範囲で配慮**するのが大切。

最低限:
- フォームに `<label>`(Day 3)
- 画像に `alt`(Day 1)
- 見出し階層を守る(Day 2)
- インタラクティブ要素には `<button>` / `<a>`(自作 `<div>` ボタンは避ける)
- `:focus-visible` でキーボード操作対応(Day 4)
- `aria-expanded` / `aria-current` で状態変更を伝える

これだけ意識すれば、初学者レベルでは十分です。

---

## 7. 章末演習(25分)

### 🎯 ダークモード + メニュー + 確認ダイアログ

Day 7 で作った**カードギャラリー**に、以下の機能を追加してください。

仕様:
1. **ダークモード切り替えボタン**(localStorage で保存、OS設定も考慮)
2. **メニュー開閉**(モバイル向けハンバーガーメニュー風、`aria-expanded` 対応)
3. **各カードに「削除」ボタン** → クリックで `<dialog>` を出して確認 → OKで該当カードを削除

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="integrated.css">
  <title>統合演習</title>
</head>
<body>
  <header>
    <div class="logo">MyGallery</div>
    <nav>
      <button id="menuBtn" class="menu-btn" aria-expanded="false" aria-controls="menu">
        メニュー
      </button>
      <ul id="menu" class="menu" hidden>
        <li><a href="#" aria-current="page">ホーム</a></li>
        <li><a href="#">作品</a></li>
        <li><a href="#">問い合わせ</a></li>
      </ul>
    </nav>
    <button id="themeBtn" class="theme-btn">🌓</button>
  </header>
  
  <main>
    <div class="card-grid">
      <article class="card" data-id="1">
        <h3>カード1</h3>
        <p>説明文がここに入ります</p>
        <button class="delete-btn">削除</button>
      </article>
      <article class="card" data-id="2">
        <h3>カード2</h3>
        <p>説明文がここに入ります</p>
        <button class="delete-btn">削除</button>
      </article>
      <article class="card" data-id="3">
        <h3>カード3</h3>
        <p>説明文がここに入ります</p>
        <button class="delete-btn">削除</button>
      </article>
    </div>
  </main>
  
  <dialog id="confirmDialog">
    <h2>削除しますか?</h2>
    <p>この操作は取り消せません。</p>
    <form method="dialog">
      <button value="cancel">キャンセル</button>
      <button value="confirm">削除する</button>
    </form>
  </dialog>
  
  <script src="integrated.js"></script>
</body>
</html>
```

```css
/* integrated.css */
*, *::before, *::after { box-sizing: border-box; }

:root {
  --color-primary: #3b82f6;
  --color-bg: #f9fafb;
  --color-surface: white;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-danger: #ef4444;
  --shadow: 0 2px 4px rgba(0,0,0,0.05);
  --radius: 0.5rem;
}

[data-theme="dark"] {
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  transition: background 0.3s, color 0.3s;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.logo { font-weight: bold; font-size: 1.25rem; }

.menu-btn, .theme-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
}

.menu {
  list-style: none;
  position: absolute;
  top: 100%;
  right: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 0.5rem;
  margin: 0;
}

.menu li { padding: 0.5rem 1rem; }
.menu a {
  color: var(--color-text);
  text-decoration: none;
}
.menu a[aria-current="page"] {
  font-weight: bold;
  color: var(--color-primary);
}

main { padding: 2rem; max-width: 1200px; margin: 0 auto; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--color-border);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card h3 { color: var(--color-primary); margin-top: 0; }
.card p { color: var(--color-text-muted); }

.delete-btn {
  background: var(--color-danger);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

dialog {
  border: none;
  border-radius: var(--radius);
  padding: 2rem;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
dialog::backdrop { background: rgba(0,0,0,0.5); }
dialog form { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; }
dialog button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
}
dialog button[value="confirm"] {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
```

```javascript
// integrated.js

// ===== 1. ダークモード =====
const html = document.documentElement;
const themeBtn = document.querySelector("#themeBtn");

const savedTheme = localStorage.getItem("theme");
const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
html.setAttribute("data-theme", savedTheme || (osDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ===== 2. メニュー開閉 =====
const menuBtn = document.querySelector("#menuBtn");
const menu = document.querySelector("#menu");

menuBtn.addEventListener("click", () => {
  const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!isOpen));
  menu.hidden = isOpen;
});

// ===== 3. カードの削除 + 確認 =====
const dialog = document.querySelector("#confirmDialog");
let targetCard = null;

document.addEventListener("click", (event) => {
  // 削除ボタンが押された?
  if (event.target.classList.contains("delete-btn")) {
    targetCard = event.target.closest(".card");
    dialog.showModal();
  }
});

dialog.addEventListener("close", () => {
  if (dialog.returnValue === "confirm" && targetCard) {
    targetCard.remove();
  }
  targetCard = null;
});
```

実行すると:
1. **🌓 ボタン**でダーク/ライト切り替え、リロード後も状態保持
2. **メニューボタン**でドロップダウン、`aria-expanded` が正しく更新される(DevToolsで確認可)
3. **削除ボタン**で確認ダイアログ → OK でカードが消える、キャンセルで何もしない

これでHTML/CSS/JS の統合パターンの**基本セット**が揃いました。Day 9 で、これらをフル活用してアプリを作ります。

#### ⭐ 補足: イベント委譲

`document.addEventListener("click", ...)` で全クリックを受けて、`event.target.classList.contains("delete-btn")` で判定する書き方を**「イベント委譲」**と呼びます。

- 各カードに `addEventListener` を個別に付けなくていい
- 後からカードが追加されても自動的に反応する

便利なテクニックなので覚えておきましょう。

</details>

---

## 8. 今日のまとめ

### 覚えておきたいこと

1. **`querySelector("セレクタ")`** で要素取得(CSS と同じセレクタ記法)
2. **`addEventListener("イベント名", 関数)`** でイベント登録
3. **`classList.toggle("クラス名")`** でクラスの ON/OFF
4. **`data-theme` 属性** + CSS変数で**テーマ切り替え**
5. **`localStorage.setItem/getItem`** で設定を永続化
6. **`form.addEventListener("submit", ...)` + `event.preventDefault()`** でフォーム制御
7. **`FormData(form)`** でフォームデータを一括取得
8. **`dialog.showModal() / close()`** でモーダル制御
9. **`<form method="dialog">`** でJS不要の閉じる動作
10. **`aria-expanded`** で状態をアクセシブルに伝える

### よく使うパターン早見表

| やりたいこと | コード |
|---|---|
| ボタンクリック | `btn.addEventListener("click", () => {...})` |
| クラス切り替え | `el.classList.toggle("active")` |
| テーマ切り替え | `html.setAttribute("data-theme", "dark")` |
| 設定保存 | `localStorage.setItem("theme", "dark")` |
| フォームの送信を止める | `event.preventDefault()` |
| フォーム値取得 | `Object.fromEntries(new FormData(form))` |
| ダイアログ開く | `dialog.showModal()` |
| 状態を伝える | `el.setAttribute("aria-expanded", "true")` |

---

## 次回(Day 9)の予告

**Day 9 — 総合演習**は参考資料の最終章です。これまでの集大成として、JS だけで2つのアプリを作ります。

作るのは2つ:

### 演習1: スタイル付き ToDo アプリ
- フォームで入力、リストに追加
- チェックボックスで完了/未完了切り替え
- 削除ボタン(`<dialog>` で確認)
- `localStorage` で永続化
- レスポンシブ対応
- ダークモード対応

### 演習2: ポートフォリオサイト
- ヒーローセクション
- 自己紹介(About)
- スキル一覧
- 作品紹介(Works)
- 問い合わせフォーム
- レスポンシブ・ダークモード対応

**「JS だけで1から作れる**」レベルになる回です ☕

---

> 🎯 **コラム: JS と CSS の役割分担**
>
> 今日の章で見た「**`data-theme` を変えるだけで全画面の色が変わる**」現象は、JS と CSS の**理想的な役割分担**を表しています。
>
> - **JS の役割**: 状態を管理する(`data-theme` の値、`aria-expanded` の値、`localStorage` の値)
> - **CSS の役割**: 状態に応じた**見た目**を定義する(`[data-theme="dark"] { ... }`)
>
> この分離があると:
>
> 1. **JS が小さくなる**(色の指定がCSSに集約される)
> 2. **CSSだけ見れば見た目が分かる**(JSのコードを読まなくて済む)
> 3. **テーマが追加しやすい**(`data-theme="sepia"` を追加するだけ)
> 4. **デザイナーとの分業**ができる
>
> 「**JS で `style.color = "red"` と書く時代は終わった**」と覚えてください。**JS は状態を、CSS は見た目を**、それぞれの得意分野で活躍させるのが現代の流儀です。
>
> Day 9 の総合演習でも、この役割分担を意識しながら書いていきましょう。

お疲れさまでした!Day 9 で**JS だけのアプリ作り**に挑戦してみましょう ☕
