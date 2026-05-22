# 第5章 配列・オブジェクト

## この章のゴール

- 配列の型注釈と `noUncheckedIndexedAccess` の扱いを理解する
- `readonly` 配列と `readonly` プロパティを使える
- 配列メソッド(`map`/`filter`/`reduce`/`find`)を型付きで使いこなせる
- オブジェクト型をインラインで書ける
- オプショナルプロパティ(`?:`)を使える
- 分割代入・スプレッド構文をTypeScriptで使える
- タプルの基本を理解する

**所要時間の目安: 3時間**

---

## 0. この章の準備

引き続き `01-basics/` を使います。`src/05-arrays.ts` を作って進めましょう。

```json
"start": "tsx src/05-arrays.ts"
```

---

## 1. 配列(45分)

### 1-1. 配列の型注釈

```typescript
// 書き方A: T[](一般的・本資料のメイン)
const numbers: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// 書き方B: Array<T>(ジェネリック記法、機能は同じ)
const numbers2: Array<number> = [1, 2, 3];
```

**どちらでもOK**ですが、本資料では `T[]` を基本に使います。

配列も型推論が効きます。

```typescript
const items = [1, 2, 3];           // number[] と推論
const mixed = [1, "two", true];    // (number | string | boolean)[] と推論
```

### 1-2. 要素の追加・変更

```typescript
const fruits: string[] = ["apple", "banana"];

// 末尾に追加(元の配列を変更する)
fruits.push("orange");
console.log(fruits);  // ["apple", "banana", "orange"]

// 末尾を削除
fruits.pop();
console.log(fruits);  // ["apple", "banana"]

// インデックスで書き換え
fruits[0] = "melon";
console.log(fruits);  // ["melon", "banana"]
```

### 1-3. ⭐ noUncheckedIndexedAccess の効果

第1章で有効にした `noUncheckedIndexedAccess: true` の影響がここで出ます。

```typescript
const fruits: string[] = ["apple", "banana", "orange"];

const first = fruits[0];  // 型は string | undefined

console.log(first.toUpperCase());
// ❌ 'first' is possibly 'undefined'.
```

配列のインデックスアクセスはすべて `T | undefined` になります。「存在しないかもしれない」を型で表現。

修正方法:

```typescript
// 方法1: 存在チェック(明示的で分かりやすい)
if (first !== undefined) {
  console.log(first.toUpperCase());  // ✅
}

// 方法2: オプショナルチェイニング(短く書きたいとき)
console.log(first?.toUpperCase());  // ✅ undefined なら undefined を返す

// 方法3: ?? でデフォルト値
console.log(first?.toUpperCase() ?? "なし");  // ✅
```

**初学者の方針**: 方法1か2を使う。`!`(非nullアサーション)は危険なので避ける。

### 1-4. ⭐ 配列メソッド

TypeScriptで最も使う配列メソッドを押さえます。

#### map — 変換して新しい配列を作る

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// 各要素を2倍にした新しい配列
const doubled = numbers.map(n => n * 2);
// 型: number[]
console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(numbers);  // [1, 2, 3, 4, 5] (元は変わらない)

// string に変換する
const strs = numbers.map(n => `item-${n}`);
// 型: string[] (TypeScriptが自動で推論)
console.log(strs);  // ["item-1", "item-2", ...]
```

> **Pythonとの比較**
> `[n * 2 for n in numbers]` に相当します。

#### filter — 条件に合う要素だけ残す

```typescript
const evens = numbers.filter(n => n % 2 === 0);
// 型: number[]
console.log(evens);  // [2, 4]
```

#### find — 条件に合う最初の1要素を返す

```typescript
const found = numbers.find(n => n > 3);
// 型: number | undefined (見つからない可能性があるため)

if (found !== undefined) {
  console.log(found);  // 4
}
```

`find` の戻り値は `T | undefined` です。`noUncheckedIndexedAccess` と同じ思想で、「見つからない可能性」を型で表現しています。

#### reduce — 集計・畳み込み

```typescript
const sum = numbers.reduce((acc, n) => acc + n, 0);
// acc: 累積値, n: 現在の要素, 0: 初期値
console.log(sum);  // 15

