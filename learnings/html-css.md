# HTML/CSS の学び

> HTML/CSS に関する学びの蓄積。  
> 週次ログから「重要だ」と思った内容を転記して整理。

最終更新:2026/05/23

---

## 📚 学んだ概念・キーワード

### セマンティックHTML
- 説明:`<div>` ではなく `<header>` `<main>` `<footer>` などの「意味のあるタグ」を使うこと
- 使い所:ページ構造を作るとき。SEO・アクセシビリティ・後のCSS指定が楽になる
- 参考リンク:(後で記入)

### `<article>` vs `<section>` vs `<div>` の使い分け

| 判断基準 | タグ |
|---|---|
| 取り出しても単独で意味が通じる（記事・カードなど） | `<article>` |
| 見出しとセットで主題のグループを作る | `<section>` |
| CSSのためだけに箱を作りたい | `<div>` |

- 迷ったら「取り出せるか？」→ Yes → `<article>`、「見出しが付くか？」→ Yes → `<section>`、それ以外 → `<div>`

### `<details>` / `<summary>` — JSなしのアコーディオン

```html
<details>
  <summary>クリックで開く</summary>
  <p>中身</p>
</details>
```

- `<details>` だけでブラウザが開閉を制御。JavaScriptは不要
- FAQページに最適

### `<time>` — 日付の機械可読化

```html
<time datetime="2026-05-23">2026年5月23日</time>
```

- `datetime` 属性にISO形式（YYYY-MM-DD）を書く
- 表示テキストと `datetime` の日付は必ず一致させる

### WAI-ARIA 第1原則

> 「No ARIA is better than bad ARIA（悪いARIAより、ARIA無しの方がマシ）」

- ネイティブHTMLタグを使えばアクセシビリティは自動で確保される
- `<button>` を使えばキーボード操作・読み上げ・フォーカス管理がすべて自動

### フォームの基本構造

```html
<form>
  <label for="name">お名前</label>
  <input type="text" id="name" name="name" required>
  <button type="submit">送信</button>
</form>
```

- `<label>` は必ず付ける（アクセシビリティ・クリック範囲のため）
- `<button>` には必ず `type` を明示（デフォルトは `submit` なので意図せず送信されることがある）

### `<input type="...">` の使い分け

| type | 用途 | スマホでの違い |
|---|---|---|
| `text` | 普通のテキスト | 普通のキーボード |
| `email` | メールアドレス | `@` キーが出る |
| `tel` | 電話番号 | 数字キーパッド |
| `password` | パスワード | 伏字になる |
| `number` | 数値 | 数字キーパッド |
| `date` | 日付 | カレンダーUIが出る |
| `radio` | 1択選択 | — |
| `checkbox` | 複数選択 | — |

### ネイティブバリデーション属性

| 属性 | 対象 | 意味 |
|---|---|---|
| `required` | 全般 | 必須入力 |
| `minlength` / `maxlength` | テキスト系 | 最少/最大文字数 |
| `min` / `max` | number・date系 | 最小/最大値 |
| `pattern` | テキスト系 | 正規表現でチェック |

### `<fieldset>` / `<legend>` — 入力欄のグループ化

```html
<fieldset>
  <legend>お客様情報</legend>
  <label for="name">お名前</label>
  <input type="text" id="name" name="name">
</fieldset>
```

- ラジオボタンのグループには特に有効
- 読み上げソフトが「お客様情報グループ、お名前…」と読んでくれる

### `<dialog>` — モダンなモーダル

```html
<dialog id="myDialog">
  <form method="dialog">
    <p>確認メッセージ</p>
    <button>OK</button>
  </form>
</dialog>

<button onclick="myDialog.showModal()">開く</button>
```

- `showModal()` でモーダル表示、`close()` で閉じる
- `<form method="dialog">` の送信ボタンを押すと自動で閉じる
- Escキーでも閉じる（ネイティブ対応）

### `alt` 属性
- 説明:画像の代替テキスト。視覚障害者向け読み上げや、画像表示失敗時に使われる
- 使い所:`<img>` を使う全ての場面。装飾画像なら `alt=""`(空)でOK
- ポイント:**省略はNG、空でも書く**

---

## 💻 よく使うパターン・スニペット

### パターン1:HTML の基本テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ページタイトル</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- ここに内容 -->
</body>
</html>
```

**ポイント**:
- `<!DOCTYPE html>` は最初に必ず書く
- `lang="ja"` で日本語ページと宣言
- `meta viewport` はスマホ対応の必須おまじない

---

## 😅 ハマりやすいポイント

### 落とし穴1:`min` と `minlength` を混同する
- 症状:`<input type="text">` に `min="2"` を書いても文字数制限が効かない
- 原因:`min` は `type="number"` や `type="date"` 用の属性。テキスト系には効かない
- 解決:テキストの文字数制限は `minlength="2"` を使う

### 落とし穴2:ラジオボタン・チェックボックスに `value` を書き忘れる
- 症状:どれを選んでも送信される値が `"on"` になる
- 原因:`value` 属性を省略している
- 解決:`value="male"` のように必ず書く

### 落とし穴3:同じ `id` を複数の要素に使う
- 症状:バリデーションやJSが意図通りに動かない
- 原因:`id` はページ内で一意でないといけないルール
- 解決:ラジオ/チェックボックスを `<label>` で囲む書き方なら `id` 自体不要

### 落とし穴4:`event.preventDefault()` でネイティブバリデーションが止まる
- 症状:`required` を付けていても空のまま送信できてしまう
- 原因:`event.preventDefault()` はフォーム送信ごとキャンセルするため、バリデーションも動かない
- 解決:JS で `form.checkValidity()` → `form.reportValidity()` を使う（Day 8で学ぶ）

### 落とし穴5:見出しの階層を飛ばす
- 症状:`<h1>` の次にいきなり `<h3>` を使ってしまう
- 原因:見た目で大きさを選んでしまう
- 解決:見た目は CSS で調整。タグは意味で選ぶ(`h1` → `h2` → `h3` 順)

---

## 🔗 参考にした記事・動画

- (後で記入)

---

## 🤔 まだわかっていないこと

- CSS の Flexbox・Grid の使い分け
- レスポンシブデザインの実装方法
- `form.checkValidity()` / `form.reportValidity()` の使い方（Day 8）
- `<dialog>` の `::backdrop` でオーバーレイをスタイリングする方法（Day 4以降）
