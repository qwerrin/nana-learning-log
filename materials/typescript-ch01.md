# 第1章 TypeScriptとは / 環境構築 / tsconfig

## この章のゴール

- TypeScriptとJavaScriptの関係を説明できる
- なぜTypeScriptが必要かを実例で理解する
- 最初のTypeScriptプロジェクトを立ち上げられる
- `Hello, TypeScript!` を実際に実行できる
- `tsconfig.json` の主要オプションの意味が分かる
- `strict` モードがなぜ重要かを理解する

**所要時間の目安: 3時間**

---

## 0. この章で作るもの

この章を終えると、こうなります。

```
typescript-learning/
└── 01-basics/
    ├── package.json
    ├── tsconfig.json
    ├── node_modules/
    └── src/
        └── hello.ts   ← "Hello, TypeScript!" と出力
```

`npm start` と打つとターミナルに `Hello, TypeScript!` と表示される、シンプルなプロジェクトです。**この環境が第7章まで使い続ける土台**になります。

---

## 1. TypeScriptとは何か(30分)

### 1-1. ひとことで言うと

**TypeScript = JavaScript + 型システム**

JavaScriptに「型」という機能を**追加した**プログラミング言語です。Microsoftが2012年に公開し、現在のWeb開発で**事実上の標準**になっています。

### 1-2. なぜ最初からTypeScriptで学ぶのか

この資料では **JavaScriptを先に学んでからTypeScriptに移行する、という遠回りをしません**。

理由はシンプルで、**型を最初から一緒に覚えた方が効率がいい**からです。

「型なしJSに慣れた後で型を足す」より「最初から型のある状態で書く」方が、型を自然な形で身につけられます。実際の現場でも、新しいプロジェクトはほぼTypeScriptで書かれています。

### 1-3. ファイルの拡張子

| 拡張子 | 内容 |
|---|---|
| `.js` | JavaScript |
| `.ts` | TypeScript |
| `.jsx` | JavaScript + JSX(React) |
| `.tsx` | TypeScript + JSX(React) |

この資料では `.ts` と `.tsx` を書きます。

### 1-4. 実行の仕組み

ブラウザもNode.jsも、本来は**JavaScriptしか実行できません**。TypeScriptは最終的にJavaScriptに**変換(コンパイル)されてから**実行されます。

```
[hello.ts]  →  TypeScriptコンパイラ  →  [hello.js]  →  Node.js / ブラウザで実行
```

ただしこの変換作業は開発ツールが自動でやってくれるので、手動で変換する必要はありません。

### 1-5. JavaScriptの問題と、TypeScriptの解決策

JavaScriptは**動的型付け**の言語です。変数の型は実行時に決まり、自由に変えられます。これは便利な反面、バグの温床になります。

#### 問題1: スペルミスに気づけない

```javascript
// JavaScript
const user = { name: "Alice", age: 30 };
console.log(user.nmae);  // → undefined 😱(エラーにならない!)
```

```typescript
// TypeScript
const user = { name: "Alice", age: 30 };
console.log(user.nmae);
// ❌ Property 'nmae' does not exist. Did you mean 'name'?
// コードを書いた瞬間に赤線が出て教えてくれる
```

#### 問題2: 型の不一致が実行時まで分からない

```javascript
// JavaScript
const calcPrice = (price, quantity) => price * quantity;

const total = calcPrice("1000", 3);
console.log(total);  // → "100010001000" 😱(文字列の繰り返しになる)
```

```typescript
// TypeScript
const calcPrice = (price: number, quantity: number): number => price * quantity;

const total = calcPrice("1000", 3);
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
// 関数を呼ぶ時点でエラー。実行する前に気づける
```

#### 問題3: null/undefined の扱い忘れ

```javascript
// JavaScript
const findUser = (id) => { /* 見つからなければ undefined を返す */ };

const user = findUser(123);
console.log(user.name);  // → 💥 userがundefinedだと実行時エラー
```

```typescript
// TypeScript
const findUser = (id: number): User | undefined => { /* ... */ };

const user = findUser(123);
console.log(user.name);  // ❌ 'user' is possibly 'undefined'.

// 修正: 存在チェックを強制してくれる
if (user) {
  console.log(user.name);  // ✅ ここでは安全
}
```

### 1-6. TypeScriptの3大メリット

