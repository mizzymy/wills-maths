# Debug Plan: Neon Runner

## Issues Identified
1.  **No Spawning**: `spawnRow` only called once on mount. Needs to be called continuously in the loop.
2.  **No Collision**: Collision logic inside `gameLoop` is empty and lacks access to current `playerLane`.
3.  **Visual Clustering**: Lane offsets might be too narrow, causing overlap.

## Proposed Fixes

### 1. Game.jsx Refactor
-   **State Management**:
    -   Use `playerLaneRef` to track lane usage inside `requestAnimationFrame`.
    -   Use `obstaclesRef` (or just rely on the functional update state) to track items. Actually, best to keep source of truth in a Ref for the loop, and sync to State for render.
-   **Game Loop**:
    -   Move obstacles by `speed * deltaTime`.
    -   Check `lastSpawnZ`. If `lastSpawnZ > 30` (gap), spawn new row at `Z=0`.
    -   Check Collision: Iterate all obstacles. If `z > 80` (Player zone) and `lane == playerLane`:
        -   If `type == 'correct'`: +Score, Audio, Visual Feedback. Remove obstacle.
        -   If `type == 'wrong'`: Game Over / Damage.
    -   Cleanup: Remove obstacles at `z > 100`.

### 2. Obstacle.jsx Tweaks
-   Increase `laneOffsets` spread to avoid visual overlap.
-   Adjust `scale` formula for better perspective.

### 3. RunnerLogic.js Check
-   Ensure `generateObstacle` produces valid distinct answers.
