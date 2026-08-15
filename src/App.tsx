import React, { useState, useMemo } from 'react';
import { LayerVisibility } from './types/legendre';
import { evalLegendre } from './utils/mathEngine';
import { Header } from './components/Header';
import { GraphFPrime } from './components/GraphFPrime';
import { GraphGP } from './components/GraphGP';
import { MathFormula } from './components/MathFormula';

export const App: React.FC = () => {
  // Default x=1.5 (flat region where p=1 constant, showcase key Shimizu textbook insight)
  const [x, setX] = useState<number>(1.5);
  const [visibility, setVisibility] = useState<LayerVisibility>({
    showRectangle: true,
    showFxArea: true,
    showGpArea: true,
  });

  const state = useMemo(() => evalLegendre(x), [x]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Focal Diagram Column (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <GraphFPrime
              state={state}
              visibility={visibility}
              onChangeVisibility={setVisibility}
              onChangeX={setX}
              heightClass="h-96"
            />
            <GraphGP state={state} onChangeX={setX} />
          </div>

          {/* Math Breakdown & Textbook Commentary Column (Right) */}
          <div className="lg:col-span-5 space-y-4">
            <MathFormula state={state} />
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 text-slate-500 text-xs py-4 px-4 text-center space-y-1">
        <p>
          清水明『熱力学の基礎（第2版）』非公式学習サポート Web アプリケーション
        </p>
        <p className="text-slate-600">
          幾何学的ルジャンドル変換ビジュアライザ • Pure Client-Side Static Web App (Vite + React + TS)
        </p>
      </footer>
    </div>
  );
};

export default App;
