export const diccionarioColores = [
    { hex: '#FFCB05', nombre: 'Amarillo Eléctrico' },
    { hex: '#3466AF', nombre: 'Azul Rey' },
    { hex: '#6890F0', nombre: 'Azul Celeste' },
    { hex: '#FF0000', nombre: 'Rojo Fuego' },
    { hex: '#CC0000', nombre: 'Carmesí' },
    { hex: '#78C850', nombre: 'Verde Hoja' },
    { hex: '#49896F', nombre: 'Verde Bosque' },
    { hex: '#C5915D', nombre: 'Marrón Claro' },
    { hex: '#8B4513', nombre: 'Marrón Óxido' },
    { hex: '#A040A0', nombre: 'Púrpura Veneno' },
    { hex: '#7C6EBB', nombre: 'Morado Fantasma' },
    { hex: '#F85888', nombre: 'Rosa Hada' },
    { hex: '#FFB6C1', nombre: 'Rosa Claro' },
    { hex: '#A9A9A9', nombre: 'Gris Plata' },
    { hex: '#5B6370', nombre: 'Gris Acero' }
];

export function getRandomColor() {
    return diccionarioColores[Math.floor(Math.random() * diccionarioColores.length)].hex;
}

export const archetypes = {
    balanced: { maxHp: 105, attack: 70, defense: 68, speed: 67, critBonus: 0.01, dodgeBonus: 0.01, blockBonus: 0.02, variance: 0.04 },
    tank: { maxHp: 118, attack: 58, defense: 84, speed: 50, critBonus: 0, dodgeBonus: 0, blockBonus: 0.08, variance: 0.03 },
    agile: { maxHp: 96, attack: 78, defense: 54, speed: 82, critBonus: 0.03, dodgeBonus: 0.06, blockBonus: 0, variance: 0.06 },
    aggressive: { maxHp: 101, attack: 82, defense: 56, speed: 71, critBonus: 0.05, dodgeBonus: 0.01, blockBonus: -0.01, variance: 0.08 },
    technical: { maxHp: 103, attack: 67, defense: 71, speed: 69, critBonus: 0.02, dodgeBonus: 0.02, blockBonus: 0.04, variance: 0.02 }
};

function createFighter({ id, name, rarity, archetype, level = 1, xp = 0 }) {
    return {
        id, name, rarity, archetype, level, xp, color: getRandomColor(),
        ...archetypes[archetype]
    };
}

export const starterRoster = [
    createFighter({ id: "golden-rooster", name: "Gallo de Oro", rarity: "common", archetype: "balanced" }),
    createFighter({ id: "iron-beak", name: "Pico de Hierro", rarity: "common", archetype: "tank" }),
    createFighter({ id: "swift-shadow", name: "Sombra Fugaz", rarity: "rare", archetype: "agile" })
];

export const rivalPool = ["Fuero Negro", "Pluma Roja", "Espolón Letal", "Ciclón", "El Verdugo", "Navaja Blindada", "Cresta Rota"];

export function cloneRoster(roster) {
    return structuredClone(roster);
}