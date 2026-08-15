import React from 'react';
import { ViewMode } from '../types/legendre';
import { LayoutGrid, Maximize2, BookOpen } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onChangeViewMode }) => {
  return (
    <header className="bg-slate-800/90 border-b border-slate-700/80 sticky top-0 z-50 backdrop-blur-md px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/30 text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              清水明『熱力学の基礎（第2版）』サポートサイト
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">非公式</span>
            </h1>
            <p className="text-xs text-slate-400">ルジャンドル変換の幾何学的理解（長方形面積 $xp$ と 積分領域 $f(x)$ の差分）</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => onChangeViewMode('modeA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'modeA'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            モードA: 3画面同期ビュー
          </button>
          <button
            onClick={() => onChangeViewMode('modeB')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'modeB'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            モードB: シングル統合詳細
          </button>
        </div>
      </div>
    </header>
  );
};
