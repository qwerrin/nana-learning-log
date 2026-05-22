# 第18章 ベストプラクティスとよくあるエラー

## この章のゴール

- TypeScript でよくあるエラーを読み解き、自力で対処できる
- 命名規則の現代的な慣習を知る
- 「不正な状態を型で表現不可能にする」設計思想を理解する
- `any` を見つけたときの判断基準を持つ
- AI コーディング支援との賢い付き合い方を知る
- TypeScript を「書きすぎない」感覚を養う

**所要時間の目安: 2時間**

---

## 0. この章のスタンス

第17章までで「**書ける**」状態になりました。この章は「**良いコードを書く**」ためのコツを集めた実用リファレンスです。

**サクサク読み進めて、必要なときに見返す**スタイルがおすすめです。

---

## 1. ⭐ よくあるエラー10選(40分)

### 1-1. TS2322: Type 'X' is not assignable to type 'Y' — 最頻出

「**型 X を型 Y に代入できません**」。

```typescript
const age: number = "30";
// ❌ Type 'string' is not assignable to type 'number'.
```

**対処**: 正しい型の値を渡すか、`Number()` などで変換する。

---

### 1-2. TS2304: Cannot find name 'X'

「**`X` という名前が見つかりません**」。typo や import 漏れが多い。

```typescript
console.log(useState);
// ❌ Cannot find name 'useState'.
```

**対処**: `import { useState } from "react"` を追加する。スペルミスも確認。

---

### 1-3. TS2531/TS2533: Object is possibly 'null' / 'undefined' — 頻出

「**この値は null/undefined の可能性があります**」。

```typescript
const el = document.getElementById("foo");
el.textContent = "hi";
// ❌ Object is possibly 'null'.
```

**対処法(状況に応じて選ぶ)**:

```typescript
// 1. if チェック(最も安全)
if (el) { el.textContent = "hi"; }

// 2. 早期 return(ネストを避けたいとき)
if (!el) return;
el.textContent = "hi";

// 3. オプショナルチェイニング(読み取りだけの場合)
console.log(el?.textContent);

// 4. ?? でデフォルト値
const text = el?.textContent ?? "なし";

// 5. 非 null アサーション(HTMLに必ずある要素と確信できるとき限定)
const el2 = document.getElementById("foo")!;
```

---

### 1-4. TS2339: Property 'X' does not exist on type 'Y'

「**型 Y に X というプロパティはありません**」。typo や型定義漏れ。

```typescript
const user = { name: "Alice" };
console.log(user.namee);
// ❌ Property 'namee' does not exist...
```

**対処**: スペルミスを直すか、型定義に該当プロパティを追加する。

---

### 1-5. TS7006: Parameter 'X' implicitly has an 'any' type

「**引数 X が暗黙の any になっています**」。

```typescript
function greet(name) {
// ❌ Parameter 'name' implicitly has an 'any' type.
  return `Hello, ${name}`;
}
```

**対処**: 引数に型注釈を書く。`(name: string) => ...`

---

### 1-6. TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'

「**関数に渡した引数の型が違います**」。

```typescript
const greet = (name: string) => `Hi, ${name}`;
greet(123);
// ❌ Argument of type 'number' is not assignable to parameter of type 'string'.
```

**対処**: 関数の引数の型に合った値を渡す。

---

### 1-7. TS18047: 'X' is possibly 'undefined'

`noUncheckedIndexedAccess` の効果で配列アクセス時に出ます。

```typescript
const arr = [1, 2, 3];
const x = arr[10];
console.log(x.toFixed());
// ❌ 'x' is possibly 'undefined'.
```

**対処**: `if (x !== undefined)` で絞るか、`x?.toFixed()` を使う。

---

### 1-8. TS2741: Property 'X' is missing in type 'Y' but required in type 'Z'

「**必須プロパティが不足しています**」。

```typescript
type User = { name: string; age: number };
const u: User = { name: "Alice" };
// ❌ Property 'age' is missing.
```

