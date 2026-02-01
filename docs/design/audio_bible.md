# Audio Bible: Wills Maths (Syndicate OS)

**Goal:** Create a cohesive "Cyberpunk" sonic palette.
**Audio Engine:** `Howler.js` (suggested for Web Audio management).

## 1. Technical Standards (Mobile Web Optimized)
| Type | Format | Bitrate/Depth | Channels | Target Size |
| :--- | :--- | :--- | :--- | :--- |
| **BGM (Music)** | `.mp3` (Universal Loop) | 128-160 kbps | Stereo | < 1.5 MB |
| **SFX (One-shots)** | `.webm` (Primary) + `.mp3` (Fallback) | 16-bit 44.1kHz | Mono (mostly) | < 100 KB |
| **UI (Clicks)** | `.webm` | 16-bit 44.1kHz | Mono | < 20 KB |

## 2. File Organization & Naming
**Root Path:** `public/assets/audio/`

**Naming Convention:** `[category]_[context]_[action]_[variant].[ext]`
*   *Example:* `sfx_ui_confirm_01.mp3`

### Directory Structure
```text
/audio
  /bgm          (Background Loops)
  /sfx
    /ui         (Global Interface sounds)
    /breach     (Game 1 specific)
    /runner     (Game 2 specific)
    /market     (Game 3 specific)
    /encrypt    (Game 4 specific)
    /heist      (Game 5 specific)
```

## 3. Asset Inventory & Usage

### A. Global / Launcher (The Cyberdeck)
**Music:**
*   `bgm_launcher_ambience.mp3` (Loop): Dark, throbbing synth bass. Rain sounds. (Length: 0:50)

**SFX:**
*   `sfx_ui_boot_sequence.mp3`: Computer booting up, hard drive spin. (2.5s)
*   `sfx_ui_hover_master.mp3`: High-tick chirps when scrolling. (0.05s)
*   `sfx_ui_confirm_heavy.mp3`: Accepting a mission. Bass thud + metallic latch. (0.5s)
*   `sfx_ui_error_glitch.mp3`: "Access Denied" buzz. (0.4s)
*   `sfx_ui_xp_gain.mp3`: Rapid high-pitch filling sound (like collecting coins). (1.0s)

### B. Game 1: The Breach (Reflex)
**Music:**
*   `bgm_breach_flow.mp3`: Fast breakbeat, high Hi-hats. "Hacking" music. (Length: 1:20)

**SFX:**
*   `sfx_breach_node_select.mp3`: Digital "blip". (0.1s)
*   `sfx_breach_node_deselect.mp3`: Lower pitch "blip". (0.1s)
*   `sfx_breach_glass_shatter.mp3`: **Primary Dopamine Sound.** Clean glass breaking + chime. (0.6s)
*   `sfx_breach_combo_fire.mp3`: Rising pitch swoosh for streaks. (0.8s)

### C. Game 2: Neon Runner (Speed)
**Music:**
*   `bgm_runner_drive.mp3`: Driving Synthwave. 140 BPM. (Length: 1:30)

**SFX:**
*   `sfx_runner_motor_hum.mp3`: Looped engine drone. Pitch shifts with speed. (Loop)
*   `sfx_runner_swipe_whoosh.mp3`: Wind noise on lane change. (0.3s)
*   `sfx_runner_impact_smash.mp3`: Breaking the gate. Crunchy digital explosion. (0.5s)
*   `sfx_runner_fever_enter.mp3`: Distortion drop into silence, then music kicks in. (1.5s)

### D. Game 3: Black Market (Trade)
**Music:**
*   `bgm_market_alley.mp3`: Muffled club music (bass only) + sirens in distance. (Loop 0:40)

**SFX:**
*   `sfx_market_coin_cascading.mp3`: **Primary Dopamine Sound.** Coins falling on metal. (1.5s)
*   `sfx_market_register_open.mp3`: Classic "Cha-ching" but digitized. (0.6s)
*   `sfx_market_item_equip.mp3`: Sci-fi weapon reload sound. (0.4s)

### E. Game 4: Encryption (Logic)
**Music:**
*   `bgm_encrypt_tense.mp3`: Minimalist ticking clock beat. Quiet. (Length: 0:60)

**SFX:**
*   `sfx_encrypt_dial_tick.mp3`: Heavy metal click (safe cracking). (0.05s)
*   `sfx_encrypt_lock_open.mp3`: Heavy hydraulic release + steam hiss. (1.2s)
*   `sfx_encrypt_access_granted.mp3`: Positive computer choir chord. (1.0s)

### F. Game 5: The Heist (Boss)
**Music:**
*   `bgm_heist_phase1.mp3`: Cinematic orchestral tension.
*   `bgm_heist_phase2.mp3`: Dubstep drops. Distorted guitars.

**SFX:**
*   `sfx_heist_boss_roar.mp3`: Digital scream/glitch.
*   `sfx_heist_laser_charge.mp3`: Rising sine wave.
*   `sfx_heist_impact_massive.mp3`: Explosion with sub-bass (Screen shake sync).
