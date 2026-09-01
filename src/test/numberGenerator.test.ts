import { describe, expect, it } from "vitest";
import { generateNumber } from "../utils/numberGenerator";

describe("generateNumber", () => {
  it("génère correctement un numéro de facture", () => {
    const year = new Date().getFullYear();

    const result = generateNumber("FAC", 0);

    expect(result).toBe(`FAC-${year}-0001`);
  });

  it("incrémente correctement le compteur", () => {
    const year = new Date().getFullYear();

    const result = generateNumber("FAC", 12);

    expect(result).toBe(`FAC-${year}-0013`);
  });

  it("utilise correctement différents préfixes", () => {
    const year = new Date().getFullYear();

    const result = generateNumber("PRO", 5);

    expect(result).toBe(`PRO-${year}-0006`);
  });
});