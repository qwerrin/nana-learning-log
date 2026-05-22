# 第11章 ジェネリクス・ユーティリティ型

## この章のゴール

- ジェネリクスが**なぜ必要か**を理解する
- 関数と型のジェネリクスを書ける
- `extends` で型パラメータに制約をつけられる
- `keyof`/`typeof` 演算子を使える
- 主要なユーティリティ型(`Partial`/`Pick`/`Omit`/`Record`/`ReturnType`など)を使える
- 複数のユーティリティ型を組み合わせられる

**所要時間の目安: 3時間**

---

## 0. この章の準備

`02-types/` に `src/11-generics.ts` を作って進めましょう。

```json
"start": "tsx src/11-generics.ts"
```

---

## 1. ジェネリクスの動機(20分)

### 1-1. 問題: 型ごとに関数を書くのは辛い

「配列の最初の要素を返す関数」を考えます。

```typescript
// number 専用
const firstNumber = (arr: number[]): number | undefined => arr[0];
// string 専用
const firstString = (arr: string[]): string | undefined => arr[0];
// User 専用
const firstUser = (arr: User[]): User | undefined => arr[0];
// ... 型が増えるたびに増える 😱
```

`any` を使えば1つで書けますが…

```typescript
const first = (arr: any[]): any => arr[0];

const x = first([1, 2, 3]);  // x の型が any → 型情報が失われる
x.toUpperCase();              // ✅ 通るが実行時に 💥
```

**型の安全性を保ちながら、あらゆる型に対応したい**。これがジェネリクスの動機です。

### 1-2. 解決: 型を引数として渡す

```typescript
const first = <T>(arr: T[]): T | undefined => arr[0];

const x = first([1, 2, 3]);      // T = number と推論 → x: number | undefined
const y = first(["a", "b"]);     // T = string と推論 → y: string | undefined
const z = first([{ id: 1 }]);    // T = { id: number } と推論
```

`<T>` は「**型を仮置きするプレースホルダー**」。関数を呼ぶ瞬間に具体的な型に置き換えられます。

> **Pythonとの比較**
> Python の `TypeVar` に似ていますが、TypeScript は推論が強力で明示的な型指定が不要なケースが多いです。

---

## 2. ジェネリクスの基本(40分)

### 2-1. 基本構文

```typescript
// 関数名の後ろに <T> を書く
const identity = <T>(value: T): T => value;

// 呼び出し時に型を指定(ほとんどの場合不要)
identity<number>(42);   // 明示
identity(42);           // 推論(こちらが一般的)
```

### 2-2. 複数の型パラメータ

```typescript
const pair = <T, U>(a: T, b: U): [T, U] => [a, b];

const p = pair("Alice", 30);  // [string, number]
```

### 2-3. 「型を変換する関数」を表現する

```typescript
// T 型を受け取り U 型に変換するコールバックを使い、U[] を返す
const mapArray = <T, U>(arr: T[], fn: (item: T) => U): U[] => arr.map(fn);

const numbers = [1, 2, 3];
const strings = mapArray(numbers, n => `num-${n}`);  // string[]
const flags   = mapArray(numbers, n => n > 1);        // boolean[]
```

これが標準の `Array.prototype.map` の正体です。VS Code で `.map` を Ctrl+クリックすると型定義を確認できます。

### 2-4. 型パラメータの命名規則

| 名前 | 由来 | 用途 |
|---|---|---|
| `T` | Type | 一般的(最も多い) |
| `U`, `V` | 次のアルファベット | 2つ目、3つ目 |
| `K` | Key | オブジェクトのキー |
| `V` | Value | オブジェクトの値 |
| `E` | Element | 配列の要素 |

### 2-5. ジェネリクスな型エイリアス

関数だけでなく `type` にも使えます。

```typescript
type Box<T> = { value: T };

const numBox: Box<number> = { value: 42 };
const strBox: Box<string> = { value: "hello" };
```

