import { useBlackjack } from "../hooks/useBlackjack.js";
import DealerArea from "./DealerArea.jsx";
import PlayerArea from "./PlayerArea.jsx";
import Controls from "./Controls.jsx";
import ResultPopup from "./ResultPopup.jsx";

export default function GameTable({ profile, onExit }) {
  const game = useBlackjack();

  return (
    <div className="table-container">
      <header className="table-header table-header--game">
        <div className="table-copy">
          <h1 className="game-title">♠ Blackjack</h1>
          <p className="game-subtitle">
            Deal smart, track the table, and stay under 21.
          </p>
          {profile && (
            <p className="table-credits">
              {profile.name} · {profile.chips} chips
            </p>
          )}
        </div>

        <button type="button" className="menu-link" onClick={onExit}>
          ← Menu
        </button>
      </header>

      <DealerArea dealer={game.dealer} dealerRevealed={game.dealerRevealed} />

      <PlayerArea
        player={game.player}
        playerHands={game.playerHands}
        splitActive={game.splitActive}
        activeHandIndex={game.activeHandIndex}
      />

      <Controls
        gameStarted={game.gameStarted}
        showPopup={game.showPopup}
        splitActive={game.splitActive}
        player={game.player}
        playerHands={game.playerHands}
        activeHandIndex={game.activeHandIndex}
        onStart={game.startGame}
        onHit={game.playerHit}
        onStand={game.playerStand}
        onDouble={game.playerDouble}
        onSplit={game.playerSplit}
        onHitSplit={game.playerHitSplit}
        onStandSplit={game.playerStandSplit}
        onDoubleSplit={game.playerDoubleSplit}
      />

      <ResultPopup show={game.showPopup} message={game.message} onPlayAgain={game.playAgain} />
    </div>
  );
}
