const SAVE_KEY = "rooster-clash:player-roster";

export function loadRoster() {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function saveRoster(roster) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(roster));
}

export function clearRoster() {
    localStorage.removeItem(SAVE_KEY);
}

export function hasSavedRoster() {
    return Boolean(loadRoster());
}
