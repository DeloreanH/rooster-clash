import React from "react";
import { VisualGallo } from "./VisualGallo.jsx";

export function FighterPanel({ side, fighter, image, effect }) {
    const percentage = Math.max(0, ((fighter.hp ?? fighter.maxHp) / fighter.maxHp) * 100);
    
    let healthBackground;
    if (percentage > 65) {
        healthBackground = "linear-gradient(90deg, #1f7a6b 0%, #67c59a 100%)"; // Green
    } else if (percentage > 32) {
        healthBackground = "linear-gradient(90deg, #d4a017 0%, #e8c35d 100%)"; // Yellow
    } else {
        healthBackground = "linear-gradient(90deg, #b43c2f 0%, #e58271 100%)"; // Red
    }

    return (
        <article className={`fighter-card fighter-card--${side}`} style={{ position: 'relative' }}>

            {/* Animaciones SVG dinámicas */}
            {effect === 'shield' && (
                <img className={`escudo-animacion escudo-${side}`} src="/escudoEdited.svg" alt="Bloqueo" />
            )}
            {effect === 'claws' && (
                <img className="garras-animacion zarpazo-animado" src="/garras.svg" alt="Impacto" />
            )}

            <p className="eyebrow">{side === "player" ? "Player" : "Opponent"}</p>
            <h3>{fighter.name}</h3>
            <div className={effect === 'dodge' ? "esquivar-animado" : ""}>
                <VisualGallo tipo={image} color={fighter.color} isRight={side === 'opponent'} />
            </div>
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