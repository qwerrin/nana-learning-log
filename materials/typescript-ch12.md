# 第12章 型ガードと narrowing

## この章のゴール

- narrowing(型の絞り込み)の仕組みを理解する
- `typeof`/`instanceof`/`in`/等価比較/`Array.isArray` で型を絞り込める
- 判別可能ユニオンを本格的に使いこなせる
- **ユーザー定義型ガード**(`value is T`)を書ける
- **`never` を使った網羅性チェック**ができる
- 型アサーション(`as`)の危険性を理解し、代替手段を知る

**所要時間の目安: 2.5時間**

---

## 0. この章の準備

`02-types/` に `src/12-narrowing.ts` を作って進めましょう。

```json
"start": "tsx src/12-narrowing.ts"
```

**Phase 2 の総仕上げ**となる章です。これまでのユニオン型・ジェネリクスの知識を総動員します。

---

## 1. narrowing とは(15分)

**narrowing** = 「ユニオン型などの広い型を、コードの流れに応じて具体的な型に絞ること」

```typescript
const formatValue = (value: string | number): string => {
  //  ここでの value の型: string | number

  if (typeof value === "string") {
    // ここでの value の型: string ← 絞り込まれた!
    return value.toUpperCase();
  }

  // ここでの value の型: number ← string が除外された!
  return value.toFixed(2);
};
```

TypeScript は**コードの流れを追って**、ブロックごとに変数の型を自動的に絞り込みます。第10章で `typeof` を使ったのがその例。本章ではさまざまな絞り込み方法を体系的に学びます。

---

## 2. 絞り込みの方法(35分)

### 2-1. ⭐ typeof — プリミティブの判定

最もよく使う絞り込みです。

```typescript
const process = (input: string | number | boolean): string => {
  if (typeof input === "string") {
    return input.toUpperCase();       // string と確定
  } else if (typeof input === "number") {
    return input.toFixed(2);          // number と確定
  } else {
    return input ? "yes" : "no";      // boolean と確定
  }
};
```

`typeof` で判定できる値: `"string"` / `"number"` / `"boolean"` / `"function"` / `"object"` / `"undefined"`

> ⚠️ **`typeof null === "object"`**
> null は `"object"` を返す JavaScript の有名なバグです。null を判定するときは `=== null` を使ってください。

### 2-2. ⭐ 等価比較 — null/undefined の判定

```typescript
const greet = (name: string | null): string => {
  if (name === null) {
    return "Hello, guest!";
  }
  // ここでは name は string
  return `Hello, ${name.toUpperCase()}!`;
};

// truthy チェックでまとめることもできる
const greet2 = (name: string | null | undefined): string => {
  if (!name) {
    return "Hello, guest!";  // null, undefined, "" のどれか
  }
  // ここでは string(ただし空文字は除外される)
  return `Hello, ${name}!`;
};
```

> ⚠️ **空文字に注意**
> `if (!name)` は `""` も `false` として扱います。空文字を許可したい場合は `name === null || name === undefined` と明示してください。

### 2-3. instanceof — クラスインスタンスの判定

```typescript
const handleError = (error: Error | string): void => {
  if (error instanceof Error) {
    console.log(error.message);  // Error クラスのプロパティが使える
    console.log(error.stack);
  } else {
    console.log(error);          // string
  }
};

// Date の判定
const formatDate = (value: Date | string): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;  // string
};
```

`Date`、`Error`、カスタムクラスなどに使います。

### 2-4. in 演算子 — プロパティの有無で判定

```typescript
type Bird = { fly: () => void };
type Fish = { swim: () => void };

const move = (animal: Bird | Fish): void => {
  if ("fly" in animal) {
    animal.fly();   // Bird と判定
  } else {
    animal.swim();  // Fish と判定
  }
};
```

共通の判別子がないオブジェクト型のユニオンで便利。

### 2-5. Array.isArray — 配列の判定

```typescript
const process = (input: string | string[]): string => {
  if (Array.isArray(input)) {
    return input.join(", ");    // string[] と確定
  }
  return input.toUpperCase();   // string と確定
};
```

`typeof [] === "object"` なので `typeof` では配列を判定できません。**配列は `Array.isArray`** を使います。

### 2-6. 早期 return で型を絞る

`if/else` を使わなくても、早期 `return` で残りの型を絞れます。

