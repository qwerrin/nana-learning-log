# HTML/CSS 超速習 Day 3 — フォームと入力要素

## 今日のゴール

- `<form>` の基本構造を書ける
- `<input>` の各種 `type` を使い分けられる
- ネイティブ validation(`required`、`pattern` など)で入力を検証できる
- `<select>` / `<textarea>` / `<datalist>` を使える
- `<label>` で入力欄とラベルを正しく紐付けられる
- **`<dialog>` 要素**でモーダルを実装できる

**所要時間の目安: 2〜2.5時間**

---

## 0. 今日のスタンス

フォームは Web の**最も古くて、最も重要な機能**のひとつ。お問い合わせ、ログイン、検索、購入手続き—— ユーザーがサイトに**入力する**ところには必ずフォームがあります。

今日は HTML 編の最終日。HTML だけで:
- 入力チェック
- 適切なキーボード表示(スマホで `type="email"` ならアットマーク付きが出る)
- 自動補完候補の提供
- モーダルダイアログ

までできることに驚いてもらえると思います。**「HTMLって賢い」** と感じる回です。

---

## 1. フォームの基本(20分)

### 1-1. `<form>` 要素

すべてのフォームは `<form>` で囲みます。

```html
<form action="/submit" method="POST">
  <label for="name">名前:</label>
  <input type="text" id="name" name="name">
  
  <button type="submit">送信</button>
</form>
```

主な属性:
- **`action`**: 送信先のURL(指定しないと同じページに送られる)
- **`method`**: 送信方法。`GET`(検索など)か `POST`(データ送信)

今日は**HTML だけで完結する**例を扱うので、`action` は気にしなくてOK。React や JavaScript と組み合わせるときは別の章で。

### 1-2. ⭐ `<label>` の重要性

「**入力欄に何を入れるか**」を示すラベルです。

```html
<!-- ✅ 推奨: for と id を紐付ける -->
<label for="username">ユーザー名</label>
<input type="text" id="username" name="username">

<!-- または、label の中に input を入れる -->
<label>
  ユーザー名
  <input type="text" name="username">
</label>
```

#### なぜ重要か

1. **アクセシビリティ**: 読み上げソフトが「ユーザー名、テキスト入力欄」と読み上げてくれる
2. **クリック範囲が広がる**: ラベルをクリックすると入力欄にフォーカスが当たる
3. **チェックボックス・ラジオで特に便利**: 小さい四角だけでなく、文字をクリックしても選べる

`<label>` を省略するのは**事実上アンチパターン**です。必ず付けましょう。

### 1-3. `<button>` で送信

```html
<button type="submit">送信</button>
<button type="reset">クリア</button>
<button type="button">他の操作</button>
```

`type` の意味:
- **`submit`**(デフォルト): フォームを送信
- **`reset`**: フォームを初期化(あまり使わない)
- **`button`**: ボタンとしてだけ振る舞う(JSで処理する)

> ⚠️ **`<button>` には必ず `type` を書く**
>
> `<button>` のデフォルトは `submit` なので、フォーム内で **`type="button"` を書き忘れる**と意図せず送信されることがあります。「**フォーム内のボタンには必ず `type` を明示**」が安全な習慣です。

### 1-4. はじめてのフォーム

`day3/index.html` を作って書いてみてください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>はじめてのフォーム</title>
</head>
<body>
  <h1>お問い合わせ</h1>
  
  <form>
    <p>
      <label for="name">お名前</label><br>
      <input type="text" id="name" name="name">
    </p>
    <p>
      <label for="email">メールアドレス</label><br>
      <input type="email" id="email" name="email">
    </p>
    <p>
      <button type="submit">送信</button>
    </p>
  </form>
