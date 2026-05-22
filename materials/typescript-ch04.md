# 第4章 関数

## この章のゴール

- 関数の3つの書き方を理解し、Arrow Function を使いこなせる
- 引数・戻り値に正しく型注釈をつけられる
- デフォルト引数・オプショナル引数・残余引数を使い分けられる
- **関数型**(関数を引数に渡す)を書ける
- コールバック関数の仕組みが分かる

**所要時間の目安: 2.5時間**

---

## 0. この章の準備

引き続き `01-basics/` を使います。`src/04-functions.ts` を作って進めましょう。

```json
"start": "tsx src/04-functions.ts"
```

---

## 1. 関数の3つの書き方(20分)

TypeScript/JavaScriptには関数の書き方が3種類あります。

### 1-1. 関数宣言

```typescript
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2));  // 3
```

> **Pythonとの比較**
> Pythonの `def add(a, b):` に相当します。TypeScriptは `function` キーワードを使い、ブロックは `{}` で囲みます。引数と戻り値に型注釈を書く点が違います。

### 1-2. 関数式

関数を値として変数に代入する書き方です。

```typescript
const subtract = function(a: number, b: number): number {
  return a - b;
};
```

「**関数も値の一種**」というのがJS/TSの重要な特徴です。変数に入れたり、他の関数に渡したりできます。

### 1-3. ⭐ Arrow Function(本資料のメイン)

ES2015で登場した現代的な書き方。**本資料ではこれを基本として使います**。

```typescript
const multiply = (a: number, b: number): number => {
  return a * b;
};
```

`=>` (アロー)で引数リストと処理をつなぎます。

#### 短縮形: 処理が1行なら `{}` と `return` を省略

```typescript
// フル形式
const double = (n: number): number => {
  return n * 2;
};

// 短縮形(1行なら省略可能)
const double = (n: number): number => n * 2;
```

**暗黙的な return** と呼ばれます。`map`/`filter` などの配列メソッドで特に使います。

```typescript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]
```

#### 引数の数によるバリエーション

```typescript
// 引数なし
const greet = (): string => "Hello!";

// 引数1つ
const double = (n: number): number => n * 2;

// 引数2つ以上
const add = (a: number, b: number): number => a + b;
```

> ⚠️ **引数が1つでも `()` は省略しない**
>
> JavaScriptでは引数が1つのとき `(n) =>` を `n =>` と書けますが、**TypeScriptでは型注釈が必要なため省略できません**。
>
> ```typescript
> // ❌ 型注釈と組み合わせると動かない
> const double = n: number => n * 2;  // SyntaxError
>
> // ✅ 必ず () をつける
> const double = (n: number) => n * 2;
> ```

### 1-4. どの書き方を使うべきか

| 場面 | 推奨 |
|---|---|
| 通常の関数 | **Arrow Function** |
| 配列メソッドのコールバック | **Arrow Function** |
| クラスのメソッド(第7章) | 通常の `function` が安全な場合あり |

**初学者の方針**: 迷わず **Arrow Function** で書いてOK。

### 🔧 ミニ演習1

次の3つをArrow Functionで書いてください。

1. `price`(number)を受け取り、税込価格(10%増し)を返す `addTax`
2. `name`(string)を受け取り、`"Hello, [name]!"` を返す `greet`
3. 引数なしで現在のタイムスタンプ(ms)を返す `now`

<details>
<summary>解答例</summary>

```typescript
const addTax = (price: number): number => price * 1.1;

const greet = (name: string): string => `Hello, ${name}!`;

const now = (): number => Date.now();

console.log(addTax(1000));  // 1100
console.log(greet("Alice")); // "Hello, Alice!"
console.log(now());          // 現在のタイムスタンプ(ms)
```

</details>

---

## 2. 型注釈のルール(20分)

### 2-1. 引数には必ず型を書く

型推論は「今ある値から型を決める」仕組みです。関数の引数は呼び出し時まで値が決まらないため、**引数の型は必ず明示**する必要があります。

```typescript
// ❌ strict モードではエラー
const greet = (name) => `Hello, ${name}`;
// Parameter 'name' implicitly has an 'any' type.

// ✅
const greet = (name: string) => `Hello, ${name}`;
```

### 2-2. 戻り値の型は推論される

```typescript
// 推論に任せる(短い関数なら十分)
const add = (a: number, b: number) => a + b;
// 戻り値は number と推論される

// 明示する(公開関数では推奨)
const add = (a: number, b: number): number => a + b;
```

