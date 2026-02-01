# Game Specification: "Neon Runner"

**Role:** The "Adrenaline" / Times Tables Trainer.
**Commercial Reference:** *Subway Surfers* meets *Tron*.
**Hook:** "Speed is Life."

## 1. Core Gameplay Loop
1.  **Movement:** Auto-running forward on a 3-lane neon highway.
2.  **Challenge:** A "Security Gate" approaches rapidly. It displays a problem: `7 x 8`.
3.  **Choice:** The three lanes display answers: `54` | `56` | `62`.
4.  **Action:** Swipe left/right to hit the correct lane.
5.  **Payoff:**
    *   **Correct:** The bike glows, boosts speed (FOV widens), and smashes the gate into glass shards.
    *   **Incorrect:** Crash. glitch effect, slow down. "Security Drone" gets closer.

## 2. Dopamine Mechanics
*   **Speed Ramping:** The game starts slow but *accelerates* with every correct answer. The music BPM matches the speed.
*   **"Fever Mode":** 10 correct answers in a row = **OVERDRIVE**.
    *   Invincible for 5 seconds.
    *   Auto-collects all coins.
    *   Screen goes monochromatic with neon outlines.
*   **Near Miss:** Swiping at the *last possible millisecond* gives a "Daredevil Bonus" (+Bits).

## 3. Visual & Audio Targets
*   **Aesthetics:** Synthwave purple/grid.
*   **The Bike:** Upgradable skins (Tron lightcycle, Akira bike). Trails behind the bike.
*   **Audio:** Driving Synthwave bass.
    *   *Correct:* High-pitched "Ching!" (Coin sound).
    *   *Boost:* Jet engine roar.

## 4. Educational Tuning
*   **Adaptive Speed:** If the user fails `7x8`, the next gate slows down slightly and repeats `7x8` later.
*   **Visual Subliminals:** The correct answer glows *faintly* 1 second before impact in "Rookie" mode to train pattern recognition.
