# HTML/CSS 超速習 Day 9 — 総合演習 ToDo アプリ + ポートフォリオサイト

## 今日のゴール

- これまで学んだ全知識を統合して**動くアプリ**を作れる
- 完成形の **ToDo アプリ**を1から実装できる
- 完成形の **ポートフォリオサイト**を1から実装できる
- 自分のサイトを GitHub Pages で**公開**できる(発展)

**所要時間の目安: 3〜4時間**

---

## 0. 参考資料の最終章

> 📎 **この章は「参考資料」です(Day 8 から継続)**
>
> TypeScript 本編に進む場合、この章はスキップして OK です。同じテーマ(ToDo アプリ・スタイル付きサイト)を、**第13〜16章**で TypeScript + React + Tailwind を使って、より発展的に作ります。
>
> 「JS だけで簡単に動くページを 1 つ完成させたい」「成果物として GitHub Pages に公開できるものが欲しい」という人は、このまま読み進めてください。

Day 8 までで学んだ JS の使い方を**すべて統合**して、**2つの本格的なアプリ**を完成させます。

```
✅ Day 1〜7: HTML/CSS 編(完了済み)
✅ Day 8: HTML/CSS/JS統合(参考)
🎯 Day 9: 総合演習 ← 今ここ(参考)
```

今日作るもの:

1. **演習1: スタイル付き ToDo アプリ**(JS との連続性を活かす)
2. **演習2: ポートフォリオサイト**(あなた自身を紹介する)

両方とも、完成すれば **「自分で作った成果物」** として、ポートフォリオに載せられるレベル。TypeScript 本編に進む前のウォーミングアップにもなります。

時間がない方は、まず**演習1**だけでもOK。気合があれば**演習2**まで。それでは始めましょう!

---

# 演習1: スタイル付き ToDo アプリ

## 1. 完成イメージ

**機能**:
- フォームで新規ToDoを追加
- チェックで完了/未完了の切り替え(取り消し線 + 半透明)
- 削除ボタン → 確認ダイアログ → 削除
- 全消去ボタン → 確認ダイアログ → 全削除
- 完了したものだけ・未完了だけ・すべて の切り替え表示
- **localStorage で永続化**(リロードしても残る)
- **レスポンシブ**(スマホ〜PC)
- **ダークモード対応**
- アニメーション(追加時にフェードイン)

これだけの機能を持つアプリを、**今日学んだ知識だけで**作ります。

## 2. フォルダ構成

```
day9/
└── todo/
    ├── index.html
    ├── style.css
    └── app.js
```

## 3. HTML

`day9/todo/index.html`:

```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>ToDo アプリ</title>
</head>
<body>
  <header class="app-header">
    <h1>📋 My ToDo</h1>
    <button id="themeToggle" class="theme-toggle" aria-label="テーマ切り替え">🌓</button>
  </header>

  <main class="app">
    <!-- 入力フォーム -->
    <form id="todoForm" class="todo-form">
      <input
        type="text"
        id="todoInput"
        placeholder="新しいタスクを入力..."
        required
        minlength="1"
        maxlength="100"
      >
      <button type="submit">追加</button>
    </form>

    <!-- フィルター -->
    <div class="filter-tabs" role="tablist">
      <button class="filter-btn" data-filter="all" aria-current="page">すべて</button>
      <button class="filter-btn" data-filter="pending">未完了</button>
      <button class="filter-btn" data-filter="done">完了</button>
    </div>

    <!-- ToDo リスト -->
    <ul id="todoList" class="todo-list">
      <!-- JS で動的に生成 -->
    </ul>

    <!-- 何もない時のメッセージ -->
    <p id="emptyMessage" class="empty-message" hidden>
      タスクがありません 🎉
    </p>

    <!-- 操作ボタン -->
    <div class="actions">
      <span id="counter" class="counter">0 件のタスク</span>
      <button id="clearAllBtn" class="clear-btn" hidden>全て削除</button>
    </div>
  </main>

  <!-- 削除確認ダイアログ -->
  <dialog id="deleteDialog">
    <h2>削除しますか?</h2>
    <p id="deleteMessage">この操作は取り消せません。</p>
    <form method="dialog" class="dialog-actions">
      <button value="cancel">キャンセル</button>
      <button value="confirm" class="btn-danger">削除する</button>
    </form>
  </dialog>

  <script src="app.js"></script>
</body>
</html>
```

