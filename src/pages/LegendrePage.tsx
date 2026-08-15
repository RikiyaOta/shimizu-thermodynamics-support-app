import React, { useState, useMemo } from 'react';
import { evalLegendre, pToX } from '../utils/mathEngine';
import { Header } from '../components/Header';
import { GraphFPrime } from '../components/GraphFPrime';
import { GraphGPrime } from '../components/GraphGPrime';
import { GraphGP } from '../components/GraphGP';
import { MathFormula } from '../components/MathFormula';
import { FunctionDefinition } from '../components/FunctionDefinition';

export const LegendrePage: React.FC = () => {
  // Default x=1.5 (flat region where p=1 constant, showcase key Shimizu textbook insight)
  const [x, setX] = useState<number>(1.5);
  const [overrideP, setOverrideP] = useState<number | undefined>(undefined);

  const state = useMemo(() => evalLegendre(x, overrideP), [x, overrideP]);

  const handleXChange = (newX: number) => {
    setX(newX);
    setOverrideP(undefined);
  };

  const handlePChange = (targetP: number) => {
    const clampP = Math.max(0.25, Math.min(targetP, 4.2));
    if (clampP >= 2.0 && clampP <= 3.0) {
      setX(3.0);
      setOverrideP(clampP);
    } else {
      setX(pToX(clampP, x));
      setOverrideP(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header showBackButton={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 3 Stacked Diagrams Column (Left: f'(x) -> g'(p) -> g(p)) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. f'(x) vs x */}
            <GraphFPrime
              state={state}
              onChangeX={handleXChange}
              heightClass="h-80"
            />

            {/* 2. g'(p) = x vs p (Axis Swapped Dual Graph) */}
            <GraphGPrime state={state} onChangeP={handlePChange} />

            {/* 3. g(p) vs p */}
            <GraphGP state={state} onChangeP={handlePChange} />
          </div>

          {/* Math Breakdown & Function Definition Column (Right) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <MathFormula state={state} />
            <FunctionDefinition state={state} />
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
