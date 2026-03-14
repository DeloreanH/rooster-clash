import React from "react";

export function FighterPanel({ side, fighter, image }) {
    const percentage = Math.max(0, ((fighter.hp ?? fighter.maxHp) / fighter.maxHp) * 100);
    const healthBackground = percentage < 30
        ? "linear-gradient(90deg, #b43c2f 0%, #e58271 100%)"
        : "linear-gradient(90deg, #1f7a6b 0%, #67c59a 100%)";

    return (
        <article className={`fighter-card fighter-card--${side}`}>
            <p className="eyebrow">{side === "player" ? "Player" : "Opponent"}</p>
            <h3>{fighter.name}</h3>
            <img className="fighter-image" src={image} alt={`${fighter.name} pose`} />
            <div className="health">
                <div className="health__track">
                    <div className="health__bar" style={{ width: `${percentage}%`, background: healthBackground }} />
                </div>
                <p>{Math.max(0, fighter.hp ?? fighter.maxHp)}/{fighter.maxHp} HP</p>
            </div>
            <dl className="stats-list">
                <div><dt>Attack</dt><dd>{fighter.attack}</dd></div>
                <div><dt>Defense</dt><dd>{fighter.defense}</dd></div>
                <div><dt>Speed</dt><dd>{fighter.speed}</dd></div>
            </dl>
        </article>
    );
}
