import React from "react";

import { FighterCard } from "./FighterCard.jsx";

export function SelectionScreen({
    roster,
    opponents,
    selectedPlayerId,
    selectedOpponentId,
    onBack,
    onRefreshOpponents,
    onSelectPlayer,
    onSelectOpponent,
    onStartBattle,
    canStartBattle
}) {
    return (
        <section className="screen screen--active">
            <header className="topbar">
                <button type="button" className="button button--ghost" onClick={onBack}>
                    Back
                </button>
                <div>
                    <p className="eyebrow">Modular roster management</p>
                    <h2>Rooster Clash</h2>
                </div>
                <span className="pill">React + Vite</span>
            </header>

            <div className="selection-layout">
                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <p className="eyebrow">Step 1</p>
                            <h3>Choose your fighter</h3>
                        </div>
                        <span className="pill">Player roster</span>
                    </div>
                    <div className="card-grid">
                        {roster.map((fighter) => (
                            <FighterCard
                                key={fighter.id}
                                fighter={fighter}
                                isSelected={fighter.id === selectedPlayerId}
                                selectionType="player"
                                onSelect={() => onSelectPlayer(fighter.id)}
                            />
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <p className="eyebrow">Step 2</p>
                            <h3>Choose an opponent</h3>
                        </div>
                        <span className="pill pill--danger">Generated rivals</span>
                    </div>
                    <div className="card-grid">
                        {opponents.map((fighter) => (
                            <FighterCard
                                key={fighter.id}
                                fighter={fighter}
                                isSelected={fighter.id === selectedOpponentId}
                                selectionType="opponent"
                                onSelect={() => onSelectOpponent(fighter.id)}
                                showXp={false}
                            />
                        ))}
                    </div>
                </section>
            </div>

            <div className="selection-actions">
                <button type="button" className="button button--ghost" onClick={onRefreshOpponents}>
                    Refresh opponents
                </button>
                <button type="button" className="button button--primary" onClick={onStartBattle} disabled={!canStartBattle}>
                    Start local battle
                </button>
            </div>
        </section>
    );
}
