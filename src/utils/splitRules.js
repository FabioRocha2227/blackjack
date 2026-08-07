const TEN_VALUE_RANKS = new Set(["10", "Jack", "Queen", "King"]);

export function canSplitHand(cards) {
  if (!Array.isArray(cards) || cards.length !== 2) return false;

  const [firstCard, secondCard] = cards;
  if (!firstCard || !secondCard) return false;

  if (firstCard.rank === secondCard.rank) return true;

  return TEN_VALUE_RANKS.has(firstCard.rank) && TEN_VALUE_RANKS.has(secondCard.rank);
}