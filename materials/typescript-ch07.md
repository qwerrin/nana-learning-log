# 第7章 クラス・モジュール

## この章のゴール

- TypeScript のクラスにフィールド宣言・型注釈をつけられる
- アクセス修飾子(`public`/`private`/`protected`)を使い分けられる
- `private` と `#` の違いを理解する
- `readonly` フィールドを使える
- 継承(`extends`)・オーバーライド・`super` を書ける
- `implements` でインターフェースを実装できる
- `import`/`export` で型と値を使い分けられる

**所要時間の目安: 3時間**

---

## 0. この章の準備

`01-basics/` のセットアップを引き続き使います。新しいファイル `src/07-classes.ts` を作って進めましょう。

モジュールのセクションでは複数ファイルを使うので、`src/` の中に `modules/` フォルダを作ります。

```json
"start": "tsx src/07-classes.ts"
```

---

## 1. TypeScript のクラス基本(40分)

### 1-1. JS のクラスに型をつける

JS Day5 で書いたクラスに型注釈を加えるだけです。

```typescript
class User {
  name: string;   // フィールド宣言(TS では必要)
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `こんにちは、${this.name}さん!`;
  }
}

const alice = new User("Alice", 30);
console.log(alice.greet());   // "こんにちは、Aliceさん!"
console.log(alice.name);      // "Alice"
```

JS との違い:
- **クラスの中でフィールドを宣言する**(`name: string;`)
- コンストラクタ引数に型をつける
- メソッドの戻り値に型をつける(推論可、明示推奨)

### 1-2. Python との比較

| Python | TypeScript |
|---|---|
| `__init__` | `constructor` |
| `self`(引数に書く) | `this`(引数に書かない) |
| `def method(self):` | `method(): ReturnType { }` |
| `User(...)` | `new User(...)`(`new` 必須) |

> **`new` を忘れずに**
> TypeScript を使えばコンパイラが `new` の抜け忘れを教えてくれます。

### 1-3. アクセス修飾子

フィールドやメソッドに**可視性**を指定できます。

| 修飾子 | 意味 |
|---|---|
| `public` | どこからでもアクセス可能(デフォルト) |
| `private` | クラス内からのみ |
| `protected` | クラス内 + 継承先のみ |

```typescript
class BankAccount {
  public owner: string;      // どこからでもアクセス可
  private balance: number;   // クラス内のみ
  protected rate: number;    // 継承先まで

  constructor(owner: string, initial: number) {
    this.owner = owner;
    this.balance = initial;
    this.rate = 0.01;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const acc = new BankAccount("Alice", 1000);
console.log(acc.owner);      // ✅ public
console.log(acc.balance);    // ❌ Property 'balance' is private
acc.deposit(500);
console.log(acc.getBalance()); // ✅ 1500
```

**「外から触ってほしくないものは `private`」**が基本方針です。

### 1-4. ⭐ private vs # の違い

JS Day5 で学んだ `#` と TypeScript の `private` は別物です。

```typescript
class A {
  private balance: number = 0;  // TypeScript の private
}

class B {
  #balance: number = 0;          // JavaScript 標準の private
}
```

| 項目 | `private` | `#field` |
|---|---|---|
| コンパイル時のチェック | ✅ | ✅ |
| 実行時のアクセス禁止 | ❌(JS にすると消える) | ✅(本当に触れない) |
| 推奨度 | やや古い | **最近はこちら推奨** |

**実用上はどちらでもOK**。最近は `#` のほうが推奨される傾向にあります。本資料では `#` を基本に使います。

### 1-5. readonly フィールド

```typescript
class User {
  readonly id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const u = new User(1, "Alice");
u.name = "Bob";  // ✅ 変更可
u.id = 2;         // ❌ Cannot assign to 'id' because it is a read-only property.
```

`id` のように「一度決めたら変えてはいけない値」に `readonly` を使います。

### 1-6. コンストラクタ省略形(参考)

「コンストラクタ引数 = フィールド」のとき、アクセス修飾子をつけると自動的にフィールド宣言と代入をしてくれます。

```typescript
// 通常の書き方
class User {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// 省略形(public をつけると自動化)
class User {
  constructor(public name: string, public age: number) {}
}
```

