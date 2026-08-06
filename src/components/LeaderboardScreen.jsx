import { useEffect, useState } from "react";
import { getLeaderboardEntries, clearLeaderboard } from "../utils/leaderboard.js";

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatSigned(amount) {
  return amount > 0 ? `+${amount}` : String(amount);
}

export default function LeaderboardScreen({ onBack }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getLeaderboardEntries());
  }, []);

  const ranked = [...entries].sort((a, b) => b.netProfitLoss - a.netProfitLoss);
  //display only the top 10 entries
  const topRanked = ranked.slice(0, 10);

  function handleClear() {
    clearLeaderboard();
    setEntries([]);
  }

  return (
    <div className="menu-screen">
      <header className="table-header">
        <h1 className="game-title">Top 10 Leaderboard</h1>
        <p className="game-subtitle">
          {topRanked.length === 0
            ? "No games recorded yet — finish a game or exit to the menu to see it here."
            : `${topRanked.length} game${topRanked.length === 1 ? "" : "s"} recorded`}
        </p>
      </header>

      {topRanked.length > 0 && (
        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Start</th>
                <th>Net</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {topRanked.map((entry, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.startingChips}</td>
                  <td className={entry.netProfitLoss >= 0 ? "positive" : "negative"}>
                    {formatSigned(entry.netProfitLoss)}
                  </td>
                  <td>{formatDuration(entry.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="menu-buttons">
        <button onClick={onBack}>Back to Menu</button>
        {ranked.length > 0 && (
          <button className="secondary" onClick={handleClear}>
            Clear Leaderboard
          </button>
        )}
      </nav>
    </div>
  );
}
