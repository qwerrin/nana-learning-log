# 第13章 DOM・Fetch・Vite

## この章のゴール

- Vite で TypeScript の Web プロジェクトを立ち上げられる
- DOM 操作の型(`HTMLElement | null` など)を扱える
- `querySelector<T>` のジェネリクスを使える
- イベントハンドラに型をつけられる
- `fetch` + `unknown` + 型ガードで API データを安全に扱える
- `localStorage` で状態を永続化できる
- 動く ToDo アプリを完成させる

**所要時間の目安: 3時間**

---

## 0. この章の位置づけ

ここまで TypeScript を**コンソールで動くコード**で学んできました。第13章からは**ブラウザで動く実際のWebアプリ**を作ります。

この章では**素の TypeScript**でDOMを操作します。次の第14章で同じアプリをReactで書き直すので、「素のDOMとReactの差」を肌で感じられます。

---

## 1. Vite でプロジェクトを作る(20分)

### 1-1. Vite とは

**Vite(ヴィート)** はフランス語で「速い」を意味する、現代Webフロント開発で最も人気のあるビルドツールです。

主な役割:
- TypeScript をブラウザで動くJSに変換
- ファイル保存で**即座に画面が更新**(HMR)
- `npm run build` で本番用ファイルを生成

`tsx`(サーバー側でTS実行) と Vite(ブラウザ向けにTSをビルド)は別物です。

### 1-2. プロジェクトの作成

```bash
cd typescript-learning
npm create vite@latest 03-frontend -- --template vanilla-ts
cd 03-frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173/` を開くと初期ページが表示されます。

### 1-3. フォルダ構成

```
03-frontend/
├── index.html        ← HTMLのエントリポイント
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts       ← TSのエントリポイント
    └── style.css
```

### 1-4. まっさらな状態にする

`src/main.ts` を次の内容に置き換えます。

```typescript
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<h1>TypeScript DOM入門</h1>`;
```

`src/style.css` は最低限に。

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
}
```

---

## 2. DOM 操作の型(35分)

### 2-1. getElementById の戻り値

```typescript
const el = document.getElementById("title");
// 型: HTMLElement | null
```

`HTMLElement | null` — 要素が見つかれば `HTMLElement`、なければ `null` のユニオン型。

```typescript
el.textContent = "新しいタイトル";
// ❌ 'el' is possibly 'null'.
```

`null` の可能性があるので、そのまま使えません。

### 2-2. null を処理する方法

```typescript
// 方法1: if チェック(安全)
if (el) {
  el.textContent = "新しいタイトル";
}

// 方法2: 非nullアサーション(HTMLに必ずある要素なら許容)
const el2 = document.getElementById("title")!;
el2.textContent = "新しいタイトル";
```

`!` は「絶対に null ではない」と TypeScript に伝えます。**HTMLに必ず書いてある要素**なら許容されますが、乱用は禁物。

### 2-3. ⭐ querySelector とジェネリクス

```typescript
// ジェネリクスなし → HTMLElement | null
const input1 = document.querySelector("#username");

// ジェネリクスあり → HTMLInputElement | null
const input2 = document.querySelector<HTMLInputElement>("#username");

if (input2) {
  console.log(input2.value);  // ✅ HTMLInputElement の value が使える
}
```

特定の HTML 要素を扱うときは**ジェネリクスで型を指定**する習慣を。

### 2-4. 主な HTML 要素の型

| HTML 要素 | TypeScript の型 |
|---|---|
| `<input>` | `HTMLInputElement` |
| `<button>` | `HTMLButtonElement` |
| `<form>` | `HTMLFormElement` |
| `<div>` | `HTMLDivElement` |
| `<ul>` / `<ol>` | `HTMLUListElement` / `HTMLOListElement` |
| `<li>` | `HTMLLIElement` |
| `<select>` | `HTMLSelectElement` |
| `<textarea>` | `HTMLTextAreaElement` |

法則: `HTML〇〇Element`。VS Code の補完で確認できます。

### 2-5. 要素の作成

```typescript
const btn = document.createElement("button");
// 型: HTMLButtonElement (タグ名から自動推論)

btn.textContent = "クリック";
btn.disabled = true;   // HTMLButtonElement のプロパティが使える
```