</body>
</html>
```

Live Server で表示すると、シンプルな入力欄が出ます。`type="email"` のメール欄に `not-email` のような変な値を入れて送信を押してみてください。**ブラウザが自動的に**「メール形式で入力してください」と警告を出します。これがネイティブ validation の力。

---

## 2. ⭐ input の type 大全(35分)

`<input>` は `type` 属性によって**全く違う見た目と機能**になります。よく使うものを一気に紹介。

### 2-1. テキスト系

```html
<!-- 普通のテキスト -->
<input type="text">

<!-- メールアドレス -->
<input type="email">

<!-- URL -->
<input type="url">

<!-- 電話番号 -->
<input type="tel">

<!-- 検索 -->
<input type="search">

<!-- パスワード(伏字になる) -->
<input type="password">
```

**スマホでの違い**(これがすごい):

| type | スマホで出るキーボード |
|---|---|
| `text` | 普通のキーボード |
| `email` | `@` キーや `.com` ボタンが出る |
| `url` | `/` や `.com` ボタンが出る |
| `tel` | 数字キーパッド |
| `search` | 「検索」ボタン付き |
| `password` | 文字が伏字に |

「**スマホで `type="text"` のままにすると、ユーザーが面倒する**」という認識を持っておきましょう。

### 2-2. 数値・範囲

```html
<!-- 数値 -->
<input type="number" min="0" max="100" step="1">

<!-- スライダー -->
<input type="range" min="0" max="100" value="50">
```

- `min`/`max`: 最小・最大値
- `step`: ステップ(1ずつ増減、0.1ずつ増減など)
- `value`: 初期値

### 2-3. 日付・時間

```html
<!-- 日付 -->
<input type="date">

<!-- 時刻 -->
<input type="time">

<!-- 日付+時刻 -->
<input type="datetime-local">

<!-- 月 -->
<input type="month">

<!-- 週 -->
<input type="week">
```

**ブラウザがネイティブのカレンダーUI**を出してくれます。自前で日付ピッカーを作る必要なし。

### 2-4. 色とファイル

```html
<!-- 色選択(カラーピッカーが開く) -->
<input type="color" value="#3b82f6">

<!-- ファイル選択 -->
<input type="file">
<input type="file" accept="image/*">     <!-- 画像だけ -->
<input type="file" accept=".pdf,.docx"> <!-- 特定の拡張子 -->
<input type="file" multiple>             <!-- 複数選択 -->
```

`accept` で受け付けるファイル種類を絞れます。

### 2-5. チェックボックスとラジオ

```html
<!-- チェックボックス(複数選択可) -->
<label>
  <input type="checkbox" name="hobby" value="reading">
  読書
</label>
<label>
  <input type="checkbox" name="hobby" value="music">
  音楽
</label>

<!-- ラジオボタン(1つだけ選択) -->
<label>
  <input type="radio" name="size" value="s">
  Sサイズ
</label>
<label>
  <input type="radio" name="size" value="m">
  Mサイズ
</label>
<label>
  <input type="radio" name="size" value="l">
  Lサイズ
</label>
```

**重要なルール**:
- **チェックボックス**: 複数選択OK。`name` は同じでも別でも
- **ラジオボタン**: 1つだけ選択。**`name` を揃える**ことでグループ化される
- `value` が**実際に送信される値**

### 2-6. その他

```html
<!-- 隠しフィールド(JSなどから値を渡すとき) -->
<input type="hidden" name="userId" value="123">

