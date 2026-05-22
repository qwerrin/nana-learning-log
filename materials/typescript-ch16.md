# 第16章 Tailwind CSS 入門

## この章のゴール

- Tailwind CSS が何を解決するか理解する
- React + Vite プロジェクトに Tailwind を導入できる
- よく使うユーティリティクラスを使いこなせる
- レスポンシブデザインを Tailwind で書ける
- ダークモードに対応できる
- 第15章の ToDo アプリを Tailwind でスタイリングし直せる

**所要時間の目安: 3時間**

---

## 0. この章の位置づけ

第14〜15章ではインラインスタイルで UI を書いてきました。

```tsx
// インラインスタイル — 動くが書くのが大変
<button style={{ background: "#ef4444", color: "white", border: "none",
  padding: "0.25rem 0.5rem", borderRadius: 4, cursor: "pointer" }}>
  削除
</button>
```

**Tailwind CSS** を使うと、これが:

```tsx
// Tailwind — クラスを並べるだけ
<button className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer">
  削除
</button>
```

クラス名を並べるだけでスタイルが適用されます。「**ユーティリティファーストCSSフレームワーク**」と呼ばれる手法です。

---

## 1. Tailwind CSS とは(15分)

### 1-1. 従来の CSS との違い

```css
/* 従来: クラス名を考えて、CSSファイルに書く */
.delete-button {
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
```

```tsx
/* Tailwind: クラス名を直接 HTML/JSX に書く */
<button className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer">
```

### 1-2. Tailwind のメリット

**メリット1: CSS ファイルを作らなくていい**
クラス名が標準化されているので、クラス名を考える必要がありません。

**メリット2: CSS の肥大化が起きない**
使ったクラスしか出力されないので、本番ビルドのCSSファイルが小さくなります。

**メリット3: レスポンシブ・ダークモードが簡単**
`md:text-lg` `dark:bg-gray-800` のようにプレフィックスを付けるだけ。

**メリット4: デザインの一貫性**
あらかじめ定義されたスケール(色・余白・フォントサイズ)を使うので、デザインが自然と統一されます。

### 1-3. Tailwind のデメリット

- クラス名が長くなる(慣れが必要)
- クラス名を覚える必要がある(ただし補完が使える)
- 細かいカスタムスタイルは設定が必要

---

## 2. Tailwind の導入(20分)

### 2-1. 既存の `04-react/` に追加する

第14〜15章で作ったプロジェクトに追加します。

```bash
cd typescript-learning/04-react
npm install -D tailwindcss @tailwindcss/vite
```

### 2-2. Vite の設定

`vite.config.ts` を編集します。

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
```

### 2-3. CSS に追加

`src/index.css` の先頭に追加します。

```css
@import "tailwindcss";
```

既存の CSS は削除してOKです(Tailwind のリセットが入ります)。

### 2-4. 動作確認

`src/App.tsx` を一時的に変更して確認します。

```tsx
function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Tailwind が動いている!
      </h1>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        ボタン
      </button>
    </div>
  );
}
export default App;
```

青いタイトルとボタンが表示されれば成功です。

---

## 3. Tailwind の基本クラス(45分)

### 3-1. 余白(padding / margin)

Tailwind の余白は**数値スケール**で指定します。`1 = 4px`。

```tsx
// padding
<div className="p-4">      // padding: 16px (全方向)
<div className="px-4">     // padding-left + right: 16px
<div className="py-2">     // padding-top + bottom: 8px
<div className="pt-2 pb-4"> // top: 8px, bottom: 16px

// margin
<div className="m-4">      // margin: 16px
<div className="mx-auto">  // margin-left/right: auto (中央寄せ)
<div className="mt-8">     // margin-top: 32px
<div className="mb-0">     // margin-bottom: 0
```

よく使うスケール:
| クラス | サイズ |
|---|---|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

### 3-2. 色

```tsx
// テキスト色
<p className="text-gray-700">グレーのテキスト</p>
<p className="text-blue-600">青いテキスト</p>
<p className="text-red-500">赤いテキスト</p>

// 背景色
<div className="bg-white">白い背景</div>
<div className="bg-gray-100">薄いグレー背景</div>
<div className="bg-blue-500">青い背景</div>