**対処**: 不足プロパティを追加するか、`age?:` でオプショナルにする。

---

### 1-9. TS2367: This comparison appears to be unintentional

「**型が交わらないものを比較しています**」。

```typescript
const x: string = "hello";
if (x === 5) { ... }
// ❌ comparison appears to be unintentional
```

**対処**: 型を見直す。`string` と `number` を比較しようとしているのはバグの兆候。

---

### 1-10. 'error' is of type 'unknown'

`catch` ブロックで頻出。

```typescript
try { ... } catch (error) {
  console.log(error.message);
  // ❌ 'error' is of type 'unknown'.
}
```

**対処**:

```typescript
// instanceof で絞り込む
if (error instanceof Error) {
  console.log(error.message);
}

// ヘルパー関数
const getErrorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "不明なエラー";
```

---

### エラーを読むコツ

| パターン | 意味 |
|---|---|
| `Type 'X' is not assignable to type 'Y'` | 型の不一致 |
| `Cannot find name 'X'` | import 漏れ / typo |
| `is possibly null/undefined` | null チェックが必要 |
| `Property 'X' does not exist` | プロパティがない / typo |
| `implicitly has an 'any' type` | 引数に型を書く |

英語に身構えず、**よく出るパターンとして覚える**と一気に楽になります。

---

## 2. 命名規則(15分)

### 2-1. 変数・関数: camelCase

```typescript
const userName = "Alice";         // ✅
const user_name = "Alice";         // ❌ snake_case(JS では使わない)
const UserName = "Alice";          // ❌ PascalCase は型・クラス用

const getUserById = (id: number) => { ... };  // ✅
```

### 2-2. 型・クラス: PascalCase

```typescript
type UserProfile = { ... };    // ✅
interface ApiResponse { ... }  // ✅
class UserService { ... }       // ✅
```

### 2-3. interface に `I` プレフィックスをつけない

```typescript
interface IUser { ... }   // ❌ 古い C# スタイル
interface User { ... }    // ✅ 現代 TypeScript
```

### 2-4. 定数: UPPER_SNAKE_CASE(モジュールスコープ)

```typescript
const MAX_RETRY = 3;
const API_BASE_URL = "https://api.example.com";
```

ただし関数内のローカル定数は camelCase でOKです。

### 2-5. ファイル名

| スタイル | 例 | 用途 |
|---|---|---|
| PascalCase | `UserCard.tsx` | React コンポーネント(業界標準) |
| camelCase | `userService.ts` | Node.js 系 |
| kebab-case | `user-service.ts` | フレームワーク全般 |

### 2-6. 真偽値の命名

`is` / `has` / `can` / `should` のプレフィックスをつけると意図が伝わります。

```typescript
const isLoading = true;      // ✅
const hasPermission = false;  // ✅
const canEdit = true;         // ✅
const loading = true;         // 🔶 boolean か分かりにくい
```

---

## 3. 「不正な状態を型で表現不可能にする」(20分)

TypeScript 上級者の設計思想 **make illegal states unrepresentable** です。

### 3-1. 問題: 緩い型

```typescript
// ❌ 不正な組み合わせが表現できてしまう
type FetchState = {
  loading: boolean;
  data: User[] | null;
  error: string | null;
};

// 「読み込み中なのにデータもエラーもある」状態が作れる 😱
const bad: FetchState = { loading: true, data: [], error: "エラー" };
```

### 3-2. 解決: 判別可能ユニオン

```typescript
// ✅ ありえない状態が型レベルで禁止される
type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string };

const renderState = (state: FetchState): string => {
  switch (state.status) {
    case "idle":    return "未取得";
    case "loading": return "読み込み中…";
    case "success": return `${state.data.length}件`;   // data だけにアクセス可
    case "error":   return `エラー: ${state.message}`;  // message だけにアクセス可
  }
};
```

「`loading` 中なのに `data` がある」状態は**型として作れません**。バグが型レベルで防がれます。

### 3-3. 設計のコツ

「**この型、不正な組み合わせはあり得ないか?**」と自問する習慣を。

