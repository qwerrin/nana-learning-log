# TypeScript 第5章 のノート

> 教材: typescript-ch05.md
> 学習日: 2026/05/29

---

## 質問・解説ログ

### 2026/05/29 — `map` + 三項演算子 + スプレッドのパターン

**質問**: このパターンを細かく解説してほしい

```typescript
const updatedTodos = todos.map((t) =>
  t.priority === "high" ? { ...t, done: true } : t
);
```

**分解**

**① `map` の役割**

```typescript
todos.map((t) => /* tに何かする */)
```

全要素を1個ずつ処理して**新しい配列**を作る。元の `todos` は変わらない。

**② 三項演算子**

```typescript
t.priority === "high" ? { ...t, done: true } : t
//      条件           ?   trueのとき        : falseのとき
```

`high` のときだけ変更オブジェクトを返す。それ以外は `t` をそのまま返す（触らない）。

**③ スプレッドで「一部だけ変えたコピー」**

```typescript
{ ...t, done: true }
// tの全プロパティをコピーして、doneだけ true に上書き
```

具体例:

```typescript
t = { id: 2, title: "TypeScriptを勉強する", done: false, priority: "high" }
// ↓
{ id: 2, title: "TypeScriptを勉強する", done: true, priority: "high" }
//                                            ^^^^ ここだけ変わる
```

**全体の流れ**

```
{ id: 1, priority: "low"    } → そのまま t
{ id: 2, priority: "high"   } → { ...t, done: true }  ← 変更
{ id: 3, priority: "medium" } → そのまま t
{ id: 4, priority: "low"    } → そのまま t
{ id: 5, priority: "high"   } → { ...t, done: true }  ← 変更
```

**なぜこのパターンが重要か**

Reactの状態更新がまさにこの形:

```typescript
setTodos(todos.map(t =>
  t.id === targetId ? { ...t, done: true } : t
));
```

「特定の要素だけ変えた新しい配列を作る」= Reactが再レンダリングを検知する仕組みと相性がいい。

---

## あとで戻ってきたい疑問

-