<!-- 画像ボタン -->
<input type="image" src="submit.png" alt="送信">
```

### 🔧 ミニ演習1

会員登録フォームを作ってみてください。次の要件を満たすこと。

- 名前(text)
- メールアドレス(email)
- パスワード(password)
- 年齢(number、0〜120)
- 性別(radio: 男性/女性/その他)
- 興味のあるジャンル(checkbox: 技術、デザイン、ビジネス)
- 自己紹介(textarea、後で説明)
- 送信ボタン

各入力欄に `<label>` を必ず付けること。

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>会員登録</title>
</head>
<body>
  <h1>会員登録</h1>
  
  <form>
    <p>
      <label for="name">名前</label><br>
      <input type="text" id="name" name="name">
    </p>
    
    <p>
      <label for="email">メールアドレス</label><br>
      <input type="email" id="email" name="email">
    </p>
    
    <p>
      <label for="password">パスワード</label><br>
      <input type="password" id="password" name="password">
    </p>
    
    <p>
      <label for="age">年齢</label><br>
      <input type="number" id="age" name="age" min="0" max="120">
    </p>
    
    <p>
      性別<br>
      <label><input type="radio" name="gender" value="male"> 男性</label>
      <label><input type="radio" name="gender" value="female"> 女性</label>
      <label><input type="radio" name="gender" value="other"> その他</label>
    </p>
    
    <p>
      興味のあるジャンル<br>
      <label><input type="checkbox" name="interests" value="tech"> 技術</label>
      <label><input type="checkbox" name="interests" value="design"> デザイン</label>
      <label><input type="checkbox" name="interests" value="business"> ビジネス</label>
    </p>
    
    <p>
      <label for="bio">自己紹介</label><br>
      <textarea id="bio" name="bio" rows="4" cols="40"></textarea>
    </p>
    
    <p>
      <button type="submit">登録する</button>
    </p>
  </form>
</body>
</html>
```

ラジオボタンとチェックボックスは `<label>` で囲むと、文字部分もクリックで選択できるようになります。
</details>

---

## 3. 選択肢・複数行入力(20分)

### 3-1. `<textarea>` — 複数行テキスト

```html
<label for="message">メッセージ</label>
<textarea id="message" name="message" rows="4" cols="50">
  ここに初期値を入れる場合
</textarea>
```

- `rows`: 行数
- `cols`: 1行あたりの文字数(概算)
- 初期値は `<textarea>` の**中身として書く**(`value` 属性ではない)

`<input>` と違い、**改行を含むテキスト**が入力できます。

### 3-2. `<select>` — ドロップダウン

```html
<label for="country">国</label>
<select id="country" name="country">
  <option value="">選択してください</option>
  <option value="jp">日本</option>
  <option value="us">アメリカ</option>
  <option value="uk">イギリス</option>
</select>
```

複数選択もできます。

```html
<select name="languages" multiple>
  <option value="ja">日本語</option>
  <option value="en">英語</option>
  <option value="zh">中国語</option>
</select>
```

`<option>` をグループ化したいときは `<optgroup>`:

```html
<select>
  <optgroup label="アジア">
    <option value="jp">日本</option>
    <option value="kr">韓国</option>
  </optgroup>
  <optgroup label="ヨーロッパ">
    <option value="uk">イギリス</option>
    <option value="fr">フランス</option>
  </optgroup>
</select>
```

### 3-3. ⭐ `<datalist>` — オートコンプリート候補

「**自由入力もできるけど、候補も提示したい**」場面に最適。

```html
<label for="city">都市</label>
<input type="text" id="city" list="cities" name="city">

<datalist id="cities">
  <option value="東京">
  <option value="大阪">
  <option value="京都">
  <option value="札幌">
  <option value="福岡">
</datalist>
```

入力欄をクリックすると候補が出ますが、**候補にない値も入力できます**。`<select>` と違って自由度が高い。

### 3-4. `<fieldset>` / `<legend>` — グループ化

関連する入力をひとまとめにします。

```html
<fieldset>
  <legend>連絡先</legend>
  
  <label for="email2">メール</label>
  <input type="email" id="email2">
  
  <label for="phone">電話</label>
  <input type="tel" id="phone">
</fieldset>

<fieldset>
  <legend>住所</legend>
  
  <label for="zip">郵便番号</label>
  <input type="text" id="zip">
  
  <label for="address">住所</label>
  <input type="text" id="address">
</fieldset>
```

`<fieldset>` で枠が表示され、`<legend>` がそのタイトルになります。読み上げソフトでも「**連絡先のグループ、メール...**」のように読まれ、視覚障害者にも分かりやすくなります。

