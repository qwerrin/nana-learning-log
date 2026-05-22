# 第14章 React + TypeScript 基礎

## この章のゴール

- Vite で React + TypeScript プロジェクトを立ち上げられる
- JSX の基本を理解する
- 関数コンポーネントに Props の型をつけられる
- `useState` を型安全に使える
- React のイベントハンドラに正しい型をつけられる
- `children` を持つコンポーネントを書ける
- `useRef` で DOM 要素を操作できる
- 第13章の ToDo アプリを React で書き直せる

**所要時間の目安: 3時間**

---

## 0. この章の準備

```bash
cd typescript-learning
npm create vite@latest 04-react -- --template react-ts
cd 04-react
npm install
npm run dev
```

ブラウザで `http://localhost:5173/` を開くと Vite + React のサンプルが表示されます。

### 0-1. クリーンな状態にする

`src/App.tsx` を次に置き換えます。

```tsx
function App() {
  return (
    <div>
      <h1>React + TypeScript 入門</h1>
    </div>
  );
}

export default App;
```

`src/App.css` は削除するか空にします。

### 0-2. 拡張子 .tsx について

React プロジェクトでは `.tsx` を使います。`.ts` + JSX(HTML のような構文)が書けます。

---

## 1. JSX の基本(20分)

### 1-1. JSX とは

**TypeScript の中に HTML のような構文を書ける拡張**です。

```tsx
// JSX — HTML っぽいけど実は JavaScript の式
const element = <h1>Hello, React!</h1>;

// 式を埋め込む — {} の中は TypeScript
const name = "Alice";
const greeting = <p>こんにちは、{name}さん!</p>;

// 複数行は () で囲む
const card = (
  <div>
    <h2>タイトル</h2>
    <p>本文</p>
  </div>
);
```

### 1-2. JSX のルール

```tsx
// ✅ ルート要素は1つ
return (
  <div>
    <h1>タイトル</h1>
    <p>本文</p>
  </div>
);

// ✅ Fragment(<> </>) で余分な div を避ける
return (
  <>
    <h1>タイトル</h1>
    <p>本文</p>
  </>
);

// ❌ ルート要素が2つはNG
return (
  <h1>タイトル</h1>  // ← これは
  <p>本文</p>         // ←  NG
);
```

```tsx
// HTML と違う点
className="box"    // class → className
htmlFor="input"    // for → htmlFor
onClick={handler}  // イベントはキャメルケース
style={{ color: "red", fontSize: 16 }}  // style はオブジェクト
```

---

## 2. 関数コンポーネントと Props(35分)

### 2-1. 関数コンポーネントの基本

**React のコンポーネントは「JSX を返す関数」**。それだけです。

```tsx
// コンポーネント名は必ず PascalCase
const Greeting = () => {
  return <p>こんにちは!</p>;
};

// 短縮形
const Greeting = () => <p>こんにちは!</p>;
```

### 2-2. コンポーネントを使う

```tsx
const Greeting = () => <p>こんにちは!</p>;

function App() {
  return (
    <div>
      <h1>マイアプリ</h1>
      <Greeting />
      <Greeting />
      <Greeting />  {/* 3回表示 */}
    </div>
  );
}
```

### 2-3. ⭐ Props — コンポーネントへの引数

```tsx
// 型を定義
type GreetingProps = {
  name: string;
  greeting?: string;  // オプショナル
};

// 受け取る(分割代入 + デフォルト値)
const Greeting = ({ name, greeting = "こんにちは" }: GreetingProps) => {
  return <p>{greeting}、{name}さん!</p>;
};

// 使う
<Greeting name="Alice" />                  // → こんにちは、Aliceさん!
<Greeting name="Bob" greeting="やあ" />    // → やあ、Bobさん!
<Greeting name={123} />                    // ❌ string でない
<Greeting />                               // ❌ name が必須なのに省略
```

Props の型を定義することで、**渡し忘れや型違反がコンパイル時に検出**されます。React で TypeScript を使う最大のメリット。

### 2-4. React.FC は使わない

古い記事でよく見るパターンですが現代では非推奨です。

```tsx
// ❌ 古いスタイル
const Greeting: React.FC<GreetingProps> = ({ name }) => <p>{name}</p>;

// ✅ 現代のスタイル(本資料はこちら)
const Greeting = ({ name }: GreetingProps) => <p>{name}</p>;
```

