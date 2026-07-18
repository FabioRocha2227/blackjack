export default function MainMenu({ onPlay, onLeaderboard, onQuit }) {
    return (
        <div className = "menu-screen">
            <header className = "table-header">
                <h1 className = "game-title">♠ Blackjack</h1>
                <p className = "game-subtitle">Place your bet. Beat the dealer to 21.</p>
            </header>

            <nav className = "menu-buttons">
                <button type = "button" onClick = {onPlay}>Play</button>
                <button type = "button" className = "secondary" onClick = {onLeaderboard}>Leaderboard</button>
                <button type = "button" className = "secondary" onClick = {onQuit}>Quit</button>
            </nav>

        </div>

    );
}