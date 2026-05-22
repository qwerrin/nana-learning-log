# 第6章 文字列・スコープ・例外処理

## この章のゴール

- 実務でよく使う文字列メソッドを TypeScript で使いこなせる
- 変数のスコープ(有効範囲)を理解する
- クロージャの概念をざっくり理解する
- `this` の罠と Arrow Function による回避策を知る
- `try/catch` で例外を安全に処理できる
- TypeScript での `catch` の型(`unknown`)を扱える

**所要時間の目安: 2時間**

---

## 0. この章の準備

引き続き `01-basics/` を使います。`src/06-strings.ts` を作って進めましょう。

```json
"start": "tsx src/06-strings.ts"
```

---

## 1. 文字列メソッド(30分)

文字列にはたくさんのメソッドがありますが、実務でよく使うものに絞って紹介します。

### 1-1. 長さと文字の取り出し

```typescript
const str: string = "Hello, TypeScript!";

console.log(str.length);    // 18
console.log(str[0]);        // "H"
console.log(str.charAt(7)); // "T"
```

### 1-2. 検索系

```typescript
const str = "TypeScript is great";

// 含まれているか
console.log(str.includes("Script"));   // true
console.log(str.includes("Python"));   // false

// 始まり・終わり
console.log(str.startsWith("Type"));   // true
console.log(str.endsWith("great"));    // true

// インデックスを取得(見つからなければ -1)
console.log(str.indexOf("Script"));    // 4
console.log(str.indexOf("Python"));    // -1
```

### 1-3. 変換系

```typescript
const str = "  Hello, World!  ";

// 大文字・小文字
console.log(str.toUpperCase());  // "  HELLO, WORLD!  "
console.log(str.toLowerCase());  // "  hello, world!  "

// 空白除去(ユーザー入力の前処理に頻出)
console.log(str.trim());         // "Hello, World!"
console.log(str.trimStart());    // "Hello, World!  "
console.log(str.trimEnd());      // "  Hello, World!"
```

文字列メソッドは**ほぼすべて「新しい文字列を返す」設計**で、元の文字列は変わりません。

### 1-4. 切り出し・置換

```typescript
const str = "Hello, World!";

// slice(開始, 終了): 部分文字列の取り出し
console.log(str.slice(0, 5));   // "Hello"
console.log(str.slice(7));      // "World!"
console.log(str.slice(-6));     // "orld!" (負のインデックスで末尾から)

// replace: 最初の1つだけ置換
console.log(str.replace("World", "TypeScript"));  // "Hello, TypeScript!"

// replaceAll: すべて置換
const txt = "りんご、りんご、りんご";
console.log(txt.replaceAll("りんご", "みかん"));  // "みかん、みかん、みかん"
```

### 1-5. 分割と結合

```typescript
// split: 文字列 → 配列
const csv = "apple,banana,orange";
const fruits: string[] = csv.split(",");
console.log(fruits);  // ["apple", "banana", "orange"]

// join: 配列 → 文字列(配列のメソッド)
const joined = fruits.join(" / ");
console.log(joined);  // "apple / banana / orange"
```

`split` と `join` はセットで覚えると便利。CSV や URL の処理で頻出です。

### 1-6. パディング・繰り返し

```typescript
// padStart / padEnd: 指定の長さになるよう文字を埋める
const num = "42";
console.log(num.padStart(5, "0"));  // "00042"
console.log(num.padEnd(5, "-"));    // "42---"

// repeat: 繰り返し
console.log("*".repeat(5));  // "*****"
```

ゼロ埋めや表示整形でよく使います。

### 🔧 ミニ演習1

ユーザーが入力したメールアドレスを正規化する関数を書いてください。

仕様:
- 前後の空白を除去
- すべて小文字に変換
- 引数と戻り値の型を明示する

```typescript
const normalizeEmail = (email: string): string => {
  // ここを実装
};

console.log(normalizeEmail("  Alice@Example.COM  "));
// → "alice@example.com"
```

<details>
<summary>解答例</summary>

```typescript
const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

console.log(normalizeEmail("  Alice@Example.COM  "));  // "alice@example.com"
console.log(normalizeEmail("  BOB@GMAIL.COM"));         // "bob@gmail.com"
```

メソッドチェーン(`.trim().toLowerCase()`)で1行で書けます。TypeScript では引数と戻り値の型を書くことで、「文字列を受け取り文字列を返す」が保証されます。
</details>

---

## 2. スコープ(20分)

「この変数はどこから読めるか」というルールです。

### 2-1. ブロックスコープ

`const` と `let` は `{}` で囲まれたブロックの中だけで有効です。

```typescript
{
  const inner = "ブロック内";
  console.log(inner);  // OK
}
console.log(inner);  // ❌ Cannot find name 'inner'.
```

