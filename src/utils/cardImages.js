const SUIT_MAP = {
  Hearts: "hearts",
  Diamonds: "diamonds",
  Clubs: "clubs",
  Spades: "spades",
};

const RANK_MAP = {
  Ace: "A",
  Jack: "J",
  Queen: "Q",
  King: "K",
  "10": "10",
  "9": "09",
  "8": "08",
  "7": "07",
  "6": "06",
  "5": "05",
  "4": "04",
  "3": "03",
  "2": "02",
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function cardToFileName(card) {
  const suit = SUIT_MAP[card.suit];
  const rank = RANK_MAP[card.rank];
  return `card_${suit}_${rank}.png`;
}

export function cardImageSrc(card) {
  return assetUrl(`cards/${cardToFileName(card)}`);
}

export const CARD_BACK_SRC = assetUrl("cards/card_back.png");