```typescript
const formatId = (id: string | number | null): string => {
  if (id === null) return "不明";
  // ここ以降 id は string | number

  if (typeof id === "number") return `NUM-${id.toString().padStart(6, "0")}`;
  // ここ以降 id は string

  return `STR-${id.toUpperCase()}`;
};
```

ネストが浅くなり、読みやすいコードになります。

### 🔧 ミニ演習1

```typescript
// 引数: number | Date | null のいずれか
// - number → "Number: 数値"
// - Date → "Date: ISO形式文字列"
// - null → "Empty"
const describe = (value: number | Date | null): string => {
  // ここを実装
};

console.log(describe(42));          // "Number: 42"
console.log(describe(new Date(0))); // "Date: 1970-01-01T00:00:00.000Z"
console.log(describe(null));        // "Empty"
```

<details>
<summary>解答例</summary>

```typescript
const describe = (value: number | Date | null): string => {
  if (value === null) return "Empty";
  if (value instanceof Date) return `Date: ${value.toISOString()}`;
  return `Number: ${value}`;
};
```

null チェック → instanceof → 残りが number という流れ。TypeScript が自動的に型を絞ってくれます。
</details>

---

## 3. ⭐ 判別可能ユニオンを本格活用(35分)

第10章で基本を学びました。ここでは実践的なパターンを深掘りします。

### 3-1. 復習: 基本パターン

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

const calcArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;  // radius にアクセス可能
    case "rectangle":
      return shape.width * shape.height;    // width/height にアクセス可能
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
};
```

### 3-2. ⭐ 実践例: 非同期の状態管理

React や SPA でよく使うパターン。

```typescript
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; code: number };

const render = (state: FetchState<string[]>): string => {
  switch (state.status) {
    case "idle":    return "まだ取得していません";
    case "loading": return "読み込み中...";
    case "success": return `${state.data.length}件取得しました`;
    case "error":   return `エラー(${state.code}): ${state.message}`;
  }
};
```

`status === "success"` のときだけ `data` にアクセスできます。`status === "loading"` のときに `data` にアクセスしようとするとコンパイルエラー。「**不正な状態が作れない**」設計です。

### 3-3. 実践例: イベント処理

```typescript
type AppEvent =
  | { type: "userLogin"; userId: number }
  | { type: "userLogout" }
  | { type: "itemAdded"; itemId: number; quantity: number }
  | { type: "itemRemoved"; itemId: number };

const handleEvent = (event: AppEvent): void => {
  switch (event.type) {
    case "userLogin":
      console.log(`ユーザー ${event.userId} がログイン`);
      break;
    case "userLogout":
      console.log("ユーザーがログアウト");
      break;
    case "itemAdded":
      console.log(`商品 ${event.itemId} を ${event.quantity}個追加`);
      break;
    case "itemRemoved":
      console.log(`商品 ${event.itemId} を削除`);
      break;
  }
};
```

### 🔧 ミニ演習2

通知の種類を判別可能ユニオンで表現してください(第10章の復習)。

- `info`: `message: string`
- `warning`: `message: string`, `code: number`
- `error`: `message: string`, `code: number`, `isFatal: boolean`

各ケースに応じたログ出力関数 `logNotification` を実装してください。

<details>
<summary>解答例</summary>

```typescript
type Notification =
  | { kind: "info"; message: string }
  | { kind: "warning"; message: string; code: number }
  | { kind: "error"; message: string; code: number; isFatal: boolean };

const logNotification = (n: Notification): void => {
  switch (n.kind) {
    case "info":
      console.log(`[INFO] ${n.message}`);
      break;
    case "warning":
      console.warn(`[WARN:${n.code}] ${n.message}`);
      break;
    case "error":
      console.error(`[ERROR:${n.code}] ${n.message}${n.isFatal ? " (致命的)" : ""}`);
      break;
  }
};
```

</details>

---

## 4. ⭐ never を使った網羅性チェック(25分)

### 4-1. never 型とは

`never` 型は「**到達不可能な場所**」を表す型です。どんな値も代入できません。

```typescript
const x: never = 42;     // ❌ どんな型も代入できない
const y: never = "str";  // ❌
```

### 4-2. switch の default で網羅性チェック

判別可能ユニオンの `switch` 文に **`default`** で `never` チェックを入れると、ケース漏れをコンパイルエラーで検出できます。

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

const calcArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default: {
      // すべてのケースを処理しているなら、shape は never 型になる
      const _exhaustive: never = shape;
      throw new Error(`未処理の shape: ${JSON.stringify(_exhaustive)}`);
    }
  }
};
```