`if`/`for`/`while` のブロックも同じです。

```typescript
if (true) {
  const x = 10;
}
console.log(x);  // ❌ ブロックの外から見えない
```

### 2-2. 関数スコープ

関数の中で宣言した変数は、その関数の中だけで有効です。

```typescript
const greet = (): void => {
  const secret = "関数内の変数";
  console.log(secret);  // OK
};

greet();
console.log(secret);  // ❌ 外から見えない
```

> **Pythonとの比較**
> Pythonの関数スコープと同じ感覚です。

### 2-3. 内側からは外側が見える

```typescript
const message = "外側";

const show = (): void => {
  console.log(message);  // ✅ 外側の変数が読める
};

show();  // "外側"
```

「**内側から外側は見える、外側から内側は見えない**」がスコープの基本ルールです。

### 2-4. ⚠️ var を使わない理由(再確認)

`var` はブロックを無視する**関数スコープ**なので、予期しない動作をします。

```typescript
if (true) {
  var x = 10;  // ❌ var を使うな
}
console.log(x);  // 10 が見える(意図しない)

if (true) {
  const y = 20;  // ✅ const を使う
}
// console.log(y);  // ❌ 見えない(正しい)
```

`const`/`let` を使えば、この問題は気にしなくてOK。

---

## 3. クロージャ(15分)

「内側の関数が、外側の変数を**覚えている**」という仕組みです。

### 3-1. シンプルな例

```typescript
const createCounter = () => {
  let count = 0;

  return () => {
    count += 1;
    return count;
  };
};

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
```

`counter` 関数は呼ばれるたびに、外側の `count` 変数を覚えていて増やしています。

### 3-2. なぜ重要か

クロージャは「**外から直接触れない状態**」を作れます。

```typescript
const createAccount = (initial: number) => {
  let balance = initial;  // 外から直接触れない

  return {
    deposit: (amount: number): void => { balance += amount; },
    withdraw: (amount: number): void => { balance -= amount; },
    getBalance: (): number => balance,
  };
};

const account = createAccount(1000);
account.deposit(500);
console.log(account.getBalance());  // 1500
// account.balance は存在しない(外から守られている)
```

> **今は深追いしなくてOK**
> React の `useState` も内部的にクロージャで実装されています。使う側は意識しなくても大丈夫ですが、「そういう仕組みで動いている」と知っていると理解が深まります。

---

## 4. this と Arrow Function(20分)

TypeScript でも `this` は存在しますが、**Arrow Function を使えばほぼ問題が解消**されます。

### 4-1. this とは

`this` は「**いま誰がこの関数を呼んでいるか**」を表す特別な変数です。

```typescript
const user = {
  name: "Alice",
  greet: function (): void {
    console.log(`こんにちは、${this.name}さん!`);
  },
};

user.greet();  // "こんにちは、Aliceさん!"
```

### 4-2. 罠: コールバックの中で this が変わる

```typescript
const user = {
  name: "Alice",
  greet: function (): void {
    setTimeout(function () {
      // ここの this は user ではない!
      console.log(`こんにちは、${(this as any).name}さん!`);
      // → "こんにちは、undefinedさん!" 😱
    }, 100);
  },
};
```

`setTimeout` のような関数にコールバックとして渡すと、`this` が変わってしまいます。

### 4-3. ✅ Arrow Function で解決

Arrow Function は **`this` を自分で持たず、外側の `this` をそのまま使います**。

```typescript
const user = {
  name: "Alice",
  greet: function (): void {
    // Arrow Function はこの関数の this(= user)を引き継ぐ
    setTimeout(() => {
      console.log(`こんにちは、${this.name}さん!`);
      // → "こんにちは、Aliceさん!" ✅
    }, 100);
  },
};

user.greet();
```

### 4-4. 実務での方針

```
基本的に Arrow Function を使う → this の罠の 99% を回避

オブジェクトのメソッドは function キーワードも使う
→ ただし中でコールバックを使うときは Arrow Function
```

第7章のクラスでは TypeScript が `this` の型もチェックしてくれるので、さらに安全に書けます。

---

## 5. ⭐ 例外処理 — try/catch(25分)

エラーを「捕まえて」処理する仕組みです。

### 5-1. 基本構文

```typescript
try {
  // エラーが起きるかもしれない処理
  const data = JSON.parse("invalid json");
} catch (error) {
  // エラーが起きたときの処理
  console.error("エラー:", error);
} finally {
  // エラーの有無にかかわらず実行(省略可)
  console.log("処理終了");
}
```

