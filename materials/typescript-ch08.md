# 第8章 非同期処理

## この章のゴール

- 同期処理と非同期処理の違いを説明できる
- `Promise<T>` に型注釈をつけられる
- `async`/`await` を TypeScript で書ける
- **`async` 関数の戻り値は `Promise<T>`** であることを理解する
- `response.json()` を `unknown` で安全に受けられる
- `catch` の `error` が `unknown` 型になる理由と対処法を知る
- `Promise.all` で並列処理を書ける
- JSON の扱い方を知る

**所要時間の目安: 3時間**

---

## 0. この章の準備

`01-basics/` から `02-types/` フォルダに移ります。フォルダを作ってセットアップしましょう。

```bash
cd typescript-learning
mkdir 02-types
cd 02-types
npm init -y
npm install -D typescript tsx @types/node
```

`tsconfig.json` と `package.json` は `01-basics/` と同じものをコピーして、ファイル名を `08-async.ts` に変えます。

```json
"start": "tsx src/08-async.ts"
```

---

## 1. なぜ非同期が必要か(20分)

### 1-1. JavaScript はシングルスレッド

JavaScript は **一度に一つのことしかできません**(シングルスレッド)。時間のかかる処理を**同期的に**書くと、その間ブラウザが固まります。

```typescript
// ⚠️ 仮に同期的にAPIを呼んだら(実際はこう書けない)
const data = fetchSync("https://api.example.com");  // 5秒かかる
// この5秒間、ページが完全に固まる 😱
```

そこで JS は「**時間がかかる処理は裏で動かして、終わったら結果を受け取る**」という非同期処理を採用しています。

### 1-2. 同期処理 vs 非同期処理

```typescript
// 同期: 上から順番に実行
console.log("A");
console.log("B");
console.log("C");
// → A B C
```

```typescript
// 非同期: 時間のかかる処理を「後回し」にする
console.log("A");

setTimeout(() => {
  console.log("B");  // 1秒後
}, 1000);

console.log("C");
// → A C B (B が後回しになる)
```

`setTimeout` は「N ミリ秒後にコールバックを呼ぶ」非同期関数の代表例。

### 1-3. 非同期処理の代表例

| 処理 | 例 |
|---|---|
| タイマー | `setTimeout`、`setInterval` |
| Web API 呼び出し | `fetch` |
| ファイル読み込み(Node.js) | `fs.readFile` |
| データベース操作 | 各種 DB クライアント |

これらはすべて **結果が後から届く**ので、特別な書き方が必要です。

### 1-4. Promise とは

**Promise** は「**いつか結果が出る箱**」のようなものです。

| 状態 | 意味 |
|---|---|
| **pending** | まだ結果が出ていない |
| **fulfilled** | 処理が成功した |
| **rejected** | 処理が失敗した |

非同期処理を始めると `pending` で始まり、最終的に `fulfilled` か `rejected` になります。TypeScript では `Promise<T>` の `T` が「成功したときの値の型」です。

---

## 2. async / await(40分)

### 2-1. 基本構文

`async` / `await` は Promise を「同期コードのように」書ける現代的な記法です。

```typescript
// async: この関数は Promise を返す
const fetchTodo = async (): Promise<void> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  // ↑ await: レスポンスが届くまで待つ

  const data = await response.json();
  console.log(data);
};

fetchTodo();
```

`await` は「Promise の結果が出るまで待ってから次の行に進む」演算子です。

> **`await` は `async` 関数の中でしか使えない**
> ```typescript
> // ❌ 普通の関数の中では使えない
> const bad = () => {
>   const result = await fetch("...");  // SyntaxError
> };
> ```

### 2-2. ⭐ TypeScript での戻り値型

`async` 関数は**必ず `Promise<T>` を返す**ため、戻り値の型も `Promise<T>` で書きます。

```typescript
type User = { id: number; name: string; email: string };

// ✅ 戻り値は Promise<User>
const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
};

// ❌ 戻り値を User と書くのは間違い
const fetchUser2 = async (id: number): User => { ... };
// → async function return type must be a promise
```