> ⚠️ **Node.js で直接 `.ts` を実行する場合は動かないことがある**
>
> `node --experimental-strip-types` などで直接実行するモードでは、この省略形がサポートされていません。`tsx` を使う本資料の環境では問題ありませんが、チームによっては通常の書き方を統一することもあります。

### 🔧 ミニ演習1

`BankAccount` クラスを書いてください。

- `#balance`(プライベートフィールド)
- `readonly owner: string`
- `deposit(amount: number): void`
- `withdraw(amount: number): void`(残高不足なら例外)
- `getBalance(): number`

<details>
<summary>解答例</summary>

```typescript
class BankAccount {
  readonly owner: string;
  #balance: number;

  constructor(owner: string, initial: number = 0) {
    this.owner = owner;
    this.#balance = initial;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("入金額は正の数が必要です");
    this.#balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("出金額は正の数が必要です");
    if (amount > this.#balance) throw new Error("残高不足");
    this.#balance -= amount;
  }

  getBalance(): number {
    return this.#balance;
  }
}

const acc = new BankAccount("Alice", 1000);
acc.deposit(500);
console.log(acc.getBalance());  // 1500

try {
  acc.withdraw(9999);
} catch (e) {
  if (e instanceof Error) console.error(e.message);  // "残高不足"
}
```

</details>

---

## 2. 継承・implements・abstract(35分)

### 2-1. 継承(extends)

```typescript
class Animal {
  constructor(public name: string) {}

  speak(): void {
    console.log(`${this.name} が鳴きました`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);  // 親のコンストラクタを先に呼ぶ(必須)
  }

  // メソッドのオーバーライド
  speak(): void {
    console.log(`${this.name}: ワン!`);
  }

  // 独自メソッド
  fetch(): void {
    console.log(`${this.name} がボールを取ってきた!`);
  }
}

const pochi = new Dog("ポチ", "柴犬");
pochi.speak();   // "ポチ: ワン!"
pochi.fetch();   // "ポチ がボールを取ってきた!"
```

> ⚠️ **子クラスでコンストラクタを書くとき、`super()` を最初に呼ぶ**
> これを忘れるとコンパイルエラーになります。

#### 親のメソッドも呼ぶ

```typescript
class Dog extends Animal {
  speak(): void {
    super.speak();           // 親の処理も実行
    console.log("ワン!");
  }
}
```

#### 継承は使いすぎ注意

深く重ねるとコードが複雑になります。「**2段階まで**」を目安に、複雑になったら後述の `implements` + コンポジションを検討しましょう。

### 2-2. ⭐ implements でインターフェースを実装

第9章で詳しく学ぶ `interface` ですが、クラスとの組み合わせが重要なので先に紹介します。

```typescript
interface Greetable {
  greet(): string;
}

interface Describable {
  describe(): string;
}

class User implements Greetable, Describable {
  constructor(public name: string, public age: number) {}

  greet(): string {
    return `Hello, ${this.name}!`;
  }

  describe(): string {
    return `${this.name}(${this.age}歳)`;
  }
}
```

`implements` を使うと、**インターフェースが要求するメソッドが必ずあること**が保証されます。

```typescript
class IncompleteUser implements Greetable {
  // greet がない!
}
// ❌ Class 'IncompleteUser' incorrectly implements interface 'Greetable'.
//    Property 'greet' is missing...
```

#### extends vs implements の違い

| | `extends` | `implements` |
|---|---|---|
| 何を継承するか | **実装**(コード)も継承 | **形(契約)だけ**を継承 |
| 多重は？ | 1つだけ | 複数OK |
| いつ使う | 共通の実装を再利用したい | 「この型を満たす」と約束したい |

実務では **`interface` + `implements`** の組み合わせが多く使われます。`extends` は「共通の実装を持たせたい」ときだけ。

### 2-3. 抽象クラス(abstract)

「直接インスタンス化できない、雛形のクラス」です。

