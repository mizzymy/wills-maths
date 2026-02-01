import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../public/assets/audio');

// A minimal valid MP3 file (silence/blip) as base64
// This is a 1-frame MP3 I created for testing purposes.
const DUMMY_MP3_B64 = "/+MYxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MYxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const DUMMY_BUFFER = Buffer.from(DUMMY_MP3_B64, 'base64');

const ASSET_LIST = [
    // BGM
    'bgm/bgm_launcher_ambience.mp3',
    'bgm/bgm_breach_flow.mp3',
    'bgm/bgm_runner_drive.mp3',
    'bgm/bgm_market_alley.mp3',
    'bgm/bgm_encrypt_tense.mp3',
    'bgm/bgm_heist_phase1.mp3',
    'bgm/bgm_heist_phase2.mp3',

    // SFX - UI
    'sfx/ui/sfx_ui_boot_sequence.mp3',
    'sfx/ui/sfx_ui_hover_master.mp3',
    'sfx/ui/sfx_ui_confirm_heavy.mp3',
    'sfx/ui/sfx_ui_error_glitch.mp3',
    'sfx/ui/sfx_ui_xp_gain.mp3',

    // SFX - Games
    'sfx/breach/sfx_breach_node_select.mp3',
    'sfx/breach/sfx_breach_node_deselect.mp3',
    'sfx/breach/sfx_breach_glass_shatter.mp3',
    'sfx/breach/sfx_breach_combo_fire.mp3',

    'sfx/runner/sfx_runner_motor_hum.mp3',
    'sfx/runner/sfx_runner_swipe_whoosh.mp3',
    'sfx/runner/sfx_runner_impact_smash.mp3',
    'sfx/runner/sfx_runner_fever_enter.mp3',

    'sfx/market/sfx_market_coin_cascading.mp3',
    'sfx/market/sfx_market_register_open.mp3',
    'sfx/market/sfx_market_item_equip.mp3',

    'sfx/encrypt/sfx_encrypt_dial_tick.mp3',
    'sfx/encrypt/sfx_encrypt_lock_open.mp3',
    'sfx/encrypt/sfx_encrypt_access_granted.mp3',

    'sfx/heist/sfx_heist_boss_roar.mp3',
    'sfx/heist/sfx_heist_laser_charge.mp3',
    'sfx/heist/sfx_heist_impact_massive.mp3',

    // Rewards & Achievements
    'sfx/achievements/sfx_global_coin_fly.mp3',
    'sfx/achievements/sfx_global_coin_land.mp3',
    'sfx/achievements/sfx_achiev_speed.mp3',
    'sfx/achievements/sfx_achiev_rich.mp3',
    'sfx/achievements/sfx_achiev_fire.mp3',
    'sfx/achievements/sfx_achiev_glitch.mp3',
    'sfx/achievements/sfx_achiev_generic_unlock.mp3',
    'sfx/achievements/sfx_achiev_rare_unlock.mp3',

    'rewards/sfx_loot_box_shake.mp3',
    'rewards/sfx_loot_charge_up.mp3',
    'rewards/sfx_loot_explode.mp3',
    'rewards/sfx_rarity_common.mp3',
    'rewards/sfx_rarity_rare.mp3',
    'rewards/sfx_rarity_legendary.mp3',
    'rewards/sfx_rank_promotion.mp3'
];

async function generateAssets() {
    console.log(`Generating ${ASSET_LIST.length} placeholder audio assets...`);

    for (const relativePath of ASSET_LIST) {
        const fullPath = path.join(ROOT_DIR, relativePath);
        const folder = path.dirname(fullPath);

        // Ensure directory exists
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
            console.log(`Created directory: ${folder}`);
        }

        // Write file
        fs.writeFileSync(fullPath, DUMMY_BUFFER);
        console.log(` - Generated: ${relativePath}`);
    }

    console.log('\nAll assets generated successfully.');
}

generateAssets();
