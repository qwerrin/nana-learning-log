# 第3章 演算子・制御構文

## この章のゴール

- 算術・比較・論理演算子を使いこなせる
- `??`(Null合体演算子)と `||` を使い分けられる
- `if`/`else if`/`else`、三項演算子、`switch` を書ける
- `for`/`for...of`/`while` でループを書ける
- TypeScriptの型が制御構文の中でどう影響するか分かる

**所要時間の目安: 2時間**

---

## 0. この章の準備

引き続き `01-basics/` を使います。`src/03-control.ts` を作って進めましょう。

```json
"start": "tsx src/03-control.ts"
```

---

## 1. 演算子(30分)

### 1-1. 算術演算子

```typescript
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333...
console.log(10 % 3);   // 1 (剰余)
console.log(2 ** 10);  // 1024 (べき乗)
```

> **Pythonとの違い**
> Pythonの `//`(整数除算)はJavaScript/TypeScriptにはありません。整数にしたい場合は `Math.floor(10 / 3)` と書きます。

#### 代入演算子の短縮形

```typescript
let count = 10;
count += 5;   // count = count + 5
count -= 3;   // count = count - 3
count *= 2;   // count = count * 2
count /= 4;   // count = count / 4
count++;      // count = count + 1
count--;      // count = count - 1
```

### 1-2. 比較演算子

```typescript
console.log(10 > 5);    // true
console.log(10 >= 10);  // true
console.log(10 < 5);    // false
console.log(10 <= 9);   // false
```

#### ⭐ `===` を使う(`==` は使わない)

```typescript
// === は型と値の両方を比較(安全)
console.log(1 === 1);     // true
console.log(1 === "1");   // false(型が違う)
console.log(0 === false); // false(型が違う)

// == は型を変換して比較(危険)
console.log(1 == "1");    // true 😱
console.log(0 == false);  // true 😱
```

TypeScriptでは `==` を使うと警告が出る設定にできます(ESLint との組み合わせ)。**常に `===` を使う**のが鉄則です。

`!==` は「等しくない」の厳密版。

```typescript
console.log(1 !== 2);   // true
console.log(1 !== "1"); // true
```

### 1-3. 論理演算子

```typescript
const age = 20;
const hasLicense = true;

console.log(age >= 18 && hasLicense);  // true (AND: 両方true)
console.log(age >= 18 || hasLicense);  // true (OR: どちらかtrue)
console.log(!hasLicense);              // false (NOT: 反転)
```

> **Pythonとの違い**
> Pythonの `and`/`or`/`not` に相当します。TypeScript/JavaScriptは記号(`&&`/`||`/`!`)を使います。

### 1-4. `||` と `??` — Null合体演算子

「値がなければデフォルト値を使う」パターンで頻繁に使います。

```typescript
// || は「最初のtruthy(真っぽい値)」を返す
const name1: string | null = null;
console.log(name1 || "ゲスト");  // → "ゲスト"

// ⚠️ 0や空文字でも "ゲスト" になってしまう
const count = 0;
console.log(count || "なし");    // → "なし" 😱(0なのに!)
```

```typescript
// ?? は「null/undefined のときだけ」デフォルト値を使う
const count2 = 0;
console.log(count2 ?? "なし");  // → 0 (正しい)

const value: string | null = null;
console.log(value ?? "デフォルト");  // → "デフォルト"
```

**使い分けの目安**:
- `??` : `null`/`undefined` だけを置き換えたい → **こちらが安全**
- `||` : `0` や `""` も置き換えたい

### 1-5. オプショナルチェイニング `?.`

TypeScriptで頻出するパターン。「値が `null`/`undefined` かもしれないとき、安全にプロパティへアクセスする」。

```typescript
const user: { name: string; address?: { city: string } } | null = null;

// ❌ nullに直接アクセスするとエラー
// console.log(user.name);

// ✅ ?. で安全にアクセス(undefinedを返す)
console.log(user?.name);           // undefined
console.log(user?.address?.city);  // undefined(ネストも使える)
```

`?.` は「左辺が `null`/`undefined` なら `undefined` を返し、そうでなければ普通にアクセスする」演算子です。第12章の型ガードと組み合わせてよく使います。

### 1-6. Truthy / Falsy

TypeScript/JavaScriptには「真っぽい値」「偽っぽい値」という概念があります。

**Falsy な値**(条件式でfalseとして扱われる):
- `false`
- `0`
- `""` (空文字列)
- `null`
- `undefined`
- `NaN`

**それ以外はすべて Truthy** (`"0"`、`[]`、`{}` も truthy!)