ポイント:
- **セマンティックHTML**(`<header>`、`<main>`、`<form>`)
- **`data-theme="light"`** で初期テーマ
- **`<dialog>`** で削除確認
- **`aria-label`、`aria-current`** でアクセシビリティ

## 4. CSS

`day9/todo/style.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

/* ========== デザイントークン ========== */
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: color-mix(in oklch, var(--color-primary), black 15%);
  --color-danger: #ef4444;
  --color-success: #10b981;

  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

  --radius: 0.5rem;
}

/* ========== ダークモード ========== */
[data-theme="dark"] {
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
}

/* ========== ベース ========== */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background 0.3s, color 0.3s;
}

/* ========== ヘッダー ========== */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.app-header h1 {
  margin: 0;
  font-size: clamp(1.25rem, 4vw, 1.75rem);
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    background: var(--color-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

/* ========== アプリ本体 ========== */
.app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* ========== フォーム ========== */
.todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  & input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -1px;
      border-color: var(--color-primary);
    }
  }

  & button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-primary-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }
}

/* ========== フィルター ========== */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--color-bg);
  }

  &[aria-current="page"] {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

/* ========== ToDo リスト ========== */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 0.5rem;
  box-shadow: var(--shadow-sm);

  /* 追加時のアニメーション */
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ⭐ :has() で完了状態を装飾(現代CSS!) */
.todo-item:has(input:checked) {
  opacity: 0.5;

  & .todo-text {
    text-decoration: line-through;
  }
}

.todo-item input[type="checkbox"] {
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.todo-text {
  flex: 1;
  word-break: break-word;
}

.delete-btn {
  flex-shrink: 0;
  padding: 0.4rem 0.6rem;
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--color-danger);
    color: white;
  }

  &:focus-visible {
    outline: 2px solid var(--color-danger);
    outline-offset: 2px;
  }
}

/* ========== 空メッセージ ========== */
.empty-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem;
}

/* ========== 操作ボタン ========== */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.counter {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.clear-btn {
  background: transparent;
  color: var(--color-danger);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
}

/* ========== ダイアログ ========== */
dialog {
  border: none;
  border-radius: var(--radius);
  padding: 1.5rem;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 90%;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

dialog h2 {
  margin-top: 0;
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.dialog-actions button {
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
}

.dialog-actions .btn-danger {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

/* ========== reduced-motion ========== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 5. JavaScript

`day9/todo/app.js`:

```javascript
// ========== データ管理 ==========
const STORAGE_KEY = "todos";

const loadTodos = () => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

let todos = loadTodos();
let nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let currentFilter = "all";

// ========== 要素取得 ==========
const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const emptyMsg = document.querySelector("#emptyMessage");
const counter = document.querySelector("#counter");
const clearAllBtn = document.querySelector("#clearAllBtn");
const themeToggle = document.querySelector("#themeToggle");
const filterBtns = document.querySelectorAll(".filter-btn");
const deleteDialog = document.querySelector("#deleteDialog");
const deleteMessage = document.querySelector("#deleteMessage");

// ========== 描画 ==========
const render = () => {
  // フィルター適用
  let filtered = todos;
  if (currentFilter === "pending") {
    filtered = todos.filter(t => !t.done);
  } else if (currentFilter === "done") {
    filtered = todos.filter(t => t.done);
  }

  // 描画
  list.innerHTML = filtered.map(todo => `
    <li class="todo-item" data-id="${todo.id}">
      <input
        type="checkbox"
        ${todo.done ? "checked" : ""}
        aria-label="${todo.text} を完了に切り替え"
      >
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" aria-label="${todo.text} を削除">削除</button>
    </li>
  `).join("");

  // 空メッセージ表示
  emptyMsg.hidden = filtered.length > 0;

  // カウンター
  const pendingCount = todos.filter(t => !t.done).length;
  counter.textContent = `${pendingCount} 件の未完了タスク (全 ${todos.length} 件)`;

  // 全消去ボタン
  clearAllBtn.hidden = todos.length === 0;
};

// HTMLエスケープ(XSS対策)
const escapeHtml = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

// ========== 操作関数 ==========
const addTodo = (text) => {
  todos.push({
    id: nextId++,
    text: text.trim(),
    done: false,
  });
  saveTodos(todos);
  render();
};

