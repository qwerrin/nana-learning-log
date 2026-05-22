# 第17章 Node.js + Express で API サーバー

## この章のゴール

- Express で API サーバーを立ち上げられる
- リクエスト/レスポンスにジェネリクスで型をつけられる
- GET / POST / PATCH / DELETE のエンドポイントを書ける
- 入力バリデーションを実装できる
- エラーハンドリングミドルウェアを書ける
- React フロントから API を呼び出す(End-to-End)

**所要時間の目安: 3時間**

---

## 0. この章の位置づけ

第14〜16章でフロントエンドを作りました。この章では**バックエンド(サーバー側)** を TypeScript で書きます。

**Express** は Node.js で最も人気の API フレームワークです。シンプルで軽量、TypeScript との相性も良く初学者に最適。

最終的に React フロントから Express API を呼び出す**フルスタック接続**まで進みます。

---

## 1. プロジェクトを作る(20分)

### 1-1. セットアップ

```bash
cd typescript-learning
mkdir 05-express
cd 05-express
npm init -y
npm install express cors
npm install -D typescript tsx @types/node @types/express @types/cors
```

| パッケージ | 役割 |
|---|---|
| `express` | API サーバーフレームワーク |
| `cors` | 別オリジンからのアクセスを許可 |
| `@types/express` | Express の型定義 |
| `@types/cors` | cors の型定義 |

> **CORS とは**
> ブラウザはセキュリティ上、異なるオリジン(URL)へのリクエストをブロックします。フロント(`http://localhost:5173`)からサーバー(`http://localhost:3000`)を叩くには、サーバー側で CORS を許可する必要があります。

### 1-2. 設定ファイル

`tsconfig.json`(第1章と同じ内容):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

`package.json` の `scripts`:

```json
{
  "type": "module",
  "scripts": {
    "dev":       "tsx watch src/server.ts",
    "build":     "tsc --noEmit false",
    "start":     "node dist/server.js",
    "typecheck": "tsc --noEmit"
  }
}
```

- `dev`: 開発中。ファイル保存で自動再起動
- `build`: 本番用 JS を出力
- `start`: ビルド済み JS で起動

### 1-3. 最初のサーバー

`src/server.ts`:

```typescript
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くと「Hello, Express + TypeScript!」が表示されます。

---

## 2. ルーティングの基本(25分)

### 2-1. HTTP メソッドとルート

```typescript
import express from "express";

const app = express();
app.use(express.json());  // ← JSON ボディをパース(必須)

// GET: データを取得
app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

// URLパラメータ (:id)
app.get("/users/:id", (req, res) => {
  const { id } = req.params;  // 常に string
  res.json({ id: Number(id), name: "Alice" });
});

// POST: データを作成
app.post("/users", (req, res) => {
  const { name } = req.body;
  res.status(201).json({ id: 2, name });
});

// PATCH: 部分更新
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  res.json({ id: Number(id), name });
});

// DELETE: 削除
app.delete("/users/:id", (req, res) => {
  res.json({ success: true });
});

app.listen(3000);
```

> **URLパラメータは常に string**
> `/users/123` にアクセスしても `req.params.id` は `"123"` (文字列)です。数値として使うには `Number(id)` が必要です。

### 2-2. レスポンスのメソッド

```typescript
res.send("文字列");          // テキストを返す
res.json({ key: "value" }); // JSON を返す
res.status(404).json({ error: "Not Found" });  // ステータスコード付き

// よく使うステータスコード
// 200 OK        — 成功(デフォルト)
// 201 Created   — 作成成功
// 400 Bad Request — リクエストが不正
// 404 Not Found — 見つからない
// 500 Internal Server Error — サーバーエラー
```

### 2-3. クエリパラメータ

`/users?role=admin&page=1` のような URL から値を取り出します。

```typescript
app.get("/users", (req, res) => {
  const { role, page } = req.query;
  // role: string | ParsedQs | string[] | ParsedQs[] | undefined
  // 型が複雑なので string として扱う場合は型チェックが必要

  const roleStr = typeof role === "string" ? role : undefined;
  res.json({ role: roleStr, page });
});
```

---

## 3. ⭐ TypeScript で型をつける(30分)

### 3-1. リクエスト/レスポンスのジェネリクス

`app.get<Params, ResBody, ReqBody, ReqQuery>` で4つの型を指定できます。

```typescript
type UserParams = { id: string };
type User = { id: number; name: string; email: string };

