import React, { useRef, useEffect } from 'react';
import { LegendrePointState } from '../types/legendre';
import { evalGP } from '../utils/mathEngine';
import { Sliders } from 'lucide-react';

interface GraphGPrimeProps {
  state: LegendrePointState;
  onChangeP: (p: number) => void;
  heightClass?: string;
}

export const GraphGPrime: React.FC<GraphGPrimeProps> = ({
  state,
  onChangeP,
  heightClass = 'h-72',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const margin = { top: 30, right: 30, bottom: 40, left: 45 };

    const availableW = width - margin.left - margin.right;
    const availableH = height - margin.top - margin.bottom;
    const side = Math.min(availableW, availableH);

    const plotLeft = margin.left + (availableW - side) / 2;
    const plotTop = margin.top + (availableH - side) / 2;

    const pMin = 0;
    const pMax = 4.5;
    const xMin = 0;
    const xMax = 4.5;

    const toCanvasP = (val: number) => plotLeft + ((val - pMin) / (pMax - pMin)) * side;
    const toCanvasX = (val: number) => plotTop + side - ((val - xMin) / (xMax - xMin)) * side;

    // Background & Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let pVal = 0; pVal <= 4; pVal += 1) {
      const cx = toCanvasP(pVal);
      ctx.beginPath();
      ctx.moveTo(cx, plotTop);
      ctx.lineTo(cx, plotTop + side);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pVal.toString(), cx, plotTop + side + 16);
    }

    for (let xVal = 0; xVal <= 4; xVal += 1) {
      const cy = toCanvasX(xVal);
      ctx.beginPath();
      ctx.moveTo(plotLeft, cy);
      ctx.lineTo(plotLeft + side, cy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(xVal.toString(), plotLeft - 6, cy + 4);
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plotLeft, plotTop + side);
    ctx.lineTo(plotLeft + side, plotTop + side);
    ctx.moveTo(plotLeft, plotTop);
    ctx.lineTo(plotLeft, plotTop + side);
    ctx.stroke();

    // Domain dividers
    [1, 2, 3].forEach((divP) => {
      const cx = toCanvasP(divP);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(cx, plotTop);
      ctx.lineTo(cx, plotTop + side);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Helper: compute g'(p) = x for any stepP in [0.25, 4.2]
    const getPointForP = (stepP: number) => {
      if (stepP >= 2.0 && stepP <= 3.0) {
        return { p: stepP, x: 3.0 };
      }
      const res = evalGP(stepP);
      return { p: stepP, x: res.x ?? 0 };
    };

    // 1. Shaded Area: Integral g(p) (Orange) UNDER g'(p) curve
    ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.beginPath();
    ctx.moveTo(toCanvasP(0), toCanvasX(0));
    for (let stepP = 0.25; stepP <= state.p; stepP += 0.02) {
      const pt = getPointForP(stepP);
      ctx.lineTo(toCanvasP(pt.p), toCanvasX(pt.x));
    }
    ctx.lineTo(toCanvasP(state.p), toCanvasX(state.x));
    ctx.lineTo(toCanvasP(state.p), toCanvasX(0));
    ctx.closePath();
    ctx.fill();

    // 2. Shaded Area: Integral f(x) (Cyan) ABOVE g'(p) curve within rectangle
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.moveTo(toCanvasP(0), toCanvasX(0));
    ctx.lineTo(toCanvasP(0), toCanvasX(state.x));
    ctx.lineTo(toCanvasP(state.p), toCanvasX(state.x));

    for (let stepP = state.p; stepP >= 0.25; stepP -= 0.02) {
      const pt = getPointForP(stepP);
      ctx.lineTo(toCanvasP(pt.p), toCanvasX(pt.x));
    }
    ctx.closePath();
    ctx.fill();

    // 3. Rectangle px Outline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(
      toCanvasP(0),
      toCanvasX(state.x),
      toCanvasP(state.p) - toCanvasP(0),
      toCanvasX(0) - toCanvasX(state.x)
    );
    ctx.setLineDash([]);

    // 4. Piece 1: 0.25 <= p < 1.0 (Curve)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let stepP = 0.25; stepP <= 1.0; stepP += 0.02) {
      const res = evalGP(stepP);
      if (res.x !== null) {
        const cx = toCanvasP(stepP);
        const cy = toCanvasX(res.x);
        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
    }
    ctx.stroke();

    // 5. Piece 2: p = 1.0 (Dotted Vertical Line Segment x: 1.0 -> 2.0)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toCanvasP(1.0), toCanvasX(1.0));
    ctx.lineTo(toCanvasP(1.0), toCanvasX(2.0));
    ctx.stroke();
    ctx.setLineDash([]);

    // 6. Piece 3: 1.0 < p < 2.0 (Linear segment x = p + 1)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toCanvasP(1.0), toCanvasX(2.0));
    ctx.lineTo(toCanvasP(2.0), toCanvasX(3.0));
    // 7. Piece 4: 2.0 <= p <= 3.0 (Solid Horizontal Segment x = 3.0)
    ctx.lineTo(toCanvasP(3.0), toCanvasX(3.0));
    // 8. Piece 5: p >= 3.0 (Linear segment x = p)
    for (let stepP = 3.0; stepP <= 4.2; stepP += 0.02) {
      ctx.lineTo(toCanvasP(stepP), toCanvasX(stepP));
    }
    ctx.stroke();

    // Highlight current point (p, x)
    const curCx = toCanvasP(state.p);
    const curCy = toCanvasX(state.x);

    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(curCx, curCy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight annotations
    if (state.isFlatRegion) {
      ctx.fillStyle = '#eab308';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`p=1 で x=1→2 へ不連続跳躍 (微分非存在)`, curCx + 10, curCy);
    } else if (state.p >= 2.0 && state.p <= 3.0 && Math.abs(state.x - 3.0) < 0.05) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`x=3.0 固定 (2<=p<=3) 連続な水平微分線段`, curCx + 10, curCy - 5);
    }

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('p = f\'(x)', plotLeft + side + 15, plotTop + side + 4);
    ctx.fillText('g\'(p) = x', plotLeft, plotTop - 12);
  }, [state]);

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickP = e.clientX - rect.left;
    const margin = { top: 30, right: 30, bottom: 40, left: 45 };

    const availableW = rect.width - margin.left - margin.right;
    const availableH = rect.height - margin.top - margin.bottom;
    const side = Math.min(availableW, availableH);
    const plotLeft = margin.left + (availableW - side) / 2;

    const pMin = 0;
    const pMax = 4.5;

    const targetP = pMin + ((clickP - plotLeft) / side) * (pMax - pMin);
    if (targetP >= 0.25 && targetP <= 4.2) {
      onChangeP(targetP);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-lg flex flex-col items-center space-y-3">
      {/* Header Info */}
      <div className="flex justify-between w-full mb-1 items-center px-1">
        <span className="text-sm font-bold text-teal-400">【双対幾何】 変換導関数 g'(p) = x (軸が逆転)</span>
        <div className="flex gap-3 text-xs font-mono">
          <span className="text-amber-400">g(p)下面積: {state.gp.toFixed(3)}</span>
          <span className="text-sky-300">f(x)上面積: {state.fx.toFixed(3)}</span>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full ${heightClass} cursor-pointer rounded-lg bg-slate-900`}
        onMouseDown={handlePointerDown}
      />

      {/* Integrated p Slider directly below canvas */}
      <div className="w-full bg-slate-900/90 p-3 rounded-lg border border-slate-700/80 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            変換後の変数 p = f'(x) を変更:
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono">p =</span>
            <input
              type="number"
              min="0.25"
              max="4.2"
              step="0.01"
              value={state.p.toFixed(2)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onChangeP(val);
              }}
              className="w-20 bg-slate-800 border border-slate-700 text-teal-300 font-mono font-bold text-xs px-2 py-0.5 rounded text-right focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <input
          type="range"
          min="0.25"
          max="4.2"
          step="0.01"
          value={state.p}
          onChange={(e) => onChangeP(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>0.25</span>
          <span>p=1.0 (x: 1→2 跳躍点線)</span>
          <span className="text-amber-300 font-bold">2.0 ≤ p ≤ 3.0 (x=3.0固定 連続実線)</span>
          <span>4.2</span>
        </div>
      </div>
    </div>
  );
};
