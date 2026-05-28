// ============================================================
// ch05: 配列・オブジェクト
// ============================================================

// --- セクション1: 配列 ---

// 1-1. 配列の型注釈
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Alice", "Bob", "Charlie"];

// 1-2. noUncheckedIndexedAccess の効果
const fruits: string[] = ["apple", "banana", "orange"];
const first = fruits[0]; // string | undefined

if (first !== undefined) {
  console.log(first.toUpperCase()); // "APPLE"
}
console.log(first?.toUpperCase());          // "APPLE"
console.log(first?.toUpperCase() ?? "なし"); // "APPLE"

// 1-3. 配列メソッド

// map — 変換して新しい配列を作る
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const strs = numbers.map((n) => `item-${n}`);
console.log(strs); // ["item-1", "item-2", ...]

// filter — 条件に合う要素だけ残す
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4]

// find — 条件に合う最初の1要素
const found = numbers.find((n) => n > 3); // number | undefined
if (found !== undefined) {
  console.log(found); // 4
}

// reduce — 集計
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// メソッドチェーン
const users = [
  { name: "Alice", age: 30, role: "admin" as const },
  { name: "Bob", age: 17, role: "user" as const },
  { name: "Charlie", age: 25, role: "admin" as const },
  { name: "Diana", age: 40, role: "admin" as const },
];

const adminNames = users
  .filter((u) => u.age >= 18 && u.role === "admin")
  .map((u) => u.name);
console.log(adminNames); // ["Alice", "Charlie", "Diana"]

// その他のメソッド
console.log(numbers.includes(3));       // true
console.log(numbers.join(", "));        // "1, 2, 3, 4, 5"
console.log(numbers.slice(1, 3));       // [2, 3]
console.log(numbers.some((n) => n > 4)); // true
console.log(numbers.every((n) => n > 0)); // true

// reverse/sort は元を変えるのでコピーしてから使う
const reversed = [...numbers].reverse();
const sorted = [...numbers].sort((a, b) => b - a);
console.log(reversed); // [5, 4, 3, 2, 1]
console.log(sorted);   // [5, 4, 3, 2, 1]

// 1-4. readonly 配列
const sortAscSafe = (arr: readonly number[]): number[] =>
  [...arr].sort((a, b) => a - b);

const original = [3, 1, 2];
const sortedArr = sortAscSafe(original);
console.log(original);  // [3, 1, 2] (変わらない)
console.log(sortedArr); // [1, 2, 3]

// 1-5. 分割代入（配列）
const colors: string[] = ["red", "green", "blue"];
const [firstColor, secondColor] = colors;
console.log(firstColor, secondColor); // "red" "green"

const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// 1-6. スプレッド構文（配列）
const a = [1, 2, 3];
const b = [4, 5, 6];
const merged = [...a, ...b];
const added = [...a, 4];
console.log(merged); // [1, 2, 3, 4, 5, 6]
console.log(added);  // [1, 2, 3, 4]

// ミニ演習1
const names2 = users.map((u) => u.name);
console.log(names2); // ["Alice", "Bob", "Charlie", "Diana"]

const adults = users.filter((u) => u.age >= 18);
console.log(adults.map((u) => u.name)); // ["Alice", "Charlie", "Diana"]

const adminNamesOnly = users.filter((u) => u.role === "admin").map((u) => u.name);
console.log(adminNamesOnly); // ["Alice", "Charlie", "Diana"]

const totalAge = users.reduce((acc, u) => acc + u.age, 0);
console.log(totalAge); // 112

// --- セクション2: タプル ---

const point: [number, number] = [10, 20];
const [px, py] = point;
console.log(px, py); // 10 20

const minMax = (nums: number[]): [number, number] => [
  Math.min(...nums),
  Math.max(...nums),
];
const [min, max] = minMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1 9

// --- セクション3: オブジェクト型 ---

// 3-1. オブジェクト型の定義
type User = {
  name: string;
  age: number;
  email?: string; // オプショナルプロパティ
};

const u1: User = { name: "Alice", age: 30 };
const u2: User = { name: "Bob", age: 25, email: "b@example.com" };

// オプショナルプロパティのアクセス
console.log(u1.email?.toUpperCase() ?? "メールなし"); // "メールなし"
console.log(u2.email?.toUpperCase() ?? "メールなし"); // "B@EXAMPLE.COM"

// 3-2. readonly プロパティ
type Config = {
  readonly apiUrl: string;
  timeout: number;
};

const config: Config = { apiUrl: "https://api.example.com", timeout: 3000 };
config.timeout = 5000; // ✅ readonly でないので変更可

// 3-3. 分割代入（オブジェクト）
const user = { name: "Alice", age: 30, email: "a@example.com" };
const { name, age } = user;
console.log(name, age); // "Alice" 30

// 別名をつける
const { name: userName } = user;
console.log(userName); // "Alice"

// 引数で分割代入（React で頻出）
const greet = ({ name: n, age: a }: User): string =>
  `${n}さん(${a}歳)、こんにちは!`;
console.log(greet({ name: "Alice", age: 30 })); // "Aliceさん(30歳)、こんにちは!"

// 3-4. スプレッド構文（オブジェクト）
const baseUser = { name: "Alice", age: 30 };
const updated = { ...baseUser, age: 31 };
console.log(updated);  // { name: "Alice", age: 31 }
console.log(baseUser); // { name: "Alice", age: 30 } (変わらない)

// ミニ演習2
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

const discounted: Product = { ...p1, price: p1.price * 0.9 };
console.log(discounted.price); // 2250

console.log(p1.description ?? "説明なし"); // "説明なし"
console.log(p2.description ?? "説明なし"); // "Reactの実践書"

// --- セクション4: 章末演習（ToDoリスト） ---

type Priority = "high" | "medium" | "low";

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

// 課題1: 完了したToDoだけ
const completed = todos.filter((t) => t.done);
console.log(completed.map((t) => t.title));
// ["TypeScriptを勉強する", "本を返す"]

// 課題2: 未完了のタイトル
const pendingTitles = todos.filter((t) => !t.done).map((t) => t.title);
console.log(pendingTitles);
// ["牛乳を買う", "ジムに行く", "ブログを書く"]

// 課題3: high を全て完了にした新しい配列（元は変えない）
const updatedTodos = todos.map((t) =>
  t.priority === "high" ? { ...t, done: true } : t
);
console.log(updatedTodos.filter((t) => t.priority === "high").map((t) => t.done));
// [true, true]
console.log(todos[1]?.done); // false（元は変わらない）

// 課題4: 全ToDo表示
todos.forEach((t) => {
  console.log(`[${t.done ? "完了" : "未完了"}] ${t.title}`);
});

export {};
