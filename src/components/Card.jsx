import { CARD_BACK_SRC, cardImageSrc } from "../utils/cardImages.js";

export default function Card({ card, hidden = false, flip = false }) {
  return (
    <div className={`card ${hidden ? "back" : ""} ${flip ? "flip" : ""}`}>
      {hidden ? (
        <img src={CARD_BACK_SRC} alt="Hidden card" />
      ) : (
        <img src={cardImageSrc(card)} alt={`${card.rank} of ${card.suit}`} />
      )}
    </div>
  );
}
