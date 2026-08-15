# Task 1 Brief: Project Scaffolding with Vite + React + TypeScript + pnpm

## Requirements
Set up the Vite + React + TypeScript project with `pnpm` package manager in the root workspace `/Users/rikiyaota/Documents/github.com/RikiyaOta/shimizu-thermodynamics-support-app`.

### Files to Create/Configure:
1. `package.json`:
   - Name: `shimizu-thermodynamics-legendre-app`
   - Dependencies: `react`, `react-dom`, `katex`, `lucide-react`
   - DevDependencies: `vite`, `typescript`, `@types/react`, `@types/react-dom`, `@types/katex`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `vitest`
   - Scripts: `"dev": "vite"`, `"build": "tsc && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`
2. `vite.config.ts`: Configured with React plugin and Tailwind plugin, `base: './'`.
3. `tsconfig.json`: React JSX setting, ESNext module, strict type checking.
4. `index.html`: Japanese language (`lang="ja"`), title `清水熱力学サポート - ルジャンドル変換の視覚的理解`, KaTeX CSS stylesheet link (`https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css`), entry script `/src/main.tsx`.
5. `src/index.css`: `@import "tailwindcss";` and font stack.
6. `src/main.tsx`: React 18 `createRoot` rendering `App` component into `#root`.
7. `src/App.tsx`: Initial baseline App placeholder in Japanese.

### Execution Steps:
- Create the configuration files and `src/` entry files.
- Run `pnpm install`.
- Run `pnpm build` and verify that `dist/` is successfully produced without TypeScript or Vite errors.
- Create git commit for Task 1.

### Global Constraints:
- Natural Language: All user-facing text, comments, and titles must be in Japanese.
- Package Manager: MUST use `pnpm`.
- Output: Static build in `dist/`.