**`async` 関数 = `Promise<T>` を返す関数** と覚えてください。

### 2-3. ⭐ await した変数の型推論

```typescript
const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`...`);
  // response の型は Response

  const data: unknown = await response.json();
  // data の型は unknown(後述)

  return data as User;  // (暫定: 本来はバリデーションすべき)
};
```

`await` の結果は、その Promise の型パラメータが取り出されたものになります。

```typescript
const p: Promise<string> = Promise.resolve("hello");
const value = await p;
// value の型は string
```

### 2-4. 自分で Promise を作る(参考)

`new Promise` で独自の非同期処理を作れます。

```typescript
// N ミリ秒待つユーティリティ
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// 使い方
const main = async (): Promise<void> => {
  console.log("開始");
  await delay(1000);
  console.log("1秒経過");
};

main();
```

実務では既存の Promise を `await` することの方がずっと多いので、今は「こういうこともできる」程度で OK。

### 🔧 ミニ演習1

次の関数を `async`/`await` で書いてください。

- 引数: `ids: number[]`(ユーザー ID の配列)
- 処理: `https://jsonplaceholder.typicode.com/users/{id}` から順番に取得
- 戻り値: `Promise<string[]>`(取得した名前の配列)

<details>
<summary>解答例</summary>

```typescript
const fetchUserNames = async (ids: number[]): Promise<string[]> => {
  const names: string[] = [];

  for (const id of ids) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "name" in data &&
      typeof (data as Record<string, unknown>).name === "string"
    ) {
      names.push((data as { name: string }).name);
    }
  }

  return names;
};

const main = async () => {
  const names = await fetchUserNames([1, 2, 3]);
  console.log(names);
};

main();
```

</details>

---

## 3. ⭐ fetch と型の安全な扱い(40分)

### 3-1. fetch の基本

```typescript
const response: Response = await fetch("https://api.example.com/data");
```

`fetch` の戻り値は `Promise<Response>` 型です。

### 3-2. ⚠️ response.ok を必ずチェック

`fetch` は HTTP エラー(404, 500 など)を **`catch` では捕まえません**。ネットワーク自体のエラーしか catch に入らないからです。

```typescript
// ❌ 404 でも catch に入らない
const response = await fetch("https://example.com/not-found");
const data = await response.json();  // 404 のエラーボディを JSON にしようとする

// ✅ response.ok を必ずチェックする
const response = await fetch("https://example.com/not-found");
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);  // 自分でエラーを投げる
}
const data = await response.json();
```

`response.ok` は HTTP ステータスが `200〜299` のとき `true` になります。**これは超重要なお約束**。

### 3-3. ⭐ response.json() は unknown で受ける

`response.json()` の戻り値は TypeScript の型定義では `Promise<any>` になっています。`any` は型チェックを無効化するので、**`unknown` として受け取る**のが安全です。

```typescript
const data: unknown = await response.json();  // ✅ unknown で受ける
// const data = await response.json();       // ❌ any になる
```

### 3-4. unknown を使った安全な fetch パターン

```typescript
type ApiUser = {
  id: number;
  name: string;
  email: string;
};

// 型ガード(第12章で詳しく学ぶ)
const isApiUser = (value: unknown): value is ApiUser =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  "name" in value &&
  "email" in value;

const fetchUser = async (id: number): Promise<ApiUser> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: unknown = await response.json();

  if (!isApiUser(data)) {
    throw new Error("不正なレスポンス形式");
  }

  return data;  // ここでは ApiUser 型
};
```

「**unknown で受ける → 型ガードで検証 → T 型として扱う**」がモダン TypeScript の定石。`as ApiUser` で強制キャストするより格段に安全です。

型ガードの詳細は第12章で学びます。今は「こういうパターンがある」と把握しておけば十分。

---

## 4. ⭐ エラーハンドリング(30分)

### 4-1. try/catch と async/await

`async`/`await` のエラーは、第6章で学んだ通常の `try/catch` で処理できます。