#### 実用例: API レスポンス型

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

type UserResponse    = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;

const fetchUser = async (id: number): Promise<ApiResponse<User>> => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};
```

`ApiResponse<T>` を一度定義すれば、全 API のレスポンス型をシンプルに書けます。

#### ジェネリクス + 判別可能ユニオン

第10章で学んだパターンとの組み合わせ。

```typescript
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// 使い方
const handle = (result: Result<User>): void => {
  if (result.ok) {
    console.log(result.data.name);  // ✅ data がある
  } else {
    console.error(result.error);    // ✅ error がある
  }
};
```

### 🔧 ミニ演習1

次の関数をジェネリクスで書いてください。

1. `last<T>(arr: T[]): T | undefined` — 配列の最後の要素
2. `wrap<T>(value: T): { value: T }` — 値を `{ value }` で包む
3. `merge<T, U>(a: T, b: U): T & U` — 2つのオブジェクトをマージ

<details>
<summary>解答例</summary>

```typescript
const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

const wrap = <T>(value: T): { value: T } => ({ value });

const merge = <T extends object, U extends object>(a: T, b: U): T & U =>
  ({ ...a, ...b } as T & U);

console.log(last([1, 2, 3]));          // 3
console.log(wrap("hello"));             // { value: "hello" }
console.log(merge({ name: "Alice" }, { age: 30 }));  // { name: "Alice", age: 30 }
```

</details>

---

## 3. ⭐ 型パラメータの制約(extends)(30分)

### 3-1. 制約なしの問題

```typescript
const getLength = <T>(value: T): number => {
  return value.length;
  // ❌ Property 'length' does not exist on type 'T'.
};
```

`T` は何でもありなので、`number` のような `length` を持たない型も来うる。

### 3-2. extends で制約をつける

「`T` には `length` プロパティが必要」と制約します。

```typescript
const getLength = <T extends { length: number }>(value: T): number => value.length;

getLength("hello");        // ✅ string は length を持つ
getLength([1, 2, 3]);      // ✅ 配列も持つ
getLength({ length: 10 }); // ✅ 自作オブジェクトでも OK
getLength(123);             // ❌ number は length を持たない
```

`<T extends X>` = 「T は X を満たす型」という制約。

### 3-3. ⭐ keyof との組み合わせ

`keyof T` は「T のすべてのキーの文字列リテラル型」です。

```typescript
const user = { name: "Alice", age: 30, email: "a@ex.com" };
type UserKeys = keyof typeof user;  // "name" | "age" | "email"
```

これを使うとオブジェクトのプロパティを**型安全に**取り出せます。

```typescript
const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

const name  = getProperty(user, "name");   // string
const age   = getProperty(user, "age");    // number
const email = getProperty(user, "email");  // string
const xxx   = getProperty(user, "xxx");    // ❌ "xxx" は存在しない
```

`T[K]` は「T の K キーに対応する値の型」です。この3つ(`T`, `K extends keyof T`, `T[K]`)のセットは実務頻出のパターン。

### 3-4. デフォルト型パラメータ

引数のデフォルト値と同様に、型パラメータにもデフォルトを設定できます。

```typescript
type Container<T = string> = {
  value: T;
  label: string;
};

const c1: Container = { value: "hello", label: "名前" };        // T = string
const c2: Container<number> = { value: 42, label: "年齢" };     // T = number
```

### 🔧 ミニ演習2

```typescript
// 配列から条件に合う要素を取り出す関数をジェネリクスで書いてください
// filter<T>(arr: T[], predicate: (item: T) => boolean): T[]

// 使い方:
// filter([1, 2, 3, 4], n => n % 2 === 0) → [2, 4]
// filter(["a", "bb", "ccc"], s => s.length > 1) → ["bb", "ccc"]
```

<details>
<summary>解答例</summary>

```typescript
const filter = <T>(arr: T[], predicate: (item: T) => boolean): T[] =>
  arr.filter(predicate);

