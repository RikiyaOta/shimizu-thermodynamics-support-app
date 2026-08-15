import React, { useRef, useEffect } from 'react';
import { LegendrePointState, LayerVisibility } from '../types/legendre';
import { evalLegendre } from '../utils/mathEngine';

interface GraphFPrimeProps {
  state: LegendrePointState;
  visibility?: LayerVisibility;
  onChangeX: (x: number) => void;
  heightClass?: string;
}

export const GraphFPrime: React.FC<GraphFPrimeProps> = ({
  state,
  visibility = { showRectangle: true, showFxArea: true, showGpArea: true },
  onChangeX,
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

    const xMin = 0;
    const xMax = 4.2;
    const pMin = 0;
    const pMax = 4.5;

    const toCanvasX = (val: number) => margin.left + ((val - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
    const toCanvasY = (val: number) => height - margin.bottom - ((val - pMin) / (pMax - pMin)) * (height - margin.top - margin.bottom);

    // Background & Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let xVal = 0; xVal <= 4; xVal += 1) {
      const cx = toCanvasX(xVal);
      ctx.beginPath();
      ctx.moveTo(cx, margin.top);
      ctx.lineTo(cx, height - margin.bottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(xVal.toString(), cx, height - margin.bottom + 16);
    }

    for (let pVal = 0; pVal <= 4; pVal += 1) {
      const cy = toCanvasY(pVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, cy);
      ctx.lineTo(width - margin.right, cy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(pVal.toString(), margin.left - 6, cy + 4);
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

    // Domain dividers
    [1, 2, 3].forEach((divX) => {
      const cx = toCanvasX(divX);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(cx, margin.top);
      ctx.lineTo(cx, height - margin.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 1. Shaded Area: Integral f(x) (Cyan) under f'(x)
    if (visibility.showFxArea) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), toCanvasY(0));
      for (let stepX = 0.01; stepX <= state.x; stepX += 0.02) {
        const res = evalLegendre(stepX);
        ctx.lineTo(toCanvasX(stepX), toCanvasY(res.p));
      }
      ctx.lineTo(toCanvasX(state.x), toCanvasY(state.p));
      ctx.lineTo(toCanvasX(state.x), toCanvasY(0));
      ctx.closePath();
      ctx.fill();
    }

    // 2. Shaded Area: Legendre g(p) (Orange) above f'(x) within rectangle
    if (visibility.showGpArea) {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), toCanvasY(0));
      ctx.lineTo(toCanvasX(0), toCanvasY(state.p));
      ctx.lineTo(toCanvasX(state.x), toCanvasY(state.p));

      // Polygon contour following f'(x) back to origin
      for (let stepX = state.x; stepX >= 0.01; stepX -= 0.02) {
        const res = evalLegendre(stepX);
        ctx.lineTo(toCanvasX(stepX), toCanvasY(res.p));
      }
      ctx.closePath();
      ctx.fill();
    }

    // 3. Rectangle xp Outline
    if (visibility.showRectangle) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(
        toCanvasX(0),
        toCanvasY(state.p),
        toCanvasX(state.x) - toCanvasX(0),
        toCanvasY(0) - toCanvasY(state.p)
      );
      ctx.setLineDash([]);
    }

    // Derivative Curve f'(x)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;

    // Piece 1: 0 < x < 1
    ctx.beginPath();
    for (let stepX = 0.01; stepX < 1.0; stepX += 0.02) {
      const res = evalLegendre(stepX);
      if (stepX === 0.01) ctx.moveTo(toCanvasX(stepX), toCanvasY(res.p));
      else ctx.lineTo(toCanvasX(stepX), toCanvasY(res.p));
    }
    ctx.lineTo(toCanvasX(1.0), toCanvasY(1.0));
    ctx.stroke();

    // Piece 2: 1 <= x < 2 (Flat region p=1)
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.moveTo(toCanvasX(1.0), toCanvasY(1.0));
    ctx.lineTo(toCanvasX(2.0), toCanvasY(1.0));
    ctx.stroke();

    // Piece 3: 2 <= x < 3
    ctx.beginPath();
    for (let stepX = 2.0; stepX < 3.0; stepX += 0.02) {
      const res = evalLegendre(stepX);
      if (stepX === 2.0) ctx.moveTo(toCanvasX(stepX), toCanvasY(res.p));
      else ctx.lineTo(toCanvasX(stepX), toCanvasY(res.p));
    }
    ctx.lineTo(toCanvasX(3.0), toCanvasY(2.0));
    ctx.stroke();

    // Discontinuity vertical line at x = 3 from p=2 to p=3
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(3.0), toCanvasY(2.0));
    ctx.lineTo(toCanvasX(3.0), toCanvasY(3.0));
    ctx.stroke();
    ctx.setLineDash([]);

    // Piece 4: x >= 3
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.moveTo(toCanvasX(3.0), toCanvasY(3.0));
    for (let stepX = 3.0; stepX <= 4.0; stepX += 0.02) {
      const res = evalLegendre(stepX);
      ctx.lineTo(toCanvasX(stepX), toCanvasY(res.p));
    }
    ctx.stroke();

    // Current point on f'(x)
    const curCx = toCanvasX(state.x);
    const curCy = toCanvasY(state.p);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(curCx, curCy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - margin.right + 15, height - margin.bottom + 4);
    ctx.fillText("f'(x) = p", margin.left, margin.top - 12);
  }, [state, visibility]);

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const margin = { left: 45, right: 30 };
    const width = rect.width;
    const xMin = 0;
    const xMax = 4.2;

    const targetX = xMin + ((clickX - margin.left) / (width - margin.left - margin.right)) * (xMax - xMin);
    if (targetX >= 0.05 && targetX <= 4.2) {
      onChangeX(targetX);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-lg flex flex-col items-center w-full">
      <div className="flex justify-between w-full mb-1 items-center px-1">
        <span className="text-sm font-bold text-emerald-400">【幾何学定義】 導関数 f'(x) と 面積分割</span>
        <div className="flex gap-3 text-xs">
          <span className="text-sky-300">f(x)面積 = {state.fx.toFixed(3)}</span>
          <span className="text-amber-400">g(p)面積 = {state.gp.toFixed(3)}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className={`w-full ${heightClass} cursor-pointer rounded-lg bg-slate-900`}
        onMouseDown={handlePointerDown}
      />
    </div>
  );
};
