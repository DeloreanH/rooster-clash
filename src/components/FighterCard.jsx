import React from "react";

export function FighterCard({ fighter, isSelected, selectionType, onSelect, showXp = true }) {
    const selectedClass = isSelected ? `is-${selectionType}` : "";

    return (
        <article className={`fighter-option ${selectedClass}`.trim()} onClick={onSelect}>
            <div className="fighter-meta">
                <span className="tag">{fighter.rarity}</span>
                <span className="tag">{fighter.archetype}</span>
                <span className="tag">Level {fighter.level}</span>
            </div>
            <h4>{fighter.name}</h4>
            <p>HP {fighter.maxHp}</p>
            <p>Attack {fighter.attack} | Defense {fighter.defense}</p>
            <p>Speed {fighter.speed}</p>
            {showXp ? <p>XP {fighter.xp}/{fighter.level * 100}</p> : null}
        </article>
    );
}