```typescript
abstract class Shape {
  // 抽象メソッド: 子クラスで必ず実装する
  abstract area(): number;

  // 通常のメソッド: 共通の処理を持てる
  describe(): string {
    return `この図形の面積は ${this.area().toFixed(2)} です`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }
}

const c = new Circle(5);
console.log(c.describe());  // "この図形の面積は 78.54 です"

new Shape();  // ❌ Cannot create an instance of an abstract class.
```

**`interface` との使い分け**:
- **`interface`**: 形だけを約束する(実装は各クラスで書く)
- **`abstract class`**: 共通の実装も提供しつつ、一部は子クラスに委ねる

実務では **`interface` で十分なことが多い**です。

### 🔧 ミニ演習2

`Logger` インターフェースを実装する `ConsoleLogger` クラスを書いてください。

```typescript
interface Logger {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

// ConsoleLogger を実装する
// log → [LOG] message
// warn → [WARN] message
// error → [ERROR] message
```

<details>
<summary>解答例</summary>

```typescript
interface Logger {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

const logger: Logger = new ConsoleLogger();
logger.log("処理開始");
logger.warn("メモリが少ない");
logger.error("接続失敗");
```

`const logger: Logger = new ConsoleLogger()` のように型を `Logger` にしておくと、後で `FileLogger` に差し替えたときもコードを変えなくて済みます。これが `implements` を使う価値の本質です。

</details>

---

## 3. getter / setter / static(20分)

### 3-1. getter / setter

メソッドを「プロパティのように」呼べる仕組みです。

```typescript
class User {
  constructor(
    private _firstName: string,
    private _lastName: string
  ) {}

  // getter: () なしで読める
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  // setter: = で書ける
  set fullName(value: string) {
    const parts = value.split(" ");
    this._firstName = parts[0] ?? "";
    this._lastName = parts[1] ?? "";
  }
}

const user = new User("Alice", "Smith");
console.log(user.fullName);  // "Alice Smith"

user.fullName = "Bob Johnson";
console.log(user.fullName);  // "Bob Johnson"
```

getter の戻り値型は自動推論されますが、明示推奨です。

### 3-2. static メソッド・プロパティ

インスタンスを作らずに呼べるメソッドです。

```typescript
class MathUtils {
  static readonly PI = 3.14159;

  static double(n: number): number {
    return n * 2;
  }

  static square(n: number): number {
    return n ** 2;
  }
}

// new せずに呼べる
console.log(MathUtils.PI);          // 3.14159
console.log(MathUtils.double(5));   // 10
console.log(MathUtils.square(4));   // 16
```

関連する関数をまとめる「名前空間」的な使い方が典型。ただし現代 TypeScript では **普通の関数を `export` する方が主流**です。クラスである必要がないなら、シンプルな関数で十分です。

---

## 4. ジェネリクスクラス(15分)

クラスにもジェネリクスを使えます。

```typescript
class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  get size(): number {
    return this.#items.length;
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }
}

// number のスタック
const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log(numStack.peek());  // 3
console.log(numStack.pop());   // 3
console.log(numStack.size);    // 2

// string のスタック
const strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");

numStack.push("text");  // ❌ string は number スタックに入れられない
```

`class Stack<T>` のようにクラス名の後に `<T>` を書きます。インスタンス化時に `new Stack<number>()` で型を指定。ジェネリクスの詳細は第11章で学びます。

---

## 5. モジュール(25分)

### 5-1. export の基本

```typescript
// math.ts
export const add = (a: number, b: number): number => a + b;
export const multiply = (a: number, b: number): number => a * b;
export const PI = 3.14159;
```

```typescript
// user.ts
export type User = { name: string; age: number };

export class UserService {
  createUser(name: string, age: number): User {
    return { name, age };
  }
}
```

### 5-2. import の基本

```typescript
// app.ts
import { add, multiply, PI } from "./math.js";
import { User, UserService } from "./user.js";

console.log(add(1, 2));         // 3
console.log(PI);                // 3.14159

const service = new UserService();
const user: User = service.createUser("Alice", 30);
```

> ⚠️ **拡張子は `.js`**
>
> TypeScript で書くとき、import のパスは `.ts` ではなく `.js` にします。これは TypeScript がコンパイル後の JS を参照するためです。
>
> ```typescript
> import { add } from "./math.js";  // ✅
> import { add } from "./math.ts";  // ❌(一般的ではない)
> ```