特に**ラジオボタンのグループ**には `<fieldset>` を使うのがベストプラクティス。

```html
<fieldset>
  <legend>サイズを選択</legend>
  <label><input type="radio" name="size" value="s"> S</label>
  <label><input type="radio" name="size" value="m"> M</label>
  <label><input type="radio" name="size" value="l"> L</label>
</fieldset>
```

---

## 4. ⭐ ネイティブvalidation(25分)

JavaScript なしで、**ブラウザに入力チェックさせる**機能です。

### 4-1. 必須入力

```html
<input type="email" required>
```

`required` 属性を付けると、空のまま送信できなくなります。試しに送信ボタンを押すと**「この項目は必須です」**とブラウザが警告。

### 4-2. 文字数制限

```html
<input type="text" minlength="3" maxlength="20">
```

- `minlength`: 最少文字数
- `maxlength`: 最大文字数

### 4-3. 数値の範囲

```html
<input type="number" min="0" max="100">
<input type="range" min="0" max="100" step="5">
```

### 4-4. パターン(正規表現)

```html
<!-- 半角英数字のみ -->
<input type="text" pattern="[a-zA-Z0-9]+">

<!-- 郵便番号(7桁) -->
<input type="text" pattern="\d{3}-?\d{4}" placeholder="123-4567">
```

`pattern` には正規表現を書きます。詳しい正規表現の書き方は今は気にしなくて OK。「**こういうことができる**」と知っておくだけで十分。

### 4-5. 組み合わせ例

```html
<form>
  <p>
    <label for="username">ユーザー名(3〜20文字)</label><br>
    <input
      type="text"
      id="username"
      name="username"
      required
      minlength="3"
      maxlength="20"
    >
  </p>
  
  <p>
    <label for="email">メール</label><br>
    <input type="email" id="email" name="email" required>
  </p>
  
  <p>
    <label for="age">年齢(18以上)</label><br>
    <input type="number" id="age" name="age" min="18" required>
  </p>
  
  <p>
    <button type="submit">登録</button>
  </p>
</form>
```

このフォームは:
- ユーザー名が3文字未満や20文字超でブロック
- メール形式じゃないとブロック
- 年齢が18未満や空でブロック

をすべて **HTML だけで** 実現しています。

### 4-6. placeholder と value の違い

混同しやすいので整理:

```html
<!-- placeholder: 薄い文字でヒント表示。実際の値は空 -->
<input type="text" placeholder="例: 山田太郎">

<!-- value: 実際の初期値が入っている -->
<input type="text" value="山田太郎">
```

> ⚠️ **placeholder をラベル代わりに使わない**
>
> 「ラベルが場所を取るから placeholder で済まそう」は **アンチパターン**。
>
> - 入力を始めると消える(何を入れる欄か忘れる)
> - 読み上げソフトに認識されにくい
> - 文字色が薄くアクセシビリティが悪い
>
> 必ず `<label>` を使ってください。`placeholder` は**補足ヒント**として併用するもの。

### 🔧 ミニ演習2

先ほど作った会員登録フォームに、次のvalidationを追加してください。

- 名前: 必須、2文字以上
- メール: 必須
- パスワード: 必須、8文字以上
- 年齢: 必須

<details>
<summary>解答例</summary>

```html
<p>
  <label for="name">名前(2文字以上)</label><br>
  <input type="text" id="name" name="name" required minlength="2">
</p>

<p>
  <label for="email">メールアドレス</label><br>
  <input type="email" id="email" name="email" required>
</p>

<p>
  <label for="password">パスワード(8文字以上)</label><br>
  <input type="password" id="password" name="password" required minlength="8">
</p>

<p>
  <label for="age">年齢</label><br>
  <input type="number" id="age" name="age" min="0" max="120" required>
</p>
```

これを保存して、空のまま「登録する」を押したり、不正な値を入れたりして挙動を確認してください。**ブラウザが自動で警告を出してくれる**のが体感できます。
</details>

