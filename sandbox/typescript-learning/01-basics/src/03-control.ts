// ch03: 演算子・制御構文

// ===== 1. 演算子 =====

// 1-1. 算術演算子
console.log("--- 算術演算子 ---");
// ここに書いてみよう
console.log(3 + 3);
console.log(4 / 2);
console.log(2 - 1);

// 1-2. 比較演算子 (=== を使う!)
console.log("--- 比較演算子 ---");
// ここに書いてみよう
console.log(19 > 5);
console.log(10 >= 10);
console.log(29 < 5);
// 1-3. || と ?? の違い
console.log("--- || vs ?? ---");
// ここに書いてみよう
const age = 20;
const hasLicense = true;
console.log(age >= 18 || hasLicense);
const name1: string | null = null;
console.log(name1 || "ゲスト");

// ===== ミニ演習1 =====
// 次の出力を予想してから実行してみよう
console.log("--- ミニ演習1 ---");
console.log(5 === 5);
console.log(5 === "5");
console.log(null === undefined);
console.log(0 ?? "なし");
console.log(0 || "なし");
console.log("" ?? "空");

// ===== 2. 条件分岐 =====

// ===== ミニ演習2 =====
// describeWeather 関数を作ってみよう
// 30以上→"暑い", 20以上→"快適", 10以上→"肌寒い", それ未満→"寒い"
console.log("--- ミニ演習2 ---");
const describeWeather = (temperature: number): string => {
  if(temperature >= 30) return "暑い";
  if(temperature >= 20) return "快適";
  if(temperature >= 10) return "肌寒い";
  return "寒い"
};

console.log(describeWeather(35));
console.log(describeWeather(5));

// ===== 3. ループ =====

// ===== ミニ演習3 =====
// numbers の合計を返す sum 関数を作ってみよう
console.log("--- ミニ演習3 ---");
const sum = (numbers: number[]): number => {
  let total = 0;
  for(const n of numbers) {
    total += n;
  }
  return total;
};

console.log(sum([10, 20, 30, 40, 50]));

// ===== 章末演習 =====
// 演習1: 成績評価システム
const evaluate = (score: number, name: string): string => {
  if (score >= 90) return `${name}さんは優秀です! (A)`;
  if (score >= 70) return `${name}さんは合格です! (B)`;
  if (score >= 50) return `${name}さんは合格です! (C)`;
  return `${name}さんは不合格です。 (D)`;
};

console.log(evaluate(100, "Alice"));
console.log(evaluate(70, "Bob"));
console.log(evaluate(30, "Carol"));


// 演習2: FizzBuzz

const fizzBuzz = (): void => {
  for (let i = 1; i <=30; i++) {
    if (i % 15 === 0) {
      console.log("FizzBuzz")
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
};

fizzBuzz();

