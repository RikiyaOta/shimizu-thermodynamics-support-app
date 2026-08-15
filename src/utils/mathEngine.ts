import { LegendrePointState } from '../types/legendre';

/**
 * 清水明『熱力学の基礎（第2版）』に出てくるルジャンドル変換用ピースワイズ関数 f(x) と f'(x), g(p) の評価関数
 * 
 * 区間1 (0 < x < 1): f(x) = (x^3 + x)/4, f'(x) = (3x^2 + 1)/4
 * 区間2 (1 <= x < 2): f(x) = x - 0.5, f'(x) = 1 (平坦領域: p=1 一定, g(1) = 0.5)
 * 区間3 (2 <= x < 3): f(x) = x^2/2 - x + 1.5, f'(x) = x - 1
 * 区間4 (3 <= x): f(x) = x^2/2 - 1.5, f'(x) = x (x=3 で f'(x) が 2 から 3 へ飛び移る)
 */
export function evalLegendre(x: number): LegendrePointState {
  const clampX = Math.max(0.01, Math.min(x, 4.5));
  let fx = 0;
  let p = 0;
  let domainIndex: 1 | 2 | 3 | 4 = 1;
  let domainName = '';
  let descriptionJa = '';
  let isFlatRegion = false;
  let isDiscontinuityPoint = false;

  if (clampX < 1) {
    domainIndex = 1;
    domainName = '区間1 (0 < x < 1): 三次関数領域';
    fx = (Math.pow(clampX, 3) + clampX) / 4;
    p = (3 * Math.pow(clampX, 2) + 1) / 4;
    descriptionJa = '滑らかな凸関数領域。f\'(x) は 0.25 から 1.0 へ単調増加します。';
  } else if (clampX < 2) {
    domainIndex = 2;
    domainName = '区間2 (1 <= x < 2): 平坦領域 (微分一定)';
    fx = clampX - 0.5;
    p = 1.0;
    isFlatRegion = true;
    descriptionJa = 'f\'(x) = 1 で一定の平坦領域。xが変化しても p=1 のままであり、ルジャンドル変換 g(1) = 0.5 という単一の点に対応します。';
  } else if (clampX < 3) {
    domainIndex = 3;
    domainName = '区間3 (2 <= x < 3): 一次導関数領域';
    fx = (Math.pow(clampX, 2) / 2) - clampX + 1.5;
    p = clampX - 1;
    descriptionJa = 'f\'(x) は 1.0 から 2.0 へ直線的に増加します。';
  } else {
    domainIndex = 4;
    domainName = '区間4 (3 <= x): 二次関数領域 (不連続ジャンプ)';
    fx = (Math.pow(clampX, 2) / 2) - 1.5;
    p = clampX;
    if (Math.abs(clampX - 3.0) < 0.05) {
      isDiscontinuityPoint = true;
    }
    descriptionJa = 'x=3 で f\'(x) が 2 から 3 へ飛び移る跳躍不連続が存在します。p ∈ (2, 3) では g(p) は直線 3p - 3 で接続されます。';
  }

  const gp = clampX * p - fx;

  return {
    x: clampX,
    fx,
    p,
    gp,
    domainIndex,
    domainName,
    isFlatRegion,
    isDiscontinuityPoint,
    descriptionJa,
  };
}

/**
 * g(p) 変換後の曲線を描画・取得するための補助関数
 * p に対応する g(p) を返す（不連続部 2 < p < 3 の直線補間を含む）
 */
export function evalGP(p: number): { g: number; x: number | null; isInterpolated: boolean } {
  if (p < 0.25) {
    return { g: 0, x: 0, isInterpolated: false };
  } else if (p < 1.0) {
    // Domain 1: p = (3x^2 + 1)/4 => x = sqrt((4p - 1)/3)
    const x = Math.sqrt((4 * p - 1) / 3);
    const fx = (Math.pow(x, 3) + x) / 4;
    return { g: x * p - fx, x, isInterpolated: false };
  } else if (Math.abs(p - 1.0) < 0.001) {
    // Domain 2: p = 1.0 => g(1.0) = 0.5
    return { g: 0.5, x: 1.5, isInterpolated: false };
  } else if (p < 2.0) {
    // Domain 3: p = x - 1 => x = p + 1
    const x = p + 1;
    const fx = (Math.pow(x, 2) / 2) - x + 1.5;
    return { g: x * p - fx, x, isInterpolated: false };
  } else if (p <= 3.0) {
    // Discontinuity gap 2 < p < 3: x = 3 is fixed, g(p) = 3p - 3
    return { g: 3 * p - 3, x: 3.0, isInterpolated: true };
  } else {
    // Domain 4: p = x => x = p
    const x = p;
    const fx = (Math.pow(x, 2) / 2) - 1.5;
    return { g: x * p - fx, x, isInterpolated: false };
  }
}
