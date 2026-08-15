import React from 'react';
import { LayerVisibility } from '../types/legendre';
import { Layers, Sparkles } from 'lucide-react';

interface ControlsProps {
  x: number;
  onChangeX: (x: number) => void;
  visibility: LayerVisibility;
  onChangeVisibility: (updater: (prev: LayerVisibility) => LayerVisibility) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  x,
  onChangeX,
  visibility,
  onChangeVisibility,
}) => {
  const presets = [
    { label: 'x = 0.5 (三次関数部)', value: 0.5, color: 'hover:border-sky-500 hover:text-sky-300' },
    { label: 'x = 1.5 (平坦部 p=1)', value: 1.5, color: 'hover:border-amber-500 hover:text-amber-300' },
    { label: 'x = 2.5 (直線部)', value: 2.5, color: 'hover:border-emerald-500 hover:text-emerald-300' },
    { label: 'x = 3.0 (不連続部)', value: 3.0, color: 'hover:border-rose-500 hover:text-rose-300' },
    { label: 'x = 3.5 (二次関数部)', value: 3.5, color: 'hover:border-purple-500 hover:text-purple-300' },
  ];

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 shadow-lg space-y-3">
      {/* Preset Quick Jump Buttons */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          注目ポイントプリセット
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((item) => (
            <button
              key={item.value}
              onClick={() => onChangeX(item.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all bg-slate-900/80 border border-slate-700/60 text-slate-300 ${item.color} ${
                Math.abs(x - item.value) < 0.05 ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="pt-2 border-t border-slate-700/60 space-y-2">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          重ね合わせ表示レイヤー
        </span>
        <div className="flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={visibility.showRectangle}
              onChange={() => onChangeVisibility((prev) => ({ ...prev, showRectangle: !prev.showRectangle }))}
              className="rounded accent-slate-300"
            />
            長方形 xp (枠線)
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-sky-300">
            <input
              type="checkbox"
              checked={visibility.showFxArea}
              onChange={() => onChangeVisibility((prev) => ({ ...prev, showFxArea: !prev.showFxArea }))}
              className="rounded accent-sky-500"
            />
            積分領域 f(x) (下面積)
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
            <input
              type="checkbox"
              checked={visibility.showGpArea}
              onChange={() => onChangeVisibility((prev) => ({ ...prev, showGpArea: !prev.showGpArea }))}
              className="rounded accent-amber-500"
            />
            ルジャンドル領域 g(p) (上面積)
          </label>
        </div>
      </div>
    </div>
  );
};