ここに `triangle` を追加したとします。

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };  // ← 追加
```

`calcArea` の `default` ブロックで即コンパイルエラー。

```
Type '{ kind: "triangle"; base: number; height: number }' is not assignable to type 'never'.
```

**`switch` に `"triangle"` の `case` を追加するまでエラーが消えません**。「修正漏れ」を型システムが強制的に教えてくれます。

### 4-3. assertNever ヘルパー

```typescript
const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};

const calcArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    case "triangle":  return (shape.base * shape.height) / 2;
    default:          return assertNever(shape);
  }
};
```

`assertNever` を1つ書いておけば、あちこちの `switch` で使い回せます。

### 4-4. if/else でも使える

`switch` だけでなく、`if/else` の末尾でも使えます。

```typescript
type Direction = "north" | "south" | "east" | "west";

const describe = (d: Direction): string => {
  if (d === "north") return "北";
  if (d === "south") return "南";
  if (d === "east")  return "東";
  if (d === "west")  return "西";

  // すべてのケースを処理していれば d は never になる
  const _: never = d;
  return assertNever(d);
};
```

### 🔧 ミニ演習3

図形の周囲長を計算する関数を **網羅性チェック付き**で書いてください。

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

const assertNever = (value: never): never => {
  throw new Error(`未処理: ${JSON.stringify(value)}`);
};

const calcPerimeter = (shape: Shape): number => {
  // switch + default で assertNever を使う
};
```

<details>
<summary>解答例</summary>

```typescript
const calcPerimeter = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return 2 * Math.PI * shape.radius;
    case "square":
      return shape.side * 4;
    case "rectangle":
      return (shape.width + shape.height) * 2;
    default:
      return assertNever(shape);
  }
};

console.log(calcPerimeter({ kind: "circle", radius: 5 }).toFixed(2));  // 31.42
console.log(calcPerimeter({ kind: "square", side: 4 }));               // 16
console.log(calcPerimeter({ kind: "rectangle", width: 3, height: 5 })); // 16
```

</details>

---

## 5. ⭐ ユーザー定義型ガード(30分)

### 5-1. 問題: 関数で絞り込めない

```typescript
const isString = (value: unknown): boolean => typeof value === "string";

const x: unknown = "hello";
if (isString(x)) {
  x.toUpperCase();  // ❌ x は unknown のまま
}
```

`isString` が `true` を返しても TypeScript は「この関数が true を返したら x が string だ」とは理解しません。

### 5-2. value is T — 型述語

戻り値の型に `value is T` と書くと、**その関数が `true` を返したら `value` は `T` 型だと TypeScript に伝えられます**。

```typescript
const isString = (value: unknown): value is string =>
  typeof value === "string";

const x: unknown = "hello";
if (isString(x)) {
  x.toUpperCase();  // ✅ x は string と確定!
}
```

これが**ユーザー定義型ガード**です。

### 5-3. オブジェクト型の型ガード

API レスポンスや JSON のバリデーションで頻出。

```typescript
type User = { id: number; name: string; email: string };

const isUser = (value: unknown): value is User => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value && typeof (value as Record<string, unknown>).id === "number" &&
    "name" in value && typeof (value as Record<string, unknown>).name === "string" &&
    "email" in value && typeof (value as Record<string, unknown>).email === "string"
  );
};

const fetchAndValidate = async (url: string): Promise<User | null> => {
  const res = await fetch(url);
  const data: unknown = await res.json();

  if (isUser(data)) {
    return data;  // ✅ User 型として安全に使える
  }

  return null;
};
```

> **型ガードの実装内の `as` はOK**
> `isUser` の実装内で `as Record<string, unknown>` を使うのは許容されます。型ガードを**通過した後**のコードに `as` が現れないことが重要です。

### 5-4. 配列要素の型ガード

```typescript
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === "string");

const data: unknown = ["a", "b", "c"];
if (isStringArray(data)) {
  console.log(data.join(", "));  // ✅ string[] と確定
}
```

### 5-5. 型ガードの再利用

