// Core Engine for "The Breach"

export const DIFFICULTY_SETTINGS = {
    1: { targetMin: 10, targetMax: 10, spawnRate: 3000, nodeCount: 12, types: ['pair'] }, // Bonds to 10
    2: { targetMin: 10, targetMax: 20, spawnRate: 2500, nodeCount: 16, types: ['pair'] }, // Bonds to 20
    3: { targetMin: 20, targetMax: 100, spawnRate: 2000, nodeCount: 20, types: ['pair', 'triple'] } // Bonds to 100
};

/**
 * Generates a grid of numbers where valid combinations exist.
 * @param {number} level 
 */
export const generateLevel = (level = 1) => {
    const config = DIFFICULTY_SETTINGS[level] || DIFFICULTY_SETTINGS[1];
    const target = Math.floor(Math.random() * (config.targetMax - config.targetMin + 1)) + config.targetMin;

    let nodes = [];
    const totalNodes = config.nodeCount;

    // We need to ensure there are at least a few solvable pairs/triples
    let solvableCount = Math.floor(totalNodes * 0.6); // 60% of grid is part of a solution
    let noiseCount = totalNodes - solvableCount;

    // Generate Solvable Sets
    while (solvableCount > 0) {
        // For now, simple pairs
        let ValA = Math.floor(Math.random() * (target - 1)) + 1;
        let ValB = target - ValA;

        // Add pair to grid
        nodes.push({ id: Math.random().toString(36).substr(2, 9), value: ValA, type: 'standard' });
        nodes.push({ id: Math.random().toString(36).substr(2, 9), value: ValB, type: 'standard' });
        solvableCount -= 2;
    }

    // Generate Noise (Distractors)
    for (let i = 0; i < noiseCount; i++) {
        // Random numbers that likely don't sum perfectly with others instantly
        let val = Math.floor(Math.random() * target) + 1;
        nodes.push({ id: Math.random().toString(36).substr(2, 9), value: val, type: 'noise' });
    }

    // Shuffle
    nodes = nodes.sort(() => Math.random() - 0.5);

    return { target, nodes };
};

export const checkSolution = (selectedNodes, target) => {
    const sum = selectedNodes.reduce((acc, node) => acc + node.value, 0);

    if (sum === target) {
        return { valid: true, nodes: selectedNodes };
    } else if (sum > target) {
        return { valid: false, reason: 'overflow' }; // Too high
    } else {
        return { valid: false, reason: 'incomplete' }; // Too low
    }
};
