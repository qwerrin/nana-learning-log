// ===================================
// ch06: 文字列・スコープ・例外処理
// ===================================

// -----------------------------------
// 1. 文字列メソッド
// -----------------------------------

// 1-1. 長さと文字の取り出し
const str1: string = "Hello, TypeScript!";
console.log("--- 1-1 長さ・取り出し ---");
console.log(str1.length);     // 18
console.log(str1[0]);         // "H"
console.log(str1.charAt(7));  // "T"

// 1-2. 検索系
const str2 = "TypeScript is great";
console.log("--- 1-2 検索 ---");
console.log(str2.includes("Script"));    // true
console.log(str2.includes("Python"));   // false
console.log(str2.startsWith("Type"));   // true
console.log(str2.endsWith("great"));    // true
console.log(str2.indexOf("Script"));    // 4
console.log(str2.indexOf("Python"));    // -1

// 1-3. 変換系
const str3 = "  Hello, World!  ";
console.log("--- 1-3 変換 ---");
console.log(str3.toUpperCase());  // "  HELLO, WORLD!  "
console.log(str3.toLowerCase());  // "  hello, world!  "
console.log(str3.trim());         // "Hello, World!"
console.log(str3.trimStart());    // "Hello, World!  "
console.log(str3.trimEnd());      // "  Hello, World!"

// 1-4. 切り出し・置換
const str4 = "Hello, World!";
console.log("--- 1-4 切り出し・置換 ---");
console.log(str4.slice(0, 5));                       // "Hello"
console.log(str4.slice(7));                          // "World!"
console.log(str4.slice(-6));                         // "orld!"
console.log(str4.replace("World", "TypeScript"));   // "Hello, TypeScript!"
const txt = "りんご、りんご、りんご";
console.log(txt.replaceAll("りんご", "みかん"));     // "みかん、みかん、みかん"

// 1-5. 分割と結合
const csv = "apple,banana,orange";
const fruits: string[] = csv.split(",");
console.log("--- 1-5 split/join ---");
console.log(fruits);                    // ["apple", "banana", "orange"]
console.log(fruits.join(" / "));       // "apple / banana / orange"

// 1-6. パディング・繰り返し
const num = "42";
console.log("--- 1-6 padding/repeat ---");
console.log(num.padStart(5, "0"));  // "00042"
console.log(num.padEnd(5, "-"));    // "42---"
console.log("*".repeat(5));         // "*****"

// -----------------------------------
// 🔧 ミニ演習1: メールアドレス正規化
// -----------------------------------
// TODO: 以下の関数を実装してね！
// 仕様:
//   - 前後の空白を除去
//   - すべて小文字に変換
//   - 引数と戻り値の型を明示する

const normalizeEmail = (email: string): string => {
  // ここを実装してみて！
  return email.trim().toLowerCase(); // ← この行を書き換える
};

console.log("--- ミニ演習1 ---");
console.log(normalizeEmail("  Alice@Example.COM  "));
// 期待: "alice@example.com"

// -----------------------------------
// 2. スコープ
// -----------------------------------
console.log("--- 2. スコープ ---");

// ブロックスコープ: {} の中だけで有効
{
  const inner = "ブロック内";
  console.log(inner);  // OK
}
// console.log(inner);  // ← コメント外すとエラー: Cannot find name 'inner'

// 内側から外側は見える
const message = "外側";
const show = (): void => {
  console.log(message);  // ✅ 外の変数が読める
};
show();

// var はブロックを無視する → 使わない！
// const/let を使えば気にしなくてOK

// -----------------------------------
// 3. クロージャ
// -----------------------------------
console.log("--- 3. クロージャ ---");

// カウンター: 外側の count を「覚えている」
const createCounter = () => {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
};

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3

// 「外から直接触れない状態」を作る例
const createAccount = (initial: number) => {
  let balance = initial;

  return {
    deposit: (amount: number): void => { balance += amount; },
    withdraw: (amount: number): void => { balance -= amount; },
    getBalance: (): number => balance,
  };
};

const account = createAccount(1000);
account.deposit(500);
console.log(account.getBalance());  // 1500
// account.balance は存在しない → 外から直接変えられない

