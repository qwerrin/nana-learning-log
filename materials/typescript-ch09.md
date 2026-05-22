# 第9章 型エイリアスとインターフェース

## この章のゴール

- 型エイリアス(`type`)の書き方と活用法を理解する
- インターフェース(`interface`)の書き方を理解する
- `type` と `interface` の違いを説明できる
- インターセクション型(`&`)で型を合成できる
- `interface extends` で型を継承できる
- **使い分けの方針**を判断できる

**所要時間の目安: 2.5時間**

---

## 0. この章の準備

`02-types/` に `src/09-type-interface.ts` を作って進めましょう。

```json
"start": "tsx src/09-type-interface.ts"
```

---

## 0-1. なぜ型に名前をつけるのか

ここまでの章では、オブジェクト型を**毎回インラインで**書いていました。

```typescript
const formatUser = (user: { name: string; age: number; email: string }): string => {
  return `${user.name} (${user.age}歳)`;
};

const updateUser = (
  user: { name: string; age: number; email: string },
  name: string
): { name: string; age: number; email: string } => {
  return { ...user, name };
};
```

同じ型を何度も書くのは冗長で、変更も大変。**型に名前をつけて再利用する**仕組みが**型エイリアス**と**インターフェース**です。

**結論を先に言うと、本資料の方針は「迷ったら `type`、宣言マージが必要なら `interface`」**です。

---

## 1. 型エイリアス(type)(45分)

### 1-1. 基本の書き方

`type` キーワードで型に名前をつけます。

```typescript
type User = {
  name: string;
  age: number;
  email: string;
};

// 型注釈の場所に使える
const alice: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};

const formatUser = (user: User): string => `${user.name} (${user.age}歳)`;
const updateUser = (user: User, name: string): User => ({ ...user, name });
```

### 1-2. オブジェクト型以外も書ける

`type` の強みは**何にでも名前をつけられる**ことです。

```typescript
// プリミティブの別名
type UserId = number;
type UserName = string;

// 配列・タプル
type Numbers = number[];
type Coordinate = [number, number];

// 関数型
type Greeter = (name: string) => string;

// ユニオン型(第10章で詳しく)
type Status = "pending" | "active" | "suspended";

// 使い方
const id: UserId = 12345;
const greet: Greeter = name => `Hello, ${name}`;
const status: Status = "active";
const point: Coordinate = [10, 20];
```

### 1-3. 命名規則

```typescript
// ✅ PascalCase(各単語の先頭を大文字)
type User = { ... };
type ProductOrder = { ... };
type ApiResponse = { ... };

// ❌ 避ける
type user = { ... };      // 小文字始まり
type IUser = { ... };     // I プレフィックス(古いスタイル)
type Data = { ... };      // 曖昧すぎる
```

> **`I` プレフィックスを付けない**
> `IUser` のように `I` を頭につけるのは C# 文化の名残で、現代 TypeScript では使いません。TypeScript 標準ライブラリも使っていません。

### 1-4. 型の中で型を使う(ネスト)

```typescript
type Address = {
  city: string;
  zip: string;
  street: string;
};

type User = {
  id: number;
  name: string;
  address: Address;       // 別の型を参照
  friends: User[];        // 自己参照もできる(再帰型)
};

type Company = {
  name: string;
  ceo: User;
  employees: User[];
};
```

### 1-5. ⭐ インターセクション型(`&`)

「**A かつ B のプロパティを両方持つ**」型を作ります。

```typescript
type WithId = {
  readonly id: number;
};

type WithTimestamps = {
  readonly createdAt: Date;
  updatedAt: Date;
};

// & で合体
type User = WithId & WithTimestamps & {
  name: string;
  email: string;
};

const u: User = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Alice",
  email: "alice@example.com",
};
```

**共通プロパティをパーツとして再利用**できます。

```typescript
// 他の型でも再利用
type Post = WithId & WithTimestamps & {
  title: string;
  content: string;
};

type Comment = WithId & WithTimestamps & {
  text: string;
  authorId: number;
};
```

### 🔧 ミニ演習1

次の型を定義してください。