**明示するメリット**:
- 関数の中身を変えたとき、戻り値が変わるのを型エラーで気づける
- ドキュメントとして分かりやすい

**初学者の方針**: 複雑な関数や他のファイルから使う関数は明示、小さなユーティリティは省略で十分です。

### 2-3. 戻り値なしは `void`

```typescript
const log = (message: string): void => {
  console.log(message);
};
```

`console.log` のような**副作用だけが目的の関数**には `void` を使います。

---

## 3. 引数のバリエーション(30分)

### 3-1. デフォルト引数

引数を省略したときに使うデフォルト値を設定できます。

```typescript
const greet = (name: string, greeting: string = "Hello"): string => {
  return `${greeting}, ${name}!`;
};

console.log(greet("Alice"));          // "Hello, Alice!"
console.log(greet("Bob", "Hi"));      // "Hi, Bob!"
console.log(greet("Carol", "Good morning")); // "Good morning, Carol!"
```

デフォルト値があれば**型注釈は省略可能**です(値から推論される)。

```typescript
// greeting の型は string と推論されるので省略OK
const greet = (name: string, greeting = "Hello") => `${greeting}, ${name}!`;
```

> **Pythonとの比較**
> Pythonの `def greet(name, greeting="Hello"):` とほぼ同じです。

### 3-2. オプショナル引数

`?` をつけると省略可能な引数になります。型は実質 `型 | undefined` になります。

```typescript
const greet = (name: string, greeting?: string): string => {
  return `${greeting ?? "Hello"}, ${name}!`;
};

console.log(greet("Alice"));        // "Hello, Alice!"
console.log(greet("Bob", "Hi"));    // "Hi, Bob!"
```

`greeting?: string` は `greeting: string | undefined` とほぼ同じです。

#### デフォルト引数 vs オプショナル引数

```typescript
// デフォルト引数: 省略時に値が入る → greeting は string 型
const a = (name: string, greeting = "Hello") => `${greeting}, ${name}!`;

// オプショナル引数: 省略時は undefined → greeting は string | undefined 型
const b = (name: string, greeting?: string) => `${greeting ?? "Hello"}, ${name}!`;
```

**実務上はデフォルト引数の方が使いやすい**ことが多いです。「省略したら○○を使う」という意図がそのまま書けるので。

### 3-3. 残余引数(Rest Parameters)

任意個数の引数を**配列として**受け取ります。

```typescript
const sum = (...numbers: number[]): number => {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
};

console.log(sum(1, 2, 3));         // 6
console.log(sum(1, 2, 3, 4, 5));   // 15
console.log(sum());                 // 0
```

`...numbers` の型は**配列型 `number[]`** で書きます。

> **Pythonとの比較**
> Pythonの `*args` に相当します。TypeScriptでは `...変数名: 型[]` の形で書きます。

通常の引数と組み合わせる場合は、残余引数は**最後に**置く必要があります。

```typescript
const buildMessage = (prefix: string, ...items: string[]): string => {
  return `${prefix}: ${items.join(", ")}`;
};

console.log(buildMessage("果物", "りんご", "バナナ", "みかん"));
// → "果物: りんご, バナナ, みかん"
```

### 🔧 ミニ演習2

次の関数を書いてください。

1. `multiplier`(デフォルト値 2)と `...numbers` を受け取り、各数値を `multiplier` 倍した配列を返す `multiplyAll`

```typescript
const multiplyAll = (multiplier = 2, ...numbers: number[]): number[] => {
  // ここを実装
};

console.log(multiplyAll(3, 1, 2, 3));   // [3, 6, 9]
console.log(multiplyAll(undefined, 1, 2, 3));  // [2, 4, 6](デフォルト)
```

<details>
<summary>解答例</summary>

```typescript
const multiplyAll = (multiplier = 2, ...numbers: number[]): number[] => {
  return numbers.map(n => n * multiplier);
};

console.log(multiplyAll(3, 1, 2, 3));          // [3, 6, 9]
console.log(multiplyAll(undefined, 1, 2, 3));  // [2, 4, 6]
console.log(multiplyAll(10, 5, 10));           // [50, 100]
```

`map` は配列の各要素に関数を適用して新しい配列を返します。第5章で詳しく学びます。
</details>

---

## 4. ⭐ 関数型とコールバック(40分)

TypeScriptで特に重要な概念です。**「関数を引数として渡す」** パターンを型で表現します。

### 4-1. 関数も値である