const toggleTodo = (id) => {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos(todos);
    render();
  }
};

const deleteTodo = (id) => {
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  render();
};

const clearAll = () => {
  todos = [];
  saveTodos(todos);
  render();
};

// ========== 削除ダイアログ ==========
let pendingDeleteId = null;
let pendingClearAll = false;

const askDelete = (id, text) => {
  pendingDeleteId = id;
  pendingClearAll = false;
  deleteMessage.textContent = `「${text}」を削除します。`;
  deleteDialog.showModal();
};

const askClearAll = () => {
  pendingDeleteId = null;
  pendingClearAll = true;
  deleteMessage.textContent = `${todos.length} 件のタスクをすべて削除します。`;
  deleteDialog.showModal();
};

deleteDialog.addEventListener("close", () => {
  if (deleteDialog.returnValue === "confirm") {
    if (pendingClearAll) {
      clearAll();
    } else if (pendingDeleteId !== null) {
      deleteTodo(pendingDeleteId);
    }
  }
  pendingDeleteId = null;
  pendingClearAll = false;
});

// ========== イベントハンドラ ==========

// フォーム送信
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

// リストの操作(イベント委譲)
list.addEventListener("click", (event) => {
  const target = event.target;
  const item = target.closest(".todo-item");
  if (!item) return;

  const id = Number(item.dataset.id);

  if (target.classList.contains("delete-btn")) {
    const todo = todos.find(t => t.id === id);
    if (todo) askDelete(id, todo.text);
  } else if (target.matches("input[type='checkbox']")) {
    toggleTodo(id);
  }
});

// フィルター
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.removeAttribute("aria-current"));
    btn.setAttribute("aria-current", "page");
    render();
  });
});

// 全消去
clearAllBtn.addEventListener("click", () => {
  if (todos.length > 0) {
    askClearAll();
  }
});

