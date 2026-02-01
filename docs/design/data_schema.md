# Data Schema (The Brain)

**Storage Strategy:** `localStorage` (Persisted) + React Context (Runtime).
**Key:** `wm_save_v1`

## 1. Main Save Object (`wm_save_v1`)
This JSON object contains the entire player progress.

```json
{
  "user": {
    "id": "uuid-v4-string",
    "name": "Agent_001",
    "createdAt": "ISO-8601-Date"
  },
  "economy": {
    "bits": 1450,
    "lifetime_bits": 5000,
    "inventory": [
      { "id": "skin_bike_neon", "acquiredAt": "ISO-Date" },
      { "id": "avatar_frame_gold", "acquiredAt": "ISO-Date" }
    ]
  },
  "progression": {
    "rank_id": "rank_02_hacker",
    "xp": 450,
    "xp_to_next": 1000,
    "level": 5
  },
  "stats": {
    "games_played": 42,
    "accuracy_global": 0.89,
    "streaks": {
      "current": 5,
      "best": 22
    },
    "weaknesses": ["7x", "12x", "8+6"] 
  },
  "unlocks": {
    "game_2_runner": true,
    "game_3_market": false,
    "game_4_encrypt": false,
    "game_5_heist": false
  },
  "settings": {
    "audio_master": 1.0,
    "audio_sfx": 0.8,
    "audio_bgm": 0.6,
    "haptics": true,
    "low_power_mode": false
  }
}
```

## 2. Game Session Result (Runtime Only)
When a game finishes, this object is generated and passed to the Result Screen.

```json
{
  "game_id": "game_01_breach",
  "score": 1500,
  "bits_earned": 25,
  "accuracy": 0.95,
  "mistakes": [
    { "q": "8+3", "input": "12", "time": 1.2 }
  ],
  "new_best_score": true
}
```

## 3. Educational Tracking (Analytics)
We track specific "Skill Buckets" to customize difficulty.

```json
"skill_buckets": {
  "addition_basic": { "level": 3, "confidence": 0.99 },
  "multiplication_7": { "level": 1, "confidence": 0.45 }, 
  "patterns_linear": { "level": 2, "confidence": 0.70 }
}
```
*   **Logic:** If `confidence` < 0.60, the Launcher recommends training that skill.