**メリット1: 早期バグ発見**
「実行して気づくバグ」より「コードを書いた瞬間に気づくバグ」の方が、圧倒的に直しやすい。

**メリット2: エディタ補完が劇的に賢くなる**
型情報があるため、プロパティ名・引数・戻り値がすべて正確に補完される。「型を書く労力 < 補完で得する時間」になる。

**メリット3: ドキュメント代わりになる**
関数の型を見るだけで「どう使うか」が分かる。コメントや外部ドキュメントを読む必要がない。

### 1-7. TypeScriptで「できないこと」

- **実行速度は速くならない**: 型はコンパイル時に消える。実行されるのは普通のJS
- **ロジックのバグは防げない**: `0` で割ってもエラーにならない
- **外部データの型は保証されない**: APIから来たデータが本当にその型かはチェックしない

「型があれば万全」ではなく、「型に関するバグを防ぐ」ものと理解しておきましょう。

---

## 2. 環境構築(45分)

### 2-1. 環境チェック

ターミナル(macOS: ターミナル.app、Windows: PowerShell)を開いて確認します。

```bash
node --version   # v22.x.x または v24.x.x が期待値
npm --version    # 10.x.x または 11.x.x が期待値
```

バージョンが古い場合(v18以下)は、**Node.js 24 LTS** へのアップグレードを推奨します。

#### Node.jsをまだインストールしていない場合

**macOS(fnm 推奨)**:
```bash
brew install fnm
fnm install 24
fnm default 24
```

