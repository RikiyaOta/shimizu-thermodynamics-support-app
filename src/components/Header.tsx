import React from 'react';
import { BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/90 border-b border-slate-700/80 sticky top-0 z-50 backdrop-blur-md px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
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
      </div>
    </header>
  );
};
