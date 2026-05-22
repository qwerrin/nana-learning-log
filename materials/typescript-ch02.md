# 第2章 変数・型・データ型

## この章のゴール

- `const` と `let` を正しく使い分けられる
- 基本型(`number`, `string`, `boolean`, `null`, `undefined`)に型注釈をつけられる
- **型推論**を活用して「書きすぎない型」を意識できる
- **`any` と `unknown` の違い**を説明できる
- `void` と `never` の使い所が分かる

**所要時間の目安: 2.5時間**

---

## 0. この章の準備

第1章で作った `01-basics/` をそのまま使います。`src/` の中に章ごとにファイルを追加していきます。

```
typescript-learning/
└── 01-basics/
    └── src/
        ├── hello.ts       ← 第1章で作ったもの
        ├── 02-variables.ts ← 今日作る
        └── ...
```

新しいファイルを作ったら `package.json` の `start` を変更して実行します。

```json
"start": "tsx src/02-variables.ts"
```

---

## 1. 変数 — `const` と `let`(30分)

### 1-1. 変数の宣言

変数を作るときは必ず `const` か `let` のキーワードを書きます。

```typescript
const name = "Alice";  // 再代入できない
let age = 30;          // 再代入できる
```

| キーワード | 再代入 | 使いどき |
|---|---|---|
| `const` | できない | 基本はこれ |
| `let` | できる | カウンタなど後で変える値 |
| `var` | できる | **使わない**(古い書き方) |

> **Pythonとの比較**
> Pythonは `name = "Alice"` とキーワードなしで書きますが、TypeScript(JavaScript)は `const` か `let` が必須です。

### 1-2. 原則: まず `const` で書く

```typescript
// ✅ 基本はconst
const greeting = "こんにちは";

// ✅ 後で変える必要があるときだけlet
let count = 0;
count = count + 1;  // 再代入OK

// ❌ constへの再代入はエラー
const pi = 3.14;
pi = 3.0;  // Cannot assign to 'pi' because it is a constant.
```

「変えない」と明示することで、コードが読みやすくなり、意図しないバグを防げます。

### 1-3. 変数名のルール

```typescript
// ✅ camelCase(JSの慣習)
const userName = "Alice";
const totalPrice = 1980;
const isLoggedIn = true;

// ❌ snake_case(Pythonの慣習)
const user_name = "Alice";  // 動くが慣習に反する

// ❌ 数字始まりはNG
const 1stItem = "error";   // SyntaxError
```

> **Pythonとの違い**
> Pythonは `user_name` のように `snake_case` が標準ですが、TypeScript/JavaScriptは `camelCase` です。

### 1-4. テンプレートリテラル