- `Point`: `x: number`, `y: number`
- `Color`: `r: number`, `g: number`, `b: number`
- `ColoredPoint`: `Point` と `Color` の両方のプロパティを持つ(`&` を使う)

<details>
<summary>解答例</summary>

```typescript
type Point = { x: number; y: number };
type Color = { r: number; g: number; b: number };
type ColoredPoint = Point & Color;

const cp: ColoredPoint = { x: 10, y: 20, r: 255, g: 128, b: 0 };
console.log(cp);
```

</details>

---

## 2. インターフェース(interface)(30分)

### 2-1. 基本の書き方

`interface` でも型に名前をつけられます。

```typescript
interface User {
  name: string;
  age: number;
  email?: string;    // オプショナル
  readonly id: number;
}

const alice: User = { id: 1, name: "Alice", age: 30 };
```

`type User = { ... }` と `interface User { ... }` は**ほぼ同じ意味**です。文法の違いは `=` の有無だけ。

### 2-2. ⭐ extends で継承

`interface` のメリットは `extends` で継承できることです。

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
}

// Dog は Animal のプロパティも持つ
const pochi: Dog = {
  name: "ポチ",
  age: 3,
  breed: "柴犬",
};
```

複数の interface を継承することもできます。

```typescript
interface WithId {
  readonly id: number;
}

interface WithTimestamps {
  readonly createdAt: Date;
  updatedAt: Date;
}

// カンマ区切りで複数継承
interface User extends WithId, WithTimestamps {
  name: string;
  email: string;
}
```

### 2-3. 宣言マージ — interface 独自の機能

同じ名前で複数回宣言すると**自動的にマージされます**。

```typescript
interface User {
  name: string;
}

interface User {
  age: number;  // 後から追加
}

// User は { name: string; age: number } になる
const u: User = { name: "Alice", age: 30 };  // ✅
```

`type` で同じことをするとエラーになります。

```typescript
type User = { name: string };
type User = { age: number };
// ❌ Duplicate identifier 'User'.
```

**宣言マージの主な用途**: ライブラリの型を後から拡張するとき。

```typescript
// Express の Request 型にカスタムプロパティを追加する例
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
```

初学者のうちは使う機会は少ないですが、ライブラリのコードを読んでいるときに出てくるので知っておきましょう。

### 🔧 ミニ演習2

`Animal` インターフェースを継承した `Bird` を定義してください。

- `Animal`: `name: string`, `age: number`
- `Bird`(Animal を継承): `wingSpan: number`, `canFly: boolean`

<details>
<summary>解答例</summary>

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Bird extends Animal {
  wingSpan: number;
  canFly: boolean;
}

const sparrow: Bird = { name: "スズメ", age: 1, wingSpan: 22, canFly: true };
const penguin: Bird = { name: "ペンギン", age: 5, wingSpan: 80, canFly: false };

console.log(`${sparrow.name}: 飛べる=${sparrow.canFly}`);
console.log(`${penguin.name}: 飛べる=${penguin.canFly}`);
```

</details>

---

## 3. ⭐ type vs interface の使い分け(25分)

### 3-1. 比較表

| 機能 | `type` | `interface` |
|---|---|---|
| オブジェクト型の定義 | ✅ | ✅ |
| 継承・拡張 | `&`(インターセクション) | `extends` |
| 宣言マージ | ❌ | ✅ |
| ユニオン型 `\|` | ✅ | ❌ |
| タプル・配列型 | ✅ | ❌ |
| プリミティブの別名 | ✅ | ❌ |
| 計算型(`keyof` など) | ✅ | ❌ |
| `implements` での使用 | ✅ | ✅ |

### 3-2. type にしかできないこと

```typescript
// ユニオン型
type Status = "active" | "inactive" | "banned";

// タプル
type Coordinate = [number, number];

// プリミティブ別名
type UserId = number;

// 計算型(第11章で詳しく)
type UserKeys = keyof User;  // "id" | "name" | "email" | ...
```

### 3-3. interface にしかできないこと

