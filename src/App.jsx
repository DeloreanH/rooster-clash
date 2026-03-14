import React, { useState, useRef } from "react";
import { generateOpponents } from "./core/opponents.js";
import { applyVictoryRewards, runLocalCombat } from "./core/combat.js";
import { clearRoster, hasSavedRoster, loadRoster, saveRoster } from "./core/storage.js";
import { cloneRoster, starterRoster } from "./data/characters.js";
import { BattleArena } from "./components/BattleArena.jsx";
import { MenuScreen } from "./components/MenuScreen.jsx";
import { SelectionScreen } from "./components/SelectionScreen.jsx";
import { ColorEditorModal } from "./components/ColorEditorModal.jsx";

function getInitialRoster() {
    const saved = loadRoster();
    return saved ?? cloneRoster(starterRoster);
}

export default function App() {
    const [screen, setScreen] = useState("menu");
    const [roster, setRoster] = useState(getInitialRoster);
    const [opponents, setOpponents] = useState([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [selectedOpponentId, setSelectedOpponentId] = useState(null);
    const [battleState, setBattleState] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [statusText, setStatusText] = useState(hasSavedRoster() ? "Saved progress available" : "No progress available");

    // Modal State
    const [colorEditorFighterId, setColorEditorFighterId] = useState(null);

    // Surrender ref
    const surrenderedRef = useRef(false);
    const [canSurrender, setCanSurrender] = useState(false);
    const [isBattleFinished, setIsBattleFinished] = useState(false);

    const selectedPlayer = roster.find((fighter) => fighter.id === selectedPlayerId) ?? null;
    const selectedOpponent = opponents.find((fighter) => fighter.id === selectedOpponentId) ?? null;
    const canStartBattle = Boolean(selectedPlayer && selectedOpponent);

    function openMenu() {
        setScreen("menu");
        setStatusText(hasSavedRoster() ? "Saved progress available" : "No progress available");
    }

    function openSelection(nextRoster = roster) {
        setRoster(nextRoster);
        setOpponents(generateOpponents());
        setSelectedPlayerId(null);
        setSelectedOpponentId(null);
        setScreen("selection");
        setStatusText(hasSavedRoster() ? "Saved progress available" : "No progress available");
    }

    function handleNewGame() {
        clearRoster();
        const freshRoster = cloneRoster(starterRoster);
        openSelection(freshRoster);
    }

    function handleContinue() {
        const saved = loadRoster();
        openSelection(saved ?? cloneRoster(starterRoster));
    }

    function appendLog(message, type = "default") {
        setBattleLog((current) => [...current, { id: crypto.randomUUID(), message, type }]);
    }

    // Lógica para guardar color modificado
    function handleSaveColor(fighterId, newColorHex) {
        const updatedRoster = roster.map(f => f.id === fighterId ? { ...f, color: newColorHex } : f);
        setRoster(updatedRoster);
        saveRoster(updatedRoster);
        setColorEditorFighterId(null);
    }

    async function handleStartBattle() {
        if (!selectedPlayer || !selectedOpponent) return;

        setScreen("battle");
        setBattleLog([]);
        surrenderedRef.current = false;
        setCanSurrender(false);
        setIsBattleFinished(false);

        setBattleState({
            left: { ...selectedPlayer, hp: selectedPlayer.maxHp },
            right: { ...selectedOpponent, hp: selectedOpponent.maxHp },
            images: { left: "defensa", right: "defensa" },
            effect: null, // <-- Inicializamos el efecto en nulo
            modeText: "Local Mode"
        });

        const result = await runLocalCombat({
            player: selectedPlayer,
            opponent: selectedOpponent,
            checkSurrender: () => surrenderedRef.current,
            onTurnComplete: () => setCanSurrender(true), // Habilita rendirse al finalizar 1 turno
            onLog(message, type = "default") {
                appendLog(message, message.startsWith("Intro:") ? "system" : type);
            },
            onUpdate(payload) {
                setBattleState((current) => ({
                    ...(current ?? {}),
                    left: payload.left,
                    right: payload.right,
                    images: payload.images,
                    effect: payload.effect,
                    modeText: "Local Mode"
                }));
            }
        });

        setIsBattleFinished(true);

        if (surrenderedRef.current) {
            appendLog("You have surrendered. Combat abandoned.", "system");
        } else if (result.winner?.id === selectedPlayer.id) {
            const updatedRoster = structuredClone(roster);
            const rewards = applyVictoryRewards(updatedRoster, selectedPlayer.id, selectedOpponent);
            setRoster(updatedRoster);
            saveRoster(updatedRoster);
            appendLog(`${result.winner.name} WINS the battle!`, "winner");
            appendLog(`XP gained: ${rewards.gainedExp}. Modifier: ${rewards.modifier}.`);
            if (rewards.leveledUp) {
                appendLog(`${rewards.fighter.name} reaches level ${rewards.fighter.level}!`, "system");
            }
            setStatusText("Progress saved");
        } else if (result.winner) {
            saveRoster(roster);
            appendLog(`${result.winner.name} WINS the battle!`, "winner");
            appendLog("Your rooster has been defeated. You gain no experience.");
            setStatusText("Progress saved");
        } else {
            appendLog("Double KO. There is no winner this round.", "system");
        }
    }

    function handleSurrender() {
        if (window.confirm("Are you sure you want to surrender? Your rooster will lose the round.")) {
            surrenderedRef.current = true;
        }
    }

    return (
        <div id="app">
            {screen === "menu" && (
                <MenuScreen onNewGame={handleNewGame} onContinue={handleContinue} canContinue={hasSavedRoster()} saveStatus={statusText} />
            )}
            {screen === "selection" && (
                <SelectionScreen
                    roster={roster} opponents={opponents}
                    selectedPlayerId={selectedPlayerId} selectedOpponentId={selectedOpponentId}
                    onBack={openMenu} onRefreshOpponents={() => setOpponents(generateOpponents())}
                    onSelectPlayer={setSelectedPlayerId} onSelectOpponent={setSelectedOpponentId}
                    onStartBattle={handleStartBattle} canStartBattle={canStartBattle}
                    onOpenColorEditor={setColorEditorFighterId}
                />
            )}
            {screen === "battle" && battleState && (
                <BattleArena
                    battleState={battleState} battleLog={battleLog}
                    onBackToRoster={() => openSelection(roster)}
                    onSurrender={handleSurrender} canSurrender={canSurrender} isFinished={isBattleFinished}
                />
            )}
            {colorEditorFighterId && (
                <ColorEditorModal
                    fighter={roster.find(f => f.id === colorEditorFighterId)}
                    onClose={() => setColorEditorFighterId(null)}
                    onSave={handleSaveColor}
                />
            )}
        </div>
    );
}