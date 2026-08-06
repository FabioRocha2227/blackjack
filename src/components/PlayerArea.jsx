import Hand from "./Hand.jsx";
import ChipStack from "./ChipsStack.jsx";
import { handValue } from "../utils/deck.js";
import { memo } from "react";

function HandBet({ amount }) {
  if (!amount || amount <= 0) return null;
  return (
    <div className="hand-bet">
      <ChipStack amount={amount} size="sm" />
      <span className="hand-bet__amount">${amount}</span>
    </div>
}

function PlayerArea({
  player,
  playerHands,
  splitActive,
  activeHandIndex,
  lastBet,
  handBets,
  doubled,
  handDoubled,
}) {
  return (
    <div className="player-area">
      <h2>Your Hand{splitActive ? "s" : ""}</h2>

      {!splitActive ? (
        <>
          <Hand
            cards={player}
            valueLabel={`Value: ${handValue(player)}`}
            rotatedIndexes={doubled ? [player.length - 1] : []}
          />
          <HandBet amount={lastBet} />
        </>
      ) : (
        playerHands.map((hand, i) => (
          <div
            key={i}
            className={`split-hand ${activeHandIndex === i ? "active-hand" : ""}`}
          >
            <Hand
              cards={hand}
              valueLabel={`Hand ${i + 1} Value: ${handValue(hand)}`}
              rotatedIndexes={handDoubled?.[i] ? [hand.length - 1] : []}
            />
            <HandBet amount={handBets?.[i]} />
          </div>
        ))
      )}
    </div>
  );
}

export default memo(PlayerArea);
