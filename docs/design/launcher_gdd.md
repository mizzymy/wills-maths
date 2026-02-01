# Master Design Document: The Launcher ("Syndicate OS")

**Project Code:** Wills Maths
**Genre:** Gamified Education Platform / RPG Lite
**Target Demographic:** 10-12 Years (Key Stage 2/3 transition)
**Core Pillar:** "Math is the tool, not the task."

## 1. High-Level Concept
The "App" is not a menu; it is a **Device**. The user is an agent of "The Syndicate", a futuristic organization of digital troubleshooters. The Launcher is their **Cyberdeck** interface. From here, they accept contracts (games), manage their earnings, and upgrade their setup.

## 2. User Experience (UX) & UI Flow
### 2.1 The "Diegetic" Interface - Ultra Premium
*   **Juice & Polish:** Every button press must feel like firing a gun or cracking a safe.
    *   **Particles:** Sparks fly when you collect Bits.
    *   **Screen Shake:** Subtle thuds on menu navigation.
*   **Immersion First:** No standard buttons. The "Play" button is a "Connect" toggle.
*   **Visual Language:** Dark Mode, High Contrast Neon (Cyberpunk 2077 quality), Glitch effects.

### 2.2 The Loop (Launcher Level)
1.  **Login (Boot Sequence):** Bio-metrics scan (FaceID or simple tap). "Welcome Agent."
2.  **Dashboard (The Hub):** View active contracts (Daily Goals), Current Rank, and 'Bit' balance.
3.  **Mission Select (The Map):** A holographic globe or city map. Select a sector to play a specific Game.
4.  **After-Action Report (AAR):** After any game, return to Launcher for XP gain, Loot drops, and Rank progress bars.

## 3. Metagame & Economy
### 3.1 Currency: "Bits" (₿)
*   **Source:** Earnings from contracts (Math games). High accuracy = High pay.
*   **Sink:** The "Black Market".
    *   **Cosmetics:** Avatar frames, Cyberdeck skins, Neon color palettes.
    *   **Utility (Non-Pay-to-Win):** "Ram Upgrades" (Unlocks harder stats tracking), "Music Chips" (New BGM tracks).

### 3.2 Progression: "Clearance Level"
*   **Ranks:** Script Kiddie (Lvl 1) -> Hacktivist -> Operative -> Ghost -> Architect.
*   **Gating:** Higher ranks unlock harder difficulty tiers and new Game Modes.
*   **Retention:** "Daily Contracts" (e.g., "Crack 5 Firewalls with 100% accuracy") provide reason to return.

## 4. Technical Framework (The "Spine")
*   **Single Page Application (SPA):** Seamless transitions. No page reloads.
*   **Asset Management:** Assets are pre-loaded in the Launcher to ensure instant game start.
*   **Data Persistence:** LocalStorage first, syncing to Cloud (if backend added).
*   **App Lifecycle:**
    *   `Launcher` -> `GameInstance` -> `ResultData` -> `Launcher`.

## 5. Commercial Viability Hooks
*   **"Juice":** Even the menu must feel good. Particle effects on currency update. Screen shake on rank up.
*   **The "Collection" Aspect:** Gotta buy all the skins.
## 6. The Dopamine Loop (Retention Engineering)
*   **The "Loot Box" Effect (Ethical):**
    *   Completing a Daily Contract rewards a "Decrypting Data Pack".
    *   **The Reveal:** A 5-second animation of code scrolling, lights flashing, and a "LEGENDARY" gold glow before revealing a new Avatar item.
*   **Streak Fire:**
    *   Day 3+ Streak: The UI literally catches fire (neon blue flames).
    *   Loss Aversion: "Don't let the flame die out!"
*   **Sensory Overload:**
    *   Level Up? The screen freezes, colors invert, bass drop, and the new Rank slams onto the screen.