// ========== テーマ切り替え ==========
const html = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
html.setAttribute("data-theme", savedTheme || (osDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ========== 初期描画 ==========
render();
```

## 6. 動作確認

完成したら Live Server で開いて、以下を試してください:

1. **ToDoを追加** → リストに表示される
2. **チェック** → 取り消し線が引かれて半透明に
3. **削除ボタン** → 確認ダイアログ → OK で削除
4. **フィルター切り替え** → 「未完了」「完了」で表示が変わる
5. **🌓 ボタン** → ダーク/ライト切り替え
6. **リロード** → 内容が保持される
7. **スマホ表示**(DevToolsのデバイスモード)→ 崩れない
8. **キーボード操作**(Tab で移動、Enterで決定)→ 動作する

すべて動けば、**現代 Web の標準的な ToDo アプリ**の完成です!🎉

## 7. ⭐ 学んだ技術の総合一覧

このアプリには、これまでの**全てが詰まっています**:

- **Day 1**: HTMLの基本構造、DevTools
- **Day 2**: セマンティックHTML(`<header>`、`<main>`、`<form>`)
- **Day 3**: フォームとネイティブvalidation、`<dialog>`
- **Day 4**: CSS変数、`box-sizing`、`:focus-visible`
- **Day 5**: Flexbox(フォーム、操作ボタン)
- **Day 6**: レスポンシブ(`clamp()` でタイトルサイズ)
- **Day 7**: CSS Nesting、`:has()`(チェック時の装飾)、ダークモード、アニメーション、`color-mix()`、`prefers-reduced-motion`
- **Day 8**: JS との統合、`localStorage`、テーマ切り替え、イベント委譲、`aria-current`

**3桁レベルのコード量**で、**実用に耐えるアプリ**が作れる現代CSS+JSの威力を、実感できたでしょうか?

---

# 演習2: ポートフォリオサイト

「**自分自身を紹介する**」サイトを作ります。就職活動や SNS のプロフィールに載せられる、**あなただけの一品**を完成させましょう。

## 1. 完成イメージ

セクション構成:
1. **Hero**(ファーストビュー): 名前 + 肩書き + キャッチコピー
2. **About**: 簡単な自己紹介
3. **Skills**: 持っているスキル
4. **Works**: 作品紹介(架空でOK)
5. **Contact**: 問い合わせフォーム
6. **Footer**: コピーライト、SNSリンク

機能:
- レスポンシブ(モバイル → タブレット → デスクトップ)
- ダークモード対応
- フェードインアニメーション
- スムーズなスクロール(`<a href="#section">` でジャンプ)

## 2. フォルダ構成

```
day9/
└── portfolio/
    ├── index.html
    ├── style.css
    └── app.js
```

## 3. HTML

`day9/portfolio/index.html`:

```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>山田太郎 - ポートフォリオ</title>
</head>
<body>
  <!-- ヘッダー(ナビ) -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="#" class="logo">Taro Yamada</a>
      <nav>
        <ul class="nav-list">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <button id="themeToggle" class="theme-toggle" aria-label="テーマ切り替え">🌓</button>
    </div>
  </header>

  <main>
    <!-- Hero セクション -->
    <section class="hero">
      <div class="container hero-inner">
        <p class="hero-greeting">Hi, I'm</p>
        <h1 class="hero-title">山田太郎</h1>
        <p class="hero-subtitle">Web Developer in Training</p>
        <p class="hero-description">
          初学者からのキャリアチェンジを目指して、Webフロントエンドを勉強中です。
        </p>
        <a href="#contact" class="btn-primary">Contact Me</a>
      </div>
    </section>

    <!-- About セクション -->
    <section id="about" class="section">
      <div class="container">
        <h2>About</h2>
        <div class="about-grid">
          <div class="about-image" aria-hidden="true">
            <!-- アバター代わり -->
            <div class="avatar">T</div>
          </div>
          <div class="about-text">
            <p>
              はじめまして。30代でプログラミング学習を始めた山田太郎です。
              現在は事務職をしながら、夜と週末に独学で学んでいます。
            </p>
            <p>
              HTML/CSS、JavaScript、TypeScript、React と進めていく予定で、
              将来は Web エンジニアとしてキャリアを築きたいと考えています。
            </p>
            <p>
              休日はカフェ巡りと読書が趣味です。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills セクション -->
    <section id="skills" class="section section-alt">
      <div class="container">
        <h2>Skills</h2>
        <div class="skills-grid">
          <article class="skill-card">
            <h3>HTML</h3>
            <p>セマンティック HTML、アクセシビリティを意識した実装ができます。</p>
          </article>
          <article class="skill-card">
            <h3>CSS</h3>
            <p>Flexbox / Grid、レスポンシブデザイン、CSS変数を活用できます。</p>
          </article>
          <article class="skill-card">
            <h3>JavaScript</h3>
            <p>DOM操作、非同期処理、モダンJS構文を学習中。</p>
          </article>
          <article class="skill-card">
            <h3>TypeScript</h3>
            <p>型システムの基礎を理解。型安全なコードを書く練習中。</p>
          </article>
          <article class="skill-card">
            <h3>Git</h3>
            <p>基本的な操作と GitHub への push ができます。</p>
          </article>
          <article class="skill-card">
            <h3>その他</h3>
            <p>Figma、VS Code、Chrome DevTools を日常的に使用。</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Works セクション -->
    <section id="works" class="section">
      <div class="container">
        <h2>Works</h2>
        <p class="section-intro">学習中に作った作品を紹介します。</p>
        <div class="works-grid">
          <article class="work-card">
            <div class="work-image" aria-hidden="true">📋</div>
            <div class="work-content">
              <h3>ToDo アプリ</h3>
              <p>localStorage で永続化されるシンプルな ToDo 管理ツール。</p>
              <p class="work-tags">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
              </p>
            </div>
          </article>
          <article class="work-card">
            <div class="work-image" aria-hidden="true">🌤️</div>
            <div class="work-content">
              <h3>天気アプリ</h3>
              <p>外部 API を叩いて天気予報を表示するアプリ。</p>
              <p class="work-tags">
                <span>JavaScript</span>
                <span>API</span>
                <span>Fetch</span>
              </p>
            </div>
          </article>
          <article class="work-card">
            <div class="work-image" aria-hidden="true">📝</div>
            <div class="work-content">
              <h3>ブログサイト</h3>
              <p>学習内容を発信するブログ。Markdown 対応。</p>
              <p class="work-tags">
                <span>React</span>
                <span>TypeScript</span>
                <span>Markdown</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Contact セクション -->
    <section id="contact" class="section section-alt">
      <div class="container">
        <h2>Contact</h2>
        <p class="section-intro">お仕事の依頼やご相談はこちらから。</p>

        <form id="contactForm" class="contact-form">
          <div class="form-group">
            <label for="name">お名前</label>
            <input type="text" id="name" name="name" required minlength="2">
          </div>

          <div class="form-group">
            <label for="email">メールアドレス</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="message">メッセージ</label>
            <textarea id="message" name="message" rows="6" required minlength="10"></textarea>
          </div>

          <button type="submit" class="btn-primary">送信</button>
        </form>
      </div>
    </section>
  </main>

  <!-- フッター -->
  <footer class="site-footer">
    <div class="container">
      <ul class="social-links">
        <li><a href="#" aria-label="GitHub">GitHub</a></li>
        <li><a href="#" aria-label="X (旧 Twitter)">X</a></li>
        <li><a href="#" aria-label="LinkedIn">LinkedIn</a></li>
      </ul>
      <p>&copy; 2026 Taro Yamada. All rights reserved.</p>
    </div>
  </footer>

  <!-- 送信完了ダイアログ -->
  <dialog id="thanksDialog">
    <h2>ありがとうございました!</h2>
    <p>メッセージを受け付けました。返信までお待ちください。</p>
    <form method="dialog">
      <button>OK</button>
    </form>
  </dialog>

  <script src="app.js"></script>
</body>
</html>
```

> **注意**: 山田太郎の部分は**あなた自身の情報**に書き換えてください。これがあなたの**ポートフォリオ**になります。

## 4. CSS

`day9/portfolio/style.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

/* ========== デザイントークン ========== */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: color-mix(in oklch, var(--color-primary), black 15%);
  --color-accent: #8b5cf6;

  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.12);

  --radius: 0.5rem;
  --radius-lg: 1rem;

  --content-max: 1100px;
}