型ガードは**普通の関数**なので、いろいろな場所で使い回せます。

```typescript
// filter と組み合わせる
const values: unknown[] = [1, "hello", 2, "world", null];
const strings = values.filter(isString);
// 型: string[]  ← TypeScript が推論してくれる!
```

`Array.prototype.filter` は型ガード関数を受け取ると、戻り値の配列の型を自動的に絞り込みます。

### 🔧 ミニ演習4

`Product` 型の型ガードを書いてください。

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
};

const isProduct = (value: unknown): value is Product => {
  // ここを実装
};

// 使い方
const items: unknown[] = [
  { id: 1, name: "apple", price: 100 },
  { id: 2, name: "banana" },         // price がない → false
  { name: "cherry", price: 200 },    // id がない → false
];

const products = items.filter(isProduct);
console.log(products);  // [{ id: 1, name: "apple", price: 100 }]
```

<details>
<summary>解答例</summary>

```typescript
const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number"
  );
};

const items: unknown[] = [
  { id: 1, name: "apple", price: 100 },
  { id: 2, name: "banana" },
  { name: "cherry", price: 200 },
];

const products = items.filter(isProduct);
console.log(products);  // [{ id: 1, name: "apple", price: 100 }]
console.log(products[0]?.name);  // "apple"
```

</details>

---

## 6. 型アサーション(as)と非nullアサーション(!)(15分)

### 6-1. as — 型アサーション

「**TypeScript よりも自分が型を知っている**」と主張するための記法。

```typescript
const value: unknown = "hello";
const str = value as string;
str.toUpperCase();  // ✅(ただし実行時の安全性は保証されない)
```

### 6-2. as の危険性

```typescript
const num: unknown = 42;
const str = num as string;  // ❌ 数値なのに string と主張
str.toUpperCase();           // コンパイルは通るが実行時エラー
```

**`as` はコンパイルエラーを黙らせるだけ**で、実行時の安全性を保証しません。

### 6-3. as を使ってもいい場面

```typescript
// DOM 操作(自分が input 要素と知っている)
const input = document.getElementById("username") as HTMLInputElement;
console.log(input.value);

// JSON パース(別途バリデーション済みの場合)
const config = JSON.parse(jsonStr) as AppConfig;
```

**使うときは「なぜ安全か」を自分で説明できる場合のみ**。

### 6-4. ! — 非null アサーション

```typescript
const arr = [1, 2, 3];
const first = arr[0]!;  // number と扱う(undefined を除去)
```

`noUncheckedIndexedAccess` が有効だと `arr[0]` は `number | undefined` ですが、`!` で `undefined` を除去できます。

**乱用注意**。「本当に存在するか?」を都度確認してください。

### 6-5. as を使わずに済む代替手段

| 状況 | as を使わない代替 |
|---|---|
| unknown を扱う | 型ガード関数を書く |
| オブジェクトの種類を判定 | 判別可能ユニオン |
| 汎用的な処理 | ジェネリクス |
| 外部データのバリデーション | zod などのライブラリ |

**「`as` を書きたくなったら、まず別の方法を考える」**が原則です。

---

## 7. 章末演習(25分)

### 🎯 演習: イベントハンドラーシステム

判別可能ユニオン + 網羅性チェック + 型ガードを組み合わせたシステムを作ってください。

```typescript
type AppEvent =
  | { type: "userSignIn"; userId: number; timestamp: Date }
  | { type: "userSignOut"; userId: number }
  | { type: "purchase"; userId: number; amount: number; itemId: string }
  | { type: "error"; code: number; message: string; isCritical: boolean };

// 1. イベントのサマリ文字列を返す formatEvent(event: AppEvent): string
//    (網羅性チェック付き)

// 2. unknown な値が AppEvent かどうかを判定する isAppEvent
//    (最低限 type プロパティが正しいリテラル型であることをチェック)

// 3. イベントログ(unknown[])から AppEvent だけを抽出して処理する
//    parseAndProcess(logs: unknown[]): void
```

<details>
<summary>解答例</summary>

```typescript
type AppEvent =
  | { type: "userSignIn"; userId: number; timestamp: Date }
  | { type: "userSignOut"; userId: number }
  | { type: "purchase"; userId: number; amount: number; itemId: string }
  | { type: "error"; code: number; message: string; isCritical: boolean };

