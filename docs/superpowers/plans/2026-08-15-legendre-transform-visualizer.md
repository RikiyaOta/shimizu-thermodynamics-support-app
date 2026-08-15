# ルジャンドル変換ビジュアライザ 実装計画 (Legendre Transformation Visualizer Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清水明著『熱力学の基礎（第2版）』におけるルジャンドル変換の幾何学的定義（$f'(x)$ グラフにおける長方形面積と積分領域の差分 $g(p) = xp - f(x)$）を動的に体感できる、Vite + React + TypeScript + KaTeX + pnpm による静的Webアプリケーションの構築。

**Architecture:** Vite + React + TypeScript によるシングルページアプリケーション。数学計算ロジック (`mathEngine.ts`) と HTML5 Canvas 描画エンジン (`canvas.ts` / 各グラフコンポーネント) を分離し、モードA（3画面同期ビュー）とモードB（シングル統合詳細ビュー）を直感的に切り替えられるレスポンシブなダークモードUIを提供する。

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, KaTeX (`katex`), Lucide Icons (`lucide-react`), Vitest (テスト), pnpm (パッケージマネージャー)

**Spec:** [`docs/superpowers/specs/2026-08-15-legendre-transform-design.md`](file:///Users/rikiyaota/Documents/github.com/RikiyaOta/shimizu-thermodynamics-support-app/docs/superpowers/specs/2026-08-15-legendre-transform-design.md)

## Global Constraints

- **自然言語**: ユーザー向け表示テキスト、数式解説、ソースコード内コメント、ドキュメントはすべて**日本語**で統一する。変数名・関数名・クラス名・型名は一般的な英語を使用する。
- **パッケージマネージャー**: 必ず **`pnpm`** を使用する（`npm` や `yarn` は使用しない）。
- **成果物**: `pnpm build` により `dist/` ディレクトリへ静的コンテンツを出力し、サーバを必要とせずブラウザ単体で完全に動作する構成とする。

---

### Task 1: プロジェクト基盤のセットアップ (Project Scaffolding with Vite + React + TypeScript + pnpm)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Test: Build verification using `pnpm build`

**Interfaces:**
- Consumes: None
- Produces: React + TypeScript + Vite + Tailwind CSS + KaTeX 基盤環境

- [ ] **Step 1: package.json と必要依存関係の設定**

```json
{
  "name": "shimizu-thermodynamics-legendre-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "katex": "^0.16.11",
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/katex": "^0.16.7",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: pnpm install の実行**

Run: `pnpm install`
Expected: 全依存関係が `node_modules` に正常にインストールされる。

- [ ] **Step 3: Vite & TypeScript 設定ファイルの作成 (`vite.config.ts`, `tsconfig.json`, `index.html`, `src/index.css`)**

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
});
```

`index.html`:
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>清水熱力学サポート - ルジャンドル変換の視覚的理解</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
  </head>
  <body class="bg-slate-900 text-slate-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/index.css`:
```css
@import "tailwindcss";

@layer base {
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
  }
}
```

- [ ] **Step 4: ビルドテスト**

Run: `pnpm build`
Expected: `dist/` ディレクトリに静的ファイルがエラーなくビルドされる。

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vite.config.ts tsconfig.json index.html src/
git commit -m "chore: setup Vite React TypeScript Tailwind KaTeX baseline with pnpm"
```

---

### Task 2: 数学エンジンモジュールとユニットテストの構築 (`src/utils/mathEngine.ts`)

**Files:**
- Create: `src/types/legendre.ts`
- Create: `src/utils/mathEngine.ts`
- Test: `src/utils/mathEngine.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `evalLegendre(x: number): LegendrePointState` (関数 $f(x)$, $f'(x)=p$, $g(p)$ の全4区間＋不連続部の正確な評価ロジック)

- [ ] **Step 1: 型定義の作成 (`src/types/legendre.ts`)**

```typescript
export interface LegendrePointState {
  x: number;
  fx: number;
  p: number; // f'(x)
  gp: number; // xp - f(x)
  domainIndex: 1 | 2 | 3 | 4;
  domainName: string;
  isFlatRegion: boolean; // x in [1, 2)
  isDiscontinuityPoint: boolean; // x = 3
  descriptionJa: string;
}

export type ViewMode = 'modeA' | 'modeB';

export interface LayerVisibility {
  showRectangle: boolean;
  showFxArea: boolean;
  showGpArea: boolean;
}
```

- [ ] **Step 2: 失敗するユニットテストの作成 (`src/utils/mathEngine.test.ts`)**

```typescript
import { describe, it, expect } from 'vitest';
import { evalLegendre } from './mathEngine';

describe('mathEngine - evalLegendre', () => {
  it('区間1 (0 < x < 1): x=0.5 のとき f(x)=0.15625, p=0.4375, g(p)=0.0625', () => {
    const res = evalLegendre(0.5);
    expect(res.domainIndex).toBe(1);
    expect(res.fx).toBeCloseTo(0.15625);
    expect(res.p).toBeCloseTo(0.4375);
    expect(res.gp).toBeCloseTo(0.0625);
  });

  it('区間2 (1 <= x < 2): x=1.5 のとき f(x)=1.0, p=1.0, g(1.0)=0.5 (平坦部)', () => {
    const res = evalLegendre(1.5);
    expect(res.domainIndex).toBe(2);
    expect(res.isFlatRegion).toBe(true);
    expect(res.p).toBe(1.0);
    expect(res.gp).toBe(0.5);
  });

  it('区間3 (2 <= x < 3): x=2.5 のとき f(x)=2.125, p=1.5, g(1.5)=1.625', () => {
    const res = evalLegendre(2.5);
    expect(res.domainIndex).toBe(3);
    expect(res.p).toBe(1.5);
    expect(res.fx).toBe(2.125);
    expect(res.gp).toBe(1.625);
  });

  it('区間4 (3 <= x): x=3.5 のとき f(x)=4.625, p=3.5, g(3.5)=7.625', () => {
    const res = evalLegendre(3.5);
    expect(res.domainIndex).toBe(4);
    expect(res.p).toBe(3.5);
    expect(res.fx).toBe(4.625);
    expect(res.gp).toBe(7.625);
  });
});
```

- [ ] **Step 3: テスト実行（失敗を確認）**

Run: `pnpm test`
Expected: `mathEngine` 未定義のため FAIL。

- [ ] **Step 4: 数学エンジン最小実装 (`src/utils/mathEngine.ts`)**

```typescript
import { LegendrePointState } from '../types/legendre';

export function evalLegendre(x: number): LegendrePointState {
  const clampX = Math.max(0.01, Math.min(x, 4.5));
  let fx = 0;
  let p = 0;
  let domainIndex: 1 | 2 | 3 | 4 = 1;
  let domainName = '';
  let descriptionJa = '';
  let isFlatRegion = false;
  let isDiscontinuityPoint = false;

  if (clampX < 1) {
    domainIndex = 1;
    domainName = '区間1 (0 < x < 1): 三次関数領域';
    fx = (Math.pow(clampX, 3) + clampX) / 4;
    p = (3 * Math.pow(clampX, 2) + 1) / 4;
    descriptionJa = '滑らかな凸関数領域。f\'(x) は 0.25 から 1 へ増加します。';
  } else if (clampX < 2) {
    domainIndex = 2;
    domainName = '区間2 (1 <= x < 2): 平坦領域';
    fx = clampX - 0.5;
    p = 1.0;
    isFlatRegion = true;
    descriptionJa = 'f\'(x) = 1 で一定の平坦領域。xが動いても p=1 のまま g(1) = 0.5 の一点に対応します。';
  } else if (clampX < 3) {
    domainIndex = 3;
    domainName = '区間3 (2 <= x < 3): 一次導関数領域';
    fx = (Math.pow(clampX, 2) / 2) - clampX + 1.5;
    p = clampX - 1;
    descriptionJa = 'f\'(x) は 1 から 2 へ線形増加します。';
  } else {
    domainIndex = 4;
    domainName = '区間4 (3 <= x): 二次関数領域';
    fx = (Math.pow(clampX, 2) / 2) - 1.5;
    p = clampX;
    if (Math.abs(clampX - 3.0) < 0.05) {
      isDiscontinuityPoint = true;
    }
    descriptionJa = 'x=3 で f\'(x) が 2 から 3 へ飛び移る跳躍不連続が存在します。';
  }

  const gp = clampX * p - fx;

  return {
    x: clampX,
    fx,
    p,
    gp,
    domainIndex,
    domainName,
    isFlatRegion,
    isDiscontinuityPoint,
    descriptionJa,
  };
}
```

- [ ] **Step 5: テスト再実行（パスを確認）**

Run: `pnpm test`
Expected: PASS (4 tests passed).

- [ ] **Step 6: Commit**

```bash
git add src/types/legendre.ts src/utils/mathEngine.ts src/utils/mathEngine.test.ts
git commit -m "feat: implement mathematical evaluation engine for Legendre transformation"
```

---

### Task 3: Canvas 描画コンポーネント群の実装 (`src/components/GraphFX.tsx`, `GraphFPrime.tsx`, `GraphGP.tsx`)

**Files:**
- Create: `src/components/GraphFX.tsx`
- Create: `src/components/GraphFPrime.tsx`
- Create: `src/components/GraphGP.tsx`

**Interfaces:**
- Consumes: `LegendrePointState`, `LayerVisibility` from Task 2
- Produces: 60fps キャンバスグラフ描画コンポーネント（マウス drag による $x$ 操作コールバック付）

- [ ] **Step 1: GraphFX (f(x) vs x) の実装**

`f(x)` 曲線、接線、現在点 $(x, f(x))$、区間境界線をダークテーマで描画する Canvas コンポーネント。

- [ ] **Step 2: GraphFPrime (f'(x) vs x 【メイン幾何学表示】) の実装**

清水テキストの核となる図像を描画：
- 導関数 $f'(x)$ ピースワイズ波形（$x \in [1,2]$ の平坦線段および $x=3$ の垂直点線ジャンプ描画）
- 長方形 $x \times p$ （枠線 `#cbd5e1`）
- 積分領域 $f(x)$ （シアン `rgba(56, 189, 248, 0.25)` 塗りつぶし）
- ルジャンドル変換領域 $g(p)$ （オレンジ `rgba(249, 115, 22, 0.3)` 塗りつぶし）
- マウスドラッグで $x$ を変更可能にするイベントハンドラー

- [ ] **Step 3: GraphGP (g(p) vs p) の実装**

$g(p)$ 曲線と現在点 $(p, g(p))$ の軌跡、および $p \in (2,3)$ の跳躍接続線（直線補間段）を描画。

- [ ] **Step 4: Commit**

```bash
git add src/components/GraphFX.tsx src/components/GraphFPrime.tsx src/components/GraphGP.tsx
git commit -m "feat: create high-DPI canvas graph components for f(x), f'(x), and g(p)"
```

---

### Task 4: UI コントロール & KaTeX 数式ステップ解説パネルの実装 (`src/components/Controls.tsx`, `MathFormula.tsx`, `Header.tsx`)

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Controls.tsx`
- Create: `src/components/MathFormula.tsx`

**Interfaces:**
- Consumes: `LegendrePointState`, `ViewMode`, `LayerVisibility`
- Produces: ヘッダーナビゲーション、操作スライダー＆プリセット群、KaTeXリアルタイム数式解説カード

- [ ] **Step 1: Header.tsx の実装**
  - アプリタイトル「清水明『熱力学の基礎（第2版）』サポートサイト - ルジャンドル変換の視覚的理解」
  - モードA / モードB 切替トグルボタン

- [ ] **Step 2: Controls.tsx の実装**
  - $x$ スライダー ($0.05 \sim 4.5$)
  - 数値直接入力フォーム
  - プリセットボタン群 (`x = 0.5`, `x = 1.5`, `x = 2.5`, `x = 3.0`, `x = 3.5`)
  - モードB用レイヤートグルチェックボックス (`長方形 xp`, `積分領域 f(x)`, `差分領域 g(p)`)

- [ ] **Step 3: MathFormula.tsx の実装**
  - KaTeX による数式レンダリング (`katex.renderToString`)
  - 現在の $x, f(x), p, g(p)$ の数値計算過程をステップごとに日本語で分かりやすく表示。
  - 清水テキストの公式 $g(p) = xp - f(x)$ の幾何学的意味を強調。

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Controls.tsx src/components/MathFormula.tsx
git commit -m "feat: implement header navigation, slider controls, presets, and KaTeX math explanation panel"
```

---

### Task 5: 統合レイアウトビューの構築 (`src/components/ModeAView.tsx`, `ModeBView.tsx`, `src/App.tsx`)

**Files:**
- Create: `src/components/ModeAView.tsx`
- Create: `src/components/ModeBView.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Task 3 & 4 の全コンポーネント
- Produces: 完全統合されたレスポンシブ Web アプリケーション

- [ ] **Step 1: ModeAView.tsx (3画面同期レイアウト) の構築**
  - 画面上部/左側に3つの同期グラフ（$f(x)$, $f'(x)$ メイン, $g(p)$）を配置
  - 右側/下部に操作スライダーとKaTeX数式解説カードを配置

- [ ] **Step 2: ModeBView.tsx (シングル統合大画面レイアウト) の構築**
  - 中央に大画面の $f'(x)$ 幾何学キャンバスを配置
  - 描画レイヤー表示切替（長方形, $f(x)$, $g(p)$）を直感的に操作可能
  - コンパクトな $g(p)$ ポイント追跡表示とステップ解説を併設

- [ ] **Step 3: App.tsx での状態管理とビュー統合**
  - $x$ の状態管理 (`useState(1.5)`)
  - 表示モード管理 (`useState<'modeA' | 'modeB'>('modeA')`)
  - レイヤー表示状態管理

- [ ] **Step 4: 手動・視覚的検証と調整**
  - スライダーやマウスクリックで $x$ を動かし、3つのグラフと数式解説がスムーズに連動することを確認。
  - $x=1.5$ (平坦領域) で $p=1$ のまま $g(1)=0.5$ となる様子を確認。
  - $x=3.0$ (不連続領域) での挙動を確認。

- [ ] **Step 5: Commit**

```bash
git add src/components/ModeAView.tsx src/components/ModeBView.tsx src/App.tsx
git commit -m "feat: assemble Mode A (3-chart synced) and Mode B (single focal) integrated layouts in App"
```

---

### Task 6: ビルド検証と最終チェック (Production Build & Static Asset Verification)

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: すべてのソースコード
- Produces: `dist/` 静的サイトバンドル

- [ ] **Step 1: 全テストの実行**

Run: `pnpm test`
Expected: 全ユニットテストが合格すること。

- [ ] **Step 2: 生産ビルドの実行**

Run: `pnpm build`
Expected: `dist/` ディレクトリにエラーなしでビルド生成される。

- [ ] **Step 3: プロダクションプレビューでの動作確認**

Run: `pnpm preview`
Expected: ローカルWebサーバで `dist/` の動作が正しく確認できること。

- [ ] **Step 4: README.md の日本語更新**

プロジェクトの概要、使い方、ビルド手順（`pnpm install`, `pnpm dev`, `pnpm build`）、清水明『熱力学の基礎（第2版）』におけるルジャンドル変換の数学的背景の説明を追加。

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: update README with usage instructions, build guide, and mathematical background in Japanese"
```