[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-border: #334155;
}

/* ========== ベース ========== */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.7;
  background: var(--color-bg);
  color: var(--color-text);
  transition: background 0.3s, color 0.3s;
}

.container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 1.5rem;
}

h1, h2, h3 {
  line-height: 1.3;
}

a {
  color: var(--color-primary);

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

/* ========== ヘッダー ========== */
.site-header {
  position: sticky;
  top: 0;
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text);
  text-decoration: none;
}

.nav-list {
  display: none;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;

  & a {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary);
    }
  }
}

@media (min-width: 48rem) {
  .nav-list {
    display: flex;
  }
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    background: var(--color-surface);
  }
}

/* ========== Hero ========== */
.hero {
  padding: clamp(3rem, 10vw, 6rem) 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  text-align: center;
}

.hero-greeting {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  margin: 0.5rem 0;
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  margin: 0;
  opacity: 0.95;
}

.hero-description {
  margin: 1.5rem auto;
  max-width: 32rem;
  font-size: 1.05rem;
  opacity: 0.9;
}

/* ========== 共通ボタン ========== */
.btn-primary {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: white;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: bold;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:focus-visible {
    outline: 3px solid white;
    outline-offset: 3px;
  }
}

/* ========== セクション共通 ========== */
.section {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.section-alt {
  background: var(--color-surface);
}

.section h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin: 0 0 0.5rem;
  text-align: center;
}

.section-intro {
  text-align: center;
  color: var(--color-text-muted);
  margin: 0 0 2.5rem;
}

/* ========== About ========== */
.about-grid {
  display: grid;
  gap: 2rem;
  align-items: center;
  margin-top: 2.5rem;
}

@media (min-width: 48rem) {
  .about-grid {
    grid-template-columns: 200px 1fr;
  }
}

.about-image {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  box-shadow: var(--shadow-lg);
}

/* ========== Skills ========== */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.skill-card {
  background: var(--color-bg);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }

  & h3 {
    color: var(--color-primary);
    margin: 0 0 0.5rem;
  }

  & p {
    color: var(--color-text-muted);
    margin: 0;
  }
}

/* ========== Works ========== */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.work-card {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }
}

.work-image {
  height: 160px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.work-content {
  padding: 1.5rem;

  & h3 {
    margin: 0 0 0.5rem;
  }

  & p {
    color: var(--color-text-muted);
    margin: 0 0 1rem;
  }
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & span {
    background: var(--color-surface);
    color: var(--color-text);
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    border: 1px solid var(--color-border);
  }
}

/* ========== Contact フォーム ========== */
.contact-form {
  max-width: 600px;
  margin: 2.5rem auto 0;
}

.form-group {
  margin-bottom: 1.25rem;

  & label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  & input,
  & textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 1rem;
    font-family: inherit;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -1px;
      border-color: var(--color-primary);
    }
  }
}

