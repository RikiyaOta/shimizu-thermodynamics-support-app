export interface LegendrePointState {
  x: number;
  fx: number;
  p: number; // f'(x)
  gp: number; // xp - f(x)
  domainIndex: 1 | 2 | 3 | 4;
  domainName: string;
  isFlatRegion: boolean; // x in [1, 2)
  isDiscontinuityPoint: boolean; // x = 3
  descriptionJa: string;
}
