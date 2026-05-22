# 第10章 ユニオン型・リテラル型・as const

## この章のゴール

- ユニオン型(`A | B`)の意味と使い所を理解する
- `typeof` で型を絞り込める(narrowing の入口)
- リテラル型で「特定の値だけを許す型」を作れる
- `enum` を知りつつ、**使わない理由**も説明できる
- **`as const`** で enum の代替ができる
- **判別可能ユニオン**の基本パターンを書ける

**所要時間の目安: 2.5時間**

---

## 0. この章の準備

`02-types/` に `src/10-union.ts` を作って進めましょう。

```json
"start": "tsx src/10-union.ts"
```

---

## 1. ユニオン型(40分)

### 1-1. 基本の書き方

**`型A | 型B`** で「**A または B**」を表します。

```typescript
let id: string | number;
id = 12345;      // ✅ number
id = "ABC-123";  // ✅ string
id = true;       // ❌ boolean は含まれない
```

第8章の `FetchResult<T>` でも使いましたね。

```typescript
type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

これがユニオン型の実践的な使い方の一つです。

### 1-2. 関数の引数で使う

```typescript
const formatId = (id: string | number): string => `ID: ${id}`;

formatId(12345);    // ✅
formatId("ABC-1");  // ✅
formatId(true);     // ❌
```

### 1-3. ⚠️ 共通の操作しかできない

ユニオン型の値には、**両方の型に共通する操作**しかできません。

```typescript
const getLength = (value: string | number): number => {
  return value.length;
  // ❌ Property 'length' does not exist on type 'number'
};
```

`.length` は `string` にはあるが `number` にはない。「どちらか分からない状態」では安全な操作だけが許されます。

```typescript
// ✅ toString は string にも number にもある
const stringify = (value: string | number): string => value.toString();
```

### 1-4. ⭐ typeof で型を絞り込む

ユニオン型の値を使うには、**「今 X 型だ」と確定させる**必要があります。これを **narrowing(型の絞り込み)** といいます。第12章で詳しく学びますが、最も基本的な `typeof` だけここで押さえます。

```typescript
const formatValue = (value: string | number): string => {
  if (typeof value === "string") {
    return value.toUpperCase();  // ✅ ここでは string と確定
  } else {
    return value.toFixed(2);     // ✅ ここでは number と確定
  }
};

console.log(formatValue("hello"));  // "HELLO"
console.log(formatValue(3.14));     // "3.14"
```

`if (typeof value === "string")` のブロック内で、TypeScript は **`value` が `string` だ** と理解します。これが TypeScript の賢さの核心。

### 1-5. null/undefined とのユニオン(実務最頻出)

```typescript
type User = { name: string; age: number };

const findUser = (id: number): User | undefined => {
  if (id === 1) return { name: "Alice", age: 30 };
  return undefined;
};

const user = findUser(999);
console.log(user.name);  // ❌ 'user' is possibly 'undefined'

// ✅ 絞り込んでから使う
if (user !== undefined) {
  console.log(user.name);  // ここでは User 型
}

// ✅ または optional chaining
console.log(user?.name);          // undefined
console.log(user?.name ?? "ゲスト"); // "ゲスト"
```

`User | undefined` で「見つからない可能性」を型で表現し、使う前に確認を強制できます。

### 1-6. 配列との組み合わせ

```typescript
// 各要素が string か number の配列
const mixed: (string | number)[] = ["hello", 42, "world", 100];

// ⚠️ 括弧の位置に注意
// (string | number)[]  → 各要素が string か number
// string | number[]    → string か、number の配列(全然違う!)
```

### 🔧 ミニ演習1

```typescript
// 文字列なら大文字に、数値なら2倍にして返す関数を書いてください
const processInput = (input: string | number): string | number => {
  // ここを実装
};

console.log(processInput("hello"));  // "HELLO"
console.log(processInput(10));       // 20
```

<details>
<summary>解答例</summary>

```typescript
const processInput = (input: string | number): string | number => {
  if (typeof input === "string") {
    return input.toUpperCase();
  } else {
    return input * 2;
  }
};
```

</details>

---

## 2. リテラル型(30分)

### 2-1. 基本の書き方

**「特定の値そのもの」を型にする**機能です。

```typescript
let direction: "up" | "down" | "left" | "right";

