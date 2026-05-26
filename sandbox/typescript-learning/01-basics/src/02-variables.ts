// ===== ミニ演習1: const と let =====
const myName = "あなたの名前";
let myAge = 25;

console.log(`私の名前は${myName}、${myAge}歳です。`);

myAge = myAge + 1;
console.log(`来年は${myAge}歳になります。`);

// ===== ミニ演習2: 型注釈 — どこに書いてどこを省略するか =====
// TODO: formatUser の引数に型注釈を追加する
const userId = 12345;
const userName = "Alice";
const isVerified = true;

const formatUser = (id: number, name: string, verified: boolean) => {
  return `[${id}] ${name} (${verified ? "認証済み" : "未認証"})`;
};

console.log(formatUser(userId, userName, isVerified));

// ===== ミニ演習3: typeof で型を確認 =====
// TODO: 答えを予想してから実行する
console.log(typeof "123");  // string
console.log(typeof 123);  // number
console.log(typeof "true"); //string
console.log(typeof true);  //boolean
console.log(typeof undefined);  // undefined
console.log(typeof null);  //object

// ===== ミニ演習4: any を unknown に直す =====
// TODO: input の型を any → unknown に変えて、型を絞り込む
const processInput = (input: unknown) => {
  if (typeof input === "string") {
    console.log(input.toUpperCase());
  } else {
    console.log("文字列ではないのでスキップ")
  }
};

processInput("hello");
processInput(123);

// ===== 章末演習1: 型注釈をつける =====
// TODO: 引数と戻り値に型注釈を追加する
const calculateBMI = (weight: number, height: number): number => {
  return weight / (height * height);
};

const isObese = (bmi: number): boolean => {
  return bmi >= 30;
};

const formatBMI = (bmi: number): string => {
  return `BMI: ${bmi.toFixed(2)}`;
};

console.log(calculateBMI(60, 1.65));
console.log(isObese(35));
console.log(formatBMI(22.5));

// ===== 章末演習2: ユーザー情報 =====
// TODO: 仕様通りに変数と関数を作る
// userId: 数値(変更不可), userName: 文字列(変更不可)
// score: 数値(再代入あり), formatUser2(id, name, score): "[id] name: score点" を返す

const userId2 = 1;
const userName2 ="Alice";
let score = 40;

const formatUser2 = (id: number, name: string, s: number): string => {
  return `[${id}] ${name}: ${s}点`;
};

console.log(formatUser2(userId2, userName2, score));

score = 95;

console.log(formatUser2(userId2, userName2, score));

export {};
