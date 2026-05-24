## よく使うパターン

### Grid の基本セット

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3列均等 */
  gap: 16px;
}
```

### カードグリッド(現代CSSの定石)

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

→ 画面幅に応じて列数が自動で変わる。**メディアクエリ不要**。
   最小幅(250px)は内容に合わせて調整(カード系は 200〜300px が多い)。

### サイドバー付きレイアウト

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 250px;  /* メイン伸縮 + サイドバー固定 */
  gap: 16px;
}
```

### ページ全体のレイアウト(grid-template-areas)

```css
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  min-height: 100vh;
}

.header { grid-area: header; }
.main   { grid-area: main; }
.footer { grid-area: footer; }
```

→ 領域名で「どこに置くか」を指定。レイアウト変更が楽。

### モバイルファーストのメディアクエリ

```css
/* デフォルト = モバイル */
.layout { ... }

/* 768px 以上で上書き */
@media (min-width: 48rem) {
  .layout { ... }
}
```

→ ブレイクポイントは `rem` で書く(ユーザーのフォント設定に追従)。
   48rem = 768px(タブレット)、64rem = 1024px(デスクトップ)。

### clamp() で可変フォント・余白

```css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

.section {
  padding: clamp(1rem, 5vw, 3rem);
}
```

→ `clamp(最小, 推奨, 最大)`。メディアクエリなしで滑らかに変化。
   真ん中の vw は感覚で決める(大見出し 4〜6vw、本文 1.5〜2.5vw あたり)。

---

## 判断の早見表

| 迷ったとき | 答え |
|---|---|
| 横一列 or 縦一列の整列 | **Flex** |
| 行 × 列の2次元 | **Grid** |
| カードを画面幅に応じて折り返したい | `repeat(auto-fit, minmax(...))` |
| ページ全体のレイアウト | `grid-template-areas` |
| 列の幅を「比率」で指定したい | `fr` |
| 列の幅を「固定 + 余り」にしたい | `200px 1fr` |
| 画面サイズでスタイル変えたい(大きな変化) | メディアクエリ |
| 画面サイズで滑らかに変えたい(数値) | `clamp()` |