---

## 5. ⭐ `<dialog>` 要素 — モダンなモーダル(30分)

ここからが Day 3 のクライマックス。**JavaScript なしでも開閉できる**モーダルダイアログです。

### 5-1. 昔と今

昔は「モーダル(ポップアップ)」を作るには、自作 `<div>` + JS + 細かなCSS + アクセシビリティ対応…と大変でした。

```html
<!-- ❌ 昔のやり方(複雑) -->
<div class="modal-overlay" style="display:none;">
  <div class="modal-content">
    <div class="modal-header">...</div>
    <div class="modal-body">...</div>
  </div>
</div>
```

**現代では `<dialog>` 要素**でほぼ全てがネイティブ。

```html
<!-- ✅ 現代のやり方 -->
<dialog>
  <p>メッセージ</p>
  <button>閉じる</button>
</dialog>
```

### 5-2. 基本構文

```html
<dialog id="myDialog">
  <p>これはダイアログです</p>
  <button onclick="myDialog.close()">閉じる</button>
</dialog>

<button onclick="myDialog.showModal()">開く</button>
```

**ポイント**:
- `<dialog>` を書くだけ。初期状態では非表示
- `showModal()` で**モーダル表示**(背景が暗くなる、他の操作ブロック)
- `show()` で**通常表示**(他の操作可)
- `close()` で閉じる
- **Escキーで閉じる**もネイティブ対応

### 5-3. JSなしで閉じる方法 — `<form method="dialog">`

実は、ボタンに少し書くだけで JS なしでも閉じられます。

```html
<dialog id="myDialog">
  <form method="dialog">
    <p>このメッセージを表示しています</p>
    <button>OK</button>
  </form>
</dialog>
```

`<form method="dialog">` の中の submit ボタンを押すと、**ダイアログが自動的に閉じます**。

開くにはどうしても JS が少し要りますが(`showModal()` を呼ぶため)、これは Day 8 の JS 統合で学びます。今は `onclick` で簡略実装してOK。

### 5-4. ::backdrop で背景スタイル(予告)

`<dialog>` を `showModal()` で開くと、背景に暗いオーバーレイが出ます。これは CSS の `::backdrop` 疑似要素でスタイル変更できます。

```css
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);  /* 背景をぼかす */
}
```

これは Day 4 以降で詳しく扱います。今は「**そういうことができる**」と知っておけば OK。

### 5-5. 確認ダイアログを作ってみる

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Dialog のテスト</title>
</head>
<body>
  <h1>ダイアログのテスト</h1>
  
  <button onclick="confirmDialog.showModal()">削除する</button>
  
  <dialog id="confirmDialog">
    <h2>本当に削除しますか?</h2>
    <p>この操作は取り消せません。</p>
    
    <form method="dialog">
      <button value="cancel">キャンセル</button>
      <button value="confirm">削除する</button>
    </form>
  </dialog>