### 🔧 ミニ演習1

`#app` に次を生成して、ボタンを取得して `disabled = true` にしてください。

```html
<h1>マイページ</h1>
<button id="myBtn">クリック</button>
```

<details>
<summary>解答例</summary>

```typescript
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>マイページ</h1>
  <button id="myBtn">クリック</button>
`;

const btn = document.querySelector<HTMLButtonElement>("#myBtn");
if (btn) {
  btn.disabled = true;
}
```

</details>

---

## 3. イベントハンドラの型(25分)

### 3-1. addEventListener の型推論

イベント名から**自動的にイベント型が推論**されます。

```typescript
const btn = document.querySelector<HTMLButtonElement>("#myBtn")!;

btn.addEventListener("click", (event) => {
  // event の型: MouseEvent (自動推論)
  console.log(event.clientX, event.clientY);
});
```

### 3-2. 主なイベント型

| イベント名 | 型 |
|---|---|
| `"click"` | `MouseEvent` |
| `"keydown"` / `"keyup"` | `KeyboardEvent` |
| `"input"` / `"change"` | `Event` |
| `"submit"` | `SubmitEvent` |
| `"focus"` / `"blur"` | `FocusEvent` |

### 3-3. ⭐ event.target vs event.currentTarget

```typescript
const input = document.querySelector<HTMLInputElement>("#myInput")!;

// event.target の型は EventTarget | null (広すぎる)
input.addEventListener("input", (event) => {
  console.log(event.target.value);
  // ❌ Property 'value' does not exist on type 'EventTarget'
});

// event.currentTarget は登録した要素の型が正しく推論される
input.addEventListener("input", (event) => {
  console.log(event.currentTarget.value);  // ✅ HTMLInputElement
});
```

**使い分け**:
- **`currentTarget`**: ハンドラを登録した要素。型が正確。通常はこちら
- **`target`**: 実際にイベントが発生した要素。イベント委譲で使う

`target` を使いたい場合は絞り込みが必要です。

```typescript
// 方法1: instanceof で絞り込む(安全)
input.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    console.log(event.target.value);  // ✅
  }
});

// 方法2: 型アサーション(実務では多い)
input.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
});
```

### 3-4. フォームの送信

```typescript
const form = document.querySelector<HTMLFormElement>("#myForm")!;

form.addEventListener("submit", (event) => {
  event.preventDefault();  // ページリロードを止める

  const input = document.querySelector<HTMLInputElement>("#username")!;
  console.log(input.value);
});
```

### 🔧 ミニ演習2

入力欄に文字を打つと、リアルタイムで下に表示されるアプリを作ってください。

```html
<input id="nameInput" type="text" placeholder="名前を入力">
<p id="display"></p>
```

<details>
<summary>解答例</summary>

```typescript
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <input id="nameInput" type="text" placeholder="名前を入力">
  <p id="display"></p>
`;

const input = document.querySelector<HTMLInputElement>("#nameInput")!;
const display = document.querySelector<HTMLParagraphElement>("#display")!;

input.addEventListener("input", (event) => {
  display.textContent = `こんにちは、${event.currentTarget.value}さん!`;
});
```

</details>

---

## 4. fetch で API からデータを取得(30分)

第8章で学んだ `fetch` をブラウザで実際に使います。

### 4-1. JSONPlaceholder

`https://jsonplaceholder.typicode.com` は学習用の無料テスト API です。

```
GET /posts          → 投稿一覧(100件)
GET /users          → ユーザー一覧(10件)
GET /users/1/todos  → ユーザー1の ToDo リスト
```

### 4-2. 投稿一覧を取得して表示する

```typescript
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>投稿一覧</h1>
  <button id="loadBtn">読み込む</button>
  <div id="posts"></div>
`;

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// 型ガード
const isPost = (v: unknown): v is Post =>
  typeof v === "object" && v !== null && "id" in v && "title" in v && "body" in v;

// API 呼び出し
const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: unknown = await res.json();  // unknown で受ける

  if (!Array.isArray(data) || !data.every(isPost)) {
    throw new Error("不正なレスポンス形式");
  }
  return data;
};

