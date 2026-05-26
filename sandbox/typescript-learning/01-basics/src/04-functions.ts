// ============================================================
// ch04: 関数
// ============================================================

// --- セクション1: 関数の3つの書き方 ---

// 1-1. 関数宣言
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(1, 2)); // 3

// 1-2. 関数式
const subtract = function (a: number, b: number): number {
  return a - b;
};
console.log(subtract(5, 3)); // 2

// 1-3. Arrow Function（これがメイン）
const multiply = (a: number, b: number): number => {
  return a * b;
};
console.log(multiply(3, 4)); // 12

// 短縮形（1行なら return と {} を省略）
const double = (n: number): number => n * 2;
console.log(double(5)); // 10

// ミニ演習1: Arrow Function で書く
const addTax = (price: number): number => price * 1.1;
const greet = (name: string): string => `Hello, ${name}!`;
const now = (): number => Date.now();

console.log(addTax(1000));   // 1100
console.log(greet("Alice")); // "Hello, Alice!"
console.log(now());          // タイムスタンプ

// --- セクション2: 型注釈のルール ---

// 戻り値 void（副作用だけの関数）
const log = (message: string): void => {
  console.log(message);
};
log("Hello void!");

// --- セクション3: 引数のバリエーション ---

// 3-1. デフォルト引数
const greetWithDefault = (name: string, greeting = "Hello"): string =>
  `${greeting}, ${name}!`;

console.log(greetWithDefault("Alice"));          // "Hello, Alice!"
console.log(greetWithDefault("Bob", "Hi"));      // "Hi, Bob!"

// 3-2. オプショナル引数
const greetOptional = (name: string, greeting?: string): string =>
  `${greeting ?? "Hello"}, ${name}!`;

console.log(greetOptional("Alice"));       // "Hello, Alice!"
console.log(greetOptional("Bob", "Hey"));  // "Hey, Bob!"

// 3-3. 残余引数
const sum = (...numbers: number[]): number => {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
};

console.log(sum(1, 2, 3));       // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum());               // 0

// ミニ演習2: multiplyAll
const multiplyAll = (multiplier = 2, ...numbers: number[]): number[] =>
  numbers.map((n) => n * multiplier);

console.log(multiplyAll(3, 1, 2, 3));           // [3, 6, 9]
console.log(multiplyAll(undefined, 1, 2, 3));   // [2, 4, 6]

// --- セクション4: 関数型とコールバック ---

// 関数型に名前をつける
type NumberTransformer = (n: number) => number;
type NumberPredicate = (n: number) => boolean;

const doubleTransformer: NumberTransformer = (n) => n * 2;
const isEven: NumberPredicate = (n) => n % 2 === 0;

// コールバックを受け取る関数
const transform = (arr: number[], fn: (n: number) => number): number[] =>
  arr.map(fn);

console.log(transform([1, 2, 3], doubleTransformer)); // [2, 4, 6]
console.log(transform([1, 2, 3], (n) => n ** 2));     // [1, 4, 9]

// 配列メソッドとの対応
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map((n) => n * 2));             // [2, 4, 6, 8, 10]
console.log(numbers.filter((n) => n % 2 === 0));    // [2, 4]
console.log(numbers.find((n) => n > 3));            // 4
console.log(numbers.reduce((acc, n) => acc + n, 0)); // 15

// ミニ演習3: applyIf
const applyIf = (
  arr: number[],
  condition: (n: number) => boolean,
  fn: (n: number) => number
): number[] => arr.map((n) => (condition(n) ? fn(n) : n));

console.log(applyIf([1, 2, 3, 4, 5], (n) => n % 2 === 0, (n) => n * 10));
// [1, 20, 3, 40, 5]

// --- セクション5: 章末演習 ---

// パイプライン関数
const pipe = (x: number, ...fns: Array<(n: number) => number>): number =>
  fns.reduce((acc, fn) => fn(acc), x);

const addOne = (n: number) => n + 1;
const square = (n: number) => n ** 2;

console.log(pipe(3, double, addOne, square)); // 49
console.log(pipe(5, addOne, double));         // 12
console.log(pipe(4));                         // 4

export {};