理由: `React.FC` は暗黙的に `children` を許可し、ジェネリクスとの相性も悪いため。

### 🔧 ミニ演習1

`UserCard` コンポーネントを作ってください。

- `name: string`(必須)
- `age: number`(必須)
- `email?: string`(任意)

email があれば表示、なければ非表示。

<details>
<summary>解答例</summary>

```tsx
type UserCardProps = {
  name: string;
  age: number;
  email?: string;
};

const UserCard = ({ name, age, email }: UserCardProps) => (
  <div style={{ border: "1px solid #ccc", padding: "1em", margin: "0.5em" }}>
    <h2>{name}</h2>
    <p>年齢: {age}歳</p>
    {email && <p>メール: {email}</p>}
  </div>
);

function App() {
  return (
    <div>
      <UserCard name="Alice" age={30} email="alice@example.com" />
      <UserCard name="Bob" age={25} />
    </div>
  );
}
```

`{email && <p>...</p>}` は「email が truthy なら表示」の条件付きレンダリングです。

</details>

---

## 3. ⭐ useState — 状態を持つ(40分)

### 3-1. useState の基本

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  //     ↑現在値  ↑更新関数    ↑初期値

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**`setCount` を呼ぶと自動的に再描画**されます。これが React の核心。

### 3-2. useState の型

`useState` はタプルを返します(第5章で学んだタプルがここで活きる!)。

```tsx
const [count, setCount] = useState(0);
// count:    number       (初期値から推論)
// setCount: (n: number | ((prev: number) => number)) => void
```

初期値から型推論されるので、単純な場合は型注釈不要。

### 3-3. 型を明示すべきケース

```tsx
// ❌ 空配列は型が弱い(never[] と推論される)
const [items, setItems] = useState([]);

// ✅ ジェネリクスで型を明示
const [items, setItems] = useState<string[]>([]);

// ✅ 初期値が null だが後で別の型が入る場合
type User = { name: string; age: number };
const [user, setUser] = useState<User | null>(null);
```

### 3-4. ⭐ オブジェクトの更新

React では**元のオブジェクトを変更せず、新しいオブジェクトを作って渡す**のが基本。

```tsx
type Profile = { name: string; age: number };

function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({ name: "Alice", age: 30 });

  const incrementAge = () => {
    // ❌ 直接変更は NG(React が変化を検知できない)
    // profile.age++;

    // ✅ スプレッドで新しいオブジェクトを作る
    setProfile({ ...profile, age: profile.age + 1 });
  };

  return (
    <div>
      <p>{profile.name}: {profile.age}歳</p>
      <button onClick={incrementAge}>歳をとる</button>
    </div>
  );
}
```

### 3-5. 配列の更新

```tsx
const [tags, setTags] = useState<string[]>([]);

// 追加: スプレッドで新しい配列
setTags([...tags, "new-tag"]);

// 削除: filter で元の配列を変えない
setTags(tags.filter(t => t !== "old-tag"));

// 変更: map で元の配列を変えない
setTags(tags.map(t => t === "old" ? "new" : t));
```

`push`/`splice` のような**元の配列を変えるメソッドは使わない**のが React の流儀。

### 🔧 ミニ演習2

「いいねカウンター」を作ってください。

- 「いいね」ボタンでカウントが増える
- 「リセット」ボタンで 0 に戻る
- カウントが 10 以上で「🔥 人気!」を表示

<details>
<summary>解答例</summary>

```tsx
import { useState } from "react";

function LikeCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>いいね: {count}</h2>
      {count >= 10 && <p>🔥 人気!</p>}
      <button onClick={() => setCount(count + 1)}>👍 いいね</button>
      <button onClick={() => setCount(0)}>リセット</button>
    </div>
  );
}

function App() {
  return <LikeCounter />;
}
export default App;
```

</details>

---

## 4. ⭐ イベントハンドラの型(25分)

### 4-1. クリックイベント

```tsx
// インライン(推奨・型推論される)
<button onClick={(e) => console.log(e.clientX)}>クリック</button>

// ハンドラを分離する場合
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.clientX);
};
<button onClick={handleClick}>クリック</button>
```

インラインで書けば型は自動推論されます。実務ではインラインが圧倒的に多い。

