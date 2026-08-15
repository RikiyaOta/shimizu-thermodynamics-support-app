import React, { useState, useMemo } from 'react';
import { ViewMode, LayerVisibility } from './types/legendre';
import { evalLegendre } from './utils/mathEngine';
import { Header } from './components/Header';
import { ModeAView } from './components/ModeAView';
import { ModeBView } from './components/ModeBView';

export const App: React.FC = () => {
  // Default x=1.5 (flat region where p=1 constant, showcase key Shimizu textbook insight)
  const [x, setX] = useState<number>(1.5);
  const [viewMode, setViewMode] = useState<ViewMode>('modeA');
  const [visibility, setVisibility] = useState<LayerVisibility>({
    showRectangle: true,
    showFxArea: true,
    showGpArea: true,
  });

  const state = useMemo(() => evalLegendre(x), [x]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header viewMode={viewMode} onChangeViewMode={setViewMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {viewMode === 'modeA' ? (
          <ModeAView
            state={state}
            x={x}
            onChangeX={setX}
            viewMode={viewMode}
            visibility={visibility}
            onChangeVisibility={setVisibility}
          />
        ) : (
          <ModeBView
            state={state}
            x={x}
            onChangeX={setX}
            viewMode={viewMode}
            visibility={visibility}
            onChangeVisibility={setVisibility}
          />
        )}
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
