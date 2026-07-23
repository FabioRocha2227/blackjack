import { canDouble } from "../utils/doubleRules.js";
import { memo } from "react";

function Controls({
  splitActive,
  player,
  playerHands,
  activeHandIndex,
  chips,
  bet,
  handBets,
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
      {!splitActive ? (
        <>
          <button onClick={onHit}>Hit</button>
          {/* onStand now takes optional (wager, hand) params for the double-down path -
              call it with no arguments here, or the click event would be passed as `wager`. */}
          <button onClick={() => onStand()}>Stand</button>

          {canDouble(player) && chips >= bet && <button onClick={onDouble}>Double</button>}

          {player.length === 2 && player[0].rank === player[1].rank && chips >= bet && (
            <button onClick={onSplit}>Split</button>
          )}
        </>
      ) : (
        <>
          <button onClick={() => onHitSplit(activeHandIndex)}>Hit</button>
          <button onClick={() => onStandSplit(activeHandIndex)}>Stand</button>
          {canDouble(playerHands[activeHandIndex]) && chips >= handBets[activeHandIndex] && (
            <button onClick={() => onDoubleSplit(activeHandIndex)}>Double</button>
          )}
        </>
      )}
    </div>
  );
}

export default memo(Controls);