// ボーダー色
<div className="border border-gray-200">枠線あり</div>
```

**数値の意味**: 50〜950 で明暗を表します。数値が小さいほど明るい(薄い)、大きいほど暗い(濃い)。

```tsx
<p className="text-gray-300">薄いグレー</p>
<p className="text-gray-500">中間グレー</p>
<p className="text-gray-900">濃いグレー(ほぼ黒)</p>
```

### 3-3. タイポグラフィ

```tsx
// フォントサイズ
<p className="text-xs">12px</p>
<p className="text-sm">14px</p>
<p className="text-base">16px(デフォルト)</p>
<p className="text-lg">18px</p>
<p className="text-xl">20px</p>
<p className="text-2xl">24px</p>
<p className="text-4xl">36px</p>

// フォントウェイト
<p className="font-normal">通常(400)</p>
<p className="font-medium">やや太め(500)</p>
<p className="font-semibold">セミボールド(600)</p>
<p className="font-bold">太字(700)</p>

// その他
<p className="leading-relaxed">行間を広く</p>
<p className="tracking-wide">文字間隔を広く</p>
<p className="text-center">中央揃え</p>
<p className="truncate">長いテキストを省略...</p>
```

### 3-4. Flexbox

```tsx
// 横並び
<div className="flex gap-4">
  <div>A</div>
  <div>B</div>
</div>

// 両端揃え
<div className="flex justify-between items-center">
  <span>ロゴ</span>
  <nav>メニュー</nav>
</div>

// 縦方向
<div className="flex flex-col gap-2">
  <div>上</div>
  <div>下</div>
</div>

// 折り返し
<div className="flex flex-wrap gap-2">
  {tags.map(tag => <span key={tag}>{tag}</span>)}
</div>

// 要素を伸ばす
<div className="flex gap-2">
  <input className="flex-1" />  // 残りスペースを使う
  <button>送信</button>
</div>
```

### 3-5. Grid

```tsx
// 3列グリッド
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// 画面幅で自動調整(定番パターン)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

### 3-6. ボーダー・角丸・影

```tsx
// ボーダー
<div className="border">         // 1px solid
<div className="border-2">      // 2px solid
<div className="border-t">      // 上だけ

// 角丸
<div className="rounded">       // 4px
<div className="rounded-lg">    // 8px
<div className="rounded-xl">    // 12px
<div className="rounded-full">  // 50%(丸)

// 影
<div className="shadow-sm">     // 小さい影
<div className="shadow">        // 標準の影
<div className="shadow-lg">     // 大きい影
<div className="shadow-xl">     // さらに大きい影
```

### 3-7. ⭐ 疑似クラスとトランジション

```tsx
// ホバー
<button className="bg-blue-500 hover:bg-blue-600">
  ホバーで色が変わる
</button>

// フォーカス
<input className="border focus:outline-none focus:ring-2 focus:ring-blue-500" />

// アクティブ
<button className="bg-blue-500 active:scale-95">
  クリックで少し縮む
</button>

// disabled
<button className="bg-gray-400 cursor-not-allowed disabled:opacity-50"
  disabled>
  無効
</button>

// トランジション
<button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
  スムーズに色が変わる
</button>

// 複数まとめて
<div className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  ホバーで浮くカード
</div>
```

### 🔧 ミニ演習1

次のカードコンポーネントを Tailwind でスタイリングしてください。

要件:
- 白い背景、角丸、影
- タイトルは太字・大きめ
- ホバーで少し浮く(translateY + shadow)
- スムーズなトランジション

```tsx
type CardProps = { title: string; description: string };

const Card = ({ title, description }: CardProps) => (
  <div className="/* ここにクラスを書く */">
    <h3 className="/* タイトルのスタイル */">{title}</h3>
    <p className="/* 説明文のスタイル */">{description}</p>
  </div>
);
```

<details>
<summary>解答例</summary>

```tsx
const Card = ({ title, description }: CardProps) => (
  <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);
```

</details>

---

## 4. レスポンシブデザイン(20分)

### 4-1. ブレークポイント

Tailwind はモバイルファーストです。プレフィックスなし = スマホ向け。

| プレフィックス | 最小幅 |
|---|---|
| (なし) | 0px〜(全て) |
| `sm:` | 640px〜 |
| `md:` | 768px〜 |
| `lg:` | 1024px〜 |
| `xl:` | 1280px〜 |

### 4-2. 使い方

