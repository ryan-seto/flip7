import type { Card } from "../types/game";
import { getRemainingNumberCounts, getRemainingSpecialCounts } from "./deck";

export function calcBustProb(
  playerCards: Card[],
  allPlayersCards: Record<string, Card[]>,
  deckUsed: Card[]
): number {
  const remaining = getRemainingNumberCounts(allPlayersCards, deckUsed);
  const { modCounts, actCounts } = getRemainingSpecialCounts(allPlayersCards, deckUsed);
  const playerNumbers = new Set(
    playerCards.filter((c) => c.type === "number").map((c) => c.value)
  );

  let totalRemaining = 0;
  let bustCards = 0;
  for (let i = 0; i <= 12; i++) {
    const rem = Math.max(0, remaining[i]);
    totalRemaining += rem;
    if (playerNumbers.has(i)) bustCards += rem;
  }
  Object.values(modCounts).forEach((v) => (totalRemaining += Math.max(0, v)));
  Object.values(actCounts).forEach((v) => (totalRemaining += Math.max(0, v)));

  if (totalRemaining === 0) return 0;
  return bustCards / totalRemaining;
}

export function calcScore(playerCards: Card[], hasFlip7Bonus: boolean): number {
  const numberSum = playerCards
    .filter((c) => c.type === "number")
    .reduce((s, c) => s + (typeof c.value === "number" ? c.value : 0), 0);

  const hasX2 = playerCards.some((c) => c.type === "modifier" && c.value === "X2");
  const modBonus = playerCards
    .filter((c) => c.type === "modifier" && c.value !== "X2")
    .reduce((s, c) => s + parseInt(String(c.value).replace("+", "")), 0);

  let score = hasX2 ? numberSum * 2 : numberSum;
  score += modBonus;
  if (hasFlip7Bonus) score += 15;
  return score;
}