console.log(filter([1, 2, 3, 4], n => n % 2 === 0));       // [2, 4]
console.log(filter(["a", "bb", "ccc"], s => s.length > 1)); // ["bb", "ccc"]
```

`T` が引数と戻り値の両方で使われているので、`filter([1, 2, 3, 4], ...)` と呼ぶと T = number と推論されます。

</details>

---

## 4. ⭐ ユーティリティ型(60分)

TypeScript が標準で用意している**ジェネリクスの型**です。「既存の型を加工して新しい型を作る」ために使います。

### 4-1. なぜ必要か

```typescript
type User = { id: number; name: string; email: string; passwordHash: string };

// ❌ 型ごとに手書きは辛い
type CreateUserInput = { name: string; email: string; passwordHash: string };
type UpdateUserInput = { id?: number; name?: string; email?: string; passwordHash?: string };
type PublicUser      = { id: number; name: string; email: string };

// ✅ ユーティリティ型で1行
type CreateUserInput = Omit<User, "id">;
type UpdateUserInput = Partial<User>;
type PublicUser      = Omit<User, "passwordHash">;
```

**`User` を変更すれば派生型も自動追従**します。

### 4-2. ⭐ Partial<T> — 全プロパティを任意に

```typescript
type User = { id: number; name: string; email: string };

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// 部分更新の関数で頻出
const updateUser = (id: number, updates: Partial<User>): void => { ... };

updateUser(1, { name: "Alice" });         // ✅ name だけ
updateUser(1, { name: "Bob", email: "b@ex.com" });  // ✅ 複数
updateUser(1, {});                        // ✅ 空でも OK
```

### 4-3. Required<T> — 全プロパティを必須に

`Partial` の逆。任意プロパティを必須にします。

```typescript
type Config = { timeout?: number; retries?: number; baseUrl?: string };

type FullConfig = Required<Config>;
// { timeout: number; retries: number; baseUrl: string }
```

### 4-4. Readonly<T> — 全プロパティを変更不可に

```typescript
type User = { id: number; name: string };

type FrozenUser = Readonly<User>;
// { readonly id: number; readonly name: string }

const u: FrozenUser = { id: 1, name: "Alice" };
u.name = "Bob";  // ❌
```

### 4-5. ⭐ Pick<T, K> — 特定のプロパティだけ抜き出す

```typescript
type User = { id: number; name: string; email: string; age: number };

type UserSummary = Pick<User, "id" | "name">;
// { id: number; name: string }
```

### 4-6. ⭐ Omit<T, K> — 特定のプロパティを除く

```typescript
type SafeUser = Omit<User, "passwordHash">;
// { id, name, email } (passwordHash を除く)
```

**Pick vs Omit の使い分け**:
- 残したいプロパティが少ない → `Pick`
- 除きたいプロパティが少ない → `Omit`

### 4-7. ⭐ Record<K, V> — キーと値の型を指定したオブジェクト

```typescript
// Record<キーの型, 値の型>
type ScoreMap = Record<string, number>;
const scores: ScoreMap = { Alice: 90, Bob: 85 };

// リテラル型のユニオンとよく組み合わせる
type Permission = "read" | "write" | "delete";
type RolePermissions = Record<Permission, boolean>;

const adminPerms: RolePermissions = {
  read: true,
  write: true,
  delete: true,
};

// 第10章の as const 対応表を型安全に
type Category = "electronics" | "clothing" | "food";
const ShippingFees: Record<Category, number> = {
  electronics: 1500,
  clothing: 800,
  food: 500,
};
```

### 4-8. ⭐ ReturnType<T> — 関数の戻り値の型を取り出す

```typescript
const fetchUser = async (id: number): Promise<User> => {
  // ...
  return { id, name: "Alice", email: "a@ex.com" };
};

type FetchResult = ReturnType<typeof fetchUser>;
// Promise<User>