文字列に変数を埋め込むときは**バッククォート(`` ` ``)** を使います。

```typescript
const name = "Alice";
const age = 30;

// 古い書き方(文字列の連結)
console.log("私の名前は" + name + "、" + age + "歳です。");

// ✅ 現代の書き方(テンプレートリテラル)
console.log(`私の名前は${name}、${age}歳です。`);
// → 私の名前はAlice、30歳です。
```

`${式}` の形で変数だけでなく計算式も埋め込めます。

```typescript
const price = 1000;
const tax = 0.1;
console.log(`税込: ${price * (1 + tax)}円`);  // → 税込: 1100円
```

> **Pythonとの比較**
> Pythonの f-string(`f"私の名前は{name}"`)とほぼ同じです。

### 🔧 ミニ演習1

`src/02-variables.ts` を作って、次のコードを書いて実行してください。

```typescript
const myName = "あなたの名前";
let myAge = 25;

console.log(`私の名前は${myName}、${myAge}歳です。`);

myAge = myAge + 1;
console.log(`来年は${myAge}歳になります。`);
```

実行できたら、`myName = "別の名前"` と書き加えて VS Code に赤線が出ることを確認してみてください。

---

## 2. 型注釈と型推論(30分)

### 2-1. 型注釈とは

変数や関数に「この型ですよ」と明示的に書くことを**型注釈**といいます。書き方は `変数名: 型`。

```typescript
const age: number = 30;
const name: string = "Alice";
const isActive: boolean = true;
```

### 2-2. ⭐ 実は省略できることが多い(型推論)

TypeScriptは賢いので、値から型を**自動的に推測(型推論)**してくれます。

```typescript
const age = 30;       // number と推論される
const name = "Alice"; // string と推論される
const flag = true;    // boolean と推論される
```

VS Code で変数にカーソルを乗せると、推論された型がポップアップで表示されます。確認してみてください。

### 2-3. どこで型注釈を書くべきか

```typescript
// ❌ 冗長: 値から明らかなのに書いている
const x: number = 10;
const s: string = "hello";

// ✅ 推論に任せる
const x = 10;
const s = "hello";
```

```typescript
// ✅ 必ず書くべき場所: 関数の引数(推論できない)
const greet = (name: string) => `Hello, ${name}`;

// ✅ 書くと安全: 関数の戻り値(明示するとミスを防げる)
const add = (a: number, b: number): number => a + b;

// ✅ 必ず書く: 初期値なしの let
let userId: number;
userId = 12345;
```

覚え方: **「境界に型を書く」**

- **入口**(関数の引数、外部データ): 必ず書く
- **中間**(ローカル変数): 推論に任せる
- **出口**(関数の戻り値、公開API): 書くと安全

### 🔧 ミニ演習2

次のコードに適切な型注釈を追加してください。どこに書いてどこを省略するかを考えてみてください。

```typescript
// ここに型注釈を追加する
const userId = 12345;
const userName = "Alice";
const isVerified = true;

const formatUser = (id, name, verified) => {
  return `[${id}] ${name} (${verified ? "認証済み" : "未認証"})`;
};

console.log(formatUser(userId, userName, isVerified));
```

<details>
<summary>解答例</summary>

```typescript
// ローカル変数は推論に任せる(型注釈不要)
const userId = 12345;
const userName = "Alice";
const isVerified = true;

// 引数には必ず型注釈を書く
const formatUser = (id: number, name: string, verified: boolean): string => {
  return `[${id}] ${name} (${verified ? "認証済み" : "未認証"})`;
};

console.log(formatUser(userId, userName, isVerified));
```

`userId`、`userName`、`isVerified` は値から型が明らかなので省略。関数の引数には必ず書く。
</details>

---

## 3. 基本のデータ型(30分)

### 3-1. number — 数値

```typescript
const integer = 42;
const decimal = 3.14;
const negative = -100;
const big = 1_000_000;  // 区切り文字で読みやすく(値は1000000)

// 計算
console.log(10 + 5);   // 15
console.log(10 - 5);   // 5
console.log(10 * 5);   // 50
console.log(10 / 3);   // 3.3333...
console.log(10 % 3);   // 1 (剰余)
console.log(2 ** 10);  // 1024 (べき乗)
```

> **Pythonとの違い**
> Pythonには `int` と `float` の区別がありますが、TypeScript/JavaScriptは整数も小数も全部 `number` です。

特殊な数値:
```typescript
console.log(10 / 0);        // Infinity (ゼロ除算はエラーにならない)
console.log("a" * 2);       // NaN (Not a Number: 数値演算が失敗)
console.log(typeof NaN);    // "number" (NaN は number 型)
```

### 3-2. string — 文字列

```typescript
const s1 = "ダブルクォート";
const s2 = 'シングルクォート';
const s3 = `テンプレートリテラル: ${s1}`;
```

文字列メソッドの例:
```typescript
const text = "Hello, TypeScript!";

console.log(text.length);            // 18
console.log(text.toUpperCase());     // "HELLO, TYPESCRIPT!"
console.log(text.includes("Type")); // true
console.log(text.replace("Hello", "Hi"));  // "Hi, TypeScript!"
console.log(text.split(", "));      // ["Hello", "TypeScript!"]
```

### 3-3. boolean — 真偽値

```typescript
const isLoggedIn = true;
const hasError = false;

// 比較演算子の結果は boolean
console.log(10 > 5);    // true
console.log(10 === 5);  // false (厳密等価: 値と型が一致)
console.log(10 !== 5);  // true  (厳密不等価)
```

> ⚠️ **`==` ではなく `===` を使う**
>
> JavaScript/TypeScript には `==`(緩い比較) と `===`(厳密な比較)があります。
>
> ```typescript
> console.log(1 == "1");   // true  ← 型を変換して比較するので true になる
> console.log(1 === "1");  // false ← 型が違うので false
> ```
>
> **必ず `===` を使う**のが現代の鉄則です。`==` は思わぬバグの原因になります。

> **Pythonとの違い**
> Pythonの `True`/`False`(大文字始まり)に対して、TypeScript/JavaScriptは `true`/`false`(全部小文字)です。

### 3-4. null と undefined

```typescript
const nothing: null = null;           // 「意図的に値がない」
const notSet: undefined = undefined;  // 「まだ値が入っていない」

let x;          // 宣言だけ → 自動的に undefined になる
console.log(x); // undefined
```

| 値 | 意味 | いつ出てくる |
|---|---|---|
| `undefined` | まだ値が入っていない | 変数の宣言のみ、存在しないプロパティへのアクセスなど |
| `null` | 意図的に「値なし」を表す | プログラマが明示的に入れる |

実用上は「**自分で書くときは `null`**、`undefined` は「うっかり値を入れ忘れたとき」に自動で現れる」と理解しておけば十分です。

> **Pythonとの比較**
> Pythonの `None` に相当するのが `null` です。JSは `null` と `undefined` の2つあります。TypeScriptの `strict` モードではこの2つを別の型として厳格に区別します。

### 3-5. typeof で型を確認する

```typescript
console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" ⚠️ JSの有名なバグ
console.log(typeof []);          // "object"
console.log(typeof {});          // "object"
```

`typeof null` が `"object"` を返すのは**JavaScriptの歴史的なバグ**で、修正されないまま残っています。`null` のチェックは `=== null` で行います。

### 3-6. 配列(さわりだけ)

第5章で詳しくやりますが、型の書き方だけ紹介しておきます。

```typescript
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// 推論も効く
const items = [1, 2, 3];  // number[] と推論される
```

### 🔧 ミニ演習3

次の値を `typeof` で確認する前に型を予想してみてください。

```typescript
console.log(typeof "123");
console.log(typeof 123);
console.log(typeof "true");
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);
```

<details>
<summary>答え</summary>

```
"string"    ← クォートがあれば文字列
"number"
"string"    ← クォートで囲まれた "true" は文字列
"boolean"
"undefined"
"object"    ← JSの歴史的バグ
```

クォートで囲まれていれば、中身が数字でも `true` でも文字列です。
</details>

---

## 4. ⭐ any と unknown — TypeScriptの肝(30分)

ここがこの章の**最重要セクション**です。

### 4-1. any — 「何でもあり」

`any` はどんな型でも代入でき、何でもできる型です。

```typescript
let x: any = 42;
x = "hello";     // OK
x = [1, 2, 3];   // OK
x = { foo: 1 };  // OK
```

しかし **「型チェックを諦める」** という意味にもなります。

```typescript
let x: any = "hello";

