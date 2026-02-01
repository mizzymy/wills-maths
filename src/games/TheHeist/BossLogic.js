// Logic for The Heist (Boss Battle)

export const BOSS_STATS = {
    1: { name: 'Firewall Daemon', hp: 100, phases: 1, timer: 60, damagePerHit: 10 },
    2: { name: 'Cypher Warden', hp: 200, phases: 2, timer: 90, damagePerHit: 10 },
    3: { name: 'The Architect', hp: 500, phases: 3, timer: 120, damagePerHit: 15 }
};

export const generateShieldProblem = (difficulty = 1) => {
    // Rapid fire arithmetic
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * (difficulty === 1 ? 2 : 3))]; // +,- or +, -, x

    let a, b, ans;

    if (op === '+') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        ans = a + b;
    } else if (op === '-') {
        a = Math.floor(Math.random() * 20) + 10;
        b = Math.floor(Math.random() * 10) + 1;
        ans = a - b;
    } else {
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
        ans = a * b;
    }

    return { question: `${a} ${op} ${b}`, answer: ans };
};

// Boss Attack Mock logic
// Boss attacks periodically, reducing player time or shield?
// For MVP, Boss is a DPS check against the Timer.