```typescript
// 宣言マージ(ライブラリの型拡張)
interface Window {
  myCustomProp: string;  // グローバルの Window 型を拡張
}
```

### 3-4. ⭐ 本資料の使い分け方針

```
迷ったら type を使う

例外:
- クラスに implements するとき → どちらでもOK(慣習的に interface が多い)
- ライブラリの型を拡張するとき → interface(宣言マージが必要)
```

この方針の理由:
- `type` の方が表現力が高い(ユニオン型・計算型を同じ記法で書ける)
- コードベースを `type` で統一すると迷いが減る
- `interface` に必要な機能(宣言マージ)はほとんどの場面で不要

---

## 4. 型を拡張するパターン(20分)

### 4-1. 共通プロパティを部品化する

```typescript
type Identifiable = { readonly id: number };
type Timestamped = { readonly createdAt: Date; updatedAt: Date };
type Authored = { readonly authorId: number };

// パーツを組み合わせる
type Article = Identifiable & Timestamped & Authored & {
  title: string;
  content: string;
};

type Comment = Identifiable & Timestamped & Authored & {
  text: string;
  parentArticleId: number;
};
```

### 4-2. 型を「絞る」パターン

「ある型からプロパティを減らした型」を作ることもあります。TypeScript には専用のユーティリティ型があります(第11章で詳しく)。

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;  // 外部に公開したくない
};

// passwordHash を除いた型(Omit は第11章で詳しく)
type PublicUser = Omit<User, "passwordHash">;
// → { id, name, email }

// 必要なものだけ選ぶ(Pick は第11章で詳しく)
type UserSummary = Pick<User, "id" | "name">;
// → { id, name }
```

### 4-3. 型定義ファイルに分ける

実務では、型定義を専用ファイルにまとめるパターンが多いです。

```
src/
├── types.ts        ← 型定義をまとめる
├── api.ts          ← API 関連の関数
└── utils.ts        ← ユーティリティ関数
```

```typescript
// src/types.ts
export type User = {
  readonly id: number;
  name: string;
  email: string;
};

export type Post = {
  readonly id: number;
  title: string;
  content: string;
  author: User;
  tags: string[];
};
```

```typescript
// src/api.ts
import type { User, Post } from "./types.js";

export const fetchUser = async (id: number): Promise<User> => {
  // ...
};
```

### 🔧 ミニ演習3

次の型を設計してください。

- `Product`: `id`(readonly)、`name`、`price`、`category`
- `CartItem`: `Product` を含み、`quantity` を追加(`&` または `interface extends`)
- `Cart`: `items: CartItem[]`、`userId: number`

そして `calcCartTotal(cart: Cart): number` を実装してください。

<details>
<summary>解答例</summary>

```typescript
type Product = {
  readonly id: number;
  name: string;
  price: number;
  category: string;
};

type CartItem = Product & {
  quantity: number;
};

type Cart = {
  userId: number;
  items: CartItem[];
};

const calcCartTotal = (cart: Cart): number =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// 動作確認
const cart: Cart = {
  userId: 1,
  items: [
    { id: 1, name: "りんご", price: 100, category: "果物", quantity: 3 },
    { id: 2, name: "牛乳", price: 200, category: "飲料", quantity: 2 },
  ],
};

console.log(calcCartTotal(cart));  // 700
```

</details>

---

## 5. 章末演習(25分)

### 🎯 演習: EC サイトの型設計

次の型を定義して、関連する関数を実装してください。

**要件**:
- `Customer`: `id`(readonly)、`name`、`email`
- `ShippingAddress`: `recipient`、`zip`、`city`、`street`
- `OrderItem`: `productId`、`productName`、`price`、`quantity`
- `Order`: `id`(readonly)、`customer`、`items: OrderItem[]`、`shippingAddress`、`notes?`(任意)、`status: "pending" | "shipped" | "delivered"`

実装する関数:
1. `calcTotal(order: Order): number` — 注文の合計金額
2. `formatOrder(order: Order): string` — `"注文#ID: 顧客名 / 合計: X円 [ステータス]"` の形式
3. `isPending(order: Order): boolean` — ステータスが `pending` かどうか

<details>
<summary>解答例</summary>

```typescript
type Customer = {
  readonly id: number;
  name: string;
  email: string;
};