// オブジェクトの配列を集計
const users = [
  { name: "Alice", score: 80 },
  { name: "Bob", score: 90 },
  { name: "Carol", score: 70 },
];

const totalScore = users.reduce((acc, u) => acc + u.score, 0);
console.log(totalScore);  // 240
```

#### メソッドチェーン

メソッドを繋げて書けます。

```typescript
const users = [
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob", age: 17, role: "user" },
  { name: "Charlie", age: 25, role: "admin" },
];

// 18歳以上のadminの名前だけ取り出す
const adminNames = users
  .filter(u => u.age >= 18 && u.role === "admin")
  .map(u => u.name);

console.log(adminNames);  // ["Alice", "Charlie"]
```

> **Pythonとの比較**
> `[u["name"] for u in users if u["age"] >= 18 and u["role"] == "admin"]` に相当します。

#### その他のよく使うメソッド

```typescript
const numbers = [1, 2, 3, 4, 5];

console.log(numbers.includes(3));    // true
console.log(numbers.indexOf(3));     // 2
console.log(numbers.join(", "));     // "1, 2, 3, 4, 5"
console.log(numbers.slice(1, 3));    // [2, 3](元を変えない)
console.log(numbers.some(n => n > 4));  // true(1つでも条件を満たすか)
console.log(numbers.every(n => n > 0)); // true(全てが条件を満たすか)

// reverse/sort は元の配列を変更するので、コピーしてから使う
const reversed = [...numbers].reverse();  // [5, 4, 3, 2, 1]
const sorted = [...numbers].sort((a, b) => b - a);  // 降順 [5, 4, 3, 2, 1]
```

### 1-5. readonly 配列

変更不可の配列を表します。

```typescript
const nums: readonly number[] = [1, 2, 3];

nums.push(4);    // ❌ Property 'push' does not exist on type 'readonly number[]'.
nums[0] = 99;   // ❌ Index signature only permits reading.
```

「関数に配列を渡したが、変更されたくない」ときに使います。

```typescript
// ❌ 引数の配列を変更してしまう(危険)
const sortAsc = (arr: number[]): number[] => arr.sort();

// ✅ readonly で受けて、コピーしてからソート
const sortAscSafe = (arr: readonly number[]): number[] => [...arr].sort((a, b) => a - b);

const original = [3, 1, 2];
const sorted = sortAscSafe(original);
console.log(original);  // [3, 1, 2] (変わっていない)
console.log(sorted);    // [1, 2, 3]
```

### 1-6. 分割代入(配列)

```typescript
const colors: string[] = ["red", "green", "blue"];

const [first, second, third] = colors;
console.log(first);   // "red"
console.log(second);  // "green"
```

残りをまとめて受け取る:

```typescript
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]
```

### 1-7. スプレッド構文(配列)

```typescript
const a = [1, 2, 3];
const b = [4, 5, 6];

// コピー
const copy = [...a];

// 結合
const merged = [...a, ...b];  // [1, 2, 3, 4, 5, 6]

// 末尾に追加した新しい配列(元を変えない)
const added = [...a, 4];  // [1, 2, 3, 4]
```

「**元の配列を変更せず、新しい配列を作る**」のがモダンTypeScriptの基本姿勢です。

### 🔧 ミニ演習1

次の `users` 配列を使って操作してください。

```typescript
const users = [
  { name: "Alice", age: 30, role: "admin" as const },
  { name: "Bob", age: 17, role: "user" as const },
  { name: "Charlie", age: 25, role: "user" as const },
  { name: "Diana", age: 40, role: "admin" as const },
];

// 1. 全員の名前だけの string[] を作る
// 2. 18歳以上のユーザーだけの配列を作る
// 3. admin の名前だけの配列を作る(filter + map)
// 4. 全員の年齢の合計を求める(reduce)
```

<details>
<summary>解答例</summary>

```typescript
// 1. 全員の名前
const names = users.map(u => u.name);
console.log(names);  // ["Alice", "Bob", "Charlie", "Diana"]

