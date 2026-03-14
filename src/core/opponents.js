import { archetypes, rivalPool, getRandomColor } from "../data/characters.js";
import { randomInt, shuffle } from "./utils.js";

const rivalArchetypes = ["balanced", "tank", "agile", "aggressive", "technical"];

export function generateOpponents(count = 2) {
    return shuffle(rivalPool).slice(0, count).map((name, index) => {
        const archetype = rivalArchetypes[index % rivalArchetypes.length];
        const template = archetypes[archetype];
        const swing = () => randomInt(-4, 4);

        return {
            id: `rival-${index}-${name.toLowerCase().replace(/\s+/g, "-")}`,
            name, rarity: "enemy", archetype, level: randomInt(1, 4), xp: 0,
            maxHp: template.maxHp + swing(),
            attack: template.attack + swing(),
            defense: template.defense + swing(),
            speed: template.speed + swing(),
            color: getRandomColor(), // <-- Color inyectado
            critBonus: template.critBonus, dodgeBonus: template.dodgeBonus,
            blockBonus: template.blockBonus, variance: template.variance
        };
    });
}