```typescript
if ("hello") console.log("truthy");   // 実行される
if (0) console.log("falsy");          // 実行されない
if ([]) console.log("配列はtruthy");  // 実行される(注意!)
```

> **Pythonとの違い**
> Pythonでは空のリスト `[]` は `False` ですが、TypeScript/JavaScriptでは空配列 `[]` も **truthy** です。

### 🔧 ミニ演習1

次のコードの出力を予想してから実行してみてください。

```typescript
console.log(5 === 5);
console.log(5 === "5");
console.log(null === undefined);
console.log(0 ?? "なし");
console.log(0 || "なし");
console.log("" ?? "空");
```

<details>
<summary>答え</summary>

```
true
false   ← 型が違う
false   ← null と undefined は別物
0       ← ?? は null/undefined だけを対象にする
"なし"  ← 0 は falsy なので || は右辺を返す
"空"    ← "" は falsy、?? は null/undefined のみ対象なので ← !! 実は ""
```

最後の1つを訂正します:
```typescript
console.log("" ?? "空");  // → "" 
// ?? は null/undefined のときだけ右辺を返す
// "" は null でも undefined でもないので "" がそのまま返る
```

`??` と `||` の違いを体感できましたか?
</details>

---

## 2. 型の変換(15分)

TypeScriptでは型が違う演算は多くの場合エラーになりますが、明示的な変換は必要です。

### 2-1. 明示的な型変換

```typescript
// 文字列 → 数値
const str = "42";
const num = Number(str);
console.log(num);         // 42
console.log(typeof num);  // "number"

// 変換できない文字列はNaNになる
console.log(Number("abc"));  // NaN

// 数値 → 文字列
const n = 100;
console.log(String(n));      // "100"
console.log(n.toString());   // "100"

// 真偽値への変換
console.log(Boolean(1));     // true
console.log(Boolean(0));     // false
console.log(Boolean("hi"));  // true
console.log(Boolean(""));    // false
```

### 2-2. TypeScriptでの型変換の安全さ

TypeScriptでは型が違う演算は多くの場面でエラーになります。

```typescript
const x: number = 10;
const s: string = "20";

const result = x + s;
// ❌ Operator '+' cannot be applied to types 'number' and 'string'.
// (strictNullChecksの設定によっては警告のみの場合も)

// ✅ 明示的に変換してから
const result2 = x + Number(s);  // 30
const result3 = String(x) + s;  // "1020"
```

---

## 3. 条件分岐(30分)

### 3-1. if / else if / else

```typescript
const score = 75;

if (score >= 90) {
  console.log("優");
} else if (score >= 70) {
  console.log("良");
} else if (score >= 50) {
  console.log("可");
} else {
  console.log("不可");
}
// → "良"
```

> **Pythonとの違い**
> 条件を `()` で囲む、ブロックを `{}` で囲む、`elif` ではなく `else if` を使う点が異なります。

### 3-2. 早期 return パターン

`return` を使うと `else` を省略でき、ネストが浅くなります。

```typescript
const grade = (score: number): string => {
  if (score >= 90) return "優";
  if (score >= 70) return "良";
  if (score >= 50) return "可";
  return "不可";
};
```

TypeScript では戻り値の型(`string`)を書いているので、すべてのパスで文字列が返ることをコンパイラが確認してくれます。

### 3-3. 三項演算子

2択の分岐を1行で書きたいときに使います。

```typescript
const age = 20;

// if/else で書くと
let category: string;
if (age >= 20) {
  category = "成人";
} else {
  category = "未成年";
}

// 三項演算子で1行に
const category2 = age >= 20 ? "成人" : "未成年";
console.log(category2);  // → "成人"
```

TypeScriptでは三項演算子の両辺の型が合わないとエラーになります。

```typescript
const value = true ? "hello" : 42;
// value の型は string | number と推論される
```

**目安**: 2択ならOK、3択以上は `if/else if` で書く。

### 3-4. switch 文

複数の値で分岐するときに使います。

```typescript
type Fruit = "apple" | "banana" | "orange";  // ユニオン型(第10章で詳しく)

const describeFruit = (fruit: Fruit): string => {
  switch (fruit) {
    case "apple":
      return "りんご";
    case "banana":
      return "バナナ";
    case "orange":
      return "みかん";
  }
};
```

> ⚠️ **`break` を忘れずに**
>
> `return` を使わない場合、各 `case` の最後に `break` が必要です。書かないと次の `case` も実行されます(フォールスルー)。
>
> ```typescript
> switch (value) {
>   case "a":
>     console.log("A");
>     break;  // 忘れると "B" も実行される
>   case "b":
>     console.log("B");
>     break;
> }
> ```