// 2. 18歳以上
const adults = users.filter(u => u.age >= 18);
console.log(adults.map(u => u.name));  // ["Alice", "Charlie", "Diana"]

// 3. adminの名前
const adminNames = users
  .filter(u => u.role === "admin")
  .map(u => u.name);
console.log(adminNames);  // ["Alice", "Diana"]

// 4. 年齢の合計
const totalAge = users.reduce((acc, u) => acc + u.age, 0);
console.log(totalAge);  // 112
```

</details>

---

## 2. タプル(15分)

**タプル**は「長さと各要素の型が決まった配列」です。

```typescript
// タプル: [型1, 型2, ...]
const point: [number, number] = [10, 20];
const info: [string, number, boolean] = ["Alice", 30, true];

// 配列との違い
const numbers: number[] = [1, 2, 3];  // 長さ自由、要素は全部 number
```

#### アクセスと分割代入

```typescript
const point: [number, number] = [10, 20];

const x = point[0];  // number
const y = point[1];  // number
// point[2]  → ❌ 型エラー(長さ2のタプルに3番目はない)

// 分割代入と相性が良い
const [px, py] = point;
console.log(px, py);  // 10 20
```

#### 実用例: 複数の値を返す関数

```typescript
const minMax = (nums: number[]): [number, number] => {
  return [Math.min(...nums), Math.max(...nums)];
};

const [min, max] = minMax([3, 1, 4, 1, 5, 9]);
console.log(min, max);  // 1 9
```

#### React の useState との関連(予告)

```typescript
// useState は [現在の値, 更新関数] のタプルを返す
const [count, setCount] = useState<number>(0);
//     number    (n: number) => void
```

第14章のReactで再登場します。今は「タプルは分割代入と相性が良い」と覚えておけば十分。

---

## 3. オブジェクト型(45分)

### 3-1. インラインのオブジェクト型

```typescript
const user: { name: string; age: number } = {
  name: "Alice",
  age: 30,
};
```

`{ プロパティ名: 型; ... }` の形で書きます。`;` か `,` で区切ります。

推論も効きます。

```typescript
const user = { name: "Alice", age: 30 };
// 型は { name: string; age: number } と自動推論
```

### 3-2. 値の読み書き

```typescript
const user = { name: "Alice", age: 30 };

// ドット記法(基本)
console.log(user.name);  // "Alice"

// ブラケット記法(キーが変数のとき)
const key = "age";
console.log(user[key]);  // 30

// 変更
user.age = 31;  // constでも中身は変えられる
```

> **const とオブジェクト**
> `const user = {...}` の `const` は「`user` という変数の指し先が変わらない」を意味します。オブジェクトの中身を変えることは可能です。変えたくない場合は `readonly` を使います。

### 3-3. ⭐ オプショナルプロパティ

「あってもなくてもいい」プロパティは `?:` で表します。

```typescript
type User = {
  name: string;
  age: number;
  email?: string;  // 任意プロパティ(省略可能)
};

const u1: User = { name: "Alice", age: 30 };               // OK
const u2: User = { name: "Bob", age: 25, email: "b@ex.com" }; // OK
```

> ⚠️ `type` は第6章で詳しく学ぶ「型エイリアス」です。今は「型に名前をつける便利な仕組み」として使ってください。

オプショナルプロパティを使うときは `undefined` の可能性を考慮します。

```typescript
const u: User = { name: "Alice", age: 30 };

// ❌ undefined かもしれない
console.log(u.email.toUpperCase());

// ✅ オプショナルチェイニングで安全に
console.log(u.email?.toUpperCase());  // undefined

// ✅ ?? でデフォルト値
console.log(u.email?.toUpperCase() ?? "メールなし");
```

### 3-4. readonly プロパティ

変更不可のプロパティを表します。

```typescript
type Config = {
  readonly apiUrl: string;
  timeout: number;
};

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 3000,
};

config.apiUrl = "http://other.com";
// ❌ Cannot assign to 'apiUrl' because it is a read-only property.

config.timeout = 5000;  // ✅ readonly でないので変更可
```

### 3-5. 余分なプロパティのチェック

TypeScriptは「多すぎるプロパティ」も弾きます。

```typescript
type User = { name: string; age: number };

