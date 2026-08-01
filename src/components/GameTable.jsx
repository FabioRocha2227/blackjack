import { useBlackjack } from "../hooks/useBlackjack.js";
import DealerArea from "./DealerArea.jsx";
import PlayerArea from "./PlayerArea.jsx";
import Controls from "./Controls.jsx";
import ResultPopup from "./ResultPopup.jsx";
import BettingPanel from "./BettingPanel.jsx";
import StrategySidebar from "./StrategySidebar.jsx";
import { saveLeaderboardEntry } from "../utils/leaderboard.js";
import { useEffect, useRef, useState } from "react";



export default function GameTable({ profile, onExit }) {
  const game = useBlackjack(profile?.chips ?? 0);
  const [showStrategy, setShowStrategy] = useState(false);

  const savedRef = useRef(false);
  const isGameOver = game.chips <= 0 && !game.gameStarted && !game.showPopup;

  function buildEntry(reason) {
    const startingChips = profile?.chips ?? 0;
    const durationMs = profile?.startedAt ? Date.now() - profile.startedAt : 0;

    return {
      name: profile?.name ?? "Player",
      startingChips,
      finalChips: game.chips,
      netProfitLoss: game.chips - startingChips,
      durationMs,
      endedAt: new Date().toISOString(),
      reason, // "out_of_chips" | "exited"
    };
  }

  //auto save when player runs oout of chips

  useEffect(() => {
    if (isGameOver && !savedRef.current) {
      savedRef.current = true;
      saveLeaderboardEntry(buildEntry("out_of_chips"));
    }
  }, [isGameOver]);

  function handleExit() {
    if (!savedRef.current) {
      savedRef.current = true;
      saveLeaderboardEntry(buildEntry("exited"));
    }
    onExit();
  }
  return (
    <div className="table-container">

      <div className="header-controls">
        <button className="menu-button" onClick={handleExit}>
          Menu
        </button>

        {game.gameStarted && (
          <button
            className="strategy-header-toggle"
            onClick={() => setShowStrategy((s) => !s)}
          >
            {showStrategy ? "Hide Strategy ▲" : "Show Strategy ▼"}
          </button>
        )}
      </div>

      <header className="table-header table-header--game">
        <h1 className="game-title">♠ Blackjack</h1>
        <p className="table-rule">Dealer hits on 16</p>

        {profile && (
          <p className="game-subtitle">
            {profile.name} · {game.chips} chips
          </p>
        )}
      </header>

      <div className="table-hands">
        <DealerArea dealer={game.dealer} dealerRevealed={game.dealerRevealed} />

        <PlayerArea
          player={game.player}
          playerHands={game.playerHands}
          splitActive={game.splitActive}
          activeHandIndex={game.activeHandIndex}
          chips={game.chips}
          lastBet={game.bet}
          doubled={game.doubled}       
          handDoubled={game.handDoubled}
        />
      </div>
      
      {isGameOver ? (
        <div className="betting-panel">
          <p className="chips-readout">Game over — you're out of chips.</p>
          <p className="game-subtitle">
            Saved to the leaderboard. Head back to the menu to start a new game.
          </p>
          <button onClick={handleExit}>Return to Menu</button>
        </div>
      ) : !game.gameStarted && !game.showPopup ? (
        <BettingPanel chips={game.chips} lastBet={game.bet} onDeal={game.placeBet} />
      ) : null}

      {game.gameStarted && !game.showPopup && game.awaitingPlayerInput && (
        <Controls
          splitActive={game.splitActive}
          player={game.player}
          playerHands={game.playerHands}
          activeHandIndex={game.activeHandIndex}
          chips={game.chips}
          bet={game.bet}
          handBets={game.handBets}
          dealerUpCard={game.dealer?.[0]}
          onHit={game.playerHit}
          onStand={game.playerStand}
          onDouble={game.playerDouble}
          onSplit={game.playerSplit}
          onHitSplit={game.playerHitSplit}
          onStandSplit={game.playerStandSplit}
          onDoubleSplit={game.playerDoubleSplit}
          onSurrender={game.playerSurrender}
          showStrategy={showStrategy}
        />
      )}

      <StrategySidebar
        show={showStrategy}
        player={game.player}
        playerHands={game.playerHands}
        splitActive={game.splitActive}
        activeHandIndex={game.activeHandIndex}
        dealerUpCard={game.dealer?.[0]}
        onClose={() => setShowStrategy(false)}
      />

      <ResultPopup show={game.showPopup} message={game.message} onPlayAgain={game.playAgain} onRepeatBet={game.repeatBet} />
    </div>
  );
}
