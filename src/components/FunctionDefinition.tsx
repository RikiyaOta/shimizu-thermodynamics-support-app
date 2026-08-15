import React from 'react';
import { LegendrePointState } from '../types/legendre';
import katex from 'katex';
import { BookMarked } from 'lucide-react';

interface FunctionDefinitionProps {
  state: LegendrePointState;
}

export const FunctionDefinition: React.FC<FunctionDefinitionProps> = ({ state }) => {
  const renderMath = (latex: string) => {
    try {
      return { __html: katex.renderToString(latex, { throwOnError: false }) };
    } catch {
      return { __html: latex };
    }
  };

  const domainRows = [
    { index: 1, latex: 'f(x) = \\frac{x^3 + x}{4}', condition: '0 < x < 1' },
    { index: 2, latex: 'f(x) = x - \\frac{1}{2}', condition: '1 \\le x < 2' },
    { index: 3, latex: 'f(x) = \\frac{x^2}{2} - x + \\frac{3}{2}', condition: '2 \\le x < 3' },
    { index: 4, latex: 'f(x) = \\frac{x^2}{2} - \\frac{3}{2}', condition: '3 \\le x' },
  ];

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 text-base font-bold text-sky-400">
        <BookMarked className="w-5 h-5" />
        関数 f(x) の定義
      </div>

      {/* Piecewise Formula Rows with Active Highlighting */}
      <div className="space-y-2.5">
        {domainRows.map((row) => {
          const isActive = state.domainIndex === row.index;
          return (
            <div
              key={row.index}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isActive
                  ? 'bg-sky-500/15 border-sky-500 text-sky-200 shadow-md ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-700/40 text-slate-400 opacity-75'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    isActive ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  区間 {row.index}
                </span>
                <div
                  className={`text-sm font-mono ${isActive ? 'text-slate-100 font-bold' : 'text-slate-300'}`}
                  dangerouslySetInnerHTML={renderMath(row.latex)}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono self-end sm:self-auto">
                <span
                  className={isActive ? 'text-amber-300 font-bold' : 'text-slate-400'}
                  dangerouslySetInnerHTML={renderMath(`(${row.condition})`)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
