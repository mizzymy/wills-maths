// Core Engine for "The Breach"

export const DIFFICULTY_SETTINGS = {
    // Level 1: Rookie
    1: {
        targetMode: 'random',
        targetMin: 5, targetMax: 15,
        spawnRate: 3500, nodeCount: 16, types: ['pair']
    },
    // Level 2: Agent
    2: {
        targetMode: 'random',
        targetMin: 15, targetMax: 35,
        spawnRate: 3000, nodeCount: 20, types: ['pair', 'triple']
    },
    // Level 3: Veteran
    3: {
        targetMode: 'random',
        targetMin: 35, targetMax: 60,
        spawnRate: 2500, nodeCount: 24, types: ['pair', 'triple']
    },
    // Level 4: Elite
    4: {
        targetMode: 'random',
        targetMin: 60, targetMax: 200,
        spawnRate: 2000, nodeCount: 28, types: ['pair', 'triple', 'quad']
    }
};

/**
 * Generates a grid of numbers where valid combinations exist.
 * @param {number} level 
 * @param {number|null} forcedTarget - If provided, uses this target instead of random
 */
export const generateLevel = (level = 1, forcedTarget = null) => {
    const config = DIFFICULTY_SETTINGS[level] || DIFFICULTY_SETTINGS[1];

    let target;
    if (forcedTarget) {
        target = forcedTarget;
    } else {
        if (config.targetMode === 'weighted' && config.targets) {
            // Pick from educational targets or random range
            target = Math.random() > 0.3
                ? config.targets[Math.floor(Math.random() * config.targets.length)]
                : Math.floor(Math.random() * (config.targetMax - config.targetMin + 1)) + config.targetMin;
        } else {
            target = Math.floor(Math.random() * (config.targetMax - config.targetMin + 1)) + config.targetMin;
        }
    }

    let nodes = [];
    const totalNodes = config.nodeCount;

    // We need to ensure there are at least a few solvable pairs/triples
    let solvableCount = Math.floor(totalNodes * 0.75); // 75% of grid is part of a solution
    let noiseCount = totalNodes - solvableCount;

    // Generate Solvable Sets
    while (solvableCount > 0) {
        // Decide types
        const allowedTypes = config.types;
        // Weighted choice: Pair is always most common
        let type = 'pair';
        if (allowedTypes.includes('quad') && solvableCount >= 4 && Math.random() > 0.8) type = 'quad';
        else if (allowedTypes.includes('triple') && solvableCount >= 3 && Math.random() > 0.6) type = 'triple';

        if (type === 'quad') {
            // a+b+c+d
            let valA = Math.floor(Math.random() * (target / 2)) + 1;
            let valB = Math.floor(Math.random() * (target - valA - 2)) + 1;
            let valC = Math.floor(Math.random() * (target - valA - valB - 1)) + 1;
            let valD = target - valA - valB - valC;

            // Safety
            if (valD < 1) valD = 1;

            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: valA, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: valB, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: valC, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: valD, type: 'standard' });
            solvableCount -= 4;

        } else if (type === 'triple') {
            // a + b + c = target
            let a = Math.floor(Math.random() * (target - 2)) + 1;
            let remainder = target - a;
            let b = Math.floor(Math.random() * (remainder - 1)) + 1;
            let c = remainder - b;

            if (b < 1) b = 1;
            if (c < 1) c = 1;

            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: a, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: b, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: c, type: 'standard' });
            solvableCount -= 3;
        } else {
            // Pair
            let ValA = Math.floor(Math.random() * (target - 1)) + 1;
            let ValB = target - ValA;

            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: ValA, type: 'standard' });
            nodes.push({ id: Math.random().toString(36).substr(2, 9), value: ValB, type: 'standard' });
            solvableCount -= 2;
        }
    }

    // Generate Noise (Distractors)
    for (let i = 0; i < noiseCount; i++) {
        // Noise should still be roughly in range 1..Target
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