type ShippingAddress = {
  recipient: string;
  zip: string;
  city: string;
  street: string;
};

type OrderItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

type OrderStatus = "pending" | "shipped" | "delivered";

type Order = {
  readonly id: number;
  customer: Customer;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  notes?: string;
  status: OrderStatus;
};

const calcTotal = (order: Order): number =>
  order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const formatOrder = (order: Order): string =>
  `注文#${order.id}: ${order.customer.name} / 合計: ${calcTotal(order)}円 [${order.status}]`;

const isPending = (order: Order): boolean => order.status === "pending";

// 動作確認
const order: Order = {
  id: 1001,
  customer: { id: 1, name: "Alice", email: "alice@example.com" },
  items: [
    { productId: 1, productName: "TypeScript本", price: 2500, quantity: 1 },
    { productId: 2, productName: "コーヒー豆", price: 1200, quantity: 2 },
  ],
  shippingAddress: {
    recipient: "Alice",
    zip: "150-0001",
    city: "渋谷区",
    street: "道玄坂1-1",
  },
  status: "pending",
};

console.log(formatOrder(order));  // 注文#1001: Alice / 合計: 4900円 [pending]
console.log(isPending(order));    // true
```

</details>

---

## 6. この章のまとめ

### 覚えておきたいこと

1. **`type`** で型に名前をつけて再利用できる
2. **`type` は何にでも使える**: オブジェクト・配列・関数型・ユニオン型など
3. **命名は PascalCase**。`I` プレフィックスは現代 TS では不要
4. **インターセクション型 `&`** で複数の型を合成する
5. **`interface extends`** で継承できる
6. **宣言マージ** は `interface` 独自の機能(ライブラリ拡張で使う)
7. **使い分け**: 迷ったら `type`、宣言マージが必要なら `interface`

### 確認問題

<details>
<summary>Q1. type にできて interface にできないことを2つ挙げよ</summary>

1. **ユニオン型**: `type Status = "a" | "b"` は interface では書けない
2. **タプル・プリミティブ別名**: `type Coord = [number, number]` は interface では書けない
3. **計算型**: `type Keys = keyof User` は interface では書けない
</details>

<details>
<summary>Q2. interface の宣言マージとは何か? いつ使うか?</summary>

同じ名前の `interface` を複数宣言すると、自動的に1つにマージされる機能です。主に**ライブラリが用意した型に後からプロパティを追加する**ときに使います(Express の Request 型への拡張など)。
</details>

<details>
<summary>Q3. type と interface どちらを使うべきか?</summary>

**迷ったら `type`**。理由は `type` の方が表現力が高く、ユニオン型や計算型も同じ記法で書けるから。`interface` が必要な場面(宣言マージ)は限られているので、`type` で統一するとシンプルに書けます。
</details>

---

## 次の章へ

第9章で**型に名前をつけて再利用する**方法を習得しました。次の第10章では **ユニオン型・リテラル型・`as const`** を学びます。「複数の型のうちのどれか」を表現するユニオン型は、TypeScript の最も強力な機能のひとつです。

---

> 🎯 **コラム: 型を「設計」する**
>
> 型を定義することは、実は**プログラムを設計すること**と同義です。
>
> ```typescript
> // 型を見るだけで「どんなデータを扱うシステムか」が分かる
> type Order = {
>   id: number;
>   customer: Customer;
>   items: OrderItem[];
>   status: "pending" | "shipped" | "delivered";
> };
> ```
>
> コードを書く前に「どんな型が必要か」を考える習慣を持つと、実装がスムーズになります。型は**ドキュメント**であり、**仕様書**でもあります。
>
> 特に `status: "pending" | "shipped" | "delivered"` のように、**有効な値の集合**を型で表現すると、不正な値が入り込むバグを型レベルで防げます。次章の**ユニオン型・リテラル型**でこの力をさらに深めます。

お疲れさまでした!次の第10章で会いましょう ☕
