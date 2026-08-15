import { describe, it, expect } from 'vitest';
import { evalLegendre, evalGP, pToX } from './mathEngine';

describe('mathEngine - evalLegendre', () => {
  it('区間1 (0 < x < 1): x=0.5 のとき f(x)=0.15625, p=0.4375, g(p)=0.0625', () => {
    const res = evalLegendre(0.5);
    expect(res.domainIndex).toBe(1);
    expect(res.fx).toBeCloseTo(0.15625);
    expect(res.p).toBeCloseTo(0.4375);
    expect(res.gp).toBeCloseTo(0.0625);
  });

  it('区間2 (1 <= x < 2): x=1.5 のとき f(x)=1.0, p=1.0, g(1.0)=0.5 (平坦部)', () => {
    const res = evalLegendre(1.5);
    expect(res.domainIndex).toBe(2);
    expect(res.isFlatRegion).toBe(true);
    expect(res.p).toBe(1.0);
    expect(res.gp).toBe(0.5);
  });

  it('区間3 (2 <= x < 3): x=2.5 のとき f(x)=2.125, p=1.5, g(1.5)=1.625', () => {
    const res = evalLegendre(2.5);
    expect(res.domainIndex).toBe(3);
    expect(res.p).toBe(1.5);
    expect(res.fx).toBe(2.125);
    expect(res.gp).toBe(1.625);
  });

  it('区間4 (3 <= x): x=3.5 のとき f(x)=4.625, p=3.5, g(3.5)=7.625', () => {
    const res = evalLegendre(3.5);
    expect(res.domainIndex).toBe(4);
    expect(res.p).toBe(3.5);
    expect(res.fx).toBe(4.625);
    expect(res.gp).toBe(7.625);
  });

  it('evalGP: 2 < p < 3 のギャップで直線補間 g(p) = 3p - 3 を評価する', () => {
    const res25 = evalGP(2.5);
    expect(res25.isInterpolated).toBe(true);
    expect(res25.g).toBeCloseTo(4.5);
    expect(res25.x).toBe(3.0);
  });
});

describe('mathEngine - pToX (逆写像 p -> x)', () => {
  it('p=0.4375 (区間1) => x=0.5', () => {
    const x = pToX(0.4375);
    expect(x).toBeCloseTo(0.5);
  });

  it('p=1.0 (平坦部) => currentX が [1, 2) にあれば保持する', () => {
    expect(pToX(1.0, 1.8)).toBe(1.8);
    expect(pToX(1.0, 0.5)).toBe(1.5);
  });

  it('p=1.5 (区間3) => x=2.5', () => {
    expect(pToX(1.5)).toBeCloseTo(2.5);
  });

  it('2 < p < 3 (ギャップ部) => x は 3.0 に固定される', () => {
    expect(pToX(2.5)).toBe(3.0);
  });

  it('p=3.5 (区間4) => x=3.5', () => {
    expect(pToX(3.5)).toBe(3.5);
  });
});
