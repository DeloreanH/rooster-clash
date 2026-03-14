import React from "react";

export function FighterCard({ fighter, isSelected, selectionType, onSelect, showXp = true, onEditColor }) {
    const selectedClass = isSelected ? `is-${selectionType}` : "";

    return (
        <article className={`fighter-option fighter-option--redesigned ${selectedClass}`.trim()} onClick={onSelect}>
            <div className="fighter-name-row">
                <h4 className="fighter-title">{fighter.name}</h4>
                {selectionType === "player" && (
                    <div className="fighter-edit-actions">
                        <span onClick={(e) => { e.stopPropagation(); onEditColor(); }} title="Edit Color">🎨</span>
                    </div>
                )}
            </div>

            <div className="color-gallo-badge color-gallo-badge--centered" style={{ backgroundColor: fighter.color }}></div>

            <div className="fighter-level-pill">
                Lvl {fighter.level}
            </div>

            <div className="fighter-stats-list" style={{ fontSize: '1rem' }}>
                <p>❤️ HP: {fighter.maxHp}/{fighter.maxHp}</p>
                <p>⚔️ Attack: {fighter.attack}</p>
                <p>🛡️ Defense: {fighter.defense}</p>
                <p>⚡ Speed: {fighter.speed}</p>
            </div>

            <hr className="stat-divider" />

            {showXp && (
                <div className="fighter-xp-row">
                    ⭐ <i>XP: {fighter.xp}/{fighter.level * 100}</i>
                </div>
            )}
        </article>
    );
}