</body>
</html>
```

「削除する」ボタンを押すとモーダルが開き、「キャンセル」「削除する」のどちらを押しても閉じます。

Escキーで閉じることも、画面外をクリックしたときの挙動も(`closedby="any"` 属性を加えれば外クリックでも閉じる)、ネイティブ対応です。

### 5-6. ⚠️ よくある落とし穴

#### `<dialog>` を直接 CSS で `display:none` しない

`<dialog>` は内部的な状態(`open` 属性)で表示を制御しています。CSS で隠そうとすると挙動が壊れるので、**必ず `showModal()`/`close()` メソッド**を使ってください。

#### autofocus は閉じるボタンに

入力欄に `autofocus` を付けたいことがありますが、`<dialog>` 内の入力欄に付けると**意図しないキーボード表示**(モバイル)が出ることがあります。`autofocus` は閉じるボタンに付けるのが安全です。

---

## 6. 章末演習(20分)

### 🎯 完成形のお問い合わせフォーム + 確認ダイアログ

`day3/contact.html` として、次の要件を満たすページを作ってください。

**フォーム**:
- セマンティックHTML(Day 2の知識)で `<header>`、`<main>`、`<footer>` を使う
- `<fieldset>` で「お客様情報」と「お問い合わせ内容」を分ける
- お客様情報: 名前(必須、2文字以上)、メール(必須)、電話番号(任意)
- お問い合わせ内容: カテゴリ(select、4つの選択肢)、優先度(radio)、メッセージ(textarea、必須、10文字以上)
- 送信ボタンと、すぐ横に「キャンセル」ボタン

**確認ダイアログ**:
- 送信ボタンを押すと **送信前に**「内容に間違いありませんか?」と確認するモーダル(JSで実装は Day 8 でやるので、今日は静的に作るだけでOK)

<details>
<summary>解答例</summary>

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせ</title>
</head>
<body>
  <header>
    <h1>お問い合わせフォーム</h1>
    <p>下記フォームよりお問い合わせください。</p>
  </header>
  
  <main>
    <form>
      <fieldset>
        <legend>お客様情報</legend>
        
        <p>
          <label for="name">お名前(2文字以上)</label><br>
          <input
            type="text"
            id="name"
            name="name"
            required
            minlength="2"
          >
        </p>
        
        <p>
          <label for="email">メールアドレス</label><br>
          <input type="email" id="email" name="email" required>
        </p>
        
        <p>
          <label for="phone">電話番号(任意)</label><br>
          <input type="tel" id="phone" name="phone">
        </p>
      </fieldset>
      
      <fieldset>
        <legend>お問い合わせ内容</legend>
        
        <p>
          <label for="category">カテゴリ</label><br>
          <select id="category" name="category" required>
            <option value="">選択してください</option>
            <option value="question">ご質問</option>
            <option value="bug">不具合報告</option>
            <option value="request">機能リクエスト</option>
            <option value="other">その他</option>
          </select>
        </p>
        
        <p>
          優先度<br>
          <label><input type="radio" name="priority" value="low"> 低</label>
          <label><input type="radio" name="priority" value="middle" checked> 中</label>
          <label><input type="radio" name="priority" value="high"> 高</label>
        </p>
        
        <p>
          <label for="message">メッセージ(10文字以上)</label><br>
          <textarea
            id="message"
            name="message"
            rows="6"
            cols="50"
            required
            minlength="10"
            placeholder="お問い合わせ内容を詳しくご記入ください"
          ></textarea>
        </p>
      </fieldset>
      
      <p>
        <button type="submit" onclick="event.preventDefault(); confirmDialog.showModal();">送信</button>
        <button type="reset">クリア</button>
      </p>
    </form>
    
    <!-- 確認ダイアログ -->
    <dialog id="confirmDialog">
      <h2>送信内容の確認</h2>
      <p>入力内容に間違いはありませんか?</p>
      
      <form method="dialog">
        <button value="cancel">修正する</button>
        <button value="confirm">送信する</button>
      </form>
    </dialog>
  </main>
  
  <footer>
    <p><small>&copy; 2026 My Site</small></p>
  </footer>
</body>
</html>
```

**実行のポイント**:
1. 試しに何も入力せず「送信」を押す → ブラウザが「必須項目を入力してください」と教えてくれる
2. 全部入力して「送信」を押す → 確認ダイアログが開く(`event.preventDefault()` で実送信を止めている)
3. Escキーで閉じられる
4. ダイアログ内の「修正する」「送信する」どちらを押しても閉じる

`onclick="event.preventDefault(); confirmDialog.showModal();"` の部分だけは JavaScript ですが、これは Day 8 で本格的に扱います。今は **「HTMLだけでもこれだけできる**」を体感してください。
</details>

---

## 7. 🎉 HTML編 完了!

ここで HTML 編(Day 1〜3)が**完了**しました。

### HTML編で学んだこと