### 4-2. ⭐ 入力イベント — フォームで頻出

```tsx
function Form() {
  const [name, setName] = useState("");

  return (
    <div>
      {/* インライン(推奨) */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>こんにちは、{name}さん</p>
    </div>
  );
}
```

React の `onChange` は**入力のたびに発火**(素の DOM の `input` イベント相当)します。

### 4-3. フォーム送信

```tsx
function SearchForm() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // ページリロードを防ぐ
    console.log("検索:", query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <button type="submit">検索</button>
    </form>
  );
}
```

### 4-4. イベント型の早見表

| イベント | 型 | 備考 |
|---|---|---|
| `onClick` | `React.MouseEvent<T>` | ほぼ推論される |
| `onChange` | `React.ChangeEvent<T>` | `e.target.value` を使う |
| `onSubmit` | `React.FormEvent<T>` | `e.preventDefault()` が必要 |
| `onKeyDown` | `React.KeyboardEvent<T>` | `e.key` で押されたキーを取得 |

`T` は `HTMLInputElement`、`HTMLButtonElement` など。インラインで書けば自動推論されます。

### 🔧 ミニ演習3

お問い合わせフォームを作ってください。

- 入力欄: 名前・メッセージ
- 送信で `alert("名前: xxx, メッセージ: yyy")`
- 送信後は入力をクリア

<details>
<summary>解答例</summary>

```tsx
import { useState } from "react";

function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`名前: ${name}, メッセージ: ${message}`);
    setName("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          名前:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          メッセージ:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
      </div>
      <button type="submit">送信</button>
    </form>
  );
}

function App() {
  return <ContactForm />;
}
export default App;
```

</details>

---

## 5. children と useRef(25分)

### 5-1. children — 中身を受け取るコンポーネント

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;  // 何でも入れられる型
};

const Card = ({ title, children }: CardProps) => (
  <div style={{ border: "1px solid #ccc", padding: "1em", borderRadius: 8 }}>
    <h2>{title}</h2>
    {children}
  </div>
);

// 使う
function App() {
  return (
    <Card title="お知らせ">
      <p>明日は休みです</p>
      <button>了解</button>
    </Card>
  );
}
```

`<Card>...</Card>` の中身が `children` として渡されます。**汎用ラッパーコンポーネント**を作るときに使います。

`React.ReactNode` は「React で描画できる何か」を表す型。JSX・文字列・数値・null など何でも入ります。

### 5-2. useRef — DOM 要素を参照する

DOM を直接操作したいとき(フォーカス・スクロールなど)に使います。

```tsx
import { useRef } from "react";

function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  //                     ↑型を指定          ↑初期値

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="テキスト入力" />
      <button onClick={() => inputRef.current?.focus()}>
        フォーカス
      </button>
    </div>
  );
}
```

- `useRef<HTMLInputElement>(null)` で型と初期値を指定
- `inputRef.current` が `HTMLInputElement | null` になる
- `?.` でオプショナルに安全アクセス

### 5-3. useState vs useRef

| | `useState` | `useRef` |
|---|---|---|
| 値が変わると再描画 | ✅ する | ❌ しない |
| 用途 | UI に表示する値 | DOM 参照、再描画不要な値 |

---

## 6. 章末演習: ToDo アプリを React で書き直す(45分)

第13章の素の DOM 版を React で書き直します。コードの変化を比べてみてください。

### 6-1. 完全なコード

`src/App.tsx`:

```tsx
import { useState, useRef } from "react";

type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
};

