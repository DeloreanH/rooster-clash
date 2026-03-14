import React from "react";

import { FighterPanel } from "./FighterPanel.jsx";

export function BattleArena({ battleState, battleLog, onBackToRoster }) {
    return (
        <section className="screen screen--active">
            <header className="topbar">
                <button type="button" className="button button--ghost" onClick={onBackToRoster}>
                    Back to roster
                </button>
                <div>
                    <p className="eyebrow">Arena</p>
                    <h2>Battle</h2>
                </div>
                <span className="pill">{battleState.modeText}</span>
            </header>

            <div className="arena">
                <FighterPanel side="player" fighter={battleState.left} image={battleState.images.left} />
                <div className="arena-center">
                    <span className="versus">VS</span>
                </div>
                <FighterPanel side="opponent" fighter={battleState.right} image={battleState.images.right} />
            </div>

            <section className="panel">
                <div className="panel-heading">
                    <div>
                        <p className="eyebrow">Narrative</p>
                        <h3>Battle log</h3>
                    </div>
                    <span className="pill">Tick log</span>
                </div>
                <div className="battle-log">
                    {battleLog.map((entry) => (
                        <p key={entry.id} className={`log-entry ${entry.type === "system" ? "log-entry--system" : ""}`.trim()}>
                            {entry.message}
                        </p>
                    ))}
                </div>
            </section>
        </section>
    );
}
