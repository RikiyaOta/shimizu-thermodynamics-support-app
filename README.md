# 清水明『熱力学の基礎（第2版）』非公式学習サポートポータル

清水明 著『熱力学の基礎（第2版）』（東京大学出版会）の学習を補助・深化させるための、Webブラウザ上で完結するインタラクティブな非公式学習サポート Web アプリケーションポータルです。

- **公開 URL**: https://shimizu-thermodynamics-unofficial-support-site.rikiyaota.kyoto

---

## 概要と特徴

- **インタラクティブな視覚的理解**: 本書の厳密な熱力学の論理体系や幾何学的・物理的直感を、ブラウザ上でパラメータを動かしながら直感的に確認できます。
- **100% ブラウザ完結 (Pure Client-Side Static SPA)**: サーバーとの通信を必要とせず、すべての数値計算・グラフィックス描画・数式表示がクライアント環境で即座に動作します。
- **ポータル構造**: トップページから各学習コンテンツへシームレスにアクセス可能な構成となっています。

---

## 技術スタック

- **フロントエンド**: React 19, TypeScript, Tailwind CSS, React Router DOM (`HashRouter`)
- **数式・グラフィック**: KaTeX (ローカルバンドル), Lucide React, HTML5 Canvas 2D API
- **ビルド & 開発ツール**: Vite 8, Vitest, `pnpm` (セキュリティポリシー適用), `mise`
- **インフラ & CI/CD**: Cloudflare Pages, Terraform IaC, GitHub Actions

---

## 開発・ビルド手順

### 1. 依存関係のインストール
```bash
mise exec -- pnpm install
```

### 2. 開発サーバーの起動
```bash
mise exec -- pnpm dev
```

### 3. テストの実行
```bash
mise exec -- pnpm test
```

### 4. プロダクションビルド
```bash
mise exec -- pnpm build
```
ビルド成果物は `dist/` ディレクトリに生成されます。

### 5. ローカルプレビュー
```bash
mise exec -- pnpm preview
```

---

## 免責事項

本Webアプリケーションは個人によって制作された**非公式の学習支援ツール**であり、著者（清水明先生）および出版社（東京大学出版会）とは直接の関係はありません。
