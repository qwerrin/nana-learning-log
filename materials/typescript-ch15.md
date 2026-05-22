# 第15章 React + TypeScript 応用

## この章のゴール

- `useEffect` でサイドエフェクトを扱える
- `useEffect` の依存配列を正しく理解する
- カスタムフックで処理を再利用できる
- コンポーネントを適切に分割できる
- Props として関数を渡すパターンを使いこなせる
- 第14章の ToDo アプリを完成形に仕上げる

**所要時間の目安: 3時間**

---

## 0. この章の準備

第14章で作った `04-react/` プロジェクトをそのまま使います。

```bash
cd typescript-learning/04-react
npm run dev
```

---

## 1. useEffect — サイドエフェクト(40分)

### 1-1. サイドエフェクトとは

React コンポーネントの主な仕事は「**状態に応じた JSX を返す**」ことです。しかしそれ以外にも、

- API からデータを取得する
- タイマーをセット/クリアする
- ブラウザのタイトルを変更する
- `localStorage` に保存する

などの「**副作用(サイドエフェクト)**」が必要になります。これらを安全に扱うのが `useEffect` です。

### 1-2. useEffect の基本

```tsx
import { useEffect } from "react";

function TitleChanger({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | MyApp`;

    // クリーンアップ関数(コンポーネントが消えるとき実行)
    return () => {
      document.title = "MyApp";
    };
  }, [title]);  // ← 依存配列

  return <h1>{title}</h1>;
}
```

### 1-3. ⭐ 依存配列の3パターン

依存配列は `useEffect` の動作を決める重要な部分です。

```tsx
// パターン1: [] — 空配列 → コンポーネントのマウント時に1回だけ実行
useEffect(() => {
  fetchInitialData();
}, []);

// パターン2: [value] — 値の変化を監視 → value が変わるたびに実行
useEffect(() => {
  document.title = title;
}, [title]);

// パターン3: 省略 → 毎回のレンダリングで実行(ほぼ使わない)
useEffect(() => {
  console.log("レンダリングされた");
});
```

**初学者がよく間違える点**: 依存配列の中には、`useEffect` の中で使っている**すべての変数・関数**を入れる必要があります。eslint-plugin-react-hooks の `exhaustive-deps` ルールが自動チェックしてくれます。

### 1-4. ⭐ 実用例: API からデータ取得

```tsx
import { useState, useEffect } from "react";

type Post = { id: number; title: string; body: string };

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;  // クリーンアップ用フラグ

    const fetchPosts = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: unknown = await res.json();

        if (!cancelled && Array.isArray(data)) {
          setPosts(data as Post[]);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "エラーが発生しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();

    return () => { cancelled = true; };  // クリーンアップ
  }, []);  // マウント時に1回

  if (loading) return <p>読み込み中...</p>;
  if (error)   return <p style={{ color: "red" }}>エラー: {error}</p>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <strong>{post.title}</strong>
        </li>
      ))}
    </ul>
  );
}
```

**`cancelled` フラグ**は重要です。コンポーネントがアンマウントされた後に非同期処理が完了したとき、`setState` を呼ぶとメモリリークやエラーになります。

### 1-5. 実用例: localStorage との同期

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);  // key か value が変わったら保存

  return [value, setValue] as const;
}

// 使い方
function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      現在のテーマ: {theme}
    </button>
  );
}
```

`useState` の初期値に**関数**を渡すと、初回マウント時だけ実行されます(遅延初期化)。`localStorage` のような重い初期化に使います。

### 🔧 ミニ演習1

`useEffect` を使って、カウントが変わるたびにブラウザのタイトルを `カウント: N` に更新するコンポーネントを作ってください。

<details>
<summary>解答例</summary>

```tsx
import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `カウント: ${count}`;
    return () => { document.title = "MyApp"; };
  }, [count]);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

function App() {
  return <Counter />;
}
export default App;
```

ブラウザのタブを見ながら操作してみてください。

</details>

---

## 2. ⭐ カスタムフック(35分)

### 2-1. カスタムフックとは

「**`use` で始まる関数の中でフックを使う**」ことでロジックを再利用できます。

```tsx
// カスタムフックの例: カウンターのロジックを切り出す
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset     = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};

// 使う
function Counter() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
}
```

`useCounter` を別のコンポーネントでも使えます。**ロジックをコンポーネントから分離**して再利用できるのがカスタムフックの価値。

### 2-2. ⭐ useFetch カスタムフック

API 取得のロジックを汎用化します。

```tsx
import { useState, useEffect } from "react";

type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

const useFetch = <T>(url: string): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: unknown = await res.json();
        if (!cancelled) setState({ status: "success", data: data as T });
      } catch (e) {
        if (!cancelled) {
          setState({
            status: "error",
            message: e instanceof Error ? e.message : "不明なエラー",
          });
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return state;
};

// 使い方
type User = { id: number; name: string; email: string };

function UserProfile({ id }: { id: number }) {
  const result = useFetch<User>(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  switch (result.status) {
    case "loading": return <p>読み込み中...</p>;
    case "error":   return <p>エラー: {result.message}</p>;
    case "success": return (
      <div>
        <h2>{result.data.name}</h2>
        <p>{result.data.email}</p>
      </div>
    );
  }
}
```

