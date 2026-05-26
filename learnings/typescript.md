# TypeScript の学び

> TypeScript に関する学びの蓄積。  
> 週次ログから「重要だ」と思った内容を転記して整理。

最終更新:2026/05/26

---

## 📚 学んだ概念・キーワード

### TypeScript とは

- **TypeScript = JavaScript + 型システム**
- 最終的にJavaScriptにコンパイルされて実行される
- 拡張子: `.ts`（通常）/ `.tsx`（React + JSX）

### 実行コマンドの使い分け

| コマンド | 型チェック | 実行 |
|---|---|---|
| `npm start` / `npm run dev` | しない | する |
| `npm run typecheck` | する | しない |

- 型エラーは **VS Code の赤線** か `npm run typecheck` で確認
- `npm start` は型エラーがあっても動く

### `const` / `let` の使い分け

```typescript
const name = "Alice";  // 再代入なし → 基本はこれ
let count = 0;          // 再代入あり → 必要なときだけ
// var は使わない（古い書き方）
```

- まず `const` で書いて、再代入が必要になったら `let` に変える

### 型推論と型注釈 — どこに書くか

```typescript
// ローカル変数 → 推論に任せる（注釈不要）
const age = 30;         // number と推論される
const name = "Alice";   // string と推論される

// 関数の引数 → 必ず書く（推論できない）
const greet = (name: string): string => `Hello, ${name}`;

// let で初期値なし → 必ず書く（書かないと any になる）
let userId: number;
userId = 12345;
```

**覚え方: 「境界に型を書く」**
- 入口（関数の引数）: 必須
- 中間（ローカル変数）: 推論に任せる
- 出口（関数の戻り値）: 書くと安全

### 基本のデータ型

```typescript
const n: number = 42;         // 整数も小数も全部 number
const s: string = "hello";
const b: boolean = true;
const nothing: null = null;       // 意図的に「値なし」
const notSet: undefined = undefined; // 「まだ値が入っていない」
```

- `===` を使う（`==` は型変換が入るのでバグの原因）
- `typeof null` は `"object"`（JSの歴史的バグ）

### `any` vs `unknown`

```typescript
// any: 型チェックを無効化（極力使わない）
let x: any = "hello";
x.toFixed(2);  // ← 実行時エラーになるのにコンパイルは通る

// unknown: 安全な any。使う前に型を絞る必要がある
let y: unknown = "hello";
if (typeof y === "string") {
  y.toUpperCase();  // ✅ ここでは string と確定
}
```

- `any` を書きたくなったらまず `unknown` でいいか考える
- `unknown` + `typeof` で絞り込むのが TypeScript の典型パターン

### `void` と `never`

```typescript
// void: 戻り値を使わない関数
const log = (msg: string): void => { console.log(msg); };

// never: 正常終了しない関数（例外を投げる・無限ループ）
const fail = (msg: string): never => { throw new Error(msg); };
```

### `strict: true` — TypeScript の真価

`tsconfig.json` の最重要設定。8つの厳格チェックをまとめてON。

特に重要な2つ:
- **`noImplicitAny`**: 引数に型を書かないとエラー
- **`strictNullChecks`**: `null`/`undefined` を別の型として扱い、うっかりアクセスを防ぐ

`strict: false` にすると TypeScript を使う意義の大半が失われる。

### `noUncheckedIndexedAccess: true`

```typescript
const fruits = ["apple", "banana"];
const first = fruits[0]; // string | undefined になる
first.toUpperCase();     // ❌ possibly undefined
first?.toUpperCase();    // ✅ オプショナルチェイニング
```

- 配列インデックスアクセスに `| undefined` が付く
- 配列の範囲外アクセスによるバグを防ぐ

### `||` vs `??` — falsy の扱いが違う

```typescript
// || は falsy（0, "", false, null, undefined）全部に反応
console.log(0 || "なし");   // → "なし"（0 は falsy）
console.log("" || "空");    // → "空"（"" は falsy）

// ?? は null / undefined だけに反応
console.log(0 ?? "なし");   // → 0（0 は null でも undefined でもない）
console.log("" ?? "空");    // → ""（"" も同様）
```

- デフォルト値を設定するなら基本 `??` を使う
- `0` や空文字も「値あり」として扱いたいときは特に重要

### 条件分岐の early return パターン

```typescript
// ネストを避けてフラットに書く
const describeWeather = (temperature: number): string => {
  if (temperature >= 30) return "暑い";
  if (temperature >= 20) return "快適";
  if (temperature >= 10) return "肌寒い";
  return "寒い";
};
```

- `else if` をつなげるより「早めに return して抜ける」ほうが読みやすい

### FizzBuzz — 判定順が重要

```typescript
const fizzBuzz = (): void => {
  for (let i = 1; i <= 30; i++) {
    if (i % 15 === 0) {      // 3と5の倍数を先に判定
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
```

- `i % 15 === 0` を最初に書かないと `i % 3 === 0` に引っかかって "Fizz" だけ出てしまう

### `for...of` でループ

```typescript
const sum = (numbers: number[]): number => {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
};
```

- インデックスが不要なら `for...of` がシンプル

### Arrow Function — 現代 TypeScript の標準

```typescript
// フル形式
const double = (n: number): number => {
  return n * 2;
};

// 短縮形（1行なら {} と return を省略）
const double = (n: number): number => n * 2;

// 引数なし
const now = (): number => Date.now();
```

- `const f = (x: T): R => ...` の形が基本
- TypeScript では引数が1つでも `()` を省略しない（型注釈が必要なため）

### デフォルト引数 vs オプショナル引数

