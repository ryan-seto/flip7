import type { CardColors } from "../types/game";

export const NUMBER_CARDS: Record<number, number> = {};
for (let i = 0; i <= 12; i++) NUMBER_CARDS[i] = i === 0 ? 1 : i;

export const MODIFIERS = ["+2", "+4", "+6", "+8", "+10", "X2"] as const;

export const ACTION_NAMES = ["Freeze", "Flip3", "2ndChance"] as const;

export const MAX_PLAYERS = 6;

export const CARD_DISPLAY_NAMES: Record<string, string> = {
  Flip3: "Flip 3",
  "2ndChance": "2nd Chance",
};

export const CARD_COLORS: Record<string, CardColors> = {
  number: { bg: "#FFF8ED", border: "#C94040", text: "#C94040" },
  modifier: { bg: "#FDF3E0", border: "#3B5DAA", text: "#3B5DAA" },
  action: { bg: "#FFF8ED", border: "#D4943A", text: "#D4943A" },
};

// Per-value colors matching the real Flip 7 card designs
const NUMBER_CARD_COLORS: Record<number, CardColors> = {
  0:  { bg: "#F5F0E8", border: "#8B8178", text: "#8B8178" },
  1:  { bg: "#FFF0ED", border: "#C94040", text: "#C94040" },
  2:  { bg: "#F0F5E0", border: "#6B8E3A", text: "#6B8E3A" },
  3:  { bg: "#FFFBE8", border: "#C9A820", text: "#C9A820" },
  4:  { bg: "#E8F5F3", border: "#1A7A6D", text: "#1A7A6D" },
  5:  { bg: "#F3E8F8", border: "#7B4DA0", text: "#7B4DA0" },
  6:  { bg: "#FDE8F0", border: "#C9407A", text: "#C9407A" },
  7:  { bg: "#FFF0ED", border: "#B83030", text: "#B83030" },
  8:  { bg: "#E8EEF8", border: "#3B5DAA", text: "#3B5DAA" },
  9:  { bg: "#FFF3E0", border: "#D4803A", text: "#D4803A" },
  10: { bg: "#E8F5E8", border: "#3A8B4A", text: "#3A8B4A" },
  11: { bg: "#E8ECF8", border: "#4A4DA0", text: "#4A4DA0" },
  12: { bg: "#F5EDE0", border: "#8B6B3A", text: "#8B6B3A" },
};

const ACTION_CARD_COLORS: Record<string, CardColors> = {
  Freeze:    { bg: "#E0EEF8", border: "#3B7DC4", text: "#3B7DC4" },
  Flip3:     { bg: "#FFF8D0", border: "#C9A820", text: "#C9A820" },
  "2ndChance": { bg: "#FFF0ED", border: "#C94040", text: "#C94040" },
};

export function getCardColors(type: string, value: number | string): CardColors {
  if (type === "number" && typeof value === "number") {
    return NUMBER_CARD_COLORS[value] ?? CARD_COLORS.number;
  }
  if (type === "action" && typeof value === "string") {
    return ACTION_CARD_COLORS[value] ?? CARD_COLORS.action;
  }
  return CARD_COLORS[type] ?? CARD_COLORS.number;
}