```typescript
const fetchTodo = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: unknown = await response.json();
    console.log(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("取得失敗:", error.message);
    } else {
      console.error("不明なエラー:", error);
    }
  }
};
```

`.then().catch()` よりずっと読みやすく書けます。これが `async`/`await` の最大の強みです。

### 4-2. catch の error は unknown 型

第6章で触れましたが、TypeScript の `strict` モードでは `catch` の引数は `unknown` 型です。

```typescript
try {
  await fetchData();
} catch (error) {
  console.log(error.message);  // ❌ unknown には message がない

  // ✅ instanceof でチェックしてから使う
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

### 4-3. エラーメッセージを取り出すヘルパー

実務でよく使うパターン:

```typescript
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "不明なエラーが発生しました";
};

try {
  await fetchData();
} catch (error) {
  console.error(getErrorMessage(error));  // どんなエラーでも文字列で取り出せる
}
```

### 4-4. カスタムエラークラス

HTTP エラーに独自プロパティを持たせる例:

```typescript
class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const fetchData = async (url: string): Promise<unknown> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HttpError(`HTTP Error: ${response.statusText}`, response.status);
  }
  return response.json();
};

try {
  await fetchData("/api/data");
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`[${error.statusCode}] ${error.message}`);
    if (error.statusCode === 401) {
      console.log("ログインが必要です");
    }
  } else if (error instanceof Error) {
    console.error(error.message);
  }
}
```

### 4-5. エラーを再スローする

関数内で catch しつつ、呼び出し元にもエラーを伝えたいとき:

```typescript
const fetchWithRetry = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new HttpError(response.statusText, response.status);
    return response.json();
  } catch (error) {
    console.error("fetchWithRetry failed:", getErrorMessage(error));
    throw error;  // 呼び出し元にも伝える(再スロー)
  }
};
```

### 🔧 ミニ演習2

`fetchUserSafe` 関数を実装してください。

- `id` を受け取り、ユーザー情報を取得する
- 成功時: `{ ok: true; data: ApiUser }` を返す
- 失敗時: `{ ok: false; error: string }` を返す(例外を投げない)

```typescript
type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const fetchUserSafe = async (id: number): Promise<FetchResult<ApiUser>> => {
  // ここを実装
};

const result = await fetchUserSafe(1);
if (result.ok) {
  console.log(result.data.name);
} else {
  console.error(result.error);
}
```

<details>
<summary>解答例</summary>

```typescript
type ApiUser = { id: number; name: string; email: string };

type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const isApiUser = (value: unknown): value is ApiUser =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  "name" in value &&
  "email" in value;

const fetchUserSafe = async (id: number): Promise<FetchResult<ApiUser>> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const data: unknown = await response.json();

    if (!isApiUser(data)) {
      return { ok: false, error: "不正なレスポンス形式" };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
};

const main = async () => {
  const result = await fetchUserSafe(1);
  if (result.ok) {
    console.log(`名前: ${result.data.name}`);
  } else {
    console.error(`エラー: ${result.error}`);
  }
};

main();
```

`FetchResult<T>` のような「成功か失敗かを型で表現する」パターンは、例外を使わずに結果を伝えられるので実務でよく使われます。第10章で学ぶ**判別可能なユニオン型**の典型例です。

</details>

---

## 5. Promise.all と並列処理(20分)

### 5-1. 順番 vs 並列

複数の非同期処理を順番に実行すると時間がかかります。

```typescript
// 順番に: 合計3秒かかる
const seq = async () => {
  const user = await fetchUser(1);    // 1秒
  const posts = await fetchPosts(1);  // また1秒
  const todos = await fetchTodos(1);  // また1秒
};
```

互いに依存していないなら、**並列で実行した方が速い**です。

### 5-2. Promise.all で並列実行

```typescript
// 並列: 最も長いもので1秒で済む
const parallel = async () => {
  const [user, posts, todos] = await Promise.all([
    fetchUser(1),    // Promise<User>
    fetchPosts(1),   // Promise<Post[]>
    fetchTodos(1),   // Promise<Todo[]>
  ]);

  // user: User, posts: Post[], todos: Todo[]
  // TypeScript が各型を正確に推論してくれる
  console.log(user.name, posts.length, todos.length);
};
```

`Promise.all` は「**全部成功するまで待って、結果を配列で返す**」Promiseを作ります。

> ⚠️ **1つでも失敗すると全体が失敗**します。一部の失敗を許容したい場合は `Promise.allSettled` を使います。

### 5-3. 実践例: 複数ユーザーを並列取得

```typescript
const fetchMultipleUsers = async (ids: number[]): Promise<ApiUser[]> => {
  try {
    const promises = ids.map(id => fetchUser(id));  // Promise[] を作る
    const users = await Promise.all(promises);        // 全部待つ
    return users;
  } catch (error) {
    console.error("並列取得失敗:", getErrorMessage(error));
    return [];
  }
};