app.get<UserParams, User>("/users/:id", (req, res) => {
  const id = Number(req.params.id);  // string → number
  res.json({ id, name: "Alice", email: "alice@example.com" });
  // ❌ { wrong: "field" } を返すと型エラー
});
```

### 3-2. 型定義を別ファイルに

`src/types.ts`:

```typescript
export type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
};

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  title?: string;
  done?: boolean;
};

export type IdParam = { id: string };

export type ErrorResponse = { error: string };

export type SuccessResponse = { success: true };
```

`src/server.ts` で使う:

```typescript
import type { Todo, CreateTodoInput, IdParam, ErrorResponse } from "./types.js";

app.post<unknown, Todo | ErrorResponse, CreateTodoInput>("/todos", (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title は必須です" });
  }

  const newTodo: Todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
```

### 3-3. ⚠️ req.body の型は信用しすぎない

ジェネリクスで型を指定しても、**実行時に何が来るか分からない**のが現実です。

```typescript
// ❌ 型を信頼しすぎ — name が undefined の可能性がある
app.post<unknown, User, CreateUserInput>("/users", (req, res) => {
  const { name, email } = req.body;
  const user = { id: 1, name, email };  // name が undefined かも
  res.status(201).json(user);
});

// ✅ 最低限のバリデーション
app.post<unknown, User | ErrorResponse, CreateUserInput>("/users", (req, res) => {
  const { name, email } = req.body;

  if (typeof name !== "string" || typeof email !== "string") {
    return res.status(400).json({ error: "name と email は文字列が必須" });
  }

  const user: User = { id: nextId++, name, email };
  res.status(201).json(user);
});
```

---

## 4. ミドルウェア(15分)

### 4-1. ミドルウェアとは

リクエストとレスポンスの間に挟まる処理です。`app.use(...)` で登録します。

```typescript
// ログミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();  // 次の処理に進む
});

// JSON ミドルウェア(body のパース)
app.use(express.json());

// CORS ミドルウェア
app.use(cors());
```

**登録順が重要**。`app.use` は上から順に実行されます。

### 4-2. ⭐ エラーハンドリングミドルウェア

引数が `(err, req, res, next)` の4つになると**エラーハンドラ**として機能します。

```typescript
import type { Request, Response, NextFunction } from "express";

// 通常のルートより後に登録する
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

ルートハンドラ内で `next(error)` を呼ぶか、`async` ハンドラでエラーが throw されると、このエラーハンドラに渡ります。

### 4-3. 非同期エラーの扱い

```typescript
// ❌ async のエラーは自動では捕まえてくれない(Express 4まで)
app.get("/data", async (req, res) => {
  throw new Error("エラー!");  // エラーハンドラに届かない
});

// ✅ try/catch で明示的に
app.get("/data", async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err);  // エラーハンドラに渡す
  }
});
```

> Express 5 からは `async` のエラーも自動的にエラーハンドラに渡されます。

---

## 5. ⭐ 完全な ToDo API(40分)

### 5-1. 完全なコード

`src/server.ts`:

