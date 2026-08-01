import Hand from "./Hand.jsx";
import { handValue } from "../utils/deck.js";
import { memo } from "react";

function PlayerArea({ player, playerHands, splitActive, activeHandIndex, lastBet, doubled, handDoubled }) {
  return (
    <div className="player-area">
      <h2>Your Hand{splitActive ? "s" : ""}</h2>
      
      {lastBet > 0 && (
        <div className="bet-value">
          <p>Current Bet: ${lastBet}</p>
        </div>
      )}

      {!splitActive ? (
        <Hand
          cards={player}
          valueLabel={`Value: ${handValue(player)}`}
          rotatedIndexes={doubled ? [player.length - 1] : []}
        />
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
          </div>
        ))
      )}
    </div>      

  );
}

export default memo(PlayerArea);