`FetchState<T>` の判別可能ユニオン(第10章・第12章)と組み合わせて、型安全な非同期フックが完成。

### 2-3. useInput カスタムフック

フォームの入力管理を汎用化します。

```tsx
const useInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const reset = () => setValue(initialValue);

  return { value, onChange, reset };
};

// 使い方
function SignupForm() {
  const name    = useInput();
  const email   = useInput();
  const message = useInput();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name: name.value, email: email.value, message: message.value });
    name.reset();
    email.reset();
    message.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="名前" {...name} />
      <input placeholder="メール" type="email" {...email} />
      <textarea placeholder="メッセージ" {...message} />
      <button type="submit">送信</button>
    </form>
  );
}
```

`{...name}` で `{ value, onChange }` を一括で input に渡せます。

### 🔧 ミニ演習2

`useToggle` カスタムフックを作ってください。

- `useToggle(initialValue?: boolean)` → `[value: boolean, toggle: () => void]` を返す
- 使い方: `const [isOpen, toggleOpen] = useToggle(false)`

<details>
<summary>解答例</summary>

```tsx
const useToggle = (initialValue = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
};

// 使い方
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>
        {title} {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

function App() {
  return (
    <Accordion title="詳細を見る">
      <p>ここが開閉するコンテンツです。</p>
    </Accordion>
  );
}
export default App;
```

戻り値を `as const` タプルにすることで、分割代入した変数の型が正しく推論されます。

</details>

---

## 3. コンポーネントの設計(25分)

### 3-1. コンポーネント分割の基準

コンポーネントをいつ分割するかの目安:

1. **同じUIが複数回登場する** → 再利用できるコンポーネントに
2. **コンポーネントが大きくなった** → 100行が目安
3. **別の関心事が混ざっている** → 表示と状態管理を分ける

```
App
├── Header
├── TodoForm
│   └── (フォームのロジックだけ)
├── TodoList
│   └── TodoItem × N
└── Footer
```

### 3-2. ⭐ 関数を Props として渡す

子コンポーネントから親の状態を更新するには、**関数を Props として渡す**のが React の流儀です。

```tsx
// 親が状態と更新関数を持つ
type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => (
  <ul>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ))}
  </ul>
);
```

この「**データは上から、イベントは下から**」というデータフローが React の基本設計思想です。

### 3-3. 状態はどこに置くか

```
ルール: 「その状態を使うコンポーネントすべての最も近い共通の祖先」に置く

例:
- 1つのコンポーネントだけが使う → そのコンポーネントに
- 兄弟コンポーネントが共有する → 親コンポーネントに引き上げる(リフトアップ)
- アプリ全体が使う → 最上位のコンポーネントや Context に
```

---

## 4. 章末演習: ToDo アプリの完成形(45分)

第14章の ToDo アプリを、コンポーネント分割・カスタムフック・useEffect を使って完成形に仕上げます。

### 4-1. ファイル構成

```
src/
├── App.tsx
├── types.ts            ← 型定義
├── hooks/
│   └── useTodos.ts     ← ToDoのロジック
└── components/
    ├── TodoForm.tsx
    ├── TodoList.tsx
    └── TodoItem.tsx
```

### 4-2. types.ts

```typescript
// src/types.ts
export type Priority = "high" | "medium" | "low";

export type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
};
```

### 4-3. hooks/useTodos.ts

```typescript
// src/hooks/useTodos.ts
import { useState, useEffect } from "react";
import type { Todo, Priority } from "../types";

const STORAGE_KEY = "todos-react-v1";

const loadFromStorage = (): Todo[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const data: unknown = JSON.parse(json);
    return Array.isArray(data) ? (data as Todo[]) : [];
  } catch {
    return [];
  }
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);
  const [nextId, setNextId] = useState(() => {
    const stored = loadFromStorage();
    return stored.length > 0
      ? Math.max(...stored.map(t => t.id)) + 1
      : 1;
  });

  // 変更があったら localStorage に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, priority: Priority): void => {
    setTodos(prev => [...prev, { id: nextId, title, done: false, priority }]);
    setNextId(n => n + 1);
  };

  const toggleTodo = (id: number): void => {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = (): void => {
    setTodos(prev => prev.filter(t => !t.done));
  };

  const pendingCount = todos.filter(t => !t.done).length;

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, pendingCount };
};
```

### 4-4. components/TodoForm.tsx