**Windows**:
[nodejs.org](https://nodejs.org/ja) から「LTS」版をダウンロードしてインストール。

**VS Codeの確認**:
[code.visualstudio.com](https://code.visualstudio.com/) からインストール。TypeScript対応は最初から組み込まれているので、追加の拡張機能は不要です。

> **おすすめの拡張機能**(任意)
> - **Error Lens**: エラーをコード行に直接表示。初学者に特におすすめ
> - **Prettier**: コードを自動整形

### 2-2. 親フォルダを作る

これから作るすべてのプロジェクトを置く親フォルダを1つ作ります。

```bash
mkdir typescript-learning
cd typescript-learning
```

### 2-3. 最初のプロジェクト `01-basics/` を作る

**ステップ1: フォルダを作る**

```bash
mkdir 01-basics
cd 01-basics
```

**ステップ2: VS Code で開く**

```bash
code .
```

以降はVS Code内の統合ターミナルで作業します。
(`Ctrl + `` ` `` `  / macOS: `Cmd + `` ` `` `)

**ステップ3: npm の初期化**

```bash
npm init -y
```

`package.json` が生成されます。

**ステップ4: 必要なパッケージをインストール**

```bash
npm install -D typescript tsx @types/node
```

| パッケージ | 役割 |
|---|---|
| `typescript` | TypeScriptコンパイラ本体 |
| `tsx` | `.ts` ファイルを直接実行できるツール |
| `@types/node` | Node.jsの型定義(`console.log` などに型をつける) |

**ステップ5: tsconfig.json を作る**

```bash
npx tsc --init
```

生成された `tsconfig.json` の中身を**すべて次の内容に置き換えてください**。

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
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

各オプションの意味はこの章の後半で解説します。

**ステップ6: package.json を編集**

`package.json` の `scripts` を次のように書き換えます。

```json
{
  "name": "01-basics",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx src/hello.ts",
    "dev":   "tsx watch src/hello.ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^24.x.x",
    "tsx": "^4.x.x",
    "typescript": "^5.9.x"
  }
}
```

ポイント:
- `"type": "module"` を追加(ESモジュールを使うため)
- `start`: 1回だけ実行
- `dev`: ファイルを保存するたびに自動で再実行(学習中はこれが便利)
- `typecheck`: 型チェックだけ実行(実行はしない)

**ステップ7: src/hello.ts を作る**

```bash
mkdir src
```

VS Code で `src/` を右クリック → 「新しいファイル」 → `hello.ts` を作成。

```typescript
const message: string = "Hello, TypeScript!";
console.log(message);
```

`: string` という**型注釈**がついています。これがTypeScriptです。

**ステップ8: 実行!**

```bash
npm start
```

```
Hello, TypeScript!
```

🎉 **初めてのTypeScriptプログラムが動きました!**

### 2-4. 型チェックを体感する

わざと型違反を書いてみましょう。

```typescript
const message: string = 12345;  // ← string なのに数値を入れた
console.log(message);
```

**保存した瞬間に**、VS Code で `12345` の下に赤い波線が出るはずです。これが**TypeScriptのリアルタイム型チェック**。

```bash
npm run typecheck
```

```
src/hello.ts:1:7 - error TS2322: Type 'number' is not assignable to type 'string'.
```

`npm run typecheck` でも同じエラーが確認できます。

> **重要な使い分け**
>
> | コマンド | 型チェック | 実行 |
> |---|---|---|
> | `npm start` | しない | する |
> | `npm run dev` | しない | する(自動再実行) |
> | `npm run typecheck` | する | しない |
>
> **VS Code の赤線 / `npm run typecheck` でエラー確認、`npm start` で実行**、という使い分けが基本です。

確認できたら `hello.ts` を元に戻しておきましょう。

```typescript
const message: string = "Hello, TypeScript!";
console.log(message);
```

### 2-5. TypeScriptを実行する方法(参考)

`tsx` の他にも実行方法はあります。今は知識として押さえておけばOK。

| ツール | 特徴 | 型チェック |
|---|---|---|
| **tsx**(本資料推奨) | 速い、設定不要、学習向け | しない |
| **tsc + node** | 本番運用に近い、2ステップ | する |
| **ts-node** | tsxの先輩、起動が遅い | 設定次第 |
| **Node.js直接** | v22.18以降で標準サポート | しない |

**本資料の方針**: 学習中は `tsx`、型チェックは `typecheck`、本番デプロイ時(第17章)は `tsc + node`。

---

## 3. tsconfig.json の読み方(45分)

第2章で「おまじない」として書いた設定の意味を、一つずつ理解していきます。

### 3-1. 全体構造

```json
{
  "compilerOptions": { ... },   // コンパイラの動作を決める
  "include": [...],             // 対象ファイルの範囲
  "exclude": [...]              // 除外するファイル(任意)
}
```

### 3-2. ファイル範囲の設定

```json
"include": ["src/**/*"],
"rootDir": "src",
"outDir": "dist"
```

- `include`: `src/` 以下のすべてのファイルをTypeScript対象にする
- `rootDir`: ソースコードのルートフォルダ
- `outDir`: コンパイル後のJSを出力するフォルダ

### 3-3. 出力形式の設定

**`target: "ES2022"`**
コンパイル後のJSをES2022互換にする。Node.js 22+・モダンブラウザすべてに対応。古いブラウザ対応が不要な現代のプロジェクトでは `ES2022` でOK。

**`module: "ESNext"`**
import/export をESモジュール形式で出力する。

**`moduleResolution: "Bundler"`**
ViteやWebpackなどのバンドラと連携するときの解決方式。フロント・バック問わず現代のプロジェクトでは `Bundler` が無難。

**`noEmit: true`**
`tsc` を実行してもJSファイルを出力しない。実行は `tsx` に任せ、`tsc` は型チェックだけ担当する設定。

```
tsc:    型チェックだけ(JS出力なし) ← noEmit: true
tsx:    実行担当(内部でTSをJSに変換して走らせる)
```

### 3-4. 互換性・利便性の設定

**`esModuleInterop: true`**
`import fs from 'fs'` のような書き方を可能にする。これがないと `import * as fs from 'fs'` と書く必要がある。

**`skipLibCheck: true`**
`node_modules` 内の型定義ファイルのチェックをスキップ。ライブラリ間の型定義の不整合でエラーになるのを防ぐ。

**`forceConsistentCasingInFileNames: true`**
ファイル名の大文字・小文字を統一させる。macOSとWindowsの大文字小文字の扱いの違いによるバグを防ぐ。

**`resolveJsonModule: true`**
`.json` ファイルを `import` できるようにする。

**`isolatedModules: true`**
各ファイルを独立したモジュールとして扱う。Viteなどのバンドラとの互換性のため。

### 3-5. ⭐ strict モード — TypeScriptの真価

ここがこの章の**最重要セクション**です。

```json
"strict": true
```

`strict: true` は実は**8つの厳格チェックの一括スイッチ**です。

```
"strict": true は以下と等価:
  "noImplicitAny": true       ← 暗黙の any を禁止
  "strictNullChecks": true    ← null/undefined の扱いを厳格に
  "strictFunctionTypes": true
  "strictBindCallApply": true
  "strictPropertyInitialization": true
  "noImplicitThis": true
  "alwaysStrict": true
  "useUnknownInCatchVariables": true
```

中でも特に重要な2つを解説します。

#### `noImplicitAny` — 暗黙の any を禁止

```typescript
// ❌ noImplicitAny: true だとエラー
const greet = (name) => {
  return `Hello, ${name}`;
};
// Parameter 'name' implicitly has an 'any' type.
```

```typescript
// ✅ 引数に型を書く
const greet = (name: string) => {
  return `Hello, ${name}`;
};
```

`any` とは「どんな型でもOK」という型で、TypeScriptの型チェックを無効化してしまいます。`noImplicitAny` で、**引数には必ず型を書く**ことが強制されます。

#### `strictNullChecks` — null/undefined を別の型として扱う

```typescript
// ❌ strictNullChecks: true だとエラー
const double = (x: number) => x * 2;

const value = null;
double(value);  // Argument of type 'null' is not assignable to parameter of type 'number'.
```

`null` や `undefined` が紛れ込むことによる実行時エラーを、事前に防いでくれます。

#### なぜ strict: true を推奨するか

`strict: false` にすれば書くコードは減りますが、**TypeScriptを使う意味の大半が失われます**。

初学者ほど最初から `strict: true` で学ぶ方がいいです。理由は:
- エラーメッセージが「正しいコードの書き方」を教えてくれる
- 悪い習慣が身につかない
- 実際の現場でも `strict: true` が標準

### 3-6. ⭐ noUncheckedIndexedAccess — 配列アクセスを安全に

```json
"noUncheckedIndexedAccess": true
```

これは `strict` には含まれていない**追加の強化オプション**。

```typescript
const fruits: string[] = ["apple", "banana", "orange"];

const first = fruits[0];
// noUncheckedIndexedAccess: true だと型は string | undefined

console.log(first.toUpperCase());
// ❌ 'first' is possibly 'undefined'.
```

配列のインデックスアクセスは「存在しない可能性がある」ので `| undefined` が付きます。

```typescript
if (first !== undefined) {
  console.log(first.toUpperCase());  // ✅ 安全
}
// または
console.log(first?.toUpperCase());   // ✅ オプショナルチェイニング
```

最初は少し手間ですが、配列アクセスのバグを**大幅に減らす**オプションです。

### 3-7. 設定のまとめ

```json
{
  "compilerOptions": {
    // 出力設定
    "target": "ES2022",          // ES2022互換のJSに変換
    "module": "ESNext",          // ESモジュール形式
    "moduleResolution": "Bundler", // 現代的なバンドラ向け
    "noEmit": true,              // JSを出力しない(型チェックだけ)
    "outDir": "dist",            // 出力先フォルダ(noEmitでも設定)
    "rootDir": "src",            // ソースフォルダ

    // 型チェック
    "strict": true,              // 厳格モード(最重要)
    "noUncheckedIndexedAccess": true, // 配列アクセスを安全に

    // 互換性・利便性
    "esModuleInterop": true,     // import xxx from 'xxx' を許可
    "skipLibCheck": true,        // ライブラリの型チェックをスキップ
    "forceConsistentCasingInFileNames": true, // ファイル名の大文字小文字統一
    "resolveJsonModule": true,   // JSONのimportを許可
    "isolatedModules": true      // バンドラ互換
  },
  "include": ["src/**/*"]
}
```

---

## 4. Before/After で体感する(20分)

`strict` の効果を実際に確かめましょう。

**実験1: `strict: false` にしてみる**

`tsconfig.json` を一時的に変更します。

```json
"strict": false
```

`src/hello.ts` をこう書き換えて保存:

```typescript
const greet = (name) => `Hello, ${name}`;  // name に型なし

let x = "hello";
x = 123;  // 型を変えてみる

console.log(greet(x));
```

保存しても **赤線が出ません**。TypeScriptがほぼJSと同じ感覚になってしまいます。

**実験2: `strict: true` に戻す**

```json
"strict": true
```

すると:

```typescript
const greet = (name) => `Hello, ${name}`;
// ❌ Parameter 'name' implicitly has an 'any' type.

let x = "hello";
x = 123;
// ❌ Type 'number' is not assignable to type 'string'.
```

すぐに赤線が出て、問題を指摘してくれます。

実験が終わったら `hello.ts` を元に戻しましょう。

```typescript
const message: string = "Hello, TypeScript!";
console.log(message);
```

---

## 5. 章末演習(20分)

### 🎯 演習: プロジェクトの動作確認

以下をすべて確認してください。

**確認1**: `npm start` で `Hello, TypeScript!` が表示される

**確認2**: `hello.ts` を次のように書き換えると VS Code に赤線が出る

```typescript
const age: number = "thirty";  // ❌ 型違反
```

**確認3**: `npm run typecheck` でエラーメッセージが表示される

**確認4**: `hello.ts` を戻して `npm run dev` を実行すると、ファイルを保存するたびに自動で再実行される

**確認5**: `Ctrl + C` で `dev` モードを止められる

---

## 6. この章のまとめ

### 覚えておきたいこと

1. **TypeScript = JavaScript + 型システム**。最終的にはJSに変換されて実行される
2. **型のメリット3つ**: 早期バグ発見、賢いエディタ補完、ドキュメント代わり
3. **`npm start`/`dev` は型チェックをしない**。型エラーはVS Codeの赤線か `npm run typecheck` で確認
4. **`strict: true` は必須**。TypeScriptを使う意義の大半がここにある
5. **`noUncheckedIndexedAccess: true`** で配列アクセスをさらに安全に

### 確認問題

<details>
<summary>Q1. TypeScript と JavaScript の関係を一言で説明せよ</summary>

TypeScript は JavaScript のスーパーセット(上位互換)で、JavaScript に「型システム」を追加した言語です。有効な JavaScript はすべて有効な TypeScript です。
</details>

<details>
<summary>Q2. `npm start` と `npm run typecheck` の違いは?</summary>

- `npm start`: tsx でコードを**実行**する。型チェックはしない
- `npm run typecheck`: tsc で**型チェックのみ**を行う。実行はしない

型エラーがあっても `npm start` は動いてしまうので、型エラーは VS Code の赤線か `npm run typecheck` で確認します。
</details>

<details>
<summary>Q3. `strict: true` が重要な理由は?</summary>

`strict: true` は8つの厳格チェックをまとめてONにするスイッチで、その中でも特に:

- `noImplicitAny`: 引数に型を書くことを強制し、`any` の暗黙的な使用を禁止
- `strictNullChecks`: `null`/`undefined` を別の型として扱い、うっかりアクセスによるバグを防ぐ

これらを無効にすると TypeScript を使う意義の大半が失われます。
</details>

<details>
<summary>Q4. `noEmit: true` の意味は?</summary>

`tsc` を実行してもJavaScriptファイルを出力しない、という設定です。

実行は `tsx` が担当し、`tsc` は型チェックだけ行います。役割を分けることで開発時のビルドが速くなります。本番デプロイ時は別途 `tsc` でJSを出力します(第17章)。
</details>

---

## 次の章へ

第1章で**環境が整い、TypeScriptの基本的な仕組みも理解できました**。次の第2章からいよいよ**コードを本格的に書き始めます**。

第2章のテーマは「**変数・型・データ型**」。JavaScriptの基本的なデータ型を、TypeScriptの型システムと一緒に学びます。

第2章からは `01-basics/src/` の中にファイルを追加しながら進めます。準備ができたら進みましょう 🚀

---

> 🎯 **コラム: 「型を書くのが面倒」と感じたら**
>
> 最初のうちは「型を書く手間」を感じるかもしれません。でも実際は、**多くの場面で型は自動推論されます**。
>
> ```typescript
> const x = 10;          // number と自動推論 — 型注釈不要
> const s = "hello";     // string と自動推論
> const arr = [1, 2, 3]; // number[] と自動推論
> ```
>
> 明示的に型を書くのは主に「**関数の引数**」「**特定のオブジェクト**」くらいです。
>
> そして型を書くことで**コードの設計が良くなります**。「この関数の入力は何で、出力は何か」を先に考えるクセがつくのです。
>
> 「型を書く = 面倒」ではなく、「**型を書く = 設計を考える**」と思ってください。慣れると、型なしでコードを書く方が不安になります。

お疲れさまでした!次の第2章で会いましょう ☕
