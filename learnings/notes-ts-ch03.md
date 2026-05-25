# TypeScript 第3章 のノート

> 教材: typescript-ch03.md
> 学習日: 2026/05/25

---

## つまづき解決ログ

(今回は大きな詰まりなし。気になった点は「あとで戻ってきたい疑問」に記載)

---

## 定着させたいこと

- **`||` と `??` の使い分け** — `0` や `""` を弾きたくないなら `??` を使う。デフォルトは `??` で考える
- **`?.` の動き** — 左辺が `null`/`undefined` なら `undefined` を返し、そうでなければ普通にアクセス
- **`?.` と `??` の合わせ技** — `user?.name ?? "ゲスト"` は実務頻出
- **暗黙の型変換は罠が多い** — JS だと `"5" + 3 = "53"`、`-`/`*` は数値計算と挙動が違う。TS が型エラーで止めてくれるので明示変換（`Number()` / `String()`）で書く
- **早期 return（ガード節）** — 異常系を先に return で弾いて、メイン処理をフラットに置く。ネストが深くなりそうなときに思い出す
- **三項演算子は2択まで** — 3択以上は早期 return か `if/else if`。React の JSX で頻出（`{isLoggedIn ? <A /> : <B />}`）
- **`===` を常に使う**（`==` は型変換するので危険）
- **配列ループは `for...of`** — インデックスも欲しいときは `for (const [i, x] of arr.entries())`。Python の `enumerate()` 相当
- **`for...in` は配列に使わない** — オブジェクトのキー列挙用。配列のインデックスが欲しいときは `for...of` + `entries()` か、`Object.keys()` を使う
- **narrowing（型の絞り込み）の予告** — `if (typeof value === "string")` の中では `value` が `string` 確定として扱われる。第12章で本番

---

## よく使うパターン

```typescript
// パターン: null/undefined を安全にデフォルト値に置き換える
const name = user?.name ?? "ゲスト";

// パターン: 早期 return でガード節
const processUser = (user: User | null): string => {
  if (user === null) return "ユーザーなし";
  if (user.age < 18) return "未成年";
  // ここから先は全条件クリアの本処理
  return "OK";
};

// パターン: 三項演算子で2択
const message = isLoggedIn ? "ようこそ" : "ログインしてください";

// パターン: 値の対応表をオブジェクトで作る（switch の代わり）
const fruitNames: Record<string, string> = {
  apple: "りんご",
  banana: "バナナ",
};
const fruitName = fruitNames["apple"] ?? "不明";

// パターン: インデックス付きで配列ループ
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
```

---

## 用語メモ

| 用語 | 意味 |
|---|---|
| Null合体演算子 (`??`) | 左辺が `null`/`undefined` のときだけ右辺を返す |
| オプショナルチェイニング (`?.`) | 左辺が `null`/`undefined` なら `undefined` を返し、そうでなければ普通にアクセス |
| Falsy | `false` / `0` / `""` / `null` / `undefined` / `NaN`。`[]` や `{}` は truthy |
| 暗黙の型変換 | プログラマーが指示してないのに勝手に型が変換される動き。JS の罠の元 |
| 明示的な型変換 | `Number()` / `String()` などで自分で変換すること |
| 早期 return（ガード節） | 異常系を関数の先頭で return して弾き、本処理をネストの外に出す書き方 |
| フォールスルー | `switch` で `break` を忘れて次の `case` に流れ込む現象 |
| narrowing | `if` などの中で型が自動的に絞り込まれる TS の仕組み |

---

## あとで戻ってきたい疑問

- `Record<string, string>` の細かい動き（第11章で詳しくやる予定）
- narrowing の全パターン（第12章で詳しくやる予定）
- FizzBuzz の別解（`output += "Fizz"` 方式）の `output || i` パターンを、自分でも書けるようにしたい