// 描画
const renderPosts = (posts: Post[]): void => {
  const container = document.querySelector<HTMLDivElement>("#posts")!;
  container.innerHTML = posts
    .slice(0, 5)
    .map(p => `<article><h3>${p.title}</h3><p>${p.body}</p></article>`)
    .join("");
};

// イベント
const btn = document.querySelector<HTMLButtonElement>("#loadBtn")!;
btn.addEventListener("click", async () => {
  btn.disabled = true;
  btn.textContent = "読み込み中...";

  try {
    const posts = await fetchPosts();
    renderPosts(posts);
  } catch (error) {
    if (error instanceof Error) alert(`エラー: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = "読み込む";
  }
});
```

このコードには Phase 2 で学んだ要素が全部入っています:
- `Post` 型エイリアス(第9章)
- 型ガード `isPost`(第12章)
- `unknown` で受ける(第8章)
- `instanceof Error`(第6章)
- ジェネリクス `querySelector<T>`(第11章)

---

## 5. 章末演習: ToDo アプリを作る(50分)

これまでの集大成として、ブラウザで動く ToDo アプリを完成させます。

### 5-1. 完成形の機能

- フォームで ToDo を追加
- タイトルをクリックで完了/未完了切り替え
- 削除ボタン
- `localStorage` で永続化(リロードしても残る)

### 5-2. HTML と CSS

`src/main.ts` の先頭でHTML全体を生成します。

```typescript
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>📋 ToDo アプリ</h1>
  <form id="todoForm">
    <input type="text" id="todoInput" placeholder="新しいタスクを入力" required>
    <button type="submit">追加</button>
  </form>
  <ul id="todoList"></ul>
  <p id="empty" style="display:none; color:#888">タスクがありません 🎉</p>
`;
```

`src/style.css`:

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 560px;
  margin: 2rem auto;
  padding: 0 1rem;
}

#todoForm {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

#todoInput {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

#todoList {
  list-style: none;
  padding: 0;
  margin: 0;
}

#todoList li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

#todoList li.done .title {
  text-decoration: line-through;
  color: #9ca3af;
}

#todoList .title {
  flex: 1;
  cursor: pointer;
}

#todoList .delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
```

### 5-3. TypeScript — 完全なコード

```typescript
// 型定義
type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
};

// ===== localStorage での永続化 =====
const STORAGE_KEY = "todos-v1";

const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const loadTodos = (): Todo[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const data: unknown = JSON.parse(json);
    if (Array.isArray(data)) return data as Todo[];
  } catch {
    // JSON が壊れていたら空で始める
  }
  return [];
};

// ===== 状態 =====
let todos: Todo[] = loadTodos();
let nextId = todos.length > 0
  ? Math.max(...todos.map(t => t.id)) + 1
  : 1;

// ===== 要素取得 =====
const form   = document.querySelector<HTMLFormElement>("#todoForm")!;
const input  = document.querySelector<HTMLInputElement>("#todoInput")!;
const list   = document.querySelector<HTMLUListElement>("#todoList")!;
const empty  = document.querySelector<HTMLParagraphElement>("#empty")!;

// ===== 描画 =====
const render = (): void => {
  list.innerHTML = todos
    .map(todo => `
      <li class="${todo.done ? "done" : ""}" data-id="${todo.id}">
        <span class="title">${escapeHtml(todo.title)}</span>
        <button class="delete" data-id="${todo.id}" aria-label="削除">✕</button>
      </li>
    `)
    .join("");

  empty.style.display = todos.length === 0 ? "block" : "none";
};

// XSS 対策
const escapeHtml = (str: string): string => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

// ===== 操作 =====
const addTodo = (title: string): void => {
  todos.push({ id: nextId++, title, done: false });
  saveTodos(todos);
  render();
};

const toggleTodo = (id: number): void => {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos(todos);
    render();
  }
};

const deleteTodo = (id: number): void => {
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  render();
};

// ===== イベント =====

// フォーム送信
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (title) {
    addTodo(title);
    input.value = "";
    input.focus();
  }
});

// リスト操作(イベント委譲)
list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const id = Number(target.dataset.id);
  if (!id) return;

  if (target.classList.contains("delete")) {
    deleteTodo(id);
  } else if (target.classList.contains("title")) {
    const li = target.closest("li");
    if (li instanceof HTMLLIElement) {
      toggleTodo(Number(li.dataset.id));
    }
  }
});

// ===== 初期描画 =====
render();
```

### 5-4. 動作確認

1. 入力欄に「牛乳を買う」と打って追加 → リストに表示
2. タイトルをクリック → 取り消し線
3. 削除ボタン → 消える
4. リロード → 状態が維持されている

🎉 **ブラウザで動く TypeScript 製 ToDo アプリ完成!**

### 5-5. このコードのポイント解説

**イベント委譲**:
```typescript
list.addEventListener("click", (event) => { ... });
```
`<ul>` 全体に1つのリスナーを登録し、`event.target` でどの要素がクリックされたか判定します。ToDo を追加するたびにリスナーを付け直さなくて済みます。

**`escapeHtml` による XSS 対策**:
```typescript
const div = document.createElement("div");
div.textContent = str;
return div.innerHTML;
```
ユーザー入力をそのまま `innerHTML` に使うと、`<script>` タグが実行される危険があります。`textContent` に入れることで自動的にエスケープされます。

---

## 6. この章のまとめ

### 覚えておきたいこと

1. **Vite** でブラウザ向け TypeScript プロジェクトを立ち上げる
2. **`querySelector<T>`** のジェネリクスで要素に正確な型をつける
3. **`getElementById` の戻り値は `HTMLElement | null`** — null チェックが必要
4. **`event.currentTarget`** は型が正確。`event.target` は絞り込みが必要
5. **`fetch` の結果は `unknown` で受けて型ガードで検証**
6. **`localStorage`** は文字列のみ — `JSON.stringify`/`JSON.parse` とセットで使う
7. **`innerHTML` にユーザー入力を直接使わない** — `escapeHtml` でエスケープ

### 確認問題

<details>
<summary>Q1. querySelector のジェネリクスを使う理由は?</summary>

ジェネリクスなしでは戻り値が `HTMLElement | null` になり、特定の要素固有のプロパティ(例: `input.value`、`button.disabled`)を使えません。`querySelector<HTMLInputElement>` と指定すると `HTMLInputElement | null` になり、型補完が効いて安全に使えます。
</details>

<details>
<summary>Q2. event.target と event.currentTarget の違いは?</summary>

- `event.target`: 実際にイベントが発生した要素。型は `EventTarget | null`
- `event.currentTarget`: ハンドラを登録した要素。型が正しく推論される

自分が登録した要素を扱うなら `currentTarget`。イベント委譲で子要素を判定するなら `target` を `instanceof` で絞り込みます。
</details>

<details>
<summary>Q3. innerHTML にユーザー入力を直接使うとなぜ危険か?</summary>

XSS(クロスサイトスクリプティング)攻撃の危険があります。ユーザーが `<script>alert('攻撃')</script>` のような文字列を入力すると、そのまま実行されてしまいます。`textContent` に入れてから `innerHTML` を使うとエスケープされて安全になります。
</details>

---

## 次の章へ

第13章で**ブラウザで動く TypeScript アプリ**を作れるようになりました。次の第14章では、**React + TypeScript** を学びます。この章で書いた ToDo アプリを React で書き直すことで、素の DOM 操作との違いが体感できます。

---

> 🎯 **コラム: 素の DOM と React の違い**
>
> この章で書いたコードを振り返ると:
>
> ```typescript
> // 状態が変わるたびに、自分で render() を呼ぶ必要がある
> todos.push(newTodo);
> render();  // ← 手動で再描画
> ```
>
> React では:
>
> ```tsx
> const [todos, setTodos] = useState<Todo[]>([]);
> setTodos([...todos, newTodo]);  // 自動的に再描画
> ```
>
> **状態を更新するだけで画面が自動更新**されます。
>
> また `escapeHtml` のような XSS 対策も React は自動でやってくれます。今この章で「手動でやること」を経験したことで、React が何を解決しているかが明確に分かります。

お疲れさまでした!次の第14章で会いましょう ☕