```typescript
const double = (n: number): number => n * 2;

// 関数を変数に代入
const fn = double;
console.log(fn(5));  // 10

// 関数を配列に入れる
const funcs = [double, (n: number) => n + 1];
console.log(funcs[0]?.(3));  // 6
console.log(funcs[1]?.(3));  // 4
```

### 4-2. 関数型の書き方

「関数そのものの型」は `(引数名: 型) => 戻り値型` で書きます。

```typescript
// type で関数型に名前をつける
type StringTransformer = (s: string) => string;

const toUpper: StringTransformer = (s) => s.toUpperCase();
const toLower: StringTransformer = (s) => s.toLowerCase();
const trim: StringTransformer = (s) => s.trim();

console.log(toUpper("hello"));  // "HELLO"
console.log(toLower("WORLD"));  // "world"
console.log(trim("  hi  "));    // "hi"
```

型を割り当てた変数(`toUpper` など)では引数の型が推論されるので、`(s) =>` と書くだけでOKです。

### 4-3. ⭐ コールバック関数

「**関数を引数として受け取る関数**」の書き方です。`map`/`filter`/`forEach` などの配列メソッドと同じ仕組みです。

```typescript
// fn: (n: number) => number が「コールバックの型」
const transform = (arr: number[], fn: (n: number) => number): number[] => {
  return arr.map(fn);
};

// 使い方: 関数を渡す
const doubled = transform([1, 2, 3], n => n * 2);   // [2, 4, 6]
const squared = transform([1, 2, 3], n => n ** 2);  // [1, 4, 9]
const negated = transform([1, 2, 3], n => -n);      // [-1, -2, -3]
```

`fn: (n: number) => number` は「`number` を受け取り `number` を返す関数」という型です。

### 4-4. void を返すコールバック

```typescript
const forEach = (arr: number[], fn: (n: number) => void): void => {
  for (const item of arr) {
    fn(item);
  }
};

forEach([1, 2, 3], n => console.log(n));
// 1
// 2
// 3
```

「何かを返さないコールバック」には `void` を使います。

### 4-5. 実際の配列メソッドとの対応

TypeScript の標準メソッドも同じパターンです。

```typescript
const numbers = [1, 2, 3, 4, 5];

// map: (n: number) => number を渡す
const doubled = numbers.map((n) => n * 2);          // [2, 4, 6, 8, 10]

// filter: (n: number) => boolean を渡す
const evens = numbers.filter((n) => n % 2 === 0);  // [2, 4]

// forEach: (n: number) => void を渡す
numbers.forEach((n) => console.log(n));

// find: (n: number) => boolean を渡す
const found = numbers.find((n) => n > 3);           // 4

// reduce: (acc: number, n: number) => number を渡す
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15
```

これらのメソッドを使いこなすことで、`for` ループを減らしてシンプルなコードが書けます。第5章でさらに詳しく学びます。

### 🔧 ミニ演習3

次の関数を実装してください。

```typescript
// applyIf: arr の各要素に対して、condition が true のときだけ fn を適用する
// condition が false なら元の値をそのまま使う
const applyIf = (
  arr: number[],
  condition: (n: number) => boolean,
  fn: (n: number) => number
): number[] => {
  // ここを実装
};

console.log(applyIf([1, 2, 3, 4, 5], n => n % 2 === 0, n => n * 10));
// → [1, 20, 3, 40, 5]  (偶数だけ10倍)
```

<details>
<summary>解答例</summary>

```typescript
const applyIf = (
  arr: number[],
  condition: (n: number) => boolean,
  fn: (n: number) => number
): number[] => {
  return arr.map(n => condition(n) ? fn(n) : n);
};

console.log(applyIf([1, 2, 3, 4, 5], n => n % 2 === 0, n => n * 10));
// [1, 20, 3, 40, 5]

// 他の使い方
console.log(applyIf([1, 2, 3, 4, 5], n => n > 3, n => n ** 2));
// [1, 2, 3, 16, 25]
```

コールバックを2つ受け取る関数の型注釈パターンを確認してください。
</details>

---

## 5. 関数型に名前をつける(15分)

### 5-1. type で名前をつける

複数の場所で同じ関数型を使うときは、`type` で名前をつけると再利用できます。

```typescript
type NumberTransformer = (n: number) => number;
type NumberPredicate = (n: number) => boolean;
type StringFormatter = (s: string, ...args: unknown[]) => string;

// 使い回せる
const double: NumberTransformer = n => n * 2;
const isEven: NumberPredicate = n => n % 2 === 0;

const filter = (arr: number[], pred: NumberPredicate): number[] =>
  arr.filter(pred);

console.log(filter([1, 2, 3, 4, 5], isEven));  // [2, 4]
```

