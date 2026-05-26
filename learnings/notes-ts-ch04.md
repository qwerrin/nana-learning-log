# TypeScript 第4章 のノート

> 教材: typescript-ch04.md
> 学習日: 2026/05/26

---

## つまづき解決ログ

### 2026/05/26 — コールバックの「向き」を取り違えていた

**状況**: 「コールバック関数とは?」と聞かれて「他の関数を引数として受け取る関数」
と答えた。

**原因**: 「受け取る側」と「渡される側」を混同していた。実は両者には別の名前が
ついていて、コールバックは**渡される側**のこと。

**解決**:
- 関数を**受け取る**側 = 高階関数(Higher-Order Function)
- 関数として**渡される**側 = コールバック関数
- 「コール(呼び出し)をバック(あとで)する」 = 受け取った側が**あとで呼ぶ**
  ための関数、と覚える

**教訓**:
- `arr.map(fn)` で言えば、`map` が高階関数、`fn` がコールバック。
- すでに自分は `arr.map(n => n * multiplier)` を書いていた = 無意識に
  コールバックを使っていた。新しい概念ではなく、**名前を後から知った**だけ。

---

### 2026/05/26 — コールバックがなぜ便利か、自分で気づいた

**状況**: `transform` を「コールバックを使わずに」書いてみたら、
`multiplier` 専用版になってしまった。「2乗する版」「マイナスにする版」
…を作るたびに同じ関数を量産する必要があると気づいた。

**原因**: 「変換ロジック」が関数の中に**埋め込まれている**と、変換の種類だけ
関数が増える。

**解決**:
- 「**変換ロジックを外から差し込む**」のがコールバック。
- 枠組み(配列を処理する) と 中身(どう変換する) を**分離**できる。
- これが `map` / `filter` / `find` / `reduce` の設計思想そのもの。

**教訓**:
- コールバックの型 = メソッドの役割が決まる
  - `(n) => number` → 変換系(map)
  - `(n) => boolean` → 判定系(filter, find)
- 型を見るだけで「これは何系のメソッドか」が分かる。

---

### 2026/05/26 — pipe で「前の結果を次に渡す」が書けなかった

**状況**: 章末演習の `pipe` を `for` ループで書いていて、最初こう書いた:

```typescript
let total = x;
for (const f of fns) {
  total = f(x);  // ← x を渡してしまった
}
```

`pipe(3, double, addOne, square)` の結果が **9** になり、期待の **49** に
ならなかった。

**原因**: 毎回**最初の値 `x`** を関数に渡していた。「前の関数の結果」を
**次に引き継ぐ**処理になっていなかった。

**解決**:

```typescript
let total = x;
for (const f of fns) {
  total = f(total);  // ← 最新の total を渡す
}
return total;
```

`x` は「最初の値」だけで、ループの中で使うべきは**毎回更新される最新の `total`**。

**教訓**:
- 「**前の結果を引き継いで次に渡す**」処理 = 累積処理(accumulation)
- 共通パターン: `total = f(total)` / `total += n` / `result += str`
- 「**前回の結果が次に必要か?**」を意識すると、ループの中で使うべき変数が
  見えてくる。

---

### 2026/05/26 — reduce は for の累積処理を1行で書く仕組み

**状況**: `pipe` の `for` 版を書いた後、同じ処理を `reduce` で書くように
言われた。最初は別物に見えたが、対応関係を整理したらすぐ書けた。

**原因**: `reduce` のシグネチャが初見だと複雑に見える。`(acc, current) => ...`
の意味と、第2引数が初期値である点が掴めていなかった。

**解決**:

```typescript
// for版
let total = x;
for (const f of fns) {
  total = f(total);
}
return total;

// reduce版
return fns.reduce((acc, f) => f(acc), x);
```

| for版 | reduce版 |
|---|---|
| `let total` | `acc` |
| `total = x`(初期値) | `reduce` の第2引数 `x` |
| `total = f(total)` | `(acc, f) => f(acc)` |
| `return total` | `reduce` が自動で返す |

**教訓**:
- `reduce` を見た瞬間「累積処理だな」と読めるようになるのが目標。
- 初期値(第2引数)を省くとTSで型エラーになりがち。**書く癖**をつける。
- 慣れないうちは `for` で書いて、書けたら `reduce` に直す、で十分。

---

## 定着させたいこと

- **Arrow Function の短縮形は `{}` と `return` セットで省く**(片方だけはダメ)
- **引数の型は必須、戻り値の型は任意**(推論される)
- **`void` = 戻り値を使わない関数のシグナル**(副作用が目的の関数)
- **デフォルト引数とオプショナル引数の違いは「型」にも出る**
  - デフォルト引数 `(x = "default")` → 型は `string`
  - オプショナル引数 `(x?: string)` → 型は `string | undefined`
  - 実務ではデフォルト引数の方が使いやすい
- **関数型と関数定義の見分け方**
  - 型注釈の中なら関数型 `(n: number) => number`
  - `=` の右側なら関数定義 `(n: number): number => n * 2`
- **コールバックの型 = メソッドの役割**
  - `(n) => number` 変換系、`(n) => boolean` 判定系

---

## よく使うパターン

```typescript
// 残余引数 + コールバックの組み合わせ(pipeなど)
const pipe = (x: number, ...fns: Array<(n: number) => number>): number => {
  return fns.reduce((acc, f) => f(acc), x);
};

// 配列メソッドの基本セット
const numbers = [1, 2, 3, 4, 5];
numbers.map(n => n * 2);          // 変換: [2, 4, 6, 8, 10]
numbers.filter(n => n % 2 === 0); // 抽出: [2, 4]
numbers.find(n => n > 3);         // 1個探す: 4
numbers.reduce((acc, n) => acc + n, 0); // 集計: 15

// type で関数型に名前をつける(再利用したいとき)
type NumberTransformer = (n: number) => number;
type NumberPredicate = (n: number) => boolean;

const double: NumberTransformer = n => n * 2;
const isEven: NumberPredicate = n => n % 2 === 0;
```

---

## あとで戻ってきたい疑問

- `Array<T>` と `T[]` の使い分けは「中身が複雑なら `Array<T>`」と覚えたが、
  実務で迷う場面はあるか?(第5章以降で配列を本格的に使うときに確認)
- `reduce` をもっと使いこなしたい。`pipe` 以外でどんな場面で活躍するか?
- 第7章でクラスのメソッドを書くとき、Arrow Function ではなく `function` を
  使う方が安全なケースがあるらしい。何が違うのか?
