import React from 'react';
import { LegendrePointState, LayerVisibility, ViewMode } from '../types/legendre';
import { GraphFX } from './GraphFX';
import { GraphFPrime } from './GraphFPrime';
import { GraphGP } from './GraphGP';
import { Controls } from './Controls';
import { MathFormula } from './MathFormula';

interface ModeAViewProps {
  state: LegendrePointState;
  x: number;
  onChangeX: (x: number) => void;
  viewMode: ViewMode;
  visibility: LayerVisibility;
  onChangeVisibility: (updater: (prev: LayerVisibility) => LayerVisibility) => void;
}

export const ModeAView: React.FC<ModeAViewProps> = ({
  state,
  x,
  onChangeX,
  viewMode,
  visibility,
  onChangeVisibility,
}) => {
  return (
    <div className="space-y-6">
      {/* 3-Chart Synced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GraphFX state={state} onChangeX={onChangeX} />
        <GraphFPrime state={state} visibility={visibility} onChangeX={onChangeX} heightClass="h-56" />
        <GraphGP state={state} onChangeX={onChangeX} />
      </div>

      {/* Controls & Math Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Controls
          x={x}
          onChangeX={onChangeX}
          viewMode={viewMode}
          visibility={visibility}
          onChangeVisibility={onChangeVisibility}
        />
        <MathFormula state={state} />
      </div>
    </div>
  );
};