direction = "up";    // ✅
direction = "north"; // ❌ この4つのどれかしか入れられない
```

### 2-2. なぜ便利か

「選択肢を型で限定」することで、タイポや誤った値の混入を防げます。

```typescript
// ❌ string では何でも通る
const move = (direction: string) => { ... };
move("upp");   // タイポでも通る!
move("hello"); // 全然違う値でも通る

// ✅ リテラル型で限定
const move = (direction: "up" | "down" | "left" | "right") => { ... };
move("upp");   // ❌ タイポを発見
move("hello"); // ❌ 不正な値を排除
```

エディタの補完候補も4つに絞られ、選ぶだけで済みます。

### 2-3. type で名前をつける

```typescript
type Direction = "up" | "down" | "left" | "right";
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;
type Theme = "light" | "dark" | "auto";
type UserRole = "admin" | "editor" | "viewer";
```

実務では**ユーザー権限・状態・カテゴリ**でよく使います。

### 2-4. オブジェクト型のプロパティに組み込む

```typescript
type User = {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "suspended" | "pending";
};

const alice: User = {
  id: 1,
  name: "Alice",
  role: "admin",     // 補完が効く
  status: "active",
};
```

### 🔧 ミニ演習2

ピザの注文型を定義して合計金額を計算する関数を書いてください。

- `size`: `"small" | "medium" | "large"`(価格: 800 / 1200 / 1600)
- `crust`: `"thin" | "thick"`(thick は +200)
- `toppings`: 文字列の配列(1つ +100)
- `quantity`: `1 | 2 | 3`

<details>
<summary>解答例</summary>

```typescript
type PizzaOrder = {
  size: "small" | "medium" | "large";
  crust: "thin" | "thick";
  toppings: string[];
  quantity: 1 | 2 | 3;
};

const calcPizzaPrice = (order: PizzaOrder): number => {
  const sizePrice = { small: 800, medium: 1200, large: 1600 }[order.size];
  const crustExtra = order.crust === "thick" ? 200 : 0;
  const toppingsExtra = order.toppings.length * 100;
  return (sizePrice + crustExtra + toppingsExtra) * order.quantity;
};

const order: PizzaOrder = {
  size: "large",
  crust: "thick",
  toppings: ["cheese", "mushroom"],
  quantity: 2,
};

console.log(calcPizzaPrice(order));  // (1600 + 200 + 200) * 2 = 4000
```

`{ small: 800, medium: 1200, large: 1600 }[order.size]` のように、リテラル型の値をオブジェクトのキーとして使う対応表パターンは実務頻出です。

</details>

---

## 3. enum と as const(30分)

### 3-1. enum とは

「名前付き定数の集合」を作る機能です。

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

const dir: Direction = Direction.Up;
console.log(dir);  // "UP"
```

`Direction.Up` のような名前付きアクセスができます。

### 3-2. ⚠️ enum の問題点(新規コードでは非推奨)

```typescript
// ❌ 問題1: コンパイル後のJSに余計なコードが残る
enum Status { Pending, Active, Suspended }
// ↓ こんなJSが生成される(バンドルサイズ増、Tree Shakingが効かない)
var Status;
(function (Status) {
  Status[Status["Pending"] = 0] = "Pending";
  Status[Status["Active"] = 1] = "Active";
  Status[Status["Suspended"] = 2] = "Suspended";
})(Status || (Status = {}));

// ❌ 問題2: tsx(Node.jsの型ストリッピング)で動かないケースがある
// 実行時に「コードとして存在する」ため、型の削除だけでは不十分

// ❌ 問題3: 数値enumは型に存在しない値も代入できる
enum Color { Red = 0, Green = 1, Blue = 2 }
const c: Color = 999;  // ❌のはずだが TypeScript は通してしまう
```

### 3-3. ⭐ as const パターン(enum の代替)

`as const` を使うと、オブジェクトのすべてのプロパティが `readonly` になり、値が**リテラル型**として扱われます。

```typescript
// 通常のオブジェクト
const a = { color: "red" };
// 型: { color: string }  ← "red" ではなく string になる

// as const をつけると
const b = { color: "red" } as const;
// 型: { readonly color: "red" }  ← "red" というリテラル型になる
```

これを使って enum の代替を作ります。

