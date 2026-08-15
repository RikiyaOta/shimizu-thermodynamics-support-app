import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton = false }) => {
  return (
    <header className="bg-slate-800/90 border-b border-slate-700/80 sticky top-0 z-50 backdrop-blur-md px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:border-sky-500/50 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              コンテンツ一覧
            </Link>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/30 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                清水明『熱力学の基礎（第2版）』サポートサイト
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">非公式</span>
              </h1>
              <p className="text-xs text-slate-400">熱力学の概念をインタラクティブ＆グラフィカルに視覚化</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
