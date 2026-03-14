import React, { useEffect, useRef } from "react";
import { FighterPanel } from "./FighterPanel.jsx";

export function BattleArena({ battleState, battleLog, onBackToRoster, onSurrender, canSurrender, isFinished }) {
    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [battleLog]);
    return (
        <section className="screen screen--active">
            <header className="topbar">
                {isFinished ? (
                    <button type="button" className="button button--ghost" onClick={onBackToRoster}>
                        Back to Roster
                    </button>
                ) : (
                    <button type="button" className="button button--danger" onClick={onSurrender}>
                        🏳️ Surrender
                    </button>
                )}

                <span className="pill">{battleState.modeText}</span>
            </header>

            <div className="arena">
                <FighterPanel
                    side="player"
                    fighter={battleState.left}
                    image={battleState.images.left}
                    effect={battleState.effect?.target === 'left' ? battleState.effect.type : null}
                />
                <div className="arena-center">
                    <span className="versus">VS</span>
                </div>
                <FighterPanel
                    side="opponent"
                    fighter={battleState.right}
                    image={battleState.images.right}
                    effect={battleState.effect?.target === 'right' ? battleState.effect.type : null}
                />
            </div>

            <section className="panel">

                <div className="battle-log">
                    {battleLog.map((entry) => {
                        let classNames = "log-entry";
                        if (entry.type === "system") classNames += " log-entry--system";
                        else if (entry.type === "turn") classNames += " log-entry--turn";
                        else if (entry.type === "winner") classNames += " log-entry--winner";

                        return (
                            <p key={entry.id} className={classNames} dangerouslySetInnerHTML={{ __html: entry.message }} />
                        );
                    })}
                    <div ref={logEndRef} />
                </div>
            </section>
        </section>
    );
}