import React, { useRef, useEffect } from 'react';
import { LegendrePointState } from '../types/legendre';
import { evalLegendre } from '../utils/mathEngine';

interface GraphFXProps {
  state: LegendrePointState;
  onChangeX: (x: number) => void;
}

export const GraphFX: React.FC<GraphFXProps> = ({ state, onChangeX }) => {
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
    const yMin = 0;
    const yMax = 8;

    const toCanvasX = (val: number) => margin.left + ((val - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
    const toCanvasY = (val: number) => height - margin.bottom - ((val - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);

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

    for (let yVal = 0; yVal <= 8; yVal += 2) {
      const cy = toCanvasY(yVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, cy);
      ctx.lineTo(width - margin.right, cy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toString(), margin.left - 6, cy + 4);
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

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - margin.right + 15, height - margin.bottom + 4);
    ctx.fillText('f(x)', margin.left, margin.top - 12);

    // Curve f(x)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let stepX = 0.01; stepX <= 4.0; stepX += 0.02) {
      const res = evalLegendre(stepX);
      const cx = toCanvasX(res.x);
      const cy = toCanvasY(res.fx);
      if (!started) {
        ctx.moveTo(cx, cy);
        started = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // Tangent Line at current x
    const curCx = toCanvasX(state.x);
    const curCy = toCanvasY(state.fx);

    const tangentLength = 1.2;
    const x1 = Math.max(0, state.x - tangentLength);
    const x2 = Math.min(4.2, state.x + tangentLength);
    const y1 = state.fx + state.p * (x1 - state.x);
    const y2 = state.fx + state.p * (x2 - state.x);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
    ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight current point
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(curCx, curCy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [state]);

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
    <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-lg flex flex-col items-center">
      <div className="flex justify-between w-full mb-1 items-center px-1">
        <span className="text-sm font-semibold text-sky-400">元関数 f(x) と接線</span>
        <span className="text-xs text-slate-400">f({state.x.toFixed(2)}) = {state.fx.toFixed(3)}</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-56 cursor-pointer rounded-lg bg-slate-900"
        onMouseDown={handlePointerDown}
      />
    </div>
  );
};