type User2 = Awaited<ReturnType<typeof fetchUser>>;
// User (Promise を剥がす)
```

「**型を書き直さず、関数から型を自動取得**」できます。関数の戻り値が変われば型も自動追従。

### 4-9. Parameters<T> — 関数の引数の型を取り出す

```typescript
const createUser = (name: string, age: number, email: string): User => {
  // ...
};

type CreateArgs = Parameters<typeof createUser>;
// [string, number, string]
```

### 4-10. NonNullable<T> — null/undefined を除く

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
```

### 4-11. ユーティリティ型の組み合わせ

複数を組み合わせてより細かい型を作れます。

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
};

// id と passwordHash を除いて、全部任意にする
type PatchInput = Partial<Omit<User, "id" | "passwordHash">>;
// { name?: string; email?: string; role?: "admin" | "user" }

// 特定のプロパティは必須、それ以外は任意
type CreateInput = Required<Pick<User, "name" | "email">> & Partial<Omit<User, "id" | "name" | "email">>;
// { name: string; email: string; passwordHash?: string; role?: "admin" | "user" }
```

### 🔧 ミニ演習3

次の `Product` 型から派生型を作ってください。

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: "electronics" | "clothing" | "food";
};

// 1. 商品作成時の入力(id を除く)
type CreateProductInput = /* ? */;

// 2. 商品更新時の入力(全プロパティ任意)
type UpdateProductInput = /* ? */;

// 3. 商品概要(id, name, price のみ)
type ProductSummary = /* ? */;

// 4. カテゴリ別の在庫数(Record を使う)
type CategoryStock = /* ? */;
```

<details>
<summary>解答例</summary>

```typescript
type CreateProductInput = Omit<Product, "id">;
type UpdateProductInput = Partial<Product>;
type ProductSummary = Pick<Product, "id" | "name" | "price">;
type CategoryStock = Record<Product["category"], number>;
// Record<"electronics" | "clothing" | "food", number>

const stock: CategoryStock = {
  electronics: 150,
  clothing: 300,
  food: 500,
};
```

`Product["category"]` は「Product 型の category プロパティの型」を取り出す記法です。

</details>

---

## 5. keyof と typeof の組み合わせ(20分)

### 5-1. typeof — 値から型を取り出す

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

// typeof で型を取り出す
type Config = typeof config;
// { apiUrl: string; timeout: number; retries: number }

// 関数にも使える
const greet = (name: string): string => `Hello, ${name}`;
type GreetFn = typeof greet;
// (name: string) => string
```

### 5-2. keyof — 型からキーを取り出す

```typescript
type User = { id: number; name: string; email: string };

type UserKey = keyof User;
// "id" | "name" | "email"
```

### 5-3. よく使う組み合わせ

```typescript
const ShippingFees = {
  electronics: 1500,
  clothing: 800,
  food: 500,
} as const;

type Category = keyof typeof ShippingFees;
// "electronics" | "clothing" | "food"

const getFee = (category: Category): number => ShippingFees[category];
```

`typeof` → `keyof` の順で使うと、オブジェクトのキーを型として使えます。第10章の `as const` パターンの定番的な活用法。

---

## 6. 章末演習(30分)

### 🎯 演習: 型安全なローカルストレージ

TypeScript で型安全にローカルストレージを操作するクラスを作ってください。

```typescript
type StorageSchema = {
  theme: "light" | "dark";
  language: "ja" | "en";
  fontSize: number;
};

// TypedStorage クラスを実装する
// - get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null
// - set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void
// - remove<K extends keyof StorageSchema>(key: K): void

// 使い方:
// const storage = new TypedStorage();
// storage.set("theme", "dark");         // ✅
// storage.set("theme", "purple");       // ❌ 型エラー
// const theme = storage.get("theme");   // "light" | "dark" | null
```

<details>
<summary>解答例</summary>

```typescript
type StorageSchema = {
  theme: "light" | "dark";
  language: "ja" | "en";
  fontSize: number;
};