```tsx
// src/components/TodoForm.tsx
import { useState, useRef } from "react";
import type { Priority } from "../types";

type TodoFormProps = {
  onAdd: (title: string, priority: Priority) => void;
};

export const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd(trimmed, priority);
    setTitle("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力"
        style={{ flex: 1, padding: "0.5rem", borderRadius: 6, border: "1px solid #d1d5db" }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        style={{ padding: "0.5rem", borderRadius: 6 }}
      >
        <option value="high">🔴 高</option>
        <option value="medium">🟡 中</option>
        <option value="low">🟢 低</option>
      </select>
      <button type="submit">追加</button>
    </form>
  );
};
```

> **`e.target.value as Priority`** について
> `<select>` の `value` は `string` 型ですが、選択肢を `Priority` の値に限定しているので `as Priority` で安全にキャストできます。

### 4-5. components/TodoItem.tsx

```tsx
// src/components/TodoItem.tsx
import type { Todo } from "../types";

const priorityLabel: Record<Todo["priority"], string> = {
  high:   "🔴",
  medium: "🟡",
  low:    "🟢",
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <li style={{
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 0.5rem",
    borderBottom: "1px solid #f3f4f6",
    opacity: todo.done ? 0.6 : 1,
  }}>
    <span>{priorityLabel[todo.priority]}</span>
    <span
      onClick={() => onToggle(todo.id)}
      style={{
        flex: 1,
        cursor: "pointer",
        textDecoration: todo.done ? "line-through" : "none",
      }}
    >
      {todo.title}
    </span>
    <button
      onClick={() => onDelete(todo.id)}
      style={{ background: "#ef4444", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: 4, cursor: "pointer" }}
      aria-label={`${todo.title}を削除`}
    >
      ✕
    </button>
  </li>
);
```

### 4-6. components/TodoList.tsx

```tsx
// src/components/TodoList.tsx
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return <p style={{ color: "#9ca3af", textAlign: "center" }}>タスクがありません 🎉</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
```

### 4-7. App.tsx

```tsx
// src/App.tsx
import { useTodos } from "./hooks/useTodos";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, pendingCount } = useTodos();

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>📋 ToDo アプリ</h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        {pendingCount} 件の未完了 / 全 {todos.length} 件
      </p>

      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      {todos.some(t => t.done) && (
        <button
          onClick={clearCompleted}
          style={{ marginTop: "1rem", color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          完了済みをすべて削除
        </button>
      )}
    </div>
  );
}

export default App;
```

### 4-8. 動作確認

1. タスクを追加(優先度付き)
2. タイトルをクリックして完了/未完了切り替え
3. 削除ボタンで削除
4. ページをリロードしてもタスクが残っている
5. 完了済みをまとめて削除

---

## 5. この章のまとめ

### 覚えておきたいこと

1. **`useEffect(fn, [])`** はマウント時に1回だけ。`[value]` は value が変わるたびに実行
2. **クリーンアップ関数**でタイマーや非同期処理のキャンセルをする
3. **カスタムフック**は `use` で始まる関数。ロジックを分離・再利用できる
4. **コンポーネント分割**の目安: 再利用・100行超え・関心の分離
5. **「データは上から、イベントは下から」** — 関数を Props として渡す
6. 状態は「使うコンポーネントすべての最も近い共通の祖先」に置く

### 確認問題

<details>
<summary>Q1. useEffect の依存配列 [] と省略の違いは?</summary>

- `[]`(空配列): マウント時に**1回だけ**実行
- 省略: **毎回のレンダリング後**に実行(ほぼ使わない)
- `[value]`: `value` が変わるたびに実行
</details>

<details>
<summary>Q2. カスタムフックと普通の関数の違いは?</summary>

カスタムフックは `use` で始まり、**内部で React のフックを使える**点が違います。普通の関数の中でフックを使うとルール違反(Hooks のルール)になりますが、カスタムフックの中なら使えます。
</details>

<details>
<summary>Q3. 子コンポーネントから親の状態を更新するにはどうするか?</summary>

親が状態更新関数を**Props として子に渡します**。子はその関数を呼ぶだけで、直接状態を持ちません。これが React の「データは上から、イベントは下から」というデータフローです。
</details>

---

## 次の章へ

第15章で **React の応用**をマスターしました。次の第16章では **Tailwind CSS** を導入します。今まで書いてきたインラインスタイルを Tailwind のクラスで書き直し、より素早く美しい UI を作れるようになります。

---

> 🎯 **コラム: カスタムフックはテストしやすい**
>
> `useTodos` のようにロジックをカスタムフックに切り出すと、**コンポーネントとは独立してテストできる**というメリットがあります。
>
> ```typescript
> // カスタムフックのテスト(jest + @testing-library/react-hooks)
> const { result } = renderHook(() => useTodos());
>
> act(() => result.current.addTodo("テスト", "high"));
> expect(result.current.todos).toHaveLength(1);
> ```
>
> UI とロジックを分離することで、UI が変わってもロジックのテストは壊れません。規模が大きくなるほどこの恩恵が大きくなります。
>
> 今の段階ではテストを書かなくても問題ありませんが、「**ロジックを分離する習慣**」は最初から身につけておくと後で困りません。

お疲れさまでした!次の第16章で会いましょう ☕
