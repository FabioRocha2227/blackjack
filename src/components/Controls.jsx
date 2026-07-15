import { canDouble } from "../utils/doubleRules.js";
import { memo } from "react";

function Controls({
  gameStarted,
  showPopup,
  splitActive,
  player,
  playerHands,
  activeHandIndex,
  onStart,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onHitSplit,
  onStandSplit,
  onDoubleSplit,
}) {
  return (
    <div className="controls">
      {!gameStarted && !showPopup && <button onClick={onStart}>Start Game</button>}

      {gameStarted && !showPopup && (
        !splitActive ? (
          <>
            <button onClick={onHit}>Hit</button>
            <button onClick={onStand}>Stand</button>

            {canDouble(player) && <button onClick={onDouble}>Double</button>}

            {player.length === 2 && player[0].rank === player[1].rank && (
              <button onClick={onSplit}>Split</button>
            )}
          </>
        ) : (
          <>
            <button onClick={() => onHitSplit(activeHandIndex)}>Hit</button>
            <button onClick={() => onStandSplit(activeHandIndex)}>Stand</button>
            {canDouble(playerHands[activeHandIndex]) && (
              <button onClick={() => onDoubleSplit(activeHandIndex)}>Double</button>
            )}
          </>
        )
      )}
    </div>
  );
}

export default memo(Controls);