TypeScriptではユニオン型と `switch` を組み合わせると、**全ケースが網羅されているかチェック**できます。これは第12章の「型ガード」で詳しく学びます。

### 3-5. オブジェクトによる分岐(現代的)

`switch` の代わりに、オブジェクトを使う書き方もよく使われます。

```typescript
const fruitNames: Record<string, string> = {
  apple:  "りんご",
  banana: "バナナ",
  orange: "みかん",
};

const name = fruitNames["apple"] ?? "不明";
console.log(name);  // → "りんご"
```

シンプルな「値の対応表」なら、`switch` よりオブジェクトの方が短く書けます。

### 🔧 ミニ演習2

引数 `temperature`(気温、`number` 型)を受け取り、次の文字列を返す関数 `describeWeather` を書いてください。

- 30以上 → `"暑い"`
- 20以上 → `"快適"`
- 10以上 → `"肌寒い"`
- それ未満 → `"寒い"`

<details>
<summary>解答例</summary>

```typescript
const describeWeather = (temperature: number): string => {
  if (temperature >= 30) return "暑い";
  if (temperature >= 20) return "快適";
  if (temperature >= 10) return "肌寒い";
  return "寒い";
};

console.log(describeWeather(35));  // "暑い"
console.log(describeWeather(25));  // "快適"
console.log(describeWeather(15));  // "肌寒い"
console.log(describeWeather(5));   // "寒い"
```

戻り値の型 `: string` を明示すると、全パスで文字列を返すことをコンパイラが確認してくれます。
</details>

---

## 4. ループ(30分)

### 4-1. for 文(伝統的)

```typescript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// 0, 1, 2, 3, 4
```

構造:
```
for (初期化; 継続条件; 更新) {
  処理
}
```

### 4-2. ⭐ for...of 文(推奨)

配列などを1つずつ処理するとき。**Pythonの `for x in list:` に近い感覚**。

```typescript
const fruits: string[] = ["apple", "banana", "orange"];

for (const fruit of fruits) {
  console.log(fruit);
}
// "apple", "banana", "orange"
```

TypeScriptでは `fruit` の型が自動的に `string` と推論されます。

インデックスも必要なときは `entries()` を使います。

```typescript
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
// "0: apple", "1: banana", "2: orange"
```

### 4-3. while 文

回数が事前に決まっていないループに使います。

```typescript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
// 0, 1, 2
```

> ⚠️ **無限ループに注意**: `while (true)` のように条件が常に true だと終わりません。必ず終了条件を確認してください。

### 4-4. break と continue

```typescript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;      // 5になったらループを抜ける
  if (i % 2 === 0) continue;  // 偶数はスキップ
  console.log(i);
}
// 1, 3
```

### 4-5. ⚠️ for...in は配列に使わない

```typescript
const arr = ["a", "b", "c"];

// ❌ for...in は配列に使うと意図しない動作をすることがある
for (const i in arr) { ... }

// ✅ 配列には for...of を使う
for (const item of arr) { ... }
```

`for...in` はオブジェクトのキーを列挙するための構文です(第5章で説明)。

### 🔧 ミニ演習3

配列 `[10, 20, 30, 40, 50]` の合計を計算する関数 `sum` を書いてください。

```typescript
const sum = (numbers: number[]): number => {
  // ここを実装
};

console.log(sum([10, 20, 30, 40, 50]));  // → 150
```

<details>
<summary>解答例</summary>

```typescript
const sum = (numbers: number[]): number => {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
};

console.log(sum([10, 20, 30, 40, 50]));  // 150
```

`numbers: number[]` と型注釈を書くことで、`n` の型が自動的に `number` と推論されます。後の章で `reduce` を使うともっと短く書けます。
</details>

---

## 5. TypeScript の型と制御構文(15分)

TypeScriptでは制御構文の中で型が**絞り込まれる**という特徴があります。これを **narrowing(型の絞り込み)** といい、第12章で詳しく学びます。ここでは予告として触れておきます。

### 5-1. if で型が絞り込まれる

```typescript
const value: string | number = "hello";

if (typeof value === "string") {
  // ここでは value は string 型として扱われる
  console.log(value.toUpperCase());  // ✅
} else {
  // ここでは value は number 型として扱われる
  console.log(value.toFixed(2));     // ✅
}
```

`if` ブロックの中で型が自動的に絞り込まれるので、型エラーなく各型のメソッドが使えます。