x.toUpperCase();   // ✅ 通る(正しい)
x.toFixed(2);      // ✅ 通る(stringにこのメソッドはない→実行時エラー)
x.foo.bar.baz();   // ✅ 通る(実行時エラー確定)
```

どんなアクセスもコンパイル時はエラーにならず、**実行時にエラーになります**。TypeScriptを使う意味が失われます。

### 4-2. unknown — 安全な any

`unknown` は `any` の安全な代替です。

```typescript
let x: unknown = 42;
x = "hello";     // 代入はanyと同じく自由
x = [1, 2, 3];   // OK
```

違いは**使う時**に現れます。

```typescript
let x: unknown = "hello";

x.toUpperCase();
// ❌ 'x' is of type 'unknown'.

// 型を絞り込んでから使う
if (typeof x === "string") {
  x.toUpperCase();  // ✅ ここでは string と確定している
}
```

`unknown` の値を使うには**型を確認してから**でないといけません。これにより、実行時エラーを事前に防げます。

### 4-3. any vs unknown 比較

| 項目 | any | unknown |
|---|---|---|
| 代入 | 何でも入る | 何でも入る |
| 読み出し | **何でもできる**(危険) | **型を絞ってから** |
| 型チェック | 無効化 | 強制 |
| 使いどころ | (極力使わない) | JSON.parse の結果、外部から来るデータ |

### 4-4. 使い分けの方針

```
1. 具体的な型を使う → number, string, User など(デフォルト)
2. 不明な値の入り口 → unknown
3. どうしても型がつけられない → any(理由をコメントで書く)
```

**「any を書きたくなったら、まず unknown でいいか考える」**が鉄則です。

### 🔧 ミニ演習4

次のコードを `any` から `unknown` を使った安全な書き方に直してください。

```typescript
const processInput = (input: any) => {
  console.log(input.toUpperCase());  // 文字列のときだけ実行したい
};