```typescript
import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  IdParam,
  ErrorResponse,
  SuccessResponse,
} from "./types.js";

const app = express();
const PORT = 3000;

// ===== ミドルウェア =====
app.use(cors());
app.use(express.json());

// ===== データストア(本来は DB に置く) =====
let todos: Todo[] = [];
let nextId = 1;

// ===== ルート =====

// 一覧取得
app.get<unknown, Todo[]>("/todos", (req, res) => {
  res.json(todos);
});

// 1件取得
app.get<IdParam, Todo | ErrorResponse>("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `ID ${id} の ToDo が見つかりません` });
  }
  res.json(todo);
});

// 新規作成
app.post<unknown, Todo | ErrorResponse, CreateTodoInput>(
  "/todos",
  (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title は必須の文字列です" });
    }

    const newTodo: Todo = {
      id: nextId++,
      title: title.trim(),
      done: false,
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  }
);

// 部分更新
app.patch<IdParam, Todo | ErrorResponse, UpdateTodoInput>(
  "/todos/:id",
  (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: `ID ${id} の ToDo が見つかりません` });
    }

    const { title, done } = req.body;
    if (title !== undefined) todo.title = title;
    if (done !== undefined)  todo.done = done;

    res.json(todo);
  }
);

// 削除
app.delete<IdParam, SuccessResponse | ErrorResponse>(
  "/todos/:id",
  (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `ID ${id} の ToDo が見つかりません` });
    }

    todos.splice(index, 1);
    res.json({ success: true });
  }
);

// ===== エラーハンドラ =====
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: err instanceof Error ? err.message : "Internal Server Error",
  });
});

// ===== 起動 =====
app.listen(PORT, () => {
  console.log(`ToDo API running at http://localhost:${PORT}`);
});
```

### 5-2. 動作確認(curl)

```bash
# 一覧(空)
curl http://localhost:3000/todos

# 作成
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "TypeScriptを学ぶ"}'

# 一覧(1件)
curl http://localhost:3000/todos

# 完了にする
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# 削除
curl -X DELETE http://localhost:3000/todos/1

# バリデーションエラー
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
# → {"error":"title は必須の文字列です"}
```

### 5-3. RESTful API 設計

| メソッド | URL | 意味 |
|---|---|---|
| GET | `/todos` | 全件取得 |
| GET | `/todos/:id` | 1件取得 |
| POST | `/todos` | 新規作成 |
| PATCH | `/todos/:id` | 部分更新 |
| DELETE | `/todos/:id` | 削除 |

---

## 6. ⭐ React フロントと接続する(30分)

### 6-1. 2つのサーバーを同時に起動

**ターミナル1**: Express サーバー
```bash
cd typescript-learning/05-express
npm run dev
# → http://localhost:3000
```

**ターミナル2**: React フロント
```bash
cd typescript-learning/04-react
npm run dev
# → http://localhost:5173
```

### 6-2. React 側の API クライアント

`04-react/src/api.ts` を新規作成します。

```typescript
// src/api.ts
const BASE_URL = "http://localhost:3000";

export type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => ({}));
    const message = typeof err === "object" && err !== null && "error" in err
      ? String((err as { error: unknown }).error)
      : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
};