### 5-2. オプショナルチェイニングとの組み合わせ

```typescript
const user: { name: string } | null = null;

// ?. で null チェックしながらアクセス
const name = user?.name ?? "ゲスト";
console.log(name);  // → "ゲスト"
```

`user?.name` は `user` が `null`/`undefined` なら `undefined` を返し、`?? "ゲスト"` でデフォルト値を設定します。TypeScriptでよく使う定番パターンです。

---

## 6. 章末演習(20分)

### 🎯 演習1: 成績評価システム

引数に点数(`number`)と受験者名(`string`)を取り、評価を返す関数を作ってください。

仕様:
- 90点以上: `"[名前]さんは優秀です！(A)"`
- 70点以上: `"[名前]さんは合格です。(B)"`
- 50点以上: `"[名前]さんは合格です。(C)"`
- 50点未満: `"[名前]さんは不合格です。(D)"`

### 🎯 演習2: FizzBuzz

1から30までの数を出力しますが、
- 3の倍数なら `"Fizz"`
- 5の倍数なら `"Buzz"`
- 両方の倍数なら `"FizzBuzz"`
を出力する関数を書いてください。

<details>
<summary>解答例</summary>

```typescript
// 演習1
const evaluate = (score: number, name: string): string => {
  if (score >= 90) return `${name}さんは優秀です！(A)`;
  if (score >= 70) return `${name}さんは合格です。(B)`;
  if (score >= 50) return `${name}さんは合格です。(C)`;
  return `${name}さんは不合格です。(D)`;
};

console.log(evaluate(95, "Alice"));  // "Aliceさんは優秀です！(A)"
console.log(evaluate(75, "Bob"));   // "Bobさんは合格です。(B)"
console.log(evaluate(45, "Carol")); // "Carolさんは不合格です。(D)"

// 演習2
const fizzBuzz = (): void => {
  for (let i = 1; i <= 30; i++) {
    if (i % 15 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
};

fizzBuzz();
```

FizzBuzz は `15の倍数を先にチェック`するのがポイントです。`3 × 5 = 15` なので、15の倍数を最初に判定しないと FizzBuzz が出力されません。
</details>

---

## 7. この章のまとめ

### 覚えておきたいこと

1. **`===` を使う**(`==` は絶対に使わない)
2. **`??`** はnull/undefinedだけ対象、**`||`** はfalsy全体が対象
3. **`?.`** でnull/undefinedを安全にチェックしながらアクセス
4. **Falsy**: `false`/`0`/`""`/`null`/`undefined`/`NaN`。空配列 `[]` は truthy
5. **for...of** が配列ループの基本。`for...in` は配列に使わない
6. **早期 return** でネストを浅く保つ
7. TypeScriptでは **if の中で型が絞り込まれる**(narrowing)

### 確認問題

<details>
<summary>Q1. `0 || "default"` と `0 ?? "default"` の結果はそれぞれ何か?</summary>

- `0 || "default"` → `"default"` (`0` は falsy なので右辺が返る)
- `0 ?? "default"` → `0` (`0` は null でも undefined でもないので左辺がそのまま返る)
</details>

<details>
<summary>Q2. `for...of` と `for...in` の違いは?</summary>

- `for...of`: 配列や文字列など「値の列」を1つずつ取り出す。**配列のループに使う**
- `for...in`: オブジェクトの**キー**を取り出す。配列に使うと意図しない動作をするので避ける
</details>

<details>
<summary>Q3. 三項演算子はどういうときに使うべきか?</summary>

**2択の分岐**を短く書きたいときに使います。3択以上になる場合は読みにくくなるので、`if/else if` を使う方が良いです。
</details>

---

## 次の章へ

第3章で**演算子と制御構文**が身につきました。次の第4章では**関数**をTypeScriptの型と一緒に詳しく学びます。Arrow Function の型注釈、デフォルト引数・残余引数の型、関数を引数として渡す書き方など、実務で毎日使うパターンを押さえます。

---

> 🎯 **コラム: `===` を強制するTypeScriptの設定**
>
> ESLintというコードチェックツールを使うと、`==` を使ったときに自動で警告を出す設定ができます。
>
> ```json
> // .eslintrc での設定例
> { "rules": { "eqeqeq": "error" } }
> ```
>
> 実務のプロジェクトでは ESLint + TypeScript を組み合わせて、コードの品質を自動チェックするのが当たり前です。今の段階では「そういう仕組みがある」と知っておけば十分で、本格的な設定は中級者向けのトピックです。

お疲れさまでした!次の第4章で会いましょう ☕