> **Pythonとの比較**
>
> | Python | TypeScript |
> |---|---|
> | `try:` | `try {` |
> | `except Exception as e:` | `catch (error) {` |
> | `finally:` | `finally {` |
> | `raise Exception("...")` | `throw new Error("...")` |

### 5-2. エラーを投げる

```typescript
const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("0で割れません");
  }
  return a / b;
};

try {
  console.log(divide(10, 2));  // 5
  console.log(divide(10, 0));  // ここで例外が投げられる
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);  // "0で割れません"
  }
}
```

### 5-3. ⭐ TypeScript の catch は unknown 型

TypeScript の `strict` モードでは、`catch` の引数は **`unknown` 型**になります。

```typescript
try {
  JSON.parse("invalid");
} catch (error) {
  // error は unknown 型
  console.log(error.message);
  // ❌ 'error' is of type 'unknown'.
}
```

第2章で学んだ `unknown` の出番です。使う前に型を確認する必要があります。

```typescript
try {
  JSON.parse("invalid");
} catch (error) {
  // instanceof Error で確認してから使う
  if (error instanceof Error) {
    console.error(error.message);  // ✅ ここでは Error 型と確定
    console.error(error.stack);    // ✅ スタックトレースも取れる
  } else {
    console.error("不明なエラー:", error);
  }
}
```

> **なぜ unknown なのか**
>
> TypeScript/JavaScript では `throw` する値に制限がありません。`Error` オブジェクトだけでなく、文字列や数値も `throw` できます。
>
> ```typescript
> throw "文字列エラー";  // OK
> throw 42;             // OK
> throw { code: 404 };  // OK
> ```
>
> そのため `catch` の引数は「何でも来る可能性がある」= `unknown` になります。`instanceof Error` でチェックしてから使うのが安全な書き方です。

### 5-4. カスタムエラークラス

独自のエラー型を作ることもできます。

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const validateAge = (age: number): void => {
  if (age < 0 || age > 150) {
    throw new ValidationError(`無効な年齢: ${age}`);
  }
};

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("バリデーションエラー:", error.message);
  } else if (error instanceof Error) {
    console.error("その他のエラー:", error.message);
  }
}
```

クラスについては第7章で詳しく学びます。今は「カスタムエラーが作れる」とだけ覚えておいてください。

### 5-5. 非同期処理でのエラーハンドリング(予告)

`async/await` と組み合わせると:

```typescript
const fetchData = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("通信エラー:", error.message);
    }
    throw error;  // 呼び出し元に再スロー
  }
};
```

非同期処理と `try/catch` の組み合わせは第8章で詳しく扱います。

### 🔧 ミニ演習2

入力文字列をパースする関数を書いてください。

仕様:
- カンマ区切りの `"名前,年齢"` 形式の文字列を受け取る
- `{ name: string; age: number }` 型のオブジェクトを返す
- 形式が不正なら `Error` を投げる
- 年齢が数値に変換できないなら `Error` を投げる

```typescript
const parseUser = (input: string): { name: string; age: number } => {
  // ここを実装
};

// 正常系
try {
  console.log(parseUser("Alice,30"));  // { name: "Alice", age: 30 }
  console.log(parseUser("Bob"));       // エラーになる
} catch (error) {
  if (error instanceof Error) console.error(error.message);
}
```

<details>
<summary>解答例</summary>

```typescript
const parseUser = (input: string): { name: string; age: number } => {
  const parts = input.split(",").map(p => p.trim());

  if (parts.length !== 2) {
    throw new Error("形式が不正です(name,age の形式で入力してください)");
  }

  const [name, ageStr] = parts;
  const age = Number(ageStr);

  if (Number.isNaN(age)) {
    throw new Error(`年齢が数値ではありません: "${ageStr}"`);
  }

  if (!name) {
    throw new Error("名前が空です");
  }

  return { name, age };
};

// 動作確認
const testCases = ["Alice,30", "Bob,25", "Carol", "Dave,abc", "  ,30"];

for (const input of testCases) {
  try {
    const user = parseUser(input);
    console.log(`✅ ${JSON.stringify(user)}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ "${input}": ${error.message}`);
    }
  }
}
```

`split` → `trim` → `Number()` → バリデーション → 返却、という流れ。`instanceof Error` で安全に `message` を取り出しています。

</details>

---

## 6. 章末演習(20分)

### 🎯 演習: CSVパーサー

カンマ区切りのCSV文字列から、ユーザーの配列を作る関数を書いてください。

```typescript
type User = {
  name: string;
  age: number;
  email: string;
};

// CSV の各行を User に変換する
// 形式: "名前,年齢,メールアドレス"
const parseCSV = (csv: string): User[] => {
  // ここを実装
  // - 行ごとに分割
  // - 各行を User に変換
  // - 変換失敗した行はスキップ(console.warn で警告)
  // - メールアドレスは小文字に正規化
};