- 同時に存在しないはずの2つのフィールドがある → 別々のユニオンメンバーに分ける
- `boolean` が複数あって組み合わせが爆発する → ユニオンで状態を明示する

---

## 4. ⭐ any との付き合い方(20分)

### 4-1. any を見つけたときの判断フロー

```
any を書きたい / 見つけた
    ↓
unknown で代替できる?  → Yes → unknown を使う
    ↓ No
ジェネリクス <T> で抽象化できる? → Yes → ジェネリクスを使う
    ↓ No
型ガードで安全に絞れる? → Yes → 型ガード + unknown を使う
    ↓ No
どうしても必要 → any + コメントで理由を書く
```

### 4-2. よくある any の直し方

```typescript
// ❌ any
const parseData = (data: any) => {
  return data.name.toUpperCase();
};

// ✅ unknown + 型ガード
const isDataLike = (v: unknown): v is { name: string } =>
  typeof v === "object" && v !== null && "name" in v &&
  typeof (v as Record<string, unknown>).name === "string";

const parseData = (data: unknown): string => {
  if (!isDataLike(data)) throw new Error("Invalid data");
  return data.name.toUpperCase();
};
```

### 4-3. as の濫用にも注意

```typescript
// ❌ 嘘をついている
const x = "hello" as unknown as number;
const y = data as User;  // 検証なしで信じる

// ✅ 型ガードで検証してから
if (isUser(data)) {
  console.log(data.name);  // 安全
}
```

**「`as` を書きたい」と思ったら、まず別の方法を考える**のが鉄則。

---

## 5. TypeScript を「書きすぎない」(15分)

### 5-1. ❌ 書きすぎ

```typescript
const name: string = "Alice";  // 値から推論できる
const age: number = 30;

// 冗長な関数の型
const add: (a: number, b: number) => number =
  (a: number, b: number): number => a + b;
```

### 5-2. ✅ 適切な量

```typescript
const name = "Alice";  // string と推論される
const age = 30;         // number と推論される

// 引数は必須、戻り値は推論可
const add = (a: number, b: number) => a + b;
```

### 5-3. 「境界に型を書く」原則

```
入口(関数の引数、外部データ) → 必ず書く
中間(ローカル変数、計算結果) → 推論に任せる
出口(公開関数の戻り値、型エクスポート) → 書くと安全
```

```typescript
// ✅ 入口・出口に型、中間は推論
const calcTotal = (items: Item[]): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);  // 推論
  const tax = subtotal * 0.1;                                          // 推論
  return subtotal + tax;
};
```

### 5-4. 過度に複雑な型を書かない

TypeScript の型システムは非常に強力で複雑な型を書けますが、**読み手が10秒で理解できない型は複雑すぎ**です。

```typescript
// ❌ 過剰に高度(実務では不要なことが多い)
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// ✅ シンプルで意図が明確
type UpdateUserInput = Partial<Omit<User, "id">>;
```

**「読みやすさ優先」** が実用コードの指針です。

---

## 6. AI コーディング支援との付き合い方(15分)

### 6-1. AI が得意なこと

- 定型的なコード(CRUD の実装、テストコード)
- ボイラープレート(コンポーネントの雛形)
- エラーメッセージの解説(検索より速い)
- 既知のパターンへの変換(JS → TS の移植)

### 6-2. AI が苦手なこと(注意)

- 知識カットオフ後の最新 API
- 微妙なビジネスロジックの意図の理解
- セキュリティ重要な箇所(認証・暗号化など)
- `any` を多用したコード(「動くから良し」と判断しがち)

### 6-3. ⭐ AI が古いパターンを勧めてくることがある

```typescript
// AI が出しがちな古いパターン → 自分で修正
enum Status { ... }     // → 直接ユニオン型か as const (第10章)
const X: React.FC<P>    // → 引数で型注釈するスタイル (第14章)
var x = ...             // → const / let
interface IUser { ... } // → I プレフィックスなし
```

### 6-4. 良い付き合い方