processInput("hello");
processInput(123);  // 数値のときは何もしたい
```

<details>
<summary>解答例</summary>

```typescript
const processInput = (input: unknown) => {
  if (typeof input === "string") {
    console.log(input.toUpperCase());  // ✅ ここでは string と確定
  } else {
    console.log("文字列ではないのでスキップ");
  }
};

processInput("hello");  // → "HELLO"
processInput(123);       // → "文字列ではないのでスキップ"
```

`unknown` で受けて、`typeof` で型を絞り込む。これが TypeScript の典型的なパターンです。
</details>

---

## 5. void と never — 関数の特殊な型(20分)

主に**関数の戻り値の型**として使います。

### 5-1. void — 「何も返さない」

```typescript
const log = (message: string): void => {
  console.log(message);
  // return なし
};
```

`console.log` のような**副作用だけが目的の関数**に使います。`void` の関数を呼ぶと戻り値は `undefined` になります。

### 5-2. never — 「絶対に戻らない」

```typescript
// 例外を投げて正常終了しない関数
const throwError = (message: string): never => {
  throw new Error(message);
};

// 無限ループ
const infiniteLoop = (): never => {
  while (true) {
    // 永遠に回り続ける
  }
};
```

`never` は「**この関数は絶対に正常終了しない**」を型で表現します。

### 5-3. void と never の違い

| 型 | 意味 |
|---|---|
| `void` | 正常終了するが戻り値を使わない |
| `never` | 正常終了しない(例外 / 無限ループ) |

`never` は第10章の「型ガード・narrowing」で**網羅性チェック**として再登場します。今は「こんな型がある」程度で十分です。

### 🔧 ミニ演習5

次の関数の戻り値の型は `void` と `never` のどちらですか?

```typescript
// A
const printAge = (age: number) => {
  console.log(`Age: ${age}`);
};

// B
const reportError = (message: string) => {
  throw new Error(message);
};

// C
const startTimer = () => {
  setInterval(() => console.log("tick"), 1000);
};
```

<details>
<summary>答え</summary>

- **A**: `void` — 普通に終わる、戻り値なし
- **B**: `never` — 例外を投げて正常終了しない
- **C**: `void` — `setInterval` を呼んで終わる。(タイマーは別途動き続けるが、関数自体は正常終了)

「正常終了するか?」が判断基準です。
</details>

---

## 6. let の「後から代入」パターン(10分)

`let` で宣言だけして後から値を入れる場合の注意点です。

```typescript
// ❌ 危険: 型注釈なし + 初期値なし → any になる
let x;
x = 10;
x = "hello";  // anyなのでエラーにならない

// ✅ 型注釈を必ず書く
let userId: number;
userId = 12345;  // OK
userId = "abc";  // ❌ Type 'string' is not assignable to type 'number'.
```

「**`let` で宣言だけするときは必ず型注釈を書く**」と覚えてください。

「まだ未決定(undefined)かもしれない」を型で表現したい場合:

```typescript
let result: number | undefined;  // 「数値 または 未定義」
result = undefined;  // OK
result = 42;         // OK
result = "hello";    // ❌
```

`number | undefined` の `|` は**ユニオン型**で「AまたはB」を表します。第10章で詳しく学びます。

---

## 7. 章末演習(30分)

### 🎯 演習1: 適切な型注釈をつける

次の関数に適切な型注釈を追加してください。

```typescript
const calculateBMI = (weight, height) => {
  return weight / (height * height);
};

const isObese = (bmi) => {
  return bmi >= 30;
};

const formatBMI = (bmi) => {
  return `BMI: ${bmi.toFixed(2)}`;
};