const u: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",  // ❌ User 型に email はない
};
```

タイポや設計ミスを早期に発見できます。

### 3-6. 分割代入(オブジェクト)

オブジェクトから複数の値を取り出す便利な書き方です。

```typescript
const user = { name: "Alice", age: 30, email: "a@ex.com" };

// 基本
const { name, age } = user;
console.log(name, age);  // "Alice" 30

// 別名をつける
const { name: userName, age: userAge } = user;
console.log(userName);  // "Alice"

// デフォルト値
const { name: n, role = "user" } = user;
console.log(role);  // "user"(user に role がないのでデフォルト)
```

#### 関数の引数で使う(React で頻出)

```typescript
type User = { name: string; age: number };

const greet = ({ name, age }: User): string => {
  return `${name}さん(${age}歳)、こんにちは!`;
};

greet({ name: "Alice", age: 30 });  // "Aliceさん(30歳)、こんにちは!"
```

Reactのコンポーネントで **Props を分割代入で受け取る** のに必須のパターンです。

### 3-7. スプレッド構文(オブジェクト)

オブジェクトをコピー・マージできます。

```typescript
const user = { name: "Alice", age: 30 };

// コピー
const copy = { ...user };

// 一部を変えたコピーを作る(元は変わらない)
const updated = { ...user, age: 31 };
console.log(updated);  // { name: "Alice", age: 31 }
console.log(user);     // { name: "Alice", age: 30 } (変わらない)

// 新しいプロパティを追加したコピー
const withEmail = { ...user, email: "alice@example.com" };
```

「**元を変えずに新しいオブジェクトを作る**」のがモダンTypeScriptの基本。Reactの状態更新で毎日使います。

### 🔧 ミニ演習2

次の `Product` 型を定義して、操作してください。

- `id`: 数値、必須、変更不可
- `name`: 文字列、必須
- `price`: 数値、必須
- `description`: 文字列、任意

```typescript
// type Product = { ... }

// 1. 以下のオブジェクトを作る
//    { id: 1, name: "TypeScript入門", price: 2500 }
//    { id: 2, name: "React実践", price: 3000, description: "Reactの実践書" }

// 2. price を 10% 引きにした新しいオブジェクトを作る(元は変えない)

// 3. description をコンソールに出力する(ない場合は "説明なし")
```

<details>
<summary>解答例</summary>

```typescript
type Product = {
  readonly id: number;
  name: string;
  price: number;
  description?: string;
};

const p1: Product = { id: 1, name: "TypeScript入門", price: 2500 };
const p2: Product = {
  id: 2,
  name: "React実践",
  price: 3000,
  description: "Reactの実践書",
};

// 10% 引き
const discounted: Product = { ...p1, price: p1.price * 0.9 };
console.log(discounted.price);  // 2250

// description の出力
console.log(p1.description ?? "説明なし");  // "説明なし"
console.log(p2.description ?? "説明なし");  // "Reactの実践書"
```

</details>

---

## 4. 章末演習(30分)

### 🎯 演習: ToDoリスト操作

```typescript
type Priority = "high" | "medium" | "low";  // ユニオン型(第10章で詳しく)

type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
  priority: Priority;
};

const todos: Todo[] = [
  { id: 1, title: "牛乳を買う", done: false, priority: "low" },
  { id: 2, title: "TypeScriptを勉強する", done: true, priority: "high" },
  { id: 3, title: "ジムに行く", done: false, priority: "medium" },
  { id: 4, title: "本を返す", done: true, priority: "low" },
  { id: 5, title: "ブログを書く", done: false, priority: "high" },
];
```

**課題1**: 完了したToDoだけの配列を作る

**課題2**: 未完了のToDoのタイトルだけの `string[]` を作る

**課題3**: `priority` が `"high"` のToDoを全て完了にした新しい配列を作る(元は変えない)

**課題4**: 全ToDoを `"[完了/未完了] タイトル"` の形式で表示する

<details>
<summary>解答例</summary>

```typescript
// 課題1: 完了したToDo
const completed = todos.filter(t => t.done);
console.log(completed.map(t => t.title));
// ["TypeScriptを勉強する", "本を返す"]

