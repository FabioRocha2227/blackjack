import { useState } from "react";
import MainMenu from "./components/MainMenu.jsx";
import NewGameDialog from "./components/GameDialog.jsx";
import LeaderboardScreen from "./components/LeaderboardScreen.jsx";
import GameTable from "./components/GameTable.jsx";
import "./App.css";


const SCREEN = {
  MENU: "menu",
  NEW_GAME: "newGame",
  LEADERBOARD: "leaderboard",
  GAME: "game",
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.MENU);
  const [profile, setProfile] = useState(null); // { name, chips }

  function handleStartGame({ name, chips }) {
    setProfile({ name, chips, startedAt: Date.now() });
    setScreen(SCREEN.GAME);
  }

  function handleQuit() {
    // If a preload script exposes a quit bridge, use it (proper Electron app.quit()).
    // Otherwise fall back to closing the window, which works for a plain browser tab
    // opened via window.open(), though it's a no-op in most normal browser tabs.
    if (window.electronAPI?.quitApp) {
      window.electronAPI.quitApp();
    } else {
      window.close();
    }
  }

  return (
    <>
      {screen === SCREEN.MENU && (
        <MainMenu
          onPlay={() => setScreen(SCREEN.NEW_GAME)}
          onLeaderboard={() => setScreen(SCREEN.LEADERBOARD)}
          onQuit={handleQuit}
        />
      )}

      {screen === SCREEN.NEW_GAME && (
        <NewGameDialog onStart={handleStartGame} onCancel={() => setScreen(SCREEN.MENU)} />
      )}

      {screen === SCREEN.LEADERBOARD && (
        <LeaderboardScreen onBack={() => setScreen(SCREEN.MENU)} />
      )}

      {screen === SCREEN.GAME && (
        <GameTable profile={profile} onExit={() => setScreen(SCREEN.MENU)} />
      )}
    </>
  );
}
