export interface DoughPercentages {
  hydration: number;
  salt: number;
  yeast: number;
  sugar: number;
  oil: number;
}

export interface DoughWeights {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  sugar: number;
  oil: number;
}

export function calcDough(
  ballCount: number,
  ballWeight: number,
  percentages: DoughPercentages
): DoughWeights {
  const total = ballCount * ballWeight;
  const { hydration, salt, yeast, sugar, oil } = percentages;
  const sumPct = 100 + hydration + salt + yeast + sugar + oil;
  const flour = total / (sumPct / 100);
  return {
    flour: Math.round(flour),
    water: Math.round((hydration / 100) * flour),
    salt: Math.round((salt / 100) * flour),
    yeast: Math.round((yeast / 100) * flour),
    sugar: Math.round((sugar / 100) * flour),
    oil: Math.round((oil / 100) * flour),
  };
}
