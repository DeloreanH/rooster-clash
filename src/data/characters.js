export const archetypes = {
    balanced: {
        maxHp: 105,
        attack: 70,
        defense: 68,
        speed: 67,
        critBonus: 0.01,
        dodgeBonus: 0.01,
        blockBonus: 0.02,
        variance: 0.04
    },
    tank: {
        maxHp: 118,
        attack: 58,
        defense: 84,
        speed: 50,
        critBonus: 0,
        dodgeBonus: 0,
        blockBonus: 0.08,
        variance: 0.03
    },
    agile: {
        maxHp: 96,
        attack: 78,
        defense: 54,
        speed: 82,
        critBonus: 0.03,
        dodgeBonus: 0.06,
        blockBonus: 0,
        variance: 0.06
    },
    aggressive: {
        maxHp: 101,
        attack: 82,
        defense: 56,
        speed: 71,
        critBonus: 0.05,
        dodgeBonus: 0.01,
        blockBonus: -0.01,
        variance: 0.08
    },
    technical: {
        maxHp: 103,
        attack: 67,
        defense: 71,
        speed: 69,
        critBonus: 0.02,
        dodgeBonus: 0.02,
        blockBonus: 0.04,
        variance: 0.02
    }
};

function createFighter({ id, name, rarity, archetype, level = 1, xp = 0 }) {
    return {
        id,
        name,
        rarity,
        archetype,
        level,
        xp,
        ...archetypes[archetype]
    };
}

export const starterRoster = [
    createFighter({
        id: "golden-rooster",
        name: "Golden Rooster",
        rarity: "common",
        archetype: "balanced"
    }),
    createFighter({
        id: "iron-beak",
        name: "Iron Beak",
        rarity: "common",
        archetype: "tank"
    }),
    createFighter({
        id: "swift-shadow",
        name: "Swift Shadow",
        rarity: "rare",
        archetype: "agile"
    })
];

export const rivalPool = [
    "Black Fury",
    "Red Feather",
    "Lethal Spur",
    "Cyclone",
    "The Executioner",
    "Armored Blade",
    "Broken Crest",
    "Ashen Bolt",
    "Moon Beak"
];

export function cloneRoster(roster) {
    return structuredClone(roster);
}
