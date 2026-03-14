export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
