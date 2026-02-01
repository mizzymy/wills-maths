# WILLS MATHS: PROJECT BIBLE (Start Here)

**Context:** This document is the **Master Map**. If you are lost, return here.

## 1. The Vision (Read First)
*   **[Launcher GDD (The Platform)](./design/launcher_gdd.md)**
    *   **What it is:** The "Syndicate OS". The Metagame, UI Flow, and Rank System.
    *   **Key Concept:** The app is a "Cyberdeck", not a menu.
    *   **Read for:** UX Flow, Theme, Core Loop.

## 2. The Mechanics (The "Addiction")
*   **[Rewards & Economy System](./design/rewards_system.md)**
    *   **What it is:** The Dopamine Engine. Bits, Loot Crates, and Achievements.
    *   **Key Concept:** "The Reveal" sequence and Audio/Visual payoffs.
    *   **Read for:** Loot Box logic, Coin spawning physics, Achievement IDs.

*   **[Educational Framework](./design/educational_framework.md)**
    *   **What it is:** The Hidden Curriculum.
    *   **Key Concept:** Math is the "Ammo".
    *   **Read for:** Difficulty scaling logic and Curriculum alignment.

## 3. The Missions (Game Specifications)
Build these one by one. Do not start Game 2 until Game 1 is polished.

*   **Game 1:** **[The Breach (Reflex)](./design/game_specs/01_the_breach.md)** (Start Here)
*   **Game 2:** **[Neon Runner (Speed)](./design/game_specs/02_neon_runner.md)**
*   **Game 3:** **[Black Market (Strategy)](./design/game_specs/03_black_market.md)**
*   **Game 4:** **[Encryption Protocol (Logic)](./design/game_specs/04_encryption.md)**
*   **Game 5:** **[The Heist (Bosses)](./design/game_specs/05_the_heist.md)**

## 4. The Assets
*   **[Audio Bible](./design/audio_bible.md)**
    *   **What it is:** The Inventory of every sound effect.
    *   **Key Concept:** "Cyberpunk Palette" (WebM/MP3).
    *   **Status:** Placeholders generated in `public/assets/audio/`.

*   **[Visual Asset List (Art Bible)](./design/visual_asset_list.md)**
    *   **What it is:** The list of Icons, Sprites, and UI elements.
    *   **Key Concept:** Neon SVG icons and Rank PNGs.

## 5. Technical Implementation
*   **[Implementation Plan](./implementation_plan.md)**
    *   **Stack:** React + Vite + PWA.
    *   **Architecture:** `GameContext` (Global State).

*   **[Data Schema (The Brain)](./design/data_schema.md)**
    *   **What it is:** The structure of the Save File (`localStorage`).
    *   **Key Concept:** JSON structure for Profile, Inventory, and Stats.

---
**Development Order:**
1.  **Launcher Dashboard** (UI Framework)
2.  **Rewards System** (Economy Logic)
3.  **Game 1: The Breach** (First Playable)
4.  **Games 2-5** (Expansion)
