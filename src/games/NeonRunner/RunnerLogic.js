// Logic for Neon Runner

export const LANE_COUNT = 3;
export const BASE_SPEED = 10;
export const SPEED_INCREMENT = 0.5;

// Math Questions Generator
// Math Questions Generator
export const generateObstacle = (difficulty = 1) => {
    // KS2 Difficulty Tiers
    let validTables = [];

    if (difficulty === 1) validTables = [1, 2, 3];
    else if (difficulty === 2) validTables = [4, 5, 6, 10];
    else if (difficulty === 3) validTables = [7, 8, 9, 11, 12];
    else validTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Elite

    const factorA = validTables[Math.floor(Math.random() * validTables.length)];
    const factorB = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const correctAnswer = factorA * factorB;

    // Generate distractors (answers that are close)
    let distractors = [
        correctAnswer + (Math.random() > 0.5 ? factorA : -factorA), // +/- one factor
        correctAnswer + (Math.random() > 0.5 ? 10 : -10)            // +/- 10
    ];

    // Ensure unique and positive
    distractors = distractors.map(d => Math.abs(d) || 2);
    if (distractors[0] === correctAnswer) distractors[0] += 1;
    if (distractors[1] === correctAnswer) distractors[1] -= 1;
    if (distractors[0] === distractors[1]) distractors[1] += 2;

    // Randomize placement
    const correctLane = Math.floor(Math.random() * LANE_COUNT);

    const lanes = [];
    let distractorIdx = 0;

    for (let i = 0; i < LANE_COUNT; i++) {
        if (i === correctLane) {
            lanes.push({ type: 'correct', value: correctAnswer, label: `${factorA} x ${factorB}` });
        } else {
            lanes.push({ type: 'wrong', value: distractors[distractorIdx], label: `${distractors[distractorIdx]}` });
            distractorIdx++;
        }
    }

    return { lanes, id: Math.random().toString(36).substr(2, 9), z: -100 }; // Start far back
};
