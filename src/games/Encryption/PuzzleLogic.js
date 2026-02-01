// Logic for Encryption Protocol

export const PUZZLE_TYPES = [
    'linear', // + n
    'geometric', // * n
    'fibonacci', // n + (n-1)
    'square' // n^2
];

export const generatePuzzle = (difficulty = 1) => {
    const type = difficulty === 1 ? 'linear'
        : difficulty === 2 ? (Math.random() > 0.5 ? 'linear' : 'geometric')
            : PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)];

    let sequence = [];
    let answer = 0;
    let rule = "";

    if (type === 'linear') {
        const start = Math.floor(Math.random() * 20);
        const step = Math.floor(Math.random() * 5) + 2;
        rule = `+${step}`;
        for (let i = 0; i < 5; i++) sequence.push(start + (i * step));
    }
    else if (type === 'geometric') {
        const start = Math.floor(Math.random() * 5) + 1;
        const factor = Math.floor(Math.random() * 2) + 2; // *2 or *3
        rule = `x${factor}`;
        for (let i = 0; i < 5; i++) sequence.push(start * Math.pow(factor, i));
    }
    else if (type === 'fibonacci') {
        let a = 1, b = 1;
        sequence.push(a, b);
        for (let i = 2; i < 6; i++) {
            const next = a + b;
            sequence.push(next);
            a = b;
            b = next;
        }
        rule = "Fibonacci";
    }
    else if (type === 'square') {
        const start = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < 5; i++) {
            const n = start + i;
            sequence.push(n * n);
        }
        rule = "Squares";
    }

    // Remove one item (Index 3 usually good difficulty)
    const missingIndex = 3;
    answer = sequence[missingIndex];
    sequence[missingIndex] = '?';

    return { type, sequence, answer, id: Math.random().toString(36).substr(2, 9) };
};
