# Game Specification: "The Breach"

**Role:** The "Warm-up" / Reflex Trainer.
**Commercial Reference:** *Tetris Effect* meets *Fruit Ninja* (but clicking).
**Hook:** "Enter the Flow State."

## 1. Core Gameplay Loop
1.  **Trigger:** A target number (the "Key") appears at the top (e.g., "[ 10 ]").
2.  **Action:** A grid of falling or floating "Data Nodes" contains numbers (`2`, `8`, `5`, `5`).
3.  **Interaction:** Player taps nodes that **sum** to the Key.
    *   Tap `8`, then `2`. -> **BOOM**. Nodes shatter.
    *   Tap `5`, then `5`. -> **ZAP**. Beam connects them, then shatter.
4.  **Fail Condition:** Grid fills up (Buffer Overflow) or Timer runs out.

## 2. Controls & Mechanics
*   **Input:** Single Tap to select. Tap again to deselect.
*   **Combos:** Clearing a match within 1s of the previous match increases "Heat".
*   **Heat System (Juice):**
    *   **Low Heat:** Standard electronic beeps.
    *   **High Heat:** Music gets bass-heavy. Screen vignette pulses. Nodes glow brighter. "Flow State" achieved.

## 3. Visual & Audio Targets
*   **Visual Style:** "Digital Rain". Background is a scrolling code waterfall.
*   **Nodes:** Hexagonal glass shards. When broken, they shatter into physics particles.
*   **Audio:**
    *   *Select:* High-pitch varied tones (synthesizer).
    *   *Match:* Satisfying "Crunch" or "Glass Break" sound.
    *   *Error:* Low "Bzzzt" error tone.

## 4. Levels & Progression
*   **Level 1: "The Door"**
    *   Target: 10.
    *   Spawns: Pairs only (8+2, 7+3).
    *   Speed: Slow.
*   **Level 2: "The Firewall"**
    *   Target: 20 or 100.
    *   Spawns: Pairs.
    *   Speed: Medium.
*   **Level 3: "The Core" (Endless)**
    *   Target: Changes every 10 matches.
    *   Spawns: Triples introduced (2+2+6=10).

## 5. Technical Requirements
*   **Grid System:** Responsive CSS Grid (`display: grid`).
*   **Particle Engine:** Canvas overlay or simple CSS animations for "Shatter" effect.
*   **State:** Needs to track `currentSum`, `target`, `gridItems`, `comboMultiplier`.
