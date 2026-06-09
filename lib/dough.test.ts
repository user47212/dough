import { describe, it, expect } from "vitest";
import { calcDough } from "./dough";

describe("calcDough", () => {
  it("house recipe: 4 balls × 236 g", () => {
    const result = calcDough(4, 236, {
      hydration: 65,
      salt: 2,
      yeast: 0.9,
      sugar: 1.45,
      oil: 2.2,
    });
    expect(result.flour).toBe(550);
    expect(result.water).toBe(358);
    expect(result.salt).toBe(11);
    expect(result.yeast).toBe(5);
    expect(result.sugar).toBe(8);
    expect(result.oil).toBe(12);
  });

  it("is a pure function: same inputs return same outputs", () => {
    const a = calcDough(2, 250, { hydration: 60, salt: 2, yeast: 1, sugar: 1, oil: 2 });
    const b = calcDough(2, 250, { hydration: 60, salt: 2, yeast: 1, sugar: 1, oil: 2 });
    expect(a).toEqual(b);
  });

  it("scales linearly with ball count", () => {
    const pct = { hydration: 65, salt: 2, yeast: 0.9, sugar: 1.45, oil: 2.2 };
    const one = calcDough(1, 236, pct);
    const four = calcDough(4, 236, pct);
    expect(four.flour).toBeCloseTo(one.flour * 4, -1);
  });

  it("flour is the 100% base: total equals sum of all weights", () => {
    const result = calcDough(4, 236, {
      hydration: 65,
      salt: 2,
      yeast: 0.9,
      sugar: 1.45,
      oil: 2.2,
    });
    const sum = result.flour + result.water + result.salt + result.yeast + result.sugar + result.oil;
    const total = 4 * 236;
    expect(Math.abs(sum - total)).toBeLessThanOrEqual(6);
  });
});
