export default function LeaderboardScreen({ onBack }) {
return (
    <div className="menu-screen">
      <header className="table-header">
        <h1 className="game-title">Leaderboard</h1>
        <p className="game-subtitle">
          Chip tracking isn't wired up yet — this fills in once the betting mechanic lands.
        </p>
      </header>

      <section className="popup leaderboard-panel" aria-label="Leaderboard preview">
        <h2>Coming Soon</h2>
        <p className="game-subtitle">
          Once wins and losses are persisted, this screen can show chips, streaks, and best hands.
        </p>
      </section>

      <nav className="menu-buttons">
        <button type="button" onClick={onBack}>Back to Menu</button>
      </nav>
    </div>
);
}