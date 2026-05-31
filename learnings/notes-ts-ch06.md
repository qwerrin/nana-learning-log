# TypeScript ch06: 文字列・スコープ・例外処理

学習日: 2026-05-31

---

## 1. 文字列メソッド

文字列メソッドは**ほぼすべて新しい文字列を返す**（元の文字列は変わらない）。

| メソッド | 用途 |
|---------|------|
| `includes` / `startsWith` / `endsWith` | 含まれているか・始まり・終わり |
| `indexOf` | 位置を返す（見つからなければ -1） |
| `slice(start, end)` | 部分文字列。負の値で末尾から |
| `replace` / `replaceAll` | 置換（1つ / 全部） |
| `split(区切り)` | 文字列 → 配列 |
| `join(区切り)` | 配列 → 文字列 |
| `trim` / `trimStart` / `trimEnd` | 空白除去 |
| `toUpperCase` / `toLowerCase` | 大文字/小文字変換 |
| `padStart(n, str)` / `padEnd` | 指定長になるまで埋める |
| `repeat(n)` | n回繰り返す |

`split` と `join` はセットで覚える。CSV・URL 処理で頻出。

```typescript
// メールアドレス正規化（ミニ演習1）
const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();
```

---

## 2. スコープ

- `const` / `let` は **ブロックスコープ**（`{}` の中だけ有効）
- **内側から外側は見える。外側から内側は見えない**
- `var` はブロックを無視する関数スコープ → 使わない

---

## 3. クロージャ

内側の関数が、外側の変数を**覚えている**仕組み。

```typescript
const createCounter = () => {
  let count = 0;
  return () => { count += 1; return count; };
};

const c1 = createCounter();
const c2 = createCounter(); // 別の count が生まれる → c1 に影響しない
```

ポイント: `createCounter()` を呼ぶたびに**新しいクロージャ**が生まれ、状態は独立する。

---

## 4. this と Arrow Function

- Arrow Function は `this` を自分で持たず、**外側の `this` を引き継ぐ**
- コールバック内で `this` を使いたいときは Arrow Function を使う

```typescript
const user = {
  name: "Alice",
  greet: function () {
    setTimeout(() => {
      console.log(this.name); // "Alice" ✅（Arrow Function が外の this を引き継ぐ）
    }, 0);
  },
};
```

**実務方針**: 基本は Arrow Function。オブジェクトのメソッドは `function` も使う（ただし内部コールバックは Arrow Function）。

---

## 5. try / catch

```typescript
try {
  // エラーが起きるかもしれない処理
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message); // instanceof で確認してから使う
  }
} finally {
  // エラーの有無にかかわらず実行（省略可）
}
```

### TypeScript の catch は unknown 型

`throw` する値に制限がない（文字列・数値でも `throw` できる）ため、`catch` の引数は `unknown`。
→ `instanceof Error` で確認してから `message` を使う。

### ベストプラクティス: 「早く投げ、高く処理」

```
throw early  — 不正な値を発見したら即座に throw
catch late   — UI に近い層でまとめて catch
```

---

## 6. 章末演習: CSVパーサー（自分の実装）

責務を分けて実装できた。

```typescript
// 1行パース（エラーは throw）
const parseLine = (line: string): User => { ... };

// 複数行をループ、失敗行は warn でスキップ
const parseCSV = (csv: string): User[] => {
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const users: User[] = [];
  for (const line of lines) {
    try {
      users.push(parseLine(line));
    } catch (error) {
      if (error instanceof Error) console.warn(error.message);
    }
  }
  return users;
};
```

`parseLine` でエラーを throw → `parseCSV` で catch してスキップ、が「早く投げ、高く処理」の実践。
