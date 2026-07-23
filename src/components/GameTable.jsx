import { useBlackjack } from "../hooks/useBlackjack.js";
import DealerArea from "./DealerArea.jsx";
import PlayerArea from "./PlayerArea.jsx";
import Controls from "./Controls.jsx";
import ResultPopup from "./ResultPopup.jsx";
import BettingPanel from "./BettingPanel.jsx";


export default function GameTable({ profile, onExit }) {
  const game = useBlackjack(profile?.chips ?? 500);

  return (
    <div className="table-container">
      <header className="table-header table-header--game">
          <h1 className="game-title">♠ Blackjack</h1>
          {profile && (
            <p className="game-subtitle">
              {profile.name} · {game.chips} chips
            </p>
          )}
        <button className="menu-link" onClick={onExit}>
          Menu
        </button>
      </header>

      <DealerArea dealer={game.dealer} dealerRevealed={game.dealerRevealed} />

      <PlayerArea
        player={game.player}
        playerHands={game.playerHands}
        splitActive={game.splitActive}
        activeHandIndex={game.activeHandIndex}
      />


      {!game.gameStarted && !game.showPopup && (
        <BettingPanel chips={game.chips} lastBet={game.bet} onDeal={game.placeBet} />
      )}

      {game.gameStarted && !game.showPopup && game.awaitingPlayerInput && (
        <Controls
          splitActive={game.splitActive}
          player={game.player}
          playerHands={game.playerHands}
          activeHandIndex={game.activeHandIndex}
          chips={game.chips}
          bet={game.bet}
          handBets={game.handBets}
          onHit={game.playerHit}
          onStand={game.playerStand}
          onDouble={game.playerDouble}
          onSplit={game.playerSplit}
          onHitSplit={game.playerHitSplit}
          onStandSplit={game.playerStandSplit}
          onDoubleSplit={game.playerDoubleSplit}
        />
      )}

      <ResultPopup show={game.showPopup} message={game.message} onPlayAgain={game.playAgain} />
    </div>
  );
}