### 5-3. ⭐ import type — 型だけの import

「型だけを import する」と明示する書き方です。

```typescript
// 型だけを import
import type { User } from "./user.js";

// 値は普通に import
import { UserService } from "./user.js";
```

#### なぜ使うのか

- コンパイル後の JS に型の import 文が含まれなくなる(コードが軽くなる)
- 「これは型のみ」が読み手に伝わる
- `isolatedModules: true` の設定で必要になる場合がある

```typescript
// 1行で値と型を混在させる書き方
import { UserService, type User } from "./user.js";
```

**初学者の方針**: 最初は普通の `import` で問題なし。`import type` を見たら「型だけのインポートだな」と理解できれば OK。

### 5-4. デフォルトエクスポートと名前付きエクスポート

```typescript
// デフォルトエクスポート(1ファイルに1つ)
export default class UserService { ... }

// 名前付きエクスポート(複数OK)
export const add = ...;
export type User = ...;
```

**現代 TypeScript では名前付きエクスポートが主流**です。理由:
- エディタの自動 import が効きやすい
- リネームしやすい
- `import type` と組み合わせやすい

### 5-5. 再エクスポート

複数ファイルの export を1か所にまとめられます。

```typescript
// utils/index.ts
export { add, multiply } from "./math.js";
export type { User } from "./user.js";
export { UserService } from "./user.js";
```

```typescript
// app.ts — utils/index.ts から一括 import
import { add, User, UserService } from "./utils/index.js";
```

### 🔧 ミニ演習3

以下の構成でファイルを作って、動作確認してください。

```
src/modules/
├── types.ts      ← User 型と Product 型を export
├── utils.ts      ← formatUser 関数と calcTotal 関数を export
└── index.ts      ← types.ts と utils.ts を再エクスポート
```

```typescript
// 使う側
import { User, Product, formatUser, calcTotal } from "./modules/index.js";

const user: User = { name: "Alice", age: 30 };
console.log(formatUser(user));  // "Alice(30歳)"

const products: Product[] = [
  { name: "本", price: 1500 },
  { name: "ペン", price: 200 },
];
console.log(calcTotal(products));  // 1700
```

<details>
<summary>解答例</summary>

```typescript
// src/modules/types.ts
export type User = { name: string; age: number };
export type Product = { name: string; price: number };
```

```typescript
// src/modules/utils.ts
import type { User, Product } from "./types.js";

export const formatUser = (user: User): string =>
  `${user.name}(${user.age}歳)`;

export const calcTotal = (products: Product[]): number =>
  products.reduce((sum, p) => sum + p.price, 0);
```

```typescript
// src/modules/index.ts
export type { User, Product } from "./types.js";
export { formatUser, calcTotal } from "./utils.js";
```

```typescript
// src/07-classes.ts(使う側)
import type { User, Product } from "./modules/index.js";
import { formatUser, calcTotal } from "./modules/index.js";

const user: User = { name: "Alice", age: 30 };
console.log(formatUser(user));

const products: Product[] = [
  { name: "本", price: 1500 },
  { name: "ペン", price: 200 },
];
console.log(calcTotal(products));  // 1700
```

</details>

---

## 6. 章末演習(30分)

### 🎯 演習: ToDoリスト管理クラス

TypeScript でフル実装した ToDo 管理クラスを作ってください。

```typescript
type Priority = "high" | "medium" | "low";

type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
};

interface TodoStore {
  add(title: string, priority: Priority): Todo;
  complete(id: number): void;
  delete(id: number): void;
  getAll(): readonly Todo[];
  getPending(): Todo[];
  getByPriority(priority: Priority): Todo[];
}

// TodoList クラスを TodoStore インターフェースを implements して実装する
```

<details>
<summary>解答例</summary>