const main = async () => {
  const users = await fetchMultipleUsers([1, 2, 3]);
  console.log(users.map(u => u.name));
};
```

---

## 6. JSON の扱い(15分)

### 6-1. JSON.stringify と JSON.parse

```typescript
// オブジェクト → JSON 文字列
const user = { name: "Alice", age: 30 };
const json = JSON.stringify(user);
console.log(json);          // '{"name":"Alice","age":30}'
console.log(typeof json);   // "string"

// 整形して出力(第2引数: null, 第3引数: インデント数)
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "Alice",
//   "age": 30
// }
```

```typescript
// JSON 文字列 → オブジェクト
const parsed: unknown = JSON.parse('{"name":"Alice","age":30}');
// 型は unknown! 何が入っているか分からない
```

### 6-2. ⭐ JSON.parse の結果は unknown で受ける

```typescript
const jsonStr = '{"name":"Alice","age":30}';

// ❌ any になる(型チェックが効かない)
const data1 = JSON.parse(jsonStr);
data1.nonExistentProp.something;  // 実行時エラー

// ✅ unknown で受けて型ガードを使う
const data2: unknown = JSON.parse(jsonStr);
if (typeof data2 === "object" && data2 !== null && "name" in data2) {
  console.log((data2 as { name: string }).name);
}
```

`JSON.parse` も `response.json()` と同様、型情報がないので `unknown` で受けるのが安全です。

### 6-3. localStorage とのやり取り(実践)

```typescript
type Todo = { id: number; title: string; done: boolean };

// 保存
const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// 読み込み
const loadTodos = (): Todo[] => {
  try {
    const json = localStorage.getItem("todos");
    if (!json) return [];

    const data: unknown = JSON.parse(json);

    // 簡易バリデーション
    if (!Array.isArray(data)) return [];

    return data as Todo[];  // (本来は各要素もバリデーションすべき)
  } catch {
    return [];  // JSON が壊れていたら空配列
  }
};
```

---

## 7. 章末演習(30分)

### 🎯 演習: 未完了 ToDo 取得

以下の関数を実装してください。

```typescript
type ApiTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// userId を受け取り、そのユーザーの「未完了の ToDo タイトル」を返す
const fetchPendingTodos = async (userId: number): Promise<string[]> => {
  // 1. https://jsonplaceholder.typicode.com/users/{userId}/todos から取得
  // 2. response.ok チェック
  // 3. unknown で受けてバリデーション
  // 4. completed === false のもののタイトルだけ返す
};

// 複数ユーザーの未完了件数を並列で取得して合計を返す
const fetchTotalPendingCount = async (userIds: number[]): Promise<number> => {
  // Promise.all を使う
};

const main = async () => {
  const titles = await fetchPendingTodos(1);
  console.log(`未完了: ${titles.length}件`);

  const total = await fetchTotalPendingCount([1, 2, 3]);
  console.log(`3人の未完了合計: ${total}件`);
};

main();
```

<details>
<summary>解答例</summary>

```typescript
type ApiTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const isApiTodo = (value: unknown): value is ApiTodo =>
  typeof value === "object" &&
  value !== null &&
  "userId" in value &&
  "id" in value &&
  "title" in value &&
  "completed" in value;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "不明なエラー";
};

