import Hand from "./Hand.jsx";
import { handValue } from "../utils/deck.js";

export default function PlayerArea({ player, playerHands, splitActive, activeHandIndex }) {
  return (
    <div className="player-area">
      <h2>Your Hand{splitActive ? "s" : ""}</h2>

      {!splitActive ? (
        <Hand cards={player} valueLabel={`Value: ${handValue(player)}`} />
      ) : (
        playerHands.map((hand, i) => (
          <div
            key={i}
            className={`split-hand ${activeHandIndex === i ? "active-hand" : ""}`}
          >
            <Hand cards={hand} valueLabel={`Hand ${i + 1} Value: ${handValue(hand)}`} />
          </div>
        ))
      )}
    </div>
  );
}
