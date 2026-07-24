const STORAGE_KEY = "blackjack.leaderboard.v1";

export function getLeaderboardEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt or unavailable storage shouldn't crash the game - just show an empty board.
    return [];
  }
}

// entry: { name, startingChips, finalChips, netProfitLoss, durationMs, endedAt, reason }
export function saveLeaderboardEntry(entry) {
  const entries = getLeaderboardEntries();
  entries.push(entry);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full/unavailable - fail silently rather than breaking the game flow.
  }
  return entries;
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
