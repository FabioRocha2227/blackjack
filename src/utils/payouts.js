import { handValue } from "./deck.js";

export function blackjackReturn(wager) {
  return wager + Math.floor(wager * 1.5);
}

export function winReturn(wager) {
  return wager * 2;
}

export function pushReturn(wager) {
  return wager;
}

// Evaluate split results according to game rules.
// hands: array of hands (each is array of cards), dealerHand: array of cards, bets: array of wagers
export function splitResults(hands, dealerHand, bets) {
  const dealerTotal = handValue(dealerHand);
  let totalReturned = 0;
  const results = hands.map((hand, i) => {
    const playerTotal = handValue(hand);
    const wager = bets[i];

    if (playerTotal > 21) return `Hand ${i + 1}: Bust`;
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      totalReturned += wager * 2;
      return `Hand ${i + 1}: Win (+${wager * 2})`;
    }
    if (playerTotal < dealerTotal) {
      return `Hand ${i + 1}: Dealer wins`;
    }
    totalReturned += wager;
    return `Hand ${i + 1}: Push`;
  });

  return { totalReturned, results };
}

export function insuranceReturn(insuranceBet) {
  // Insurance pays 2:1; return includes original stake
  return insuranceBet * 3;
}

export function surrenderReturn(wager) {
  return Math.floor(wager / 2);
}

export default {
  blackjackReturn,
  winReturn,
  pushReturn,
  splitResults,
};