```typescript
// as const パターン
const Status = {
  Pending: "pending",
  Active: "active",
  Suspended: "suspended",
} as const;

// 型を抽出(「valueofオブジェクト」を得る定型文)
type Status = typeof Status[keyof typeof Status];
// → "pending" | "active" | "suspended"

// 使い方
const current: Status = Status.Active;   // "active"
const current2: Status = "pending";       // 文字列直接指定もOK
const bad: Status = "deleted";           // ❌
```

`Status.Active` のような名前付きアクセスができて、しかも JS に余計なコードが残りません。

### 3-4. ⭐ 直接ユニオン(最もシンプル・推奨)

名前付きアクセスが必要ない場合は、直接ユニオン型が最もシンプルです。

```typescript
type Status = "pending" | "active" | "suspended";

const updateStatus = (status: Status): void => {
  console.log(`Status: ${status}`);
};

updateStatus("active");   // ✅
updateStatus("deleted");  // ❌
```

### 3-5. 3つの比較

| 方式 | 記述量 | 名前付きアクセス | JSコード生成 | 推奨度 |
|---|---|---|---|---|
| `enum` | 少ない | ✅ `Status.Active` | ❌ 余計に生成 | ❌ 新規では非推奨 |
| `as const` + 型抽出 | やや多い | ✅ `Status.Active` | ✅ なし | ○ 名前付きが必要なら |
| 直接ユニオン | 最少 | ❌(文字列直接指定) | ✅ なし | ✅ 最推奨 |

**初学者の方針**: まずは**直接ユニオン**で書く。`Status.Active` のような名前付きアクセスが必要になったら `as const` を使う。

### 3-6. as const のその他の使い方

```typescript
// 配列をタプルとして固定
const colors = ["red", "green", "blue"] as const;
// 型: readonly ["red", "green", "blue"]
// colors.push("yellow");  // ❌ readonly

// オブジェクト全体を変更不可に
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;
// config.timeout = 3000;  // ❌ readonly

// keyof で型を作る
type Category = "electronics" | "clothing" | "food";
const ShippingFees = {
  electronics: 1500,
  clothing: 800,
  food: 500,
} as const;

type Category2 = keyof typeof ShippingFees;
// → "electronics" | "clothing" | "food"
```

### 🔧 ミニ演習3

次の3つの書き方を実際に書いて比較してください。

タスクの優先度: `"low"`, `"medium"`, `"high"`

1. `enum` で書く
2. `as const` で書く
3. 直接ユニオン型で書く

<details>
<summary>解答例</summary>

```typescript
// 1. enum(現代では非推奨)
enum PriorityEnum {
  Low = "low",
  Medium = "medium",
  High = "high",
}
const p1: PriorityEnum = PriorityEnum.High;

// 2. as const(名前付きアクセスが必要な場合)
const Priority = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;
type Priority = typeof Priority[keyof typeof Priority];
const p2: Priority = Priority.High;   // "high"
const p3: Priority = "medium";         // 直接指定もOK

// 3. 直接ユニオン(最もシンプル・推奨)
type PriorityType = "low" | "medium" | "high";
const p4: PriorityType = "high";
```

</details>

---

## 4. ⭐ 判別可能ユニオン(30分)

### 4-1. 動機: 「形の違うオブジェクト」を1つの型で扱う

APIのレスポンスや状態管理では、「成功時と失敗時でデータの形が違う」ことがよくあります。

```typescript
// ❌ これだと status が "success" でも data があるか分からない
type Response = {
  status: "success" | "error";
  data?: User;
  message?: string;
};

// ✅ 判別可能ユニオンで形そのものを分ける
type Response =
  | { status: "success"; data: User }
  | { status: "error"; message: string };
```

### 4-2. 基本パターン

**共通のプロパティ**(`kind` や `type`、`status` など)で種類を判別し、TypeScript が自動的に型を絞り込みます。

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

const calcArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      // ここでは shape は { kind: "circle"; radius: number } と確定
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // ここでは { kind: "rectangle"; width: number; height: number } と確定
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
};

console.log(calcArea({ kind: "circle", radius: 5 }).toFixed(2));      // 78.54
console.log(calcArea({ kind: "rectangle", width: 10, height: 5 }));   // 50
```

`switch (shape.kind)` の各 `case` の中で、TypeScript は型を自動的に絞り込んでくれます。`radius` は `"circle"` のときしかアクセスできません。

### 4-3. よくある実用パターン

#### 非同期の状態管理

```typescript
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