### 5-2. 関数型の引数名は任意

関数型の中の引数名は**ドキュメント目的**で書くもので、実際には無視されます。

```typescript
// どちらも同じ型
type A = (name: string) => void;
type B = (x: string) => void;
type C = (s: string) => void;
```

ただし**意味のある名前**をつけることで、型だけ見ても使い方が分かります。

```typescript
// ❌ 意味が分からない
type Handler = (x: unknown, y: number) => void;

// ✅ 意味が伝わる
type Handler = (event: Event, delay: number) => void;
```

---

## 6. 章末演習(25分)

### 🎯 演習: パイプライン関数

複数の変換関数を順番に適用する `pipe` 関数を実装してください。

```typescript
// pipe: 値 x に対して、fns の関数を左から順番に適用する
const pipe = (x: number, ...fns: Array<(n: number) => number>): number => {
  // ここを実装
};

const double = (n: number) => n * 2;
const addOne = (n: number) => n + 1;
const square = (n: number) => n ** 2;

console.log(pipe(3, double, addOne, square));
// 3 → double → 6 → addOne → 7 → square → 49

console.log(pipe(5, addOne, double));
// 5 → addOne → 6 → double → 12
```

<details>
<summary>解答例</summary>

```typescript
const pipe = (x: number, ...fns: Array<(n: number) => number>): number => {
  return fns.reduce((acc, fn) => fn(acc), x);
};

const double = (n: number) => n * 2;
const addOne = (n: number) => n + 1;
const square = (n: number) => n ** 2;

console.log(pipe(3, double, addOne, square));  // 49
console.log(pipe(5, addOne, double));           // 12
console.log(pipe(4));                           // 4(変換なし)
```

`Array<(n: number) => number>` は「`(n: number) => number` 型の関数の配列」です。残余引数と配列型を組み合わせたパターン。

`reduce` で「acc に fn を順番に適用」するのが核心です。
</details>

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **Arrow Function** が現代TypeScriptの標準(`const f = (x: T): R => ...`)
2. **引数には必ず型を書く**(推論できないため)
3. **戻り値の型は省略可**だが、複雑な関数では明示すると安全
4. **デフォルト引数**: `(x = "default")` で省略時の値を設定
5. **オプショナル引数**: `(x?: string)` で `string | undefined` 型
6. **残余引数**: `(...nums: number[])` で可変長を配列として受け取る
7. **関数型**: `(x: T) => R` の形で「関数を引数に渡す」ときに使う
8. **コールバック**: `map`/`filter`/`reduce` などと同じ仕組み

### 確認問題

<details>
<summary>Q1. デフォルト引数とオプショナル引数の違いは?</summary>

- **デフォルト引数** `(x = "default")`: 省略時にデフォルト値が使われる。型は `string`
- **オプショナル引数** `(x?: string)`: 省略時は `undefined` になる。型は `string | undefined`

実務ではデフォルト引数の方が使いやすいことが多いです。
</details>

<details>
<summary>Q2. 残余引数の型はどう書くか?</summary>

```typescript
const sum = (...numbers: number[]): number => { ... }
```

`...変数名: 型[]` の形で、受け取った値は配列になります。
</details>

<details>
<summary>Q3. 次のコードで fn の型は何か?</summary>

```typescript
const apply = (n: number, fn: (x: number) => string): string => fn(n);
```

`fn` の型は `(x: number) => string` です。「`number` を受け取り `string` を返す関数」という意味の**関数型**です。
</details>

---

## 次の章へ

第4章で**関数**の型付けをマスターしました。次の第5章では**配列・オブジェクト**を TypeScript の型と一緒に学びます。`map`/`filter`/`reduce` などの配列メソッドを型付きで使いこなし、オブジェクト型・オプショナルプロパティ・`readonly` も押さえます。

---

> 🎯 **コラム: 関数は「設計の単位」**
>
> TypeScriptで関数に型をつけるとき、実は「**この関数は何を受け取って何を返すか**」を設計しているのです。
>
> ```typescript
> // 型を書く前に「設計」を考える
> const processUser = (id: number): User | undefined => { ... };
> ```
>
> 「`User | undefined` を返す」と書いた瞬間に、「ユーザーが見つからない場合がある」という設計が型に記録されます。後でこの関数を使う人は、型を見るだけで「null チェックが必要だな」と分かります。
>
> **型を書くこと = 設計を明文化すること**。これがTypeScriptを使う本質的な価値のひとつです。

お疲れさまでした!次の第5章で会いましょう ☕
