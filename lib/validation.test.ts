import { describe, it, expect } from "vitest";
import { validateField } from "./validation";

describe("validateField", () => {
  describe("positive rule (ball count, ball weight)", () => {
    it("accepts positive integers", () => {
      expect(validateField("4", "positive")).toEqual({ value: 4, error: null });
    });

    it("accepts positive decimals", () => {
      expect(validateField("236.5", "positive")).toEqual({ value: 236.5, error: null });
    });

    it("rejects zero", () => {
      const result = validateField("0", "positive");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be greater than 0");
    });

    it("rejects negative numbers", () => {
      const result = validateField("-3", "positive");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be greater than 0");
    });
  });

  describe("non-negative rule (percentages)", () => {
    it("accepts zero (lean dough)", () => {
      expect(validateField("0", "non-negative")).toEqual({ value: 0, error: null });
    });

    it("accepts positive decimals", () => {
      expect(validateField("1.45", "non-negative")).toEqual({ value: 1.45, error: null });
    });

    it("rejects negative numbers", () => {
      const result = validateField("-0.5", "non-negative");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Cannot be negative");
    });
  });

  describe("non-numeric and empty input", () => {
    it("rejects empty string", () => {
      const result = validateField("", "positive");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Required");
    });

    it("rejects whitespace-only string", () => {
      const result = validateField("   ", "non-negative");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Required");
    });

    it("rejects non-numeric text", () => {
      const result = validateField("abc", "positive");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be a number");
    });

    it("rejects partial numeric garbage like '1.2.3'", () => {
      const result = validateField("1.2.3", "non-negative");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be a number");
    });

    it("rejects Infinity (not a usable quantity)", () => {
      const result = validateField("Infinity", "positive");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be a number");
    });

    it("rejects 'NaN' literal", () => {
      const result = validateField("NaN", "non-negative");
      expect(result.value).toBeNull();
      expect(result.error).toBe("Must be a number");
    });
  });

  it("trims surrounding whitespace on valid input", () => {
    expect(validateField(" 65 ", "non-negative")).toEqual({ value: 65, error: null });
  });
});