const fetchPendingTodos = async (userId: number): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}/todos`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("配列が返ってくるはずです");
    }

    const todos = data.filter(isApiTodo);  // 型ガードでフィルタ

    return todos
      .filter(t => !t.completed)
      .map(t => t.title);
  } catch (error) {
    console.error("取得失敗:", getErrorMessage(error));
    return [];
  }
};

const fetchTotalPendingCount = async (userIds: number[]): Promise<number> => {
  const results = await Promise.all(userIds.map(id => fetchPendingTodos(id)));
  return results.reduce((sum, titles) => sum + titles.length, 0);
};

const main = async () => {
  const titles = await fetchPendingTodos(1);
  console.log(`未完了: ${titles.length}件`);
  titles.slice(0, 3).forEach(t => console.log(` ・${t}`));

  const total = await fetchTotalPendingCount([1, 2, 3]);
  console.log(`3人の未完了合計: ${total}件`);
};

main();
```

</details>

---

## 8. この章のまとめ

### 覚えておきたいこと

1. **`async` 関数の戻り値は `Promise<T>`**(`T` ではない)
2. **`await` は `async` 関数の中でしか使えない**
3. **`response.ok` を必ずチェック**(`fetch` は HTTP エラーを catch しない)
4. **`response.json()` / `JSON.parse` は `unknown` で受ける**
5. **`catch` の `error` は `unknown`** → `instanceof Error` でチェック
6. **`getErrorMessage(error)`** ヘルパーでどんなエラーも文字列化
7. **`Promise.all`** で複数の非同期を並列実行

### 確認問題

<details>
<summary>Q1. async 関数の戻り値型を User と書くとどうなるか?</summary>

コンパイルエラーになります。`async` 関数は自動的に Promise でラップされるため、戻り値の型は必ず `Promise<User>` にする必要があります。
</details>

<details>
<summary>Q2. fetch が 404 を返しても catch に入らないのはなぜか?</summary>

`fetch` はネットワーク自体のエラー(オフラインなど)のときだけ reject されます。HTTP ステータスコード(404, 500 等)は通信自体は成功しているため、`response.ok` が `false` になるだけです。手動で `if (!response.ok) throw new Error(...)` を書く必要があります。
</details>

<details>
<summary>Q3. Promise.all と順番に await する違いは?</summary>

- **順番に await**: 1つ終わってから次を始める。合計時間 = 各処理の合計
- **Promise.all**: 全部同時に始める。合計時間 = 最も長い処理の時間

互いに依存していない非同期処理は `Promise.all` で並列実行するのが効率的です。
</details>

---

## 次の章へ

第8章で**非同期処理**をマスターしました。`fetch` + `async/await` + `unknown` の安全なパターンは、React での API 呼び出しでも毎日使います。

次の第9章からは **Phase 2 — 型システム** に入ります。第9章では **型エイリアスとインターフェース**を詳しく学びます。

---

> 🎯 **コラム: コールバック地獄から async/await へ**
>
> 非同期処理の書き方は大きく進化してきました。
>
> ```typescript
> // 1世代目: コールバック地獄(〜2015年頃)
> fetchUser(1, (user) => {
>   fetchPosts(user.id, (posts) => {
>     fetchComments(posts[0].id, (comments) => {
>       // どんどん深くなる...
>     });
>   });
> });
>
> // 2世代目: Promise チェーン(2015年〜)
> fetchUser(1)
>   .then(user => fetchPosts(user.id))
>   .then(posts => fetchComments(posts[0].id))
>   .then(comments => console.log(comments));
>
> // 3世代目: async/await(2017年〜・現在の主流)
> const user = await fetchUser(1);
> const posts = await fetchPosts(user.id);
> const first = posts[0];
> if (first) {
>   const comments = await fetchComments(first.id);
>   console.log(comments);
> }
> ```
>
> 今あなたが学んでいる `async`/`await` は、この進化の最新形です。普通の同期コードと変わらない見た目で非同期処理を書けるのは、先人たちの多くの試行錯誤のおかげです。

お疲れさまでした!次の第9章で会いましょう ☕
