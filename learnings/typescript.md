# TypeScript の学び

> TypeScript に関する学びの蓄積。  
> 週次ログから「重要だ」と思った内容を転記して整理。

最終更新:2026/05/24

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

---

## 🤔 まだわかっていないこと

- 演算子・制御構文（ch03 で学ぶ）
- 関数の高度な型（ch04）
- 配列・オブジェクトの型（ch05）
- ジェネリクス・ユーティリティ型（ch11）