const renderState = (state: FetchState<User>): string => {
  switch (state.status) {
    case "idle":    return "待機中";
    case "loading": return "読み込み中...";
    case "success": return `ユーザー: ${state.data.name}`;
    case "error":   return `エラー: ${state.message}`;
  }
};
```

`state.status === "success"` のときだけ `state.data` にアクセスでき、それ以外では型エラーになります。これが判別可能ユニオンの真価です。

#### フォーム入力の種類

```typescript
type FormField =
  | { type: "text"; label: string; maxLength?: number }
  | { type: "select"; label: string; options: string[] }
  | { type: "checkbox"; label: string; checked: boolean };

const renderField = (field: FormField): string => {
  switch (field.type) {
    case "text":
      return `<input type="text" placeholder="${field.label}">`;
    case "select":
      return `<select>${field.options.map(o => `<option>${o}</option>`).join("")}</select>`;
    case "checkbox":
      return `<input type="checkbox" ${field.checked ? "checked" : ""}>`;
  }
};
```

### 4-4. 設計のポイント

判別可能ユニオンを作るときのコツ:

1. **判別プロパティ(タグ)** は全ケースに共通で、各ケースで異なるリテラル型にする
2. タグ名は `kind`、`type`、`tag`、`status` などが慣習的によく使われる
3. 各ケースのプロパティは**そのケースに必要なものだけ**定義する(オプショナルにしない)

```typescript
// ✅ 良い設計: タグが明確で、各ケースに必要なプロパティだけある
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

// ❌ 悪い設計: タグがなく、オプショナルだらけ
type BadResult<T> = {
  success: boolean;
  value?: T;
  error?: Error;
};
```

### 🔧 ミニ演習4

通知の種類を判別可能ユニオンで定義して、表示文字列を返す関数を書いてください。

- `info`: `message: string`
- `warning`: `message: string`, `code: number`
- `error`: `message: string`, `code: number`, `stack?: string`

```typescript
type Notification = /* ここを実装 */;

const formatNotification = (n: Notification): string => {
  // ここを実装
};

console.log(formatNotification({ kind: "info", message: "保存しました" }));
// "[INFO] 保存しました"

console.log(formatNotification({ kind: "warning", message: "容量不足", code: 101 }));
// "[WARNING:101] 容量不足"

console.log(formatNotification({ kind: "error", message: "接続失敗", code: 500 }));
// "[ERROR:500] 接続失敗"
```

<details>
<summary>解答例</summary>

```typescript
type Notification =
  | { kind: "info"; message: string }
  | { kind: "warning"; message: string; code: number }
  | { kind: "error"; message: string; code: number; stack?: string };

const formatNotification = (n: Notification): string => {
  switch (n.kind) {
    case "info":
      return `[INFO] ${n.message}`;
    case "warning":
      return `[WARNING:${n.code}] ${n.message}`;
    case "error":
      return `[ERROR:${n.code}] ${n.message}${n.stack ? `\n${n.stack}` : ""}`;
  }
};

console.log(formatNotification({ kind: "info", message: "保存しました" }));
console.log(formatNotification({ kind: "warning", message: "容量不足", code: 101 }));
console.log(formatNotification({ kind: "error", message: "接続失敗", code: 500 }));
```

</details>

---

## 5. 章末演習(25分)

### 🎯 演習: タスク管理システムの型

```typescript
// タスクの状態を判別可能ユニオンで設計してください
// - todo: タイトルと優先度だけ
// - in_progress: todo の情報に加え、担当者(string)と開始日(Date)
// - done: in_progress の情報に加え、完了日(Date)

type TaskStatus = /* 実装 */;

// 以下の関数を実装してください
// 1. formatTask(task: TaskStatus): string — タスクの状態を1行で表示
// 2. isOverdue(task: TaskStatus, deadline: Date): boolean
//    — in_progress のタスクが deadline を過ぎているか
//    — todo と done は false を返す
```

<details>
<summary>解答例</summary>

```typescript
type Priority = "low" | "medium" | "high";

