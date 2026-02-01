# App Design: Wills Maths (Theme: Cyber Syndicate)

**Target Audience:** Children 10-12 years old.
**Platform:** Mobile (PWA/Web First, capable of wrapping).
**Theme:** Cyberpunk / Secret Agent. "Non-educational" feel. Cool, dark mode, neon accents, glitch effects.

## Core Concept
Players are new recruits in the "Syndicate", a high-tech group of elite troubleshooters. To complete missions (games), they need to hack systems, escape security, and trade assets—all of which require rapid mental math.
**Currency:** "Bits" (₿) and "Reputation".
**Loop:** Play Games → Earn Bits → Upgrade Cyberdeck/Hideout/Avatar → Unlock High-Stakes Missions.

---

## The 5 Games (Missions)

### 1. The Breach (Reflex Recall)
*   **Concept:** Fast-paced "hacking". Numbers fall or appear on a grid. Player must tap the correct answer to "break the firewall" before time runs out.
*   **Math Focus:** Number bonds (pairs to 10, 20, 100), simple addition/subtraction recall.
*   **Gameplay:**
    *   Screen shows "Target: 10". Falling blocks have numbers `8`, `3`, `2`, `5`. Player taps `8` then `2`.
    *   Combo streaks speed up the music and visual effects.
*   **Visuals:** Matrix-style digital rain, neon green/red flashes.

### 2. Neon Runner (Multiplication Chase)
*   **Concept:** Endless runner (or bike chase). The player is on a futuristic bike escaping a security drone.
*   **Math Focus:** Times tables.
*   **Gameplay:**
    *   The road splits into 3 lanes. Gates block the way.
    *   Gate shows "7 x 6". Lanes show `42`, `48`, `36`.
    *   Swipe to the correct lane to boost through. Wrong lane slows you down (drone gets closer).
*   **Visuals:** Tron-like grid, frantic sense of speed, motion blur.

### 3. Black Market (Trade & Profit)
*   **Concept:** A trading sim minigame. Buy low, sell high.
*   **Math Focus:** Quick mental arithmetic, profit calculation, currency handling.
*   **Gameplay:**
    *   NPC offers items: "I'll sell you 3 Data Chips for 50 Bits each." (Total 150).
    *   Another buyer offers: "I need 3 Data Chips, I'll pay 180 total."
    *   Player must decide quickly: "Deal" or "No Deal". (Profit = 30).
*   **Visuals:** Gritty cyberpunk alleyway UI, hologram inventory.

### 4. Encryption Protocol (Logic & Patterns)
*   **Concept:** Cracking a safe combination or unlocking a door.
*   **Math Focus:** Sequences, patterns, jumping numbers (e.g., 2, 4, 8, ?).
*   **Gameplay:**
    *   A dial or keypad is shown with a missing slot.
    *   "25, 50, 75, [?]".
    *   Drag and drop the correct chip into the slot to verify.
    *   Harder levels introduce multi-step logic (+2, -1, +2...).
*   **Visuals:** High-security vault interface, tumblers clicking, lasers.

### 5. The Heist (Boss Battle)
*   **Concept:** A multi-stage challenge combining skills. Defeat a "Security AI".
*   **Math Focus:** Mixed review (All of the above).
*   **Gameplay:**
    *   **Phase 1:** Dodge attack (Equation answer determines safe spot).
    *   **Phase 2:** Attack boss (Solve multiplication to charge weapon).
    *   **Phase 3:** Hack finale (Pattern matching).
*   **Visuals:** Giant AI face or robot antagonist, intense screen shake on hits, health bars.

---

## Progression & Economy

*   **Ranks:** Rookie → Hacker → Operator → Elite → Mastermind.
*   **Shop ($$$):**
    *   Spend 'Bits' on visual upgrades: New Bike skins, new Avatar outfits, neon UI colors.
    *   **No power-ups that skip math** (we want them to learn). Key upgrades might be "Multipliers" (earn gold faster) to encourage replay.
*   **Daily Contracts:** "Complete 3 Breach runs" for bonus Bits.

## Implementation Phases

### Phase 1: Core Framework (UI & Navigation)
*   Setup Project (Vite + React).
*   Global State (Currency, XP, Unlocks).
*   Main Menu (The "Hideout").

### Phase 2-6: Game Development
*   Implement one game at a time.
    *   Logic (Math generation).
    *   Gameplay Loop (Input/Feedback).
    *   Polish (Animations/Sound).

### Phase 7: Polish & Assets
*   Unified Sound Effects.
*   Particle Systems (Sparks, Glitches).
*   Onboarding/Tutorial.
