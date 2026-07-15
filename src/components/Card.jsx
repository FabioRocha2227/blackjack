import { CARD_BACK_SRC, cardImageSrc } from "../utils/cardImages.js";

const CARD_IMAGE_SIZE = 64;

export default function Card({ card, hidden = false, flip = false }) {
  return (
    <div className={`card ${hidden ? "back" : ""} ${flip ? "flip" : ""}`}>
      {hidden ? (
        <img
          src={CARD_BACK_SRC}
          alt="Hidden card"
          width={CARD_IMAGE_SIZE}
          height={CARD_IMAGE_SIZE}
        />
      ) : (
        <img
          src={cardImageSrc(card)}
          alt={`${card.rank} of ${card.suit}`}
          width={CARD_IMAGE_SIZE}
          height={CARD_IMAGE_SIZE}
        />
      )}
    </div>
  );
}