```
1. AI に作らせる(ドラフト)
2. 自分で読み解いて理解する
3. 古いパターンや any を見つけたら直す
4. 動作確認・テストする
```

「**AI は下書き、責任は自分**」というスタンスで。

> **AI をデバッガーとして使うのが特に有用**
> エラーメッセージをそのまま貼り付けて「これって何?」と聞くだけで的確な解説が返ってきます。TypeScript 学習中の最高の家庭教師になります。

---

## 7. その他の実用 Tips(10分)

### `import type` を活用

```typescript
import type { User } from "./types.js";  // 型だけ → ビルド後に消える
import { fetchUser } from "./api.js";     // 値
```

### unknown を積極的に使う

```typescript
// ❌ any
function parseData(data: any) { ... }

// ✅ unknown
function parseData(data: unknown) { ... }
```

外部から来る値(API レスポンス・JSON.parse・catch のエラー)は常に `unknown` で受けるべし。

### オプショナルチェイニング・null 合体演算子

```typescript
// 古い書き方
if (user && user.address && user.address.city) {
  console.log(user.address.city);
}

// 現代の書き方
console.log(user?.address?.city ?? "未設定");
```

### 関数引数に readonly を使う

```typescript
// ❌ 元の配列を変えてしまうかも
const sortAsc = (arr: number[]): number[] => arr.sort();

// ✅ readonly で変更を禁止
const sortAsc = (arr: readonly number[]): number[] => [...arr].sort((a, b) => a - b);
```

### zod で型と実行時バリデーションを統一(次のステップ)

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof UserSchema>;

// スキーマを書けば、型と実行時チェックが両方できる
const user = UserSchema.parse(data);
```

---

## 8. この章のまとめ

### 原則集

1. **エラーはパターンで覚える**(英語に身構えない)
2. **命名は慣習に従う** — camelCase / PascalCase / UPPER_SNAKE_CASE
3. **`I` プレフィックスは使わない**
4. **不正な状態を型で表現不可能に** — 判別可能ユニオン
5. **`any` を見たら別の方法を考える** — unknown / ジェネリクス / 型ガード
6. **`as` は最終手段** — 書く前に立ち止まる
7. **AI に任せても責任は自分**
8. **境界に型を書く** — 入口・出口は明示、中間は推論
9. **過度に複雑な型を書かない** — 読みやすさ優先
10. **`unknown` を積極的に使う**

### よくあるミスの対処マップ

| 症状 | 第一手 |
|---|---|
| 赤線が出た | エラーコードのパターンで判断 |
| `any` が大量にある | 引数に型を書く、unknown 化を検討 |
| 型を書くのが大変 | 推論できる場所は省略、`type` で再利用 |
| `as` を書きたくなった | 型ガード・ジェネリクス・判別可能ユニオンで代替できないか |
| 不正な状態を許してしまう | 判別可能ユニオンに変更 |

---

## 次の章へ

第18章で**実用的な心得**を整理しました。最終章の第19章では、**さらに学ぶための信頼できるリソース**を紹介します。

---

> 🎯 **コラム: 良い TypeScript コードとは**
>
> 業界トップエンジニアの書く TypeScript コードは、意外なほど**シンプル**です。
>
> ```typescript
> // ❌ 過剰に高度(読み手の負担が大きい)
> type DeepPartialPick<T, K extends keyof T> = { [P in K]?: T[P] };
>
> // ✅ シンプルで意図が明確
> type UpdateUserInput = Partial<Omit<User, "id">>;
> ```
>
> 「**わざわざ複雑に書く必要がない**」と分かっているから、シンプルなのです。
>
> 学習中は色々試して、複雑な型を書きたくなる時期があります。それは通過儀礼。楽しみながら通り過ぎて、最終的には「**シンプルで意図が伝わる型**」に落ち着くのがゴールです。
>
> 「**書ける**」から「**選べる**」エンジニアへ。それが TypeScript の上達曲線です。

お疲れさまでした!次の第19章で会いましょう ☕