// -----------------------------------
// 4. this と Arrow Function
// -----------------------------------
console.log("--- 4. this と Arrow Function ---");

const user = {
  name: "Alice",
  // function キーワードのメソッド + 内部は Arrow Function
  greet: function (): void {
    setTimeout(() => {
      // Arrow Function は外側の this(= user) を引き継ぐ
      console.log(`こんにちは、${this.name}さん!`);  // ✅ "Alice"
    }, 0);
  },
};

user.greet();

// -----------------------------------
// 5. try/catch 例外処理
// -----------------------------------
console.log("--- 5. try/catch ---");

// 基本: JSON.parse は不正な文字列でエラーを投げる
try {
  const data = JSON.parse("invalid json");
  console.log(data);
} catch (error) {
  if (error instanceof Error) {
    console.error("エラーをキャッチ:", error.message);
  }
} finally {
  console.log("finally は必ず実行される");
}

// エラーを自分で投げる
const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("0で割れません");
  }
  return a / b;
};

try {
  console.log(divide(10, 2));  // 5
  console.log(divide(10, 0)); // ここで例外
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);  // "0で割れません"
  }
}

// -----------------------------------
// 🔧 ミニ演習2: parseUser
// -----------------------------------
// TODO: 以下の関数を実装してね！
// 仕様:
//   - カンマ区切りの "名前,年齢" 形式を受け取る
//   - { name: string; age: number } を返す
//   - 形式が不正 or 年齢が数値に変換できないなら Error を投げる

const parseUser = (input: string): { name: string; age: number } => {
  // ここを実装してみて！
  const parts = input.split(",").map(part => part.trim());
  if (parts.length !== 2) {
    throw new Error("入力は '名前,年齢' の形式でなければなりません");
  }
  const [name, ageStr] = parts;
  const age = Number(ageStr);

  if (Number.isNaN(age)) {
    throw new Error("年齢は数値でなければなりません");
  }
  if (!name) {
    throw new Error("名前は空であってはなりません");
  }

  return { name, age };
};

console.log("--- ミニ演習2 ---");
try {
  console.log(parseUser("Alice,30"));  // { name: "Alice", age: 30 }
  console.log(parseUser("Bob"));       // ← エラーになるはず
} catch (error) {
  if (error instanceof Error) console.error(error.message);
}

// -----------------------------------
// 6. 章末演習: CSVパーサー
// -----------------------------------
// TODO: parseCSV を実装してね！
// 仕様:
//   - 複数行の CSV 文字列を受け取る（形式: "名前,年齢,メールアドレス"）
//   - User[] を返す
//   - 変換失敗した行はスキップ（console.warn で警告）
//   - メールアドレスは小文字に正規化する

type User = {
  name: string;
  age: number;
  email: string;
};

const parseLine = (line: string): User => {
  const parts = line.split(",").map(part => part.trim());
  if (parts.length !== 3) {
    throw new Error(`行の形式が不正です: "${line}"`);
  }
  const [name, ageStr, email] = parts;
  const age = Number(ageStr);

  if (Number.isNaN(age)) {
    throw new Error(`年齢が数値に変換できません: "${ageStr}"`);
  }
  if (!name) {
    throw new Error("名前は空であってはなりません");
  }
  if (!email) {
    throw new Error("メールアドレスは空であってはなりません");
  }

  return { name, age, email: normalizeEmail(email) };
};

const parseCSV = (csv: string): User[] => {
  // ここを実装してみて！
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const users: User[] = [];

  for (const line of lines) {
    try {
      users.push(parseLine(line));
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error.message);
      }
    }
  }
  return users;
};

const csvInput = `
Alice,30,Alice@Example.COM
Bob,abc,bob@example.com
Charlie,25,charlie@example.com
invalid-line
Diana,40,diana@example.com
`.trim();

console.log("--- 章末演習 ---");
console.log(parseCSV(csvInput));
// 期待:
// [
//   { name: "Alice",   age: 30, email: "alice@example.com" },
//   { name: "Charlie", age: 25, email: "charlie@example.com" },
//   { name: "Diana",   age: 40, email: "diana@example.com" },
// ]
// Bob と invalid-line は console.warn でスキップ

export {};