```tsx
// スマホ: 1列 / タブレット以上: 2列 / デスクトップ以上: 3列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>

// スマホ: テキスト小さめ / デスクトップ: 大きめ
<h1 className="text-2xl md:text-4xl font-bold">タイトル</h1>

// スマホ: 縦並び / タブレット以上: 横並び
<div className="flex flex-col md:flex-row gap-4">
  <aside className="md:w-64">サイドバー</aside>
  <main className="flex-1">メインコンテンツ</main>
</div>

// スマホ: 非表示 / デスクトップ: 表示
<nav className="hidden lg:flex gap-4">...</nav>
```

### 4-3. 実用例: ナビゲーションバー

```tsx
const Header = () => (
  <header className="bg-white border-b border-gray-200 px-4 py-3">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <span className="text-xl font-bold text-gray-800">MyApp</span>

      {/* スマホ: 非表示、md以上: 表示 */}
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">ホーム</a>
        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">について</a>
        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">連絡</a>
      </nav>

      {/* スマホ: ハンバーガーメニュー(実装は省略) */}
      <button className="md:hidden p-2 text-gray-600">☰</button>
    </div>
  </header>
);
```

---

## 5. ダークモード(15分)

### 5-1. CSS での設定

`src/index.css` に追記します。

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

### 5-2. dark: プレフィックス

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <h1>タイトル</h1>
  <p className="text-gray-600 dark:text-gray-400">本文</p>
</div>
```

### 5-3. React でのダークモード切り替え

```tsx
import { useState, useEffect } from "react";

const useTheme = () => {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem("theme") === "dark" ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark(d => !d) };
};

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
      >
        {isDark ? "🌞" : "🌙"}
      </button>
    </div>
  );
}
```

---

## 6. よく使うコンポーネントのパターン(20分)

### 6-1. ボタン

```tsx
// バリアントをまとめて管理
const buttonVariants = {
  primary:   "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger:    "bg-red-500 hover:bg-red-600 text-white",
  ghost:     "hover:bg-gray-100 text-gray-600",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

type ButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({ variant = "primary", children, onClick, disabled }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 rounded-lg font-medium text-sm
      transition-colors duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${buttonVariants[variant]}
    `}
  >
    {children}
  </button>
);
```

### 6-2. Input

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({ label, error, ...props }: InputProps) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      {...props}
      className={`
        w-full px-3 py-2 rounded-lg border text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-shadow duration-150
        ${error ? "border-red-400" : "border-gray-300"}
        ${props.className ?? ""}
      `}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
```

### 6-3. Badge(タグ・バッジ)

```tsx
type BadgeVariant = "blue" | "green" | "yellow" | "red" | "gray";

const badgeClasses: Record<BadgeVariant, string> = {
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red:    "bg-red-100 text-red-700",
  gray:   "bg-gray-100 text-gray-600",
};

const Badge = ({ variant = "gray", children }: { variant?: BadgeVariant; children: React.ReactNode }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClasses[variant]}`}>
    {children}
  </span>
);
```

---

## 7. 章末演習: ToDo アプリを Tailwind でスタイリング(40分)

第15章のインラインスタイル版を Tailwind で書き直します。

### 7-1. App.tsx

```tsx
// src/App.tsx
import { useTodos } from "./hooks/useTodos";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, pendingCount } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">📋 ToDo アプリ</h1>
        <p className="text-sm text-gray-500 mb-6">
          {pendingCount} 件の未完了 / 全 {todos.length} 件
        </p>

        <TodoForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

        {todos.some(t => t.done) && (
          <button
            onClick={clearCompleted}
            className="mt-4 text-sm text-gray-500 hover:text-red-500 transition-colors underline"
          >
            完了済みをすべて削除
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
```

### 7-2. components/TodoForm.tsx

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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white placeholder-gray-400"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="high">🔴 高</option>
        <option value="medium">🟡 中</option>
        <option value="low">🟢 低</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm
          font-medium rounded-lg transition-colors duration-150"
      >
        追加
      </button>
    </form>
  );
};
```

### 7-3. components/TodoItem.tsx

```tsx
// src/components/TodoItem.tsx
import type { Todo } from "../types";