```
✅ Day 1: Webの仕組みとHTML基礎
   - HTML/CSS/JS の役割
   - 基本構造、主要タグ
   - DevTools の使い方

✅ Day 2: セマンティックHTMLと文書構造
   - <header>/<nav>/<main>/<footer> など
   - <article>/<section>/<aside> の使い分け
   - アクセシビリティの第一歩(ARIA第1原則)

✅ Day 3: フォームと入力要素 ← 今ここ
   - <input> の各種 type
   - ネイティブ validation
   - <select>/<textarea>/<datalist>
   - <fieldset>/<legend>
   - <dialog> 要素
```

これだけで、**「見た目はシンプルだが、機能が揃った」**Webページが作れます。次は CSS で**見た目を整えていく**段階。

---

## 8. 今日のまとめ

### 覚えておきたいこと

1. **`<form>`** でフォーム全体を囲む
2. **`<label for="id">`** で入力欄にラベルを必ず付ける(アクセシビリティ・操作性)
3. **`<input type="...">`** で種類を変える(`email`、`tel`、`number`、`date`、`color` など)
4. **スマホは type で最適なキーボードが出る**
5. **`required`、`minlength`、`pattern`** でネイティブ validation
6. **`<select>`** はドロップダウン、**`<datalist>`** はオートコンプリート候補
7. **`<fieldset>` + `<legend>`** で入力欄をグループ化
8. **`<button>` には必ず `type` を明示**
9. **`<dialog>`** が現代のモーダル(`showModal()` / `close()`、`<form method="dialog">`)
10. **`placeholder` をラベル代わりにしない**

### よく使う属性早見表

| 属性 | 意味 |
|---|---|
| `required` | 必須入力 |
| `minlength` / `maxlength` | 最少/最大文字数 |
| `min` / `max` | 最小/最大値(数値) |
| `step` | ステップ(数値) |
| `pattern` | 正規表現 |
| `placeholder` | ヒント文字 |
| `autocomplete` | ブラウザの自動入力(`off`、`on`、`email` など) |
| `disabled` | 入力不可 |
| `readonly` | 読み取り専用 |

---

## 明日の予告

明日から **CSS 編** に入ります!Day 4 は **CSSの基礎・セレクタ・ボックスモデル**。今まで素っ気なかったページに、ようやく**色やレイアウトが入る**段階です。

CSS 編で学ぶこと:

```
Day 4: CSS基礎・セレクタ・ボックスモデル
Day 5: Flexbox(横並び・縦並びの基本)
Day 6: Grid・レスポンシブデザイン
Day 7: 現代CSS応用・アニメーション
```

ここから「**作ってて楽しい**」フェーズに突入します ☕

---

> 🎯 **コラム: HTMLの力を再認識する**
>
> 今日学んだことの多くは、**JavaScript を一切書かずに**実現できました。
>
> - 入力チェック(`required`、`minlength`、`pattern`)
> - メール形式の自動判定(`type="email"`)
> - 日付ピッカーの表示(`type="date"`)
> - スマホで適切なキーボード(`type="tel"`、`type="email"`)
> - モーダルダイアログ(`<dialog>`)
> - 開閉できるアコーディオン(`<details>`、Day 2)
>
> 一昔前は、これらすべてに jQuery プラグインや自前のJSが必要でした。**現代の HTML は驚くほど賢くなっています**。
>
> 「**JavaScriptに頼る前に、HTMLでできることを試す**」が、現代Web開発の重要な姿勢。
>
> - 軽い: JSライブラリを読み込まない
> - 速い: ネイティブ実装
> - アクセシブル: ブラウザが自動対応
> - 壊れにくい: JSがエラーで止まっても動く
>
> 「**HTMLだけで十分**」を疑い、必要なときだけJSを書く。これが2025-2026年のWeb開発者の判断基準です。

お疲れさまでした!次の Day 4 から、ようやく**CSS で見た目を整える**世界へ進みましょう ☕