```typescript
// デフォルト引数: 省略時に値が入る → 型は string
const a = (name: string, greeting = "Hello") => `${greeting}, ${name}!`;

// オプショナル引数: 省略時は undefined → 型は string | undefined
const b = (name: string, greeting?: string) => `${greeting ?? "Hello"}, ${name}!`;
```

- デフォルト引数は型が `string`（undefined にならない）→ `??` なしで使える
- オプショナル引数は型が `string | undefined` → 関数内で `??` が必要
- 実務ではデフォルト引数の方が使いやすいことが多い

### 残余引数（Rest Parameters）

```typescript
const sum = (...numbers: number[]): number => {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
};

console.log(sum(1, 2, 3));    // 6
console.log(sum());            // 0
```

- `...変数名: 型[]` の形。受け取った値は配列になる
- 通常の引数と組み合わせるときは**最後**に置く

### 関数型とコールバック

```typescript
// 関数型: (引数名: 型) => 戻り値型
type NumberTransformer = (n: number) => number;

// コールバックを受け取る関数
const transform = (arr: number[], fn: (n: number) => number): number[] =>
  arr.map(fn);

transform([1, 2, 3], n => n * 2);   // [2, 4, 6]
transform([1, 2, 3], n => n ** 2);  // [1, 4, 9]
```

- `fn: (n: number) => number` = 「number を受け取り number を返す関数」という型
- `map`/`filter`/`reduce` のコールバックと同じ仕組み

### コールバック関数 vs 高階関数

```typescript
// map が「高階関数」、n => n * 2 が「コールバック関数」
numbers.map(n => n * 2);
```

- **高階関数**: 関数を引数として**受け取る**側（`map`、`filter`、`reduce` など）
- **コールバック関数**: 引数として**渡される**側（`n => n * 2` の部分）
- 「コール(呼び出し)をバック(あとで)する」= 受け取った側があとで呼ぶための関数

コールバックを使う理由: 「枠組み（配列を処理する）」と「中身（どう変換するか）」を分離できる。変換ロジックを外から差し込めるので、同じパターンの関数を量産しなくて済む。

### よく使う配列メソッドと関数型

```typescript
const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);              // [2, 4, 6, 8, 10]  — 変換
numbers.filter(n => n % 2 === 0);    // [2, 4]             — 絞り込み
numbers.find(n => n > 3);            // 4                  — 最初の1件
numbers.reduce((acc, n) => acc + n, 0); // 15              — 集計
```

コールバックの型でメソッドの役割が分かる:
- `(n) => number` → 変換系（map）
- `(n) => boolean` → 判定系（filter、find）

### 関数型 vs 関数定義の見分け方

```typescript
// 型注釈の中 → 関数型
const transform = (arr: number[], fn: (n: number) => number): number[] => ...
//                                     ^^^^^^^^^^^^^^^^^^^^^^^^ 関数型

// = の右側 → 関数定義
const double = (n: number): number => n * 2;
//             ^^^^^^^^^^^^^^^^^^^^^^^^ 関数定義
```

### reduce の構造 — for ループとの対応

```typescript
// for 版
let total = x;
for (const f of fns) {
  total = f(total);
}
return total;

// reduce 版（同じ処理を1行で）
return fns.reduce((acc, f) => f(acc), x);
```

| for 版 | reduce 版 |
|---|---|
| `let total` | `acc` |
| 初期値 `x` | 第2引数 `x` |
| `total = f(total)` | `(acc, f) => f(acc)` |
| `return total` | reduce が自動で返す |

- 初期値（第2引数）は**必ず書く**（省くと型エラーになりがち）
- 慣れないうちは for で書いてから reduce に直す、で十分

---

## 💻 よく使うパターン・スニペット

### プロジェクト初期セットアップ

```bash
mkdir my-project && cd my-project
npm init -y
npm install -D typescript tsx @types/node
npx tsc --init
```

`package.json` の scripts:
```json
{
  "type": "module",
  "scripts": {
    "start": "tsx src/index.ts",
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

### tsconfig.json（推奨設定）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

---

## 😅 ハマりやすいポイント

### `let` の初期値なし宣言で型注釈を忘れる
- 症状: 暗黙の `any` になりエラーが出なくなる
- 解決: `let userId: number;` のように必ず型注釈を書く

### 宣言した変数と違う変数を渡す
- 症状: `userId2` を作ったのに `userId` を渡してしまった
- 解決: 変数名を揃える意識を持つ

### `export {}` を書かないと変数名が衝突する
- 症状: 別ファイルの `const sum` と名前がぶつかって `Cannot redeclare block-scoped variable` エラー
- 原因: `import`/`export` のない TS ファイルはグローバルスコープ扱いになる
- 解決: ファイル末尾に `export {};` を1行追加してモジュールとして宣言する

### pipe で「前の結果」ではなく「最初の値」を渡し続けてしまう
- 症状: `total = f(x)` と書いてしまい、毎回最初の値で処理される（結果が 9 になるなど）
- 原因: 累積処理では「前回の結果」を次に渡す必要があると気づいていなかった
- 解決: `total = f(total)` — ループ内では**毎回更新される変数**を渡す
- 覚え方: 「前の結果が次に必要か？」を意識する

---

## 🤔 まだわかっていないこと

- 配列・オブジェクトの型（ch05）
- `Array<T>` と `T[]` の実務での使い分け（ch05 以降で確認）
- `reduce` を pipe 以外でどう活用するか
- クラスのメソッドで Arrow Function より `function` が安全なケース（ch07）
- ジェネリクス・ユーティリティ型（ch11）
