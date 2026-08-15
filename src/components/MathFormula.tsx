import React from 'react';
import { LegendrePointState } from '../types/legendre';
import katex from 'katex';
import { Calculator, Info, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface MathFormulaProps {
  state: LegendrePointState;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ state }) => {
  const renderMath = (latex: string) => {
    try {
      return { __html: katex.renderToString(latex, { throwOnError: false }) };
    } catch {
      return { __html: latex };
    }
  };

  const rectArea = state.x * state.p;

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-lg space-y-4">
      {/* Title & Domain Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <span className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
          <Calculator className="w-4 h-4" />
          数式と数値の対応・解説
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
          {state.domainName}
        </span>
      </div>

      {/* Primary Geometric Formulas */}
      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/50 space-y-3 text-center">
        <div
          className="text-base text-slate-100"
          dangerouslySetInnerHTML={renderMath('g(p) = x \\cdot p - f(x)')}
        />
        <div
          className="text-sm text-teal-400 font-bold border-t border-slate-800 pt-2"
          dangerouslySetInnerHTML={renderMath('g\'(p) = \\frac{dg}{dp} = x')}
        />
        <p className="text-xs text-slate-400">
          ルジャンドル変換の微分は元の変数 <span className="text-teal-300 font-mono">x</span> に一致します！
          そのため、中央の <span className="text-teal-400 font-mono font-bold">g'(p)</span> グラフは、上段の <span className="text-emerald-400 font-mono font-bold">f'(x)</span> グラフの縦軸と横軸を入れ替えた裏返し（双対）のグラフになります。
        </p>
      </div>

      {/* Numerical Step-by-Step Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40">
          <span className="text-slate-400 block mb-1">長方形全体 (xp)</span>
          <span className="font-mono text-slate-200 text-sm font-bold">{rectArea.toFixed(3)}</span>
          <span className="text-[10px] text-slate-500 block">{state.x.toFixed(2)} × {state.p.toFixed(2)}</span>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-sky-500/30">
          <span className="text-sky-400 block mb-1">積分領域 f(x) (下面積)</span>
          <span className="font-mono text-sky-300 text-sm font-bold">{state.fx.toFixed(3)}</span>
          <span className="text-[10px] text-slate-500 block">∫ f'(x') dx'</span>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-amber-500/30">
          <span className="text-amber-400 block mb-1">差分領域 g(p) (上面積)</span>
          <span className="font-mono text-amber-300 text-sm font-bold">{state.gp.toFixed(3)}</span>
          <span className="text-[10px] text-slate-500 block">{rectArea.toFixed(3)} - {state.fx.toFixed(3)}</span>
        </div>
      </div>

      {/* Dual Property Highlight Box */}
      <div className="bg-teal-500/10 border border-teal-500/30 p-2.5 rounded-lg text-xs space-y-1">
        <span className="font-bold text-teal-300 flex items-center gap-1">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          熱力学の双対性 (Dual Nature)
        </span>
        <p className="text-slate-300 text-[11px]">
          • <span className="text-amber-300 font-bold">f'(x) で平坦</span> だった部分 ($x \in [1,2], p=1$) $\implies$ <span className="text-amber-300 font-bold">g'(p) では垂直線</span> ($p=1, x:1 \to 2$)
        </p>
        <p className="text-slate-300 text-[11px]">
          • <span className="text-rose-300 font-bold">f'(x) でジャンプ</span> だった部分 ($x=3, p:2 \to 3$) $\implies$ <span className="text-rose-300 font-bold">g'(p) では水平線</span> ($x=3, p:2 \to 3$)
        </p>
      </div>

      {/* Shimizu Textbook Insight Commentary Card */}
      <div className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1 ${
        state.isFlatRegion
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
          : state.isDiscontinuityPoint
          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
          : 'bg-slate-900/80 border-slate-700/60 text-slate-300'
      }`}>
        <div className="flex items-center gap-1.5 font-bold mb-1">
          {state.isFlatRegion ? (
            <Info className="w-4 h-4 text-amber-400" />
          ) : state.isDiscontinuityPoint ? (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          ) : (
            <Info className="w-4 h-4 text-sky-400" />
          )}
          <span>教科書（清水明『熱力学の基礎』）の解説ポイント</span>
        </div>
        <p>{state.descriptionJa}</p>
        {state.isFlatRegion && (
          <p className="text-[11px] text-amber-300/90 font-medium">
            ★ x が 1.0 から 2.0 に動いても、傾き p = f'(x) は 1.0 のままです。このとき長方形面積 xp と f(x) が同時に増えますが、その差額 g(p) は常に 0.5 の一定値になります。
          </p>
        )}
      </div>
    </div>
  );
};