```typescript
type Priority = "high" | "medium" | "low";

type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
};

interface TodoStore {
  add(title: string, priority: Priority): Todo;
  complete(id: number): void;
  delete(id: number): void;
  getAll(): readonly Todo[];
  getPending(): Todo[];
  getByPriority(priority: Priority): Todo[];
}

class TodoList implements TodoStore {
  #todos: Todo[] = [];
  #nextId = 1;

  add(title: string, priority: Priority): Todo {
    const todo: Todo = {
      id: this.#nextId++,
      title,
      done: false,
      priority,
    };
    this.#todos.push(todo);
    return todo;
  }

  complete(id: number): void {
    const todo = this.#todos.find(t => t.id === id);
    if (!todo) throw new Error(`ID ${id} の ToDo が見つかりません`);
    todo.done = true;
  }

  delete(id: number): void {
    const idx = this.#todos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`ID ${id} の ToDo が見つかりません`);
    this.#todos.splice(idx, 1);
  }

  getAll(): readonly Todo[] {
    return this.#todos;
  }

  getPending(): Todo[] {
    return this.#todos.filter(t => !t.done);
  }

  getByPriority(priority: Priority): Todo[] {
    return this.#todos.filter(t => t.priority === priority);
  }
}

// 動作確認
const list = new TodoList();
list.add("TypeScript を学ぶ", "high");
list.add("買い物をする", "medium");
list.add("本を読む", "low");
list.add("運動する", "high");

list.complete(1);

console.log("全件:", list.getAll().map(t => t.title));
console.log("未完了:", list.getPending().map(t => t.title));
console.log("高優先度:", list.getByPriority("high").map(t => t.title));
```

</details>

---

## 7. この章のまとめ

### 覚えておきたいこと

1. TS のクラスでは**フィールドを先に宣言する**(`name: string;`)
2. **アクセス修飾子**: `public`(デフォルト)/ `private` / `protected`
3. **`#field`** はランタイムでも保護される。最近は `private` より推奨
4. **`readonly`** で変更不可フィールド
5. **`extends`** で実装を継承。コンストラクタでは `super()` を最初に呼ぶ
6. **`implements`** でインターフェースの形を保証。複数OK
7. **`abstract class`** は直接 `new` できない雛形クラス
8. **名前付き `export`** が現代 TS の主流
9. **`import type`** で型だけを明示的に import する

### 確認問題

<details>
<summary>Q1. private と # の主な違いは?</summary>

- `private`: TypeScript のコンパイル時のみチェック。JS に変換後は通常のプロパティになる
- `#`: JavaScript 標準の仕様。実行時も本当にアクセスできない

最近は `#` のほうが推奨されています。
</details>

<details>
<summary>Q2. extends と implements の違いは?</summary>

- `extends`: 親クラスの実装(コード)も継承する。1つだけ
- `implements`: インターフェースの「形」を約束するだけ。実装は自分で書く。複数 OK

実務では「共通の処理を持たせたい」→ `extends`、「この型を満たすと約束したい」→ `implements` と使い分けます。
</details>

<details>
<summary>Q3. import type を使うメリットは?</summary>

- コンパイル後の JS に型の import 文が含まれなくなり、コードが軽くなる
- 読み手に「これは型だけ」と明示できる
- `isolatedModules: true` の環境で必要になる場合がある
</details>

---

## 次の章へ

第7章で**クラスとモジュール**をマスターしました。次の第8章では **非同期処理** を学びます。`Promise`/`async`/`await` に TypeScript の型をつけて、API 呼び出しや非同期処理を安全に書けるようになります。

---

> 🎯 **コラム: クラスを使う vs 関数を使う**
>
> 現代の TypeScript では、「**クラスを使うべきか、関数とオブジェクトを使うべきか**」という議論がよくあります。
>
> **クラスが向いている場面**:
> - 状態と操作がセットになるもの(例: BankAccount)
> - 継承で共通処理をまとめたい
> - `implements` で「この型を満たす」を保証したい
>
> **関数 + オブジェクトが向いている場面**:
> - React のコンポーネント(関数コンポーネントが主流)
> - 状態を持たないユーティリティ処理
> - シンプルなデータ変換
>
> 「**どちらが正解**」はなく、場面によって使い分けるのが現代 TypeScript の流儀です。この資料の後半(React・Express)でも両方が登場します。

お疲れさまでした!次の第8章で会いましょう ☕