class TypedStorage {
  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as StorageSchema[K];
    } catch {
      return null;
    }
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove<K extends keyof StorageSchema>(key: K): void {
    localStorage.removeItem(key);
  }
}

const storage = new TypedStorage();

storage.set("theme", "dark");         // ✅
// storage.set("theme", "purple");    // ❌ 型エラー
// storage.set("unknownKey", "val");  // ❌ 型エラー

const theme = storage.get("theme");  // "light" | "dark" | null
```

`K extends keyof StorageSchema` で キーを型安全に制限し、`StorageSchema[K]` で値の型も自動的に決まります。これがジェネリクスの実用例です。

</details>

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **ジェネリクス `<T>`**: 「型を引数として渡す」仕組み
2. **型推論が効く**: 呼び出し時に型の明示はほぼ不要
3. **`<T extends X>`**: T に制約をつける
4. **`keyof T`**: T のすべてのキーのリテラル型
5. **`T[K]`**: T の K キーの値の型
6. **`typeof 値`**: 値から型を取り出す

ユーティリティ型の早見表:

| ユーティリティ型 | 説明 |
|---|---|
| `Partial<T>` | 全プロパティを任意に |
| `Required<T>` | 全プロパティを必須に |
| `Readonly<T>` | 全プロパティを変更不可に |
| `Pick<T, K>` | K のプロパティだけ残す |
| `Omit<T, K>` | K のプロパティを除く |
| `Record<K, V>` | キー K、値 V のオブジェクト型 |
| `ReturnType<F>` | 関数 F の戻り値の型 |
| `Parameters<F>` | 関数 F の引数の型(タプル) |
| `NonNullable<T>` | null/undefined を除く |
| `Awaited<T>` | Promise を剥がした型 |

### 確認問題

<details>
<summary>Q1. ジェネリクスを使わずに any を使うとどんな問題があるか?</summary>

`any` を返す関数を呼んだ結果も `any` になり、型情報が完全に失われます。その後のプロパティアクセスやメソッド呼び出しがエラーを出さなくなり、実行時エラーが起きやすくなります。ジェネリクスを使えば型を保ったまま汎用的なコードが書けます。
</details>

<details>
<summary>Q2. Partial と Omit の違いは?</summary>

- `Partial<T>`: 全プロパティを**任意**(`?:`)にする。プロパティ自体は残る
- `Omit<T, K>`: 指定したプロパティを**削除**する。残りは変化なし
</details>

<details>
<summary>Q3. keyof と typeof の違いと使い分けは?</summary>

- `keyof 型`: **型**からキーの文字列リテラルユニオンを取り出す
- `typeof 値`: **値**から型を取り出す

セットで使うことが多い: `keyof typeof obj` で「オブジェクトのキーの型」を得る。
</details>

---

## 次の章へ

第11章で**ジェネリクスとユーティリティ型**をマスターしました。次の第12章では **型ガードと narrowing** を学びます。ユニオン型の値を「具体的な型として確定させる」技術で、第10章の判別可能ユニオンとも密接に関連します。

---

> 🎯 **コラム: ジェネリクスは「設計の道具」**
>
> ジェネリクスを使うと、「**型に依存しない汎用的な設計**」ができます。
>
> ```typescript
> // 型を具体化するほど汎用性が下がる
> const saveUser = (user: User): void => { ... };
>
> // ジェネリクスで汎用化
> const save = <T>(item: T): void => { ... };
>
> // 制約で「型安全かつ汎用」のバランスをとる
> const saveWithId = <T extends { id: number }>(item: T): void => { ... };
> ```
>
> TypeScript の標準ライブラリ(`Array`、`Promise`、`Map` など)はすべてジェネリクスで実装されています。「`map<U>(...)`」や「`Promise<T>`」の `<T>` が今学んだジェネリクスです。
>
> React の `useState<T>` も同じ仕組みです。第14章で再登場します。

お疲れさまでした!次の第12章で会いましょう ☕
