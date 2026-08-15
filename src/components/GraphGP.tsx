import React, { useRef, useEffect } from 'react';
import { LegendrePointState } from '../types/legendre';
import { evalGP, pToX } from '../utils/mathEngine';
import { Sliders } from 'lucide-react';

interface GraphGPProps {
  state: LegendrePointState;
  onChangeX: (x: number) => void;
}

export const GraphGP: React.FC<GraphGPProps> = ({ state, onChangeX }) => {
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

    const pMin = 0;
    const pMax = 4.2;
    const gMin = 0;
    const gMax = 9;

    const toCanvasP = (val: number) => margin.left + ((val - pMin) / (pMax - pMin)) * (width - margin.left - margin.right);
    const toCanvasG = (val: number) => height - margin.bottom - ((val - gMin) / (gMax - gMin)) * (height - margin.top - margin.bottom);

    // Background & Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let pVal = 0; pVal <= 4; pVal += 1) {
      const cx = toCanvasP(pVal);
      ctx.beginPath();
      ctx.moveTo(cx, margin.top);
      ctx.lineTo(cx, height - margin.bottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pVal.toString(), cx, height - margin.bottom + 16);
    }

    for (let gVal = 0; gVal <= 8; gVal += 2) {
      const cy = toCanvasG(gVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, cy);
      ctx.lineTo(width - margin.right, cy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(gVal.toString(), margin.left - 6, cy + 4);
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    // g(p) Curve
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    let started = false;
    for (let stepP = 0.25; stepP <= 4.0; stepP += 0.02) {
      const res = evalGP(stepP);
      const cx = toCanvasP(stepP);
      const cy = toCanvasG(res.g);
      if (!started) {
        ctx.moveTo(cx, cy);
        started = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // Highlight interpolated segment 2 < p < 3 (Discontinuity gap fill)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toCanvasP(2.0), toCanvasG(3.0));
    ctx.lineTo(toCanvasP(3.0), toCanvasG(6.0));
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight current point
    const curCx = toCanvasP(state.p);
    const curCy = toCanvasG(state.gp);

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(curCx, curCy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight flat region point (p=1, g=0.5) if x in [1, 2)
    if (state.isFlatRegion) {
      ctx.fillStyle = '#eab308';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`平坦部 (1<=x<2) → p=1 で g(1)=0.5 に集約`, curCx + 10, curCy - 5);
    }

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('p = f\'(x)', width - margin.right + 15, height - margin.bottom + 4);
    ctx.fillText('g(p)', margin.left, margin.top - 12);
  }, [state]);

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickP = e.clientX - rect.left;
    const margin = { left: 45, right: 30 };
    const width = rect.width;
    const pMin = 0;
    const pMax = 4.2;

    const targetP = pMin + ((clickP - margin.left) / (width - margin.left - margin.right)) * (pMax - pMin);
    const targetX = pToX(targetP, state.x);
    onChangeX(targetX);
  };

  const handlePChange = (targetP: number) => {
    const targetX = pToX(targetP, state.x);
    onChangeX(targetX);
  };

  return (
    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-lg flex flex-col items-center space-y-3">
      {/* Header Info */}
      <div className="flex justify-between w-full mb-1 items-center px-1">
        <span className="text-sm font-bold text-amber-400">変換後関数 g(p) = xp - f(x)</span>
        <span className="text-xs text-slate-400">g({state.p.toFixed(2)}) = {state.gp.toFixed(3)}</span>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-56 cursor-pointer rounded-lg bg-slate-900"
        onMouseDown={handlePointerDown}
      />

      {/* Integrated p Slider directly below canvas */}
      <div className="w-full bg-slate-900/90 p-3 rounded-lg border border-slate-700/80 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
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
                if (!isNaN(val)) handlePChange(val);
              }}
              className="w-20 bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold text-xs px-2 py-0.5 rounded text-right focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <input
          type="range"
          min="0.25"
          max="4.2"
          step="0.01"
          value={state.p}
          onChange={(e) => handlePChange(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>0.25</span>
          <span>p=1.0 (平坦部: g=0.5)</span>
          <span>p=2.0 → 3.0 (直線補間)</span>
          <span>4.2</span>
        </div>
      </div>
    </div>
  );
};
