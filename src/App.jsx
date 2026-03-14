import React, { useState } from "react";
import { generateOpponents } from "./core/opponents.js";
import { applyVictoryRewards, runLocalCombat } from "./core/combat.js";
import { clearRoster, hasSavedRoster, loadRoster, saveRoster } from "./core/storage.js";
import { cloneRoster, starterRoster } from "./data/characters.js";
import { BattleArena } from "./components/BattleArena.jsx";
import { MenuScreen } from "./components/MenuScreen.jsx";
import { SelectionScreen } from "./components/SelectionScreen.jsx";

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
    const [statusText, setStatusText] = useState(hasSavedRoster() ? "Saved progress available" : "No saved progress");

    const selectedPlayer = roster.find((fighter) => fighter.id === selectedPlayerId) ?? null;
    const selectedOpponent = opponents.find((fighter) => fighter.id === selectedOpponentId) ?? null;
    const canStartBattle = Boolean(selectedPlayer && selectedOpponent);

    function openMenu() {
        setScreen("menu");
        setStatusText(hasSavedRoster() ? "Saved progress available" : "No saved progress");
    }

    function openSelection(nextRoster = roster) {
        setRoster(nextRoster);
        setOpponents(generateOpponents());
        setSelectedPlayerId(null);
        setSelectedOpponentId(null);
        setScreen("selection");
        setStatusText(hasSavedRoster() ? "Saved progress available" : "No saved progress");
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

    async function handleStartBattle() {
        if (!selectedPlayer || !selectedOpponent) {
            return;
        }

        setScreen("battle");
        setBattleLog([]);
        setBattleState({
            left: { ...selectedPlayer, hp: selectedPlayer.maxHp },
            right: { ...selectedOpponent, hp: selectedOpponent.maxHp },
            images: {
                left: "/gallo_defensa.png",
                right: "/gallo_defensaDerecha.png"
            },
            modeText: "Local mode"
        });

        const result = await runLocalCombat({
            player: selectedPlayer,
            opponent: selectedOpponent,
            onLog(message) {
                appendLog(message, message.startsWith("Intro:") ? "system" : "default");
            },
            onUpdate(payload) {
                setBattleState((current) => ({
                    ...(current ?? {}),
                    left: payload.left,
                    right: payload.right,
                    images: payload.images,
                    modeText: "Local mode"
                }));
            }
        });

        if (result.winner?.id === selectedPlayer.id) {
            const updatedRoster = structuredClone(roster);
            const rewards = applyVictoryRewards(updatedRoster, selectedPlayer.id, selectedOpponent);
            setRoster(updatedRoster);
            saveRoster(updatedRoster);
            appendLog(`${result.winner.name} wins the battle.`, "system");
            appendLog(`XP earned: ${rewards.gainedExp}. Modifier: ${rewards.modifier}.`);
            if (rewards.leveledUp) {
                appendLog(`${rewards.fighter.name} reaches level ${rewards.fighter.level}.`, "system");
            }
            setStatusText("Progress saved");
        } else if (result.winner) {
            saveRoster(roster);
            appendLog(`${result.winner.name} wins the battle.`, "system");
            appendLog("Your fighter does not earn experience this time.");
            setStatusText("Progress saved");
        } else {
            appendLog("Double knockout. No winner this round.", "system");
        }
    }

    return (
        <div id="app">
            {screen === "menu" && (
                <MenuScreen
                    onNewGame={handleNewGame}
                    onContinue={handleContinue}
                    canContinue={hasSavedRoster()}
                    saveStatus={statusText}
                />
            )}

            {screen === "selection" && (
                <SelectionScreen
                    roster={roster}
                    opponents={opponents}
                    selectedPlayerId={selectedPlayerId}
                    selectedOpponentId={selectedOpponentId}
                    onBack={openMenu}
                    onRefreshOpponents={() => setOpponents(generateOpponents())}
                    onSelectPlayer={setSelectedPlayerId}
                    onSelectOpponent={setSelectedOpponentId}
                    onStartBattle={handleStartBattle}
                    canStartBattle={canStartBattle}
                />
            )}

            {screen === "battle" && battleState && (
                <BattleArena
                    battleState={battleState}
                    battleLog={battleLog}
                    onBackToRoster={() => openSelection(roster)}
                />
            )}
        </div>
    );
}
