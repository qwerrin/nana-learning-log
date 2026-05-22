# CSS変数の命名でよく使う単語まとめ

## 色（Color）

| 単語 | 意味 |
|---|---|
| `primary` | メインカラー（ブランドの中心色） |
| `secondary` | サブカラー |
| `accent` | アクセント・強調色 |
| `bg` / `background` | 背景色 |
| `fg` / `foreground` | 前景色（テキストなど） |
| `text` | 文字色 |
| `border` | 枠線の色 |
| `muted` | 控えめな色（薄いグレーなど） |
| `surface` | カードやパネルの面の色 |
| `success` | 成功（緑系） |
| `warning` | 警告（黄・オレンジ系） |
| `danger` / `error` | エラー（赤系） |
| `info` | 情報（青系） |

## 状態（State）

| 単語 | 意味 |
|---|---|
| `hover` | マウスを乗せたとき |
| `active` | クリック中・アクティブ状態 |
| `focus` | フォーカス時（キーボード操作など） |
| `disabled` | 無効化されている |
| `visited` | 訪問済みリンク |

## 段階・濃さ（Scale）

数字が大きいほど濃く、または大きくなる慣習が多いです。

| 単語 | 意味 |
|---|---|
| `50, 100, 200 ... 900` | 色の濃淡（Tailwind方式） |
| `light` / `dark` | 明るい / 暗い |
| `xs, sm, md, lg, xl` | サイズ（extra small 〜 extra large） |

## 余白・サイズ（Spacing / Size）

| 単語 | 意味 |
|---|---|
| `spacing` | 余白全般 |
| `gap` | 要素間のすきま |
| `padding` | 内側の余白 |
| `margin` | 外側の余白 |
| `radius` | 角丸の半径 |
| `width` / `height` | 幅 / 高さ |

## 文字（Typography）

| 単語 | 意味 |
|---|---|
| `font` | フォント全般 |
| `font-size` | 文字サイズ |
| `font-weight` | 太さ |
| `line-height` | 行の高さ |
| `letter-spacing` | 字間 |

## その他よく見るもの

| 単語 | 意味 |
|---|---|
| `shadow` | 影 |
| `z-index` | 重なり順 |
| `duration` | アニメーションの時間 |
| `ease` | アニメーションの緩急 |

---

## 命名の組み立て方

よくあるパターンは「**役割 - バリエーション - 状態**」の順に並べることです。

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-text-muted: #6b7280;
  --bg-surface: #ffffff;
  --spacing-md: 1rem;
  --radius-sm: 4px;
}
```

困ったら **Tailwind の命名規則** を真似すると、業界標準に近くて読みやすいです。