export const todoApi = {
  getAll: (): Promise<Todo[]> =>
    fetch(`${BASE_URL}/todos`).then(res => handleResponse<Todo[]>(res)),

  create: (title: string): Promise<Todo> =>
    fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then(res => handleResponse<Todo>(res)),

  update: (id: number, updates: { title?: string; done?: boolean }): Promise<Todo> =>
    fetch(`${BASE_URL}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then(res => handleResponse<Todo>(res)),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" })
      .then(res => handleResponse<void>(res)),
};
```

### 6-3. カスタムフックで API を使う

`04-react/src/hooks/useTodosApi.ts`:

```typescript
// src/hooks/useTodosApi.ts
import { useState, useEffect } from "react";
import { todoApi, type Todo } from "../api";

export const useTodosApi = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード
  useEffect(() => {
    todoApi.getAll()
      .then(setTodos)
      .catch(e => setError(e instanceof Error ? e.message : "エラー"))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async (title: string): Promise<void> => {
    try {
      const newTodo = await todoApi.create(title);
      setTodos(prev => [...prev, newTodo]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "追加に失敗しました");
    }
  };

  const toggleTodo = async (id: number): Promise<void> => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const updated = await todoApi.update(id, { done: !todo.done });
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました");
    }
  };

  const deleteTodo = async (id: number): Promise<void> => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const clearError = () => setError(null);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, clearError };
};
```

### 6-4. App.tsx でフルスタック接続

`04-react/src/App.tsx`:

```tsx
import { useTodosApi } from "./hooks/useTodosApi";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";

function App() {
  const {
    todos, loading, error,
    addTodo, toggleTodo, deleteTodo, clearError,
  } = useTodosApi();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📋 ToDo アプリ <span className="text-sm font-normal text-gray-400">(フルスタック版)</span>
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <TodoForm onAdd={title => addTodo(title)} />

        {loading ? (
          <div className="text-center py-8 text-gray-400">読み込み中...</div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
```

### 6-5. 動作確認

1. `http://localhost:5173` で React フロントを開く
2. タスクを追加
3. Express サーバー側のターミナルにログが出る
4. **ブラウザをリロードしてもタスクが残っている**(サーバー上に保存されているため)

🎉 **フロントエンドとバックエンドがつながりました!**

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **`app.get/post/patch/delete(path, handler)`** でルートを定義
2. **`app.use(express.json())`** は必須(ないと `req.body` が空)
3. **URLパラメータは常に string** — `Number(req.params.id)` で変換
4. **ジェネリクス `app.get<P, ResBody, ReqBody, ReqQuery>`** でリクエスト/レスポンスに型をつける
5. **`req.body` は実行時には何でも来る** — 型に頼らずバリデーションが必要
6. **エラーハンドラは引数が4つ** `(err, req, res, next)`
7. **CORS** はフロントとバックが別オリジンの場合に必要
8. **API クライアントをカスタムフックに包む** と React との連携がシンプルになる

### RESTful API 設計早見表

| 操作 | メソッド | URL例 |
|---|---|---|
| 一覧取得 | GET | `/todos` |
| 1件取得 | GET | `/todos/:id` |
| 作成 | POST | `/todos` |
| 部分更新 | PATCH | `/todos/:id` |
| 削除 | DELETE | `/todos/:id` |

### 確認問題

<details>
<summary>Q1. app.use(express.json()) を書かないとどうなるか?</summary>

`req.body` が `undefined` になります。POST や PATCH でクライアントが JSON を送ってきても、サーバー側でそのデータを読み取れません。
</details>

<details>
<summary>Q2. URLパラメータ /users/:id の :id は何型か?</summary>

**`string`** です。URL はすべてテキストなので、数値として使いたい場合は `Number(req.params.id)` で変換する必要があります。
</details>

<details>
<summary>Q3. エラーハンドリングミドルウェアが通常のミドルウェアと異なる点は?</summary>

引数が `(err, req, res, next)` の**4つ**である点です。通常のミドルウェアは `(req, res, next)` の3つ。Express はこれで区別し、エラーが発生したときだけエラーハンドラを呼びます。
</details>

---

## 次の章へ

第17章で **Node.js + Express の API サーバー**と React フロントを接続したフルスタックアプリが完成しました。

次の第18章では**ベストプラクティスとよくあるエラー**を学びます。実務でよく遭遇するエラーパターンと、TypeScript を書く上での注意点をまとめます。

---

> 🎯 **コラム: データは本来どこに保存するか**
>
> この章のサーバーは ToDo を**メモリ上の配列**に保存しています。
>
> ```typescript
> let todos: Todo[] = [];  // サーバーを再起動すると消える
> ```
>
> 本番では**データベース**に保存します。
>
> ```
> PostgreSQL / MySQL  ← リレーショナルDB(関係のあるデータ)
> MongoDB             ← ドキュメントDB(柔軟なスキーマ)
> SQLite              ← ファイルベース(小規模・学習用)
> ```
>
> TypeScript でよく使うのは **Prisma**(ORMライブラリ)+ PostgreSQL の組み合わせです。Prisma は TypeScript と相性が非常に良く、データベースのスキーマから型を自動生成してくれます。
>
> 「フルスタック TypeScript」に興味が出てきたら、Prisma + PostgreSQL を調べてみてください。

お疲れさまでした!次の第18章で会いましょう ☕