type TaskStatus =
  | { status: "todo"; title: string; priority: Priority }
  | { status: "in_progress"; title: string; priority: Priority; assignee: string; startedAt: Date }
  | { status: "done"; title: string; priority: Priority; assignee: string; startedAt: Date; completedAt: Date };

const formatTask = (task: TaskStatus): string => {
  switch (task.status) {
    case "todo":
      return `[ ] ${task.title} (${task.priority})`;
    case "in_progress":
      return `[→] ${task.title} - 担当: ${task.assignee}`;
    case "done":
      return `[✓] ${task.title} - 完了: ${task.completedAt.toLocaleDateString()}`;
  }
};

const isOverdue = (task: TaskStatus, deadline: Date): boolean => {
  if (task.status !== "in_progress") return false;
  return task.startedAt < deadline && new Date() > deadline;
};

// 動作確認
const tasks: TaskStatus[] = [
  { status: "todo", title: "仕様書を読む", priority: "high" },
  { status: "in_progress", title: "実装する", priority: "medium", assignee: "Alice", startedAt: new Date("2026-01-01") },
  { status: "done", title: "テストを書く", priority: "low", assignee: "Bob", startedAt: new Date("2026-01-10"), completedAt: new Date("2026-01-15") },
];

tasks.forEach(t => console.log(formatTask(t)));
```

`in_progress` の `task.assignee` は `todo` では使えません。TypeScript が型を絞り込んで守ってくれています。
</details>

---

## 6. この章のまとめ

### 覚えておきたいこと

1. **ユニオン型 `A | B`** は「A または B」を表す
2. ユニオン型の値には**両方に共通する操作しかできない**
3. **`typeof` で絞り込む**と、そのブロック内で具体的な型として使える
4. **リテラル型** `"admin" | "editor"` で選択肢を型として限定できる
5. **`enum` は現代 TS では非推奨**。JS に余計なコードが残る
6. **直接ユニオンが最推奨**。名前付きアクセスが必要なら `as const`
7. **判別可能ユニオン**: 共通のタグプロパティで種類を判別し、型が自動的に絞り込まれる
8. `as const` でオブジェクト全体を `readonly` + リテラル型にできる

### 確認問題

<details>
<summary>Q1. string | number の値に .length を呼べないのはなぜか?</summary>

`number` には `.length` プロパティが存在しないためです。ユニオン型の値には「どちらの型でも安全な操作」しかできません。`typeof` で `string` であることを確認してから呼ぶ必要があります。
</details>

<details>
<summary>Q2. enum が現代 TypeScript で非推奨な理由を2つ挙げよ</summary>

1. コンパイル後の JS に余計なコードが生成される(バンドルサイズ増、Tree Shaking 不可)
2. tsx などの型ストリッピングで動かないケースがある

代わりに直接ユニオン型か `as const` パターンを使います。
</details>

<details>
<summary>Q3. 判別可能ユニオンのタグプロパティの条件は?</summary>

1. すべてのケースに共通で存在する
2. 各ケースで異なるリテラル型になっている

例: `kind: "circle" | kind: "rectangle"` のように、タグの値でケースを一意に特定できる必要があります。
</details>

---

## 次の章へ

第10章で**ユニオン型と判別可能ユニオン**を習得しました。次の第11章では **ジェネリクスとユーティリティ型** を学びます。「型を引数として渡す」という発想で、型の再利用性を大きく高めます。

---

> 🎯 **コラム: 不正な状態を型で禁止する**
>
> 判別可能ユニオンを使いこなすと、「**ありえない状態をコンパイル時に禁止**」できます。
>
> ```typescript
> // ❌ 悪い設計: 「loading なのに data がある」状態が作れる
> type State = {
>   loading: boolean;
>   data?: User;
>   error?: string;
> };
>
> // ✅ 良い設計: 各状態で持つデータが明確
> type State =
>   | { status: "idle" }
>   | { status: "loading" }
>   | { status: "success"; data: User }
>   | { status: "error"; message: string };
> ```
>
> 良い設計では「`loading` 中に `data` にアクセスする」というコードが書けません。型システムが禁止するからです。
>
> これは TypeScript 上級者が大切にする **「make illegal states unrepresentable(不正な状態を表現不可能にする)」** という設計思想です。第12章の narrowing と組み合わせるとさらに強力になります。

お疲れさまでした!次の第11章で会いましょう ☕