console.log(calculateBMI(60, 1.65));
console.log(isObese(35));
console.log(formatBMI(22.5));
```

### 🎯 演習2: ユーザー情報を整理する

次の仕様で変数と関数を作ってください。

- `userId`: 数値(変更不可)
- `userName`: 文字列(変更不可)
- `score`: 数値(後で変える可能性あり)
- `formatUser(id, name, score)`: `[id] name: score点` の形式の文字列を返す関数

<details>
<summary>解答例</summary>

```typescript
// 演習1
const calculateBMI = (weight: number, height: number): number => {
  return weight / (height * height);
};

const isObese = (bmi: number): boolean => {
  return bmi >= 30;
};

const formatBMI = (bmi: number): string => {
  return `BMI: ${bmi.toFixed(2)}`;
};

console.log(calculateBMI(60, 1.65));  // 22.038...
console.log(isObese(35));              // true
console.log(formatBMI(22.5));          // "BMI: 22.50"

// 演習2
const userId = 1;          // number と推論される(型注釈不要)
const userName = "Alice";  // string と推論される
let score = 80;            // let なので再代入可

const formatUser = (id: number, name: string, s: number): string => {
  return `[${id}] ${name}: ${s}点`;
};

console.log(formatUser(userId, userName, score));  // "[1] Alice: 80点"

score = 95;
console.log(formatUser(userId, userName, score));  // "[1] Alice: 95点"
```

</details>

---

## 8. この章のまとめ

### 覚えておきたいこと

1. **`const` がデフォルト**、再代入が必要なときだけ `let`、`var` は使わない
2. **変数名は camelCase**(`userName`)
3. **テンプレートリテラル**(バッククォート + `${式}`)で文字列に変数を埋め込む
4. **型推論**があるので、単純な変数の型注釈は省略OK
5. **「境界に型を書く」**: 関数の引数は必須、ローカル変数は推論に任せる
6. **`===` を使う**(``==`` は使わない)
7. **`any` は使わない**、代わりに `unknown` を使う
8. **`void`** は「戻り値を使わない関数」、**`never`** は「正常終了しない関数」
9. **`let` で初期値なしのときは必ず型注釈を書く**

### 確認問題

<details>
<summary>Q1. `const` と `let` はどう使い分けるか?</summary>

- `const`: 再代入しない値(デフォルト)
- `let`: 後から値を変える必要がある場合のみ

まず `const` で書いて、再代入が必要になったら `let` に変えるのが定石です。
</details>

<details>
<summary>Q2. なぜ `==` ではなく `===` を使うのか?</summary>

`==` は型を自動変換してから比較するため、`1 == "1"` が `true` になるなど直感に反する結果になることがあります。

`===` は型と値の両方が一致するときだけ `true` になるため、予期しないバグを防げます。
</details>

<details>
<summary>Q3. `any` と `unknown` の違いは?</summary>

- **`any`**: 何でも代入でき、何でもできる。型チェックを無効化する
- **`unknown`**: 何でも代入できるが、使う前に型を絞り込む必要がある

`any` は「型チェックを諦める」、`unknown` は「型チェックを後から強制する」という違いがあります。
</details>

<details>
<summary>Q4. 関数の引数に型注釈が必要な理由は?</summary>

型推論は「今ある値から型を決める」仕組みです。関数の引数は定義時点ではどんな値が来るか分からないため、推論できません。そのため引数の型は明示する必要があります。
</details>

---

## 次の章へ

第2章で**変数と基本型**の土台が固まりました。次の第3章では**演算子・制御構文**を学びます。`if`/`switch`/`for`/`while` などを TypeScript の型と一緒に押さえます。

---

> 🎯 **コラム: 型を書く量の感覚**
>
> 「TypeScript は型を大量に書く言語」というイメージがあるかもしれませんが、実際はそうでもありません。
>
> ```typescript
> // TypeScript で実際によく書くコード
> const users = ["Alice", "Bob", "Charlie"];  // 型注釈なし
> const total = users.length * 100;           // 型注釈なし
>
> const greet = (name: string) => {           // 引数だけ書く
>   return `Hello, ${name}`;
> };
> ```
>
> 書くのは主に「**関数の引数**」だけ。あとは型推論が面倒を見てくれます。
>
> 慣れてくると「型推論に任せるか、明示するか」の判断が自然にできるようになります。
> 最初は「引数には型を書く」だけ意識しておけば十分です。

お疲れさまでした!次の第3章で会いましょう ☕