const assertNever = (value: never): never => {
  throw new Error(`Unexpected event: ${JSON.stringify(value)}`);
};

// 1. サマリ文字列(網羅性チェック付き)
const formatEvent = (event: AppEvent): string => {
  switch (event.type) {
    case "userSignIn":
      return `[${event.timestamp.toISOString()}] ユーザー${event.userId}がサインイン`;
    case "userSignOut":
      return `ユーザー${event.userId}がサインアウト`;
    case "purchase":
      return `ユーザー${event.userId}が商品${event.itemId}を¥${event.amount}で購入`;
    case "error":
      return `[${event.isCritical ? "致命的" : "一般"}エラー ${event.code}] ${event.message}`;
    default:
      return assertNever(event);
  }
};

// 2. 型ガード(typeプロパティの存在と値をチェック)
const VALID_TYPES = ["userSignIn", "userSignOut", "purchase", "error"] as const;

const isAppEvent = (value: unknown): value is AppEvent => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.type === "string" &&
    (VALID_TYPES as readonly string[]).includes(obj.type);
};

// 3. ログ処理
const parseAndProcess = (logs: unknown[]): void => {
  const events = logs.filter(isAppEvent);
  console.log(`${logs.length}件中 ${events.length}件が有効なイベント`);
  events.forEach(e => console.log(formatEvent(e)));
};

// 動作確認
const logs: unknown[] = [
  { type: "userSignIn", userId: 1, timestamp: new Date() },
  { type: "purchase", userId: 1, amount: 2980, itemId: "ITEM-001" },
  { type: "invalid", data: "無効" },     // 弾かれる
  "not an object",                       // 弾かれる
  { type: "error", code: 500, message: "サーバーエラー", isCritical: true },
];

parseAndProcess(logs);
```

</details>

---

## 8. この章のまとめ

### 覚えておきたいこと

1. **narrowing**: TypeScript がコードの流れを追って型を自動的に絞り込む機能
2. **絞り込み方法**: `typeof` / `instanceof` / `in` / `=== null` / `Array.isArray`
3. **判別可能ユニオン**: 共通の判別子で種類を分け、`switch` で安全に処理
4. **`never` 網羅性チェック**: `default` で `never` に代入し、ケース漏れをコンパイルエラーで検出
5. **ユーザー定義型ガード**: `value is T` で自作の絞り込み関数を書ける
6. **`as` は最終手段**: 型ガード・判別可能ユニオン・ジェネリクスで代替できないか検討する

### 絞り込み方法の早見表

| 状況 | 使う方法 |
|---|---|
| プリミティブ型 | `typeof value === "string"` |
| null/undefined | `value === null` / `if (!value)` |
| クラスのインスタンス | `value instanceof Date` |
| プロパティの有無 | `"name" in value` |
| 配列かどうか | `Array.isArray(value)` |
| 判別可能ユニオン | `switch (value.kind)` |
| 自作の判定ロジック | `value is T` 型ガード関数 |

---

## 🎉 Phase 2 完了!

```
✅ 第8章:  非同期処理
✅ 第9章:  型エイリアス・インターフェース
✅ 第10章: ユニオン型・リテラル型・as const
✅ 第11章: ジェネリクス・ユーティリティ型
✅ 第12章: 型ガードと narrowing ← 今ここ
```

TypeScript の型システムを**ほぼ完全に**習得しました。

## 次の章へ

次の第13章から **Phase 3 — 実践** に入ります。第13章では **DOM 操作・Fetch・Vite** を TypeScript で書きます。これまで学んだすべての型知識が現場で活きてきます。

---

> 🎯 **コラム: narrowing と型推論の力**
>
> 本章で学んだ narrowing は、**TypeScript の「賢さ」の根源**です。
>
> ```typescript
> if (typeof x === "string") {
>   x.toUpperCase();  // x が string と分かる
> }
> ```
>
> このような「コードの流れに応じた型推論」は、多くの言語にはありません。
>
> 「**書きやすさ × 安全性**」のバランスが現代 TypeScript の最大の魅力。
>
> `assertNever` を使った網羅性チェックは特に強力で、「新しい種類を追加したら必ずすべての処理箇所を更新させる」ことをコンパイラが強制してくれます。チーム開発やリファクタリングで大きな保険になります。

お疲れさまでした!Phase 3 でお会いしましょう ☕