// 課題2: 未完了のタイトル
const pendingTitles = todos
  .filter(t => !t.done)
  .map(t => t.title);
console.log(pendingTitles);
// ["牛乳を買う", "ジムに行く", "ブログを書く"]

// 課題3: highを全て完了にした新しい配列
const updatedTodos = todos.map(t =>
  t.priority === "high" ? { ...t, done: true } : t
);
console.log(updatedTodos.filter(t => t.priority === "high").map(t => t.done));
// [true, true]
console.log(todos[1]?.done);  // false (元は変わらない)

// 課題4: 全ToDo表示
todos.forEach(t => {
  console.log(`[${t.done ? "完了" : "未完了"}] ${t.title}`);
});
// [未完了] 牛乳を買う
// [完了] TypeScriptを勉強する
// ...
```

課題3の `map` + 三項演算子 + スプレッドのパターン(`{ ...t, done: true }`)は**Reactの状態更新の典型形**です。しっかり覚えておきましょう。
</details>

---

## 5. この章のまとめ

### 覚えておきたいこと

1. 配列の型は `T[]` で書く
2. `noUncheckedIndexedAccess` のため、インデックスアクセスの型は `T | undefined` → `if` か `?.` で対処
3. **配列メソッド**: `map`(変換)、`filter`(絞り込み)、`find`(1つ探す)、`reduce`(集計)
4. `find` の戻り値は `T | undefined`
5. **readonly 配列**: 変更不可。関数引数に使うと安全
6. オブジェクト型は `{ キー: 型; }` で書く
7. **オプショナルプロパティ** `?:` → 使うときは `?.` か `??` で対処
8. **readonly プロパティ** → 変更しようとするとコンパイルエラー
9. **分割代入** `const { name } = user` / `const [a, b] = arr`
10. **スプレッド** `{ ...obj, 変更点 }` で元を変えずに新オブジェクトを作る
11. **タプル** `[T1, T2]` は長さと型が固定された配列

### 確認問題

<details>
<summary>Q1. `find` の戻り値が `T | undefined` になるのはなぜか?</summary>

条件に合う要素が配列に存在しない場合があるためです。`find` は見つからなければ `undefined` を返します。`noUncheckedIndexedAccess` と同じ思想で「存在しない可能性」を型に反映しています。
</details>

<details>
<summary>Q2. スプレッド構文で「一部を変えたコピー」を作る方法は?</summary>

```typescript
const updated = { ...original, 変えたいプロパティ: 新しい値 };
```

後から書いたプロパティが優先されるため、変えたいものだけを上書きできます。元のオブジェクトは変わりません。
</details>

<details>
<summary>Q3. 配列の `map` と `forEach` の違いは?</summary>

- **`map`**: **新しい配列を返す**。変換結果を使いたいときに使う
- **`forEach`**: **何も返さない**(undefined)。副作用(console.logなど)だけが目的のときに使う
</details>

---

## 次の章へ

第5章で**配列とオブジェクト**の型付けをマスターしました。次の第6章では**文字列メソッド・スコープ・クロージャ・例外処理**を学びます。

---

> 🎯 **コラム: map/filter/reduce の選び方**
>
> 「for ループより map/filter の方がいいの?」と思う人もいるかもしれません。
>
> ```typescript
> // for ループ版
> const result: string[] = [];
> for (const u of users) {
>   if (u.age >= 18) {
>     result.push(u.name);
>   }
> }
>
> // map/filter 版
> const result = users.filter(u => u.age >= 18).map(u => u.name);
> ```
>
> **どちらでも動きますが**、`map`/`filter` 版には次のメリットがあります。
>
> - **意図が明確**: 「フィルターしてマップする」という処理が一目で分かる
> - **イミュータブル**: 元の配列を変更しない
> - **TypeScriptとの相性**: 戻り値の型が自動推論される
>
> ただし複雑な処理は `for` の方が読みやすいこともあります。「どちらが適切か」は場面次第で、慣れてくると自然に判断できるようになります。

お疲れさまでした!次の第6章で会いましょう ☕