const input = `
Alice,30,Alice@Example.COM
Bob,abc,bob@example.com
Charlie,25,charlie@example.com
invalid-line
Diana,40,diana@example.com
`.trim();

console.log(parseCSV(input));
// [
//   { name: "Alice", age: 30, email: "alice@example.com" },
//   { name: "Charlie", age: 25, email: "charlie@example.com" },
//   { name: "Diana", age: 40, email: "diana@example.com" },
// ]
// ※ Bob と invalid-line は警告を出してスキップ
```

<details>
<summary>解答例</summary>

```typescript
type User = {
  name: string;
  age: number;
  email: string;
};

const parseLine = (line: string): User => {
  const parts = line.split(",").map(p => p.trim());

  if (parts.length !== 3) {
    throw new Error(`形式が不正: "${line}"`);
  }

  const [name, ageStr, email] = parts;
  const age = Number(ageStr);

  if (Number.isNaN(age)) {
    throw new Error(`年齢が数値ではない: "${ageStr}"`);
  }

  if (!name || !email) {
    throw new Error("名前またはメールが空");
  }

  return { name, age, email: email.toLowerCase() };
};

const parseCSV = (csv: string): User[] => {
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const users: User[] = [];

  for (const line of lines) {
    try {
      users.push(parseLine(line));
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`スキップ: ${error.message}`);
      }
    }
  }

  return users;
};
```

ポイント:
- `parseLine` で1行のパースを担当、エラーは例外として投げる
- `parseCSV` で各行をループ、失敗した行は `catch` してスキップ
- `filter(line => line.trim() !== "")` で空行を除外

</details>

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **文字列メソッド**: `includes`、`startsWith`/`endsWith`、`slice`、`replace`/`replaceAll`、`split`/`join`、`trim`、`toUpperCase`/`toLowerCase`
2. **スコープ**: `const`/`let` はブロックスコープ。内側から外側は見える
3. **クロージャ**: 内側の関数が外側の変数を覚える仕組み
4. **`this`**: Arrow Function を使えば罠を回避できる
5. **`try/catch`**: Python の `try/except` と同じ感覚
6. **TypeScript の `catch` は `unknown` 型** → `instanceof Error` で確認してから使う
7. カスタムエラーは `class MyError extends Error` で作れる

### 確認問題

<details>
<summary>Q1. TypeScript で catch のエラー変数が unknown 型になるのはなぜか?</summary>

TypeScript/JavaScript では `throw` する値に型制限がないためです。`Error` オブジェクト以外にも文字列や数値を `throw` できるので、`catch` の引数は「何が来るか分からない」= `unknown` 型になります。使う前に `instanceof Error` で型を確認する必要があります。
</details>

<details>
<summary>Q2. クロージャとは何か? 1行で説明せよ</summary>

内側の関数が、その関数が定義された外側の変数を「覚えている(参照し続ける)」仕組みです。
</details>

<details>
<summary>Q3. `split` と `join` の組み合わせで何ができるか?</summary>

文字列を配列に分解し(`split`)、加工したあと再び文字列に結合(`join`)できます。例えばCSVを処理したり、区切り文字を変換したりするのに使います。
</details>

---

## 次の章へ

第6章で**文字列・スコープ・クロージャ・例外処理**を押さえました。次の第7章では**クラスとモジュール**を学びます。TypeScript のクラスは型システムとの親和性が高く、`private`/`readonly`/`implements` などが使えます。モジュール(`import`/`export`)は現代 TypeScript の必須知識です。

---

> 🎯 **コラム: エラーは「早く投げ、高く処理」**
>
> 例外処理のベストプラクティスのひとつが「**早く投げ(throw early)、高く処理(catch late)**」という考え方です。
>
> ```typescript
> // ✅ 問題を検出したら即座に投げる
> const getUser = (id: number): User => {
>   if (id <= 0) throw new Error("IDは正の整数でなければなりません");
>   // ...
> };
>
> // ✅ 呼び出し側でまとめて処理
> try {
>   const user = getUser(-1);
>   const order = getOrder(user);
>   const invoice = createInvoice(order);
> } catch (error) {
>   if (error instanceof Error) {
>     showErrorToUser(error.message);
>   }
> }
> ```
>
> - **早く投げる**: 不正な値は発見した瞬間にエラーにする(問題の原因に近い場所でエラーが出るため、デバッグしやすい)
> - **高く処理**: `try/catch` は UI に近い層や、エラーを一括処理できる場所でまとめて行う
>
> これにより、エラー処理のコードが散らばらず、見通しの良いコードになります。

お疲れさまでした!次の第7章で会いましょう ☕
