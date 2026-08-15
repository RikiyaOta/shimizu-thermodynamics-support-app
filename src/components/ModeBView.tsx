import React from 'react';
import { LegendrePointState, LayerVisibility, ViewMode } from '../types/legendre';
import { GraphFPrime } from './GraphFPrime';
import { GraphGP } from './GraphGP';
import { Controls } from './Controls';
import { MathFormula } from './MathFormula';

interface ModeBViewProps {
  state: LegendrePointState;
  x: number;
  onChangeX: (x: number) => void;
  viewMode: ViewMode;
  visibility: LayerVisibility;
  onChangeVisibility: (updater: (prev: LayerVisibility) => LayerVisibility) => void;
}

export const ModeBView: React.FC<ModeBViewProps> = ({
  state,
  x,
  onChangeX,
  viewMode,
  visibility,
  onChangeVisibility,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Focal Large Diagram (Left Column) */}
      <div className="lg:col-span-7 space-y-4">
        <GraphFPrime
          state={state}
          visibility={visibility}
          onChangeX={onChangeX}
          heightClass="h-96"
        />
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <GraphGP state={state} onChangeX={onChangeX} />
        </div>
      </div>

      {/* Controls & Math Panel (Right Column) */}
      <div className="lg:col-span-5 space-y-4">
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