// ===== TodoItem コンポーネント =====
type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <li style={{ display: "flex", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
    <span
      onClick={() => onToggle(todo.id)}
      style={{
        flex: 1,
        cursor: "pointer",
        textDecoration: todo.done ? "line-through" : "none",
        color: todo.done ? "#9ca3af" : "inherit",
      }}
    >
      {todo.title}
    </span>
    <button
      onClick={() => onDelete(todo.id)}
      style={{ background: "#ef4444", color: "white", border: "none", padding: "0.3rem 0.6rem", borderRadius: 4, cursor: "pointer" }}
    >
      削除
    </button>
  </li>
);

// ===== App =====
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 追加
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    setTodos([...todos, { id: nextId, title, done: false }]);
    setNextId(nextId + 1);
    setInput("");
    inputRef.current?.focus();  // 追加後に入力欄にフォーカス
  };

  // 完了トグル
  const toggleTodo = (id: number) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  // 削除
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const pendingCount = todos.filter(t => !t.done).length;

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>📋 ToDo アプリ (React版)</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力"
          style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "1rem" }}
        />
        <button type="submit">追加</button>
      </form>

      {todos.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>タスクがありません 🎉</p>
      ) : (
        <>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            {pendingCount}件の未完了タスク (全{todos.length}件)
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
```

### 6-2. 第13章版との比較

| 項目 | 第13章(素の DOM) | 第14章(React) |
|---|---|---|
| 状態管理 | 変数 + `render()` を手動呼び出し | `useState` + 自動再描画 |
| イベント | `addEventListener` | JSX の `onClick`/`onChange` |
| 要素の更新 | `innerHTML` の書き換え | JSX で宣言的に記述 |
| XSS 対策 | `escapeHtml` が必要 | React が自動エスケープ |
| コンポーネント化 | 関数で分割 | `TodoItem` コンポーネント |

React 版では「**状態を更新するだけで自動的に画面が更新**」され、XSS 対策も自動です。

### 6-3. key Props について

```tsx
{todos.map(todo => (
  <TodoItem key={todo.id} ... />
))}
```

リストを `map` でレンダリングするとき、**`key` は必須**です。React が各要素を識別するために使います。

- ✅ `key={todo.id}` — ユニークなIDが最適
- ❌ `key={index}` — 順序が変わるとバグの原因になるので避ける

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **関数コンポーネント** = JSX を返す関数。名前は PascalCase
2. **Props の型** は `type XXXProps = {...}` で定義。分割代入で受け取る
3. **`React.FC` は使わない** — Props を引数で型注釈するシンプルなスタイルが現代の主流
4. **`useState<T>(初期値)`** で状態を持つ。`setXxx` を呼ぶと自動再描画
5. **空配列/null の初期値**はジェネリクスで型を明示する
6. **状態更新はイミュータブルに** — スプレッド・filter・map で新しい値を作る
7. **イベントはインラインで書くと型推論** される
8. **`children: React.ReactNode`** で中身を受け取れる
9. **`useRef<T>(null)`** で DOM 要素を参照する
10. **`key` Props** はリストに必須

### 確認問題

<details>
<summary>Q1. useState で空配列を初期値にするとき、なぜジェネリクスが必要か?</summary>

`useState([])` だと `never[]` と推論され、後で要素を追加できなくなります。`useState<string[]>([])` のようにジェネリクスで型を指定することで、正しい配列型として扱えます。
</details>

<details>
<summary>Q2. React で状態のオブジェクトを更新するとき、なぜ直接変更してはいけないか?</summary>

React は「同じ参照かどうか」で変化を検知します。直接プロパティを変更しても参照は変わらないため、React が変化を検知できず再描画されません。スプレッド構文で新しいオブジェクトを作ることで、参照が変わり再描画が発生します。
</details>

<details>
<summary>Q3. useRef と useState の使い分けは?</summary>

- `useState`: 値が変わったら画面を更新したい場合(カウント、入力値、リストなど)
- `useRef`: DOM 要素を参照したい場合、または値を保持したいが再描画は不要な場合(タイマーIDなど)
</details>

---

## 次の章へ

第14章で **React + TypeScript の基礎**を習得しました。次の第15章では React の応用として **`useEffect`・カスタムフック・コンポーネントの分割** を学び、より実践的なアプリを作ります。

---

> 🎯 **コラム: なぜ React は「宣言的」と言われるのか**
>
> 第13章の素の DOM 版では:
>
> ```typescript
> // 「どうやって更新するか」を手順で書く(命令的)
> const li = document.createElement("li");
> li.textContent = todo.title;
> list.appendChild(li);
> ```
>
> React では:
>
> ```tsx
> // 「どんな状態のとき、どう見えるか」を書く(宣言的)
> {todos.map(todo => <TodoItem key={todo.id} todo={todo} ... />)}
> ```
>
> 「どう更新するか」ではなく「**どう見えるべきか**」を書くのが宣言的スタイル。React はその差分を計算して効率よく DOM を更新してくれます。
>
> この「宣言的 UI」の発想が、React を使うと開発が楽になる本質的な理由です。

お疲れさまでした!次の第15章で会いましょう ☕
