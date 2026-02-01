# Rewards & Achievements System: The Dopamine Engine

**Philosophy:** Every pixel and sound wave must celebrate the player's success.
**Core Loop:** Math Prowess -> Bits (Currency) -> Rank -> "The Glitch" (Narration/Lore).

## 1. The Economy: "Math is Money" (Bits ₿)
*   **Base Pay:**
    *   Correct Answer: +1 Bit.
    *   Combo (>5 streak): +2 Bits.
    *   Perfect Game: +50 Bits Bonus.
*   **The "Juice" (Audio/Visual):**
    *   **Visual:** Bits don't just appear; they spawn at the point of the correct answer and physically "fly" to the wallet in the top right.
    *   **Audio:** `sfx_global_coin_fly.mp3` (High pitch flutter) -> `sfx_global_coin_land.mp3` (Satisfying mechanical *clink*). Pitch rises with each collected bit in a streak (C -> E -> G -> C).

## 2. Achievement System (The "Syndicate Records")
Achievements are not just checkmarks; they are **Medals** displayed on the player's ID Card.

| Achievement ID | Name | Trigger | Reward | Audio Cue |
| :--- | :--- | :--- | :--- | :--- |
| `ACH_SPEED_1` | **Neural Overclock** | Answer 10 Qs in < 5 seconds. | Neon Blue Badge | `sfx_achiev_speed.mp3` (Jet engine fast pass) |
| `ACH_RICH_1` | **Whale** | Accumulate 1,000 Bits. | Gold Border | `sfx_achiev_rich.mp3` (Heavy vault thud + coins) |
| `ACH_STREAK_1` | **Unstoppable** | 50 Correct in a row. | Flaming UI | `sfx_achiev_fire.mp3` (Ignition sound) |
| `ACH_BOSS_1` | **God Slayer** | Defeat 'The Warden' with 100% HP. | "Glitch" Skin | `sfx_achiev_glitch.mp3` (Distorted bass drop) |

**audio/sfx/achievements/**
*   `sfx_achiev_generic_unlock.mp3` (0.8s): A positive, rising synth chord.
*   `sfx_achiev_rare_unlock.mp3` (1.5s): Orchestral hit + shimmer.

## 3. The Loot System: "Data Decryption" (Gacha)
Instead of "Buying" items, players "Decrypt" hacked data packs. This builds anticipation.

### The Sequence (Step-by-Step)
1.  **Selection:** Player spends 100 Bits on a "Corrupt Data Pack".
    *   *Visual:* A glitchy, shaking cube appears on screen.
    *   *Audio:* `sfx_loot_box_shake.mp3` (Rumbling, Geiger counter ticking).
2.  **The Build-Up (Input):** Player must hold "DECRYPT".
    *   *Visual:* A progress bar fills rapidly. The cube glows brighter white.
    *   *Audio:* `sfx_loot_charge_up.mp3` (Rising sine wave, increasing pitch/volume).
3.  **The Climax (Release):**
    *   *Visual:* Screen flashes white. Cube shatters.
    *   *Audio:* `sfx_loot_explode.mp3` (Thunder crack + Glass shatter).
4.  **The Reveal:**
    *   *Visual:* The Item spins in slow motion (+Rarity Glow).
    *   *Audio:*
        *   **Common:** `sfx_rarity_common.mp3` (Simple beep).
        *   **Rare:** `sfx_rarity_rare.mp3` (Stereo delay echo).
        *   **Legendary:** `sfx_rarity_legendary.mp3` (Angelic choir chord).

## 4. Rank System (Progression)
*   **Visual:** The Player's Rank (e.g., "Script Kiddie") is always visible.
*   **Promotion Event:**
    *   When XP fills -> "SYSTEM OVERRIDE" overlay.
    *   Old Rank *glitches* out. New Rank slams in letter-by-letter.
    *   Audio: `sfx_rank_promotion.mp3` (Heavy industrial slam for each letter).

## 5. Audio Implementation Strategy
*   **Folder:** `public/assets/audio/rewards/`
*   **Prefetching:** Reward sounds are preloaded on App Boot. They cannot lag.
*   **Prioritization:** Interaction sounds (Gameplay) duck (lower volume) by 50% when an Achievement sound plays.