.contact-form .btn-primary {
  background: var(--color-primary);
  color: white;
  width: 100%;
  margin-top: 0.5rem;
}

/* ========== Footer ========== */
.site-footer {
  background: var(--color-text);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;

  & a {
    color: white;
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.site-footer p {
  margin: 0;
  opacity: 0.8;
}

/* ========== ダイアログ ========== */
dialog {
  border: none;
  border-radius: var(--radius);
  padding: 1.5rem;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

dialog h2 {
  margin: 0 0 0.5rem;
}

dialog form {
  margin-top: 1rem;
}

dialog button {
  padding: 0.5rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

/* ========== フェードインアニメーション ========== */
.section h2 {
  animation: fadeInUp 0.6s ease-out backwards;
}

.skill-card, .work-card {
  animation: fadeInUp 0.5s ease-out backwards;
}

.skill-card:nth-child(1), .work-card:nth-child(1) { animation-delay: 0.1s; }
.skill-card:nth-child(2), .work-card:nth-child(2) { animation-delay: 0.2s; }
.skill-card:nth-child(3), .work-card:nth-child(3) { animation-delay: 0.3s; }
.skill-card:nth-child(4) { animation-delay: 0.4s; }
.skill-card:nth-child(5) { animation-delay: 0.5s; }
.skill-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* スムーズスクロール */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem;  /* sticky header の高さ分 */
}

/* ========== reduced-motion ========== */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 5. JavaScript

`day9/portfolio/app.js`:

```javascript
// ========== テーマ切り替え ==========
const html = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");

const savedTheme = localStorage.getItem("theme");
const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
html.setAttribute("data-theme", savedTheme || (osDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ========== Contact フォーム ==========
const contactForm = document.querySelector("#contactForm");
const thanksDialog = document.querySelector("#thanksDialog");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // FormData で値取得
  const data = Object.fromEntries(new FormData(contactForm));
  console.log("送信内容:", data);

  // ダイアログ表示
  thanksDialog.showModal();

  // フォームリセット
  contactForm.reset();
});
```

短い JS ですが、これだけで:
- テーマ切り替え + 永続化 + OS 設定対応
- フォーム送信 → ダイアログ → リセット

が動きます。

## 6. ⭐ あなたの情報に書き換える

完成版は架空の「山田太郎」になっています。**自分の情報に書き換え**ましょう。

書き換える箇所:
- **タイトル**(`<title>`)
- **名前**(複数箇所)
- **肩書き**(Hero の subtitle)
- **About のテキスト**
- **Skills**(自分のスキルに)
- **Works**(架空でも、自分が作りたいものでもOK)
- **アバターの文字**(イニシャル)
- **コピーライト**

これで、**あなたのポートフォリオサイト**になります 🎉

---

# 公開する(発展)

作ったサイトを、**世界に公開**してみましょう!

## GitHub Pages で無料公開

最も簡単な方法は **GitHub Pages**。

### 手順(概要)

1. GitHub アカウントを作る(無料)
2. リポジトリを作る(`username.github.io` という名前)
3. 作ったファイル(`index.html`、`style.css`、`app.js`)をアップロード
4. リポジトリの Settings → Pages で「Deploy from a branch」を選択
5. しばらくすると `https://username.github.io/` でアクセス可能に

詳しい手順は GitHub の公式ドキュメントで:
**https://docs.github.com/ja/pages/quickstart**

### その他の選択肢

- **Vercel**(https://vercel.com): 無料で高機能、React にも対応
- **Netlify**(https://www.netlify.com): 同じく無料、フォーム機能あり

これらは Day 9 のスコープを超えますが、「**公開する**」という体験ができると Web 開発のモチベーションが格段に上がります。

---

# 🎉 参考資料(Day 8〜9)完了!

参考資料の Day 8〜9 を完走しました。お疲れさまでした!

HTML/CSS 編(Day 1〜7)の修了に加えて、**JS だけで動くアプリを 1 つ完成させた**経験は、TypeScript 本編に進む上で大きな自信になります。

## ここで身につけたこと(JS との統合)

- ✅ `querySelector` / `addEventListener`
- ✅ `classList.toggle`
- ✅ `localStorage` で永続化
- ✅ `<dialog>` を JS で開閉
- ✅ `aria-expanded` / `aria-current`
- ✅ イベント委譲

これらはすべて **TypeScript 本編の第13章以降** で再登場します。そのときは「型がついた版」として、より安全に同じことを書けるようになります。

## 次のステップ

おめでとうございます!ここから先は **TypeScript 本編(全20章)** に進みましょう。

```
1. HTML/CSS 超速習(Day 1〜7)         ✅ 完了!
2. (参考) HTML/CSS/JS 統合(Day 8〜9)  ✅ 完了!
3. TypeScript 本編(全20章)           ← 次はここ
```

TypeScript 本編では、今日作った ToDo アプリを **TypeScript + React + Tailwind** で書き直す章(第13〜16章)も登場します。「同じアプリが、型と React でどう変わるのか」を肌で感じられるはずです。

---

## 学習プランの活用法

このプランは「**1回読んで終わり**」ではありません。**辞書のように**使ってください。

- 「Flexbox の `justify-content` どう書くんだっけ?」 → Day 5
- 「ダークモード対応の書き方は?」 → Day 7 と Day 8
- 「フォームの validation どうやるんだっけ?」 → Day 3
- 「`:has()` の実用例は?」 → Day 7

実務でも、業界トップエンジニアでも、**毎日何かしら検索しながら**書いています。「**忘れたら見返す**」を恥じる必要はありません。

---

## おすすめの次の参考書(中級・上級向け)

将来、もっと深く学びたくなったら:

### 日本語書籍

- **Mana 著『1冊ですべて身につくHTML&CSSとWebデザイン入門講座』改訂版**(SBクリエイティブ): 累計40万部、定番中の定番
- **『初心者からちゃんとしたプロになるHTML+CSS標準入門 改訂2版』**(MdN): 9 Lesson で段階的に
- **狩野祐東 著『教科書では教えてくれないHTML&CSS』**(技術評論社): 中級向け、レスポンシブテンプレート作成

### Webリソース

- **MDN Web Docs(日本語版)**: https://developer.mozilla.org/ja - リファレンスの絶対王者
- **Web.dev**(Google): https://web.dev - 最新情報
- **State of CSS**: https://stateofcss.com - 業界トレンド調査
- **Can I Use**: https://caniuse.com - ブラウザサポート確認

### 練習サイト

- **Flexbox Froggy**: https://flexboxfroggy.com/ja/ - Flexbox の練習(日本語あり)
- **Grid Garden**: https://cssgridgarden.com - Grid の練習
- **Frontend Mentor**: https://www.frontendmentor.io - 実装課題が豊富

---

> 🎯 **修了の言葉**
>
> 参考資料まで含めて完走、本当にお疲れさまでした。
>
> 学習を始める前、あなたは「**HTML すら書いたことがない**」状態だったかもしれません。今、**完全に動くWebアプリ**と**自分のポートフォリオ**を作れました。
>
> これは小さなことに見えるかもしれませんが、**人類の歴史で、これが「個人で」できるようになったのは過去20年の話**です。Web という技術は、あなたの**創造力を世界に届ける道具**。今、その道具を手にしたばかり。
>
> ここから先、TypeScript、React、Tailwind、Next.js… と進んでいくと、**もっと複雑で、もっと面白いもの**が作れるようになります。でも、**今日作った ToDo とポートフォリオ**は、いつまでも **「最初に動いたWebアプリ**」 として、あなたのキャリアの中で特別な意味を持ち続けるはずです。
>
> 「**プログラミングは難しい**」とよく言われます。確かに、覚えることは多い。でも、**正しい順番で、楽しみながら学べば、誰でも到達できる**ということを、あなたは証明しました。
>
> 続けてください。詰まったら本資料に戻ってきても OK。エラーに泣かされる日もあるでしょう。でも、その先にある「**動いた!**」の喜びは、何度味わっても色褪せません。
>
> ようこそ、Web 開発の世界へ。
>
> あなたの作品が、誰かの役に立つ日を楽しみにしています。
>
> 良いコーディングを ☕

---

🎉🎉🎉
