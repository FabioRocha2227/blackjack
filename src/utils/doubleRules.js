import { handValue } from "./deck.js";

// A 2-card hand is "soft" if it contains exactly one Ace (soft 13 through soft 20).
// A pair of Aces is treated as hard 12, not soft, since both can't count as 11.
export function isSoftHand(hand) {
  if (!hand || hand.length !== 2) return false;
  return hand.filter(c => c.rank === "Ace").length === 1;
}

// Common casino double-down rule: hard 9, 10, or 11, or any soft hand.
export function canDouble(hand) {
  if (!hand || hand.length !== 2) return false;
  if (isSoftHand(hand)) return true;
  const total = handValue(hand);
  return total === 9 || total === 10 || total === 11;
}
