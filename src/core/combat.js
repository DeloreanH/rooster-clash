import { wait } from "./utils.js";

const battleImages = {
    player: {
        idle: "/gallo_defensa.png",
        attack: "/gallo_ataque.png",
        ko: "/gallo_Vencido.png"
    },
    opponent: {
        idle: "/gallo_defensaDerecha.png",
        attack: "/gallo_ataqueDerecha.png",
        ko: "/gallo_VencidoDerecha.png"
    }
};

export function createCombatant(fighter) {
    return {
        ...structuredClone(fighter),
        hp: fighter.maxHp
    };
}

export function rollDice() {
    return (Math.floor(Math.random() * 6) + 1) * 10;
}

function randomMultiplier(variance = 0.04) {
    const min = 1 - variance;
    const max = 1 + variance;
    return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function calculateInitiative(a, b) {
    const scoreA = a.speed + Math.random() * 12;
    const scoreB = b.speed + Math.random() * 12;
    return scoreA >= scoreB ? [a, b] : [b, a];
}

export function resolveAttack(attacker, defender) {
    const attackTempo = randomMultiplier(attacker.variance);
    const defenseTempo = randomMultiplier(defender.variance);
    const attackRoll = rollDice();
    const defenseRoll = rollDice();
    const attackPower = attacker.attack * attackTempo + attackRoll + attacker.speed * 0.18;
    const defensePower = defender.defense * defenseTempo + defenseRoll + defender.speed * 0.1;

    const dodgeChance = clamp(
        0.04 + defender.dodgeBonus + (defender.speed - attacker.speed) * 0.0015,
        0.02,
        0.22
    );
    const didDodge = Math.random() < dodgeChance;

    if (didDodge) {
        return {
            attackPower: Math.round(attackPower),
            defensePower: Math.round(defensePower),
            damage: 0,
            didCrit: false,
            didDodge: true,
            didBlock: false
        };
    }

    const critChance = clamp(
        0.06 + attacker.critBonus + (attacker.speed - defender.speed) * 0.001,
        0.04,
        0.2
    );
    const didCrit = Math.random() < critChance;

    const blockChance = clamp(
        0.08 + defender.blockBonus + (defender.defense - attacker.attack) * 0.0008,
        0.03,
        0.24
    );
    const didBlock = Math.random() < blockChance;

    const rawEdge = attackPower - defensePower;
    let damage = rawEdge > 0
        ? attacker.attack * 0.08 + rawEdge * 0.3
        : Math.max(2, attacker.attack * 0.04 + rawEdge * 0.08);

    if (didCrit) {
        damage *= 1.22;
    }

    if (didBlock) {
        damage *= 0.72;
    }

    damage = Math.max(2, Math.round(damage));
    defender.hp -= damage;

    return {
        attackPower: Math.round(attackPower),
        defensePower: Math.round(defensePower),
        damage,
        didCrit,
        didDodge,
        didBlock
    };
}

export function applyVictoryRewards(playerRoster, playerId, opponent) {
    const fighter = playerRoster.find((item) => item.id === playerId);
    if (!fighter) {
        return null;
    }

    const weightedHpDiff = Math.round((opponent.maxHp - fighter.maxHp) * 0.5);
    const modifierBase = weightedHpDiff + (opponent.attack - fighter.attack) + (opponent.defense - fighter.defense);
    const modifier = Math.max(-80, Math.min(80, modifierBase * 2));
    const gainedExp = 100 + modifier;

    fighter.xp += gainedExp;

    let leveledUp = false;
    let neededExp = fighter.level * 100;

    while (fighter.xp >= neededExp && fighter.level < 99) {
        fighter.xp -= neededExp;
        fighter.level += 1;
        fighter.maxHp += 5;
        fighter.attack = Math.min(200, fighter.attack + 2);
        fighter.defense = Math.min(200, fighter.defense + 2);
        fighter.speed = Math.min(200, fighter.speed + 1);
        leveledUp = true;
        neededExp = fighter.level * 100;
    }

    if (fighter.level >= 99) {
        fighter.xp = neededExp;
    }

    return {
        gainedExp,
        modifier,
        leveledUp,
        fighter
    };
}

export async function runLocalCombat({ player, opponent, onUpdate, onLog }) {
    const left = createCombatant(player);
    const right = createCombatant(opponent);
    const [first, second] = calculateInitiative(left, right);
    let round = 1;

    onLog(`Intro: ${left.name} enters the arena.`);
    await wait(700);
    onLog(`Intro: ${right.name} answers the challenge.`);
    await wait(700);
    onLog(`${first.name} takes initiative thanks to superior speed.`);
    await wait(450);

    while (left.hp > 0 && right.hp > 0) {
        onLog(`Round ${round} begins.`, "system");
        await wait(300);

        await executeTurn(first, second, left, right, onUpdate, onLog);
        if (left.hp <= 0 || right.hp <= 0) {
            break;
        }

        await executeTurn(second, first, left, right, onUpdate, onLog);

        if (left.hp > 0 && right.hp > 0) {
            onLog(`Both fighters reset their footing before the next exchange.`);
            await wait(250);
            round += 1;
        }
    }

    const winner = left.hp > 0 ? left : right.hp > 0 ? right : null;

    return {
        winner,
        player: left,
        opponent: right
    };
}

async function executeTurn(attacker, defender, left, right, onUpdate, onLog) {
    onUpdate({
        left,
        right,
        images: {
            left: attacker.id === left.id ? battleImages.player.attack : left.hp <= 0 ? battleImages.player.ko : battleImages.player.idle,
            right: attacker.id === right.id ? battleImages.opponent.attack : right.hp <= 0 ? battleImages.opponent.ko : battleImages.opponent.idle
        }
    });

    onLog(`${attacker.name}'s turn.`);
    await wait(320);

    const result = resolveAttack(attacker, defender);
    onLog(`${attacker.name} pushes with ${result.attackPower} effective attack.`);
    await wait(220);
    onLog(`${defender.name} answers with ${result.defensePower} effective defense.`);
    await wait(220);

    if (result.didDodge) {
        onLog(`${defender.name} dodges at the last second.`);
    } else if (result.damage > 0) {
        if (result.didCrit) {
            onLog(`Critical hit by ${attacker.name}.`);
            await wait(180);
        }

        if (result.didBlock) {
            onLog(`${defender.name} blocks part of the impact.`);
            await wait(180);
        }

        onLog(`${defender.name} takes ${result.damage} damage.`);
    } else {
        onLog(`${defender.name} stops the strike.`);
    }

    onUpdate({
        left,
        right,
        images: {
            left: left.hp <= 0 ? battleImages.player.ko : battleImages.player.idle,
            right: right.hp <= 0 ? battleImages.opponent.ko : battleImages.opponent.idle
        }
    });

    await wait(320);
}