const priorityBadge: Record<Todo["priority"], { label: string; className: string }> = {
  high:   { label: "高", className: "bg-red-100 text-red-600" },
  medium: { label: "中", className: "bg-yellow-100 text-yellow-600" },
  low:    { label: "低", className: "bg-green-100 text-green-600" },
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const badge = priorityBadge[todo.priority];

  return (
    <li className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 transition-opacity ${todo.done ? "opacity-50" : ""}`}>
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
      <span
        onClick={() => onToggle(todo.id)}
        className={`flex-1 text-sm cursor-pointer select-none ${todo.done ? "line-through text-gray-400" : "text-gray-700 hover:text-gray-900"}`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-150"
        aria-label={`${todo.title}を削除`}
      >
        ✕
      </button>
    </li>
  );
};
```

### 7-4. components/TodoList.tsx

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
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">🎉</p>
        <p className="text-sm">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
    </div>
  );
};
```

### 7-5. 比較: インラインスタイル vs Tailwind

| 観点 | インラインスタイル | Tailwind |
|---|---|---|
| 記述量 | やや多い | 少ない |
| ホバー・フォーカス | JS が必要 | クラスだけで書ける |
| レスポンシブ | メディアクエリが必要 | プレフィックスで書ける |
| 一貫性 | 自分で管理 | Tailwind のスケールが統一 |
| 学習コスト | CSS の知識だけ | Tailwind のクラス名を覚える |

---

## 8. この章のまとめ

### 覚えておきたいこと

**よく使うクラスの早見表**:

| 分類 | クラス例 |
|---|---|
| 余白 | `p-4`, `px-4`, `py-2`, `m-4`, `mx-auto`, `gap-4` |
| 色 | `bg-white`, `bg-blue-500`, `text-gray-700`, `text-white` |
| テキスト | `text-sm`, `text-lg`, `font-bold`, `text-center` |
| Flexbox | `flex`, `flex-col`, `items-center`, `justify-between`, `flex-1` |
| Grid | `grid`, `grid-cols-3`, `md:grid-cols-2` |
| 枠・角丸・影 | `border`, `rounded-lg`, `shadow`, `shadow-lg` |
| 状態 | `hover:bg-blue-600`, `focus:ring-2`, `disabled:opacity-50` |
| トランジション | `transition-colors`, `duration-200` |
| レスポンシブ | `md:flex`, `lg:grid-cols-3`, `hidden md:block` |
| ダークモード | `dark:bg-gray-900`, `dark:text-gray-100` |

### 確認問題

<details>
<summary>Q1. Tailwind はモバイルファーストとはどういう意味か?</summary>

プレフィックスなしのクラスはすべての画面サイズに適用されます。`md:` や `lg:` などのプレフィックスは「その幅以上」のときに上書きされます。したがって小さい画面(モバイル)向けのスタイルを先に書き、大きい画面で変えたい部分だけ `md:` などを追加します。
</details>

<details>
<summary>Q2. `flex-1` はどういう意味か?</summary>

Flexbox コンテナの中で、その要素が**残りのスペースをすべて使う**ことを意味します。検索フォームで入力欄を `flex-1` にすると、ボタンの幅を除いた部分が入力欄になります。
</details>

<details>
<summary>Q3. `transition-colors duration-200` はどういう意味か?</summary>

`transition-colors` は色関連のプロパティ(background-color, color など)の変化をアニメーション化します。`duration-200` はその時間を 200ms に設定します。ホバー時の色変化がスムーズになります。
</details>

---

## 次の章へ

第16章で **Tailwind CSS** を使えるようになりました。次の第17章では **Node.js + Express** でバックエンド API を作ります。フロントエンドと API を接続して、フルスタックアプリの完成を目指します。

---

> 🎯 **コラム: Tailwind CSS の設計思想**
>
> Tailwind の作者 Adam Wathan はこう言っています。「**セマンティックなクラス名は嘘をつく**」。
>
> ```css
> .card { /* どんなスタイルが当たっているか分からない */ }
> .btn-primary { /* 実際のスタイルはCSSを見ないと分からない */ }
> ```
>
> Tailwind のクラス名は「**見た目そのもの**」を表します。
>
> ```tsx
> <div className="bg-white rounded-xl shadow p-6">
> ```
>
> これを見るだけで「白背景・大きな角丸・影・余白16px」と分かります。
>
> 「**CSSを書かないとUIが作れない**」状態から、「**クラスを組み合わせるだけで UI が作れる**」状態になるのが Tailwind の本質的な価値です。

お疲れさまでした!次の第17章で会いましょう ☕
