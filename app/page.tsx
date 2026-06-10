"use client";

import { useState } from "react";
import { calcDough } from "../lib/dough";
import { validateField, type FieldRule } from "../lib/validation";

type FieldKey =
  | "ballCount"
  | "ballWeight"
  | "hydration"
  | "salt"
  | "yeast"
  | "sugar"
  | "oil";

interface FieldConfig {
  key: FieldKey;
  label: string;
  rule: FieldRule;
}

const FIELDS: FieldConfig[] = [
  { key: "ballCount", label: "Ball count", rule: "positive" },
  { key: "ballWeight", label: "Ball weight (g)", rule: "positive" },
  { key: "hydration", label: "Hydration (%)", rule: "non-negative" },
  { key: "salt", label: "Salt (%)", rule: "non-negative" },
  { key: "yeast", label: "Yeast (%)", rule: "non-negative" },
  { key: "sugar", label: "Sugar (%)", rule: "non-negative" },
  { key: "oil", label: "Oil (%)", rule: "non-negative" },
];

// House recipe defaults: 4 balls × 236 g.
const HOUSE_RECIPE: Record<FieldKey, string> = {
  ballCount: "4",
  ballWeight: "236",
  hydration: "65",
  salt: "2",
  yeast: "0.9",
  sugar: "1.45",
  oil: "2.2",
};

const OUTPUT_KEYS = ["flour", "water", "salt", "yeast", "sugar", "oil"] as const;

export default function Home() {
  const [inputs, setInputs] = useState<Record<FieldKey, string>>(HOUSE_RECIPE);

  const validation = Object.fromEntries(
    FIELDS.map((f) => [f.key, validateField(inputs[f.key], f.rule)])
  ) as Record<FieldKey, ReturnType<typeof validateField>>;

  const allValid = FIELDS.every((f) => validation[f.key].error === null);

  // calcDough is the single source of math; only called with fully valid input.
  const weights = allValid
    ? calcDough(validation.ballCount.value!, validation.ballWeight.value!, {
        hydration: validation.hydration.value!,
        salt: validation.salt.value!,
        yeast: validation.yeast.value!,
        sugar: validation.sugar.value!,
        oil: validation.oil.value!,
      })
    : null;

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Dough calculator</h1>

      <section aria-label="Recipe inputs">
        {FIELDS.map(({ key, label }) => {
          const { error } = validation[key];
          return (
            <div key={key} style={{ marginBottom: "0.75rem" }}>
              <label htmlFor={key} style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>
                {label}
              </label>
              <input
                id={key}
                type="number"
                inputMode="decimal"
                value={inputs[key]}
                onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                aria-invalid={error !== null}
                aria-describedby={error ? `${key}-error` : undefined}
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  boxSizing: "border-box",
                  border: error ? "2px solid #c0392b" : "1px solid #999",
                  borderRadius: 4,
                }}
              />
              {error && (
                <p id={`${key}-error`} role="alert" style={{ color: "#c0392b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section aria-label="Ingredient weights" style={{ marginTop: "1.5rem" }}>
        <h2>Ingredients</h2>
        {!allValid && (
          <p style={{ color: "#555" }}>Fix the highlighted inputs to see ingredient weights.</p>
        )}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {OUTPUT_KEYS.map((key) => (
              <tr key={key} style={{ borderBottom: "1px solid #ddd" }}>
                <th scope="row" style={{ textAlign: "left", padding: "0.4rem 0", textTransform: "capitalize", fontWeight: 600 }}>
                  {key}
                </th>
                <td data-testid={`out-${key}`} style={{ textAlign: "right", padding: "0.4rem 0" }}>
                  {weights ? `${weights[key]} g` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
