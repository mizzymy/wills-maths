# Implementation Plan - Wills Maths

**Goal:** Build a mobile-first web application with 5 math-based minigames using React and Vanilla CSS.

## User Review Required
> [!IMPORTANT]
> **Tech Stack Confirmation:** We are using **React + Vite** with **Vanilla CSS**.
> **Deployment:** We will configure this as a **Progressive Web App (PWA)**. This enables "Add to Home Screen" functionality on iOS/Android and offline play.

## Proposed Changes

### Project Structure (New)
#### [NEW] [package.json](file:///package.json)
- Dependencies: `react`, `react-dom`, `react-router-dom`, `framer-motion`.
- DevDependencies: `vite`, `vite-plugin-pwa`.

#### [NEW] [src/App.jsx](file:///src/App.jsx)
- Main entry point with Routing (Home, Shop, Game Select, Individual Games).

#### [NEW] [src/styles/global.css](file:///src/styles/global.css)
- CSS Variables for the "Cyberpunk" theme (Neon Pink, Cyan, Dark Backgrounds).
- Reset and typography (Inter/Roboto).

#### [NEW] [vite.config.js](file:///vite.config.js)
- Configure `vite-plugin-pwa` with:
    - `registerType: 'autoUpdate'`
    - Manifest (Name: "Wills Maths", Short Name: "WillsMath", Theme Color: "#0f0f0f").
    - Icons configurations (using placeholder or generated icons).

#### [NEW] [src/context/GameContext.jsx](file:///src/context/GameContext.jsx)
- Global state for:
    - User Profile (Name, Rank).
    - Economy (Bits Balance, Inventory).
    - Unlocks (High Scores, Progress).

### Games (Phased Implementation)
#### [NEW] [src/games/TheBreach/Game.jsx](file:///src/games/TheBreach/Game.jsx)
- First game implementation (Reflex Recall).
- Logic for falling numbers and user input.

#### [NEW] [src/games/NeonRunner/Game.jsx](file:///src/games/NeonRunner/Game.jsx)
- Second game (Multiplication).

*(Other games will follow in subsequent tasks)*

## Verification Plan

### Automated Tests
- `npm run test` (Vitest) for game logic (e.g., verifying `MathGenerator` produces correct equations).

### Manual Verification
1.  **Launch App:** `npm run dev` and open in browser.
2.  **Navigation:** Verify switching between Home, Shop, and Game Select.
3.  **Economy:** Verify earning 'Bits' in a dummy game updates the global balance in the Shop.
4.  **Responsive:** Toggle Device Toolbar in Chrome (Mobile View) to ensure layout fits 375px+ width.
