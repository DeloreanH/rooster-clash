import { getRandomColor } from "../data/characters.js";

const SAVE_KEY = "rooster-clash:player-roster";

export function loadRoster() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Migración retroactiva: asegura que todos los gallos guardados tengan un color único
    return parsed.map(f => ({ ...f, color: f.color || (f.colores ? f.colores[0] : getRandomColor()) }));
}

export function saveRoster(roster) { localStorage.setItem(SAVE_KEY, JSON.stringify(roster)); }
export function clearRoster() { localStorage.removeItem(SAVE_KEY); }
export function hasSavedRoster() { return Boolean(loadRoster()); }