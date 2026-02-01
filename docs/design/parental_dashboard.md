# Parental Control & Real-Life Rewards GDD

## Overview
A secure, parent-facing dashboard that transforms in-game performance into real-world motivation. Parents can monitor detailed analytics and configure custom "IRL" rewards (e.g., "1 Hour PlayStation") that unlocked via in-game milestones.

## Core Features

### 1. Security (The Gate)
*   **Pin Access**: A 4-digit numeric code to enter the "Parent Mode".
*   **Default**: `0000` (User prompted to change on first login).
*   **Recovery**: Simple reset (since this is a localized web app, maybe just clear localStorage/cache if forgotten, or a simple math question to reset).

### 2. Analytics Dashboard ("The Report Card")
A visual breakdown of the child's performance using data stored in `GameContext`.
*   **Charts**:
    *   **Activity**: Games played per day (Bar Chart).
    *   **Accuracy**: Global correct/incorrect ratio (Pie Chart).
    *   **Trend**: Improvement over time (Line graph of scores).
*   **Raw Data**:
    *   Total Bits earned.
    *   Current Rank.
    *   Weakest Game (Game with lowest average score).
    *   Strongest Game.

### 3. Mission Control (Reward Configuration)
Parents set targets that unlock custom rewards.
*   **Mechanism**:
    *   **Create Mission**:
        *   **Condition**: "Score X in Game Y" OR "Earn X Bits" OR "Login Y Days in a row".
        *   **Reward Title**: Free text (e.g. "Pizza Night").
        *   **Icon**: Select from presets (Controller, Pizza, TV, Park, Money).
        *   **Cost**: Optional "Bit" cost (e.g. "Pay 500 Bits for this reward").
*   **Redemption**:
    *   When conditions are met, the reward moves to "Available".
    *   Child clicks "Claim".
    *   Parent gets a notification (visual popup or just checks the log) to fulfill the reward.

### 4. Child's View ("Target Acquired")
A new tab in the main Dashboard for the child.
*   **Active Targets**: Progress bars showing how close they are to the next reward.
    *   *Example*: "PlayStation Hour: 80/100 Correct Answers"
*   **Trophy Cabinet**: History of claimed rewards.

## Technical Implementation

### Data Model (`GameContext`)
```javascript
{
  parentPin: "1234",
  history: [
    { date: "2023-10-01", game: "neon_runner", score: 150, correct: 15, wrong: 2 }
  ],
  missions: [
    { 
      id: "m_1", 
      title: "Friday Gaming", 
      icon: "controller",
      type: "score_cumulative", // or 'login_streak', 'bits_earned'
      target: 1000, 
      current: 450, 
      redeemed: false 
    }
  ]
}
```

### UI Components
1.  **ParentGate.jsx**: Pin entry keypad.
2.  **ParentDashboard.jsx**: The admin container.
    *   `AnalyticsPanel.jsx`: Chart.js visualizations.
    *   `RewardConfig.jsx`: Form to add/edit missions.
3.  **ChildMissions.jsx**: The "Quest Log" for the kid.

## User Flow
1.  **Parent**: Clicks "Agents Only" (or hidden trigger) -> Enters PIN.
2.  **Parent**: Sets Mission: "Get 50 Correct answers in The Breach" -> Reward: "Ice Cream".
3.  **Child**: Plays the game. HUD updates "Mission Progress".
4.  **Dashboard**: Shows "Ice Cream: 50/50 - UNLOCKED!".
5.  **Child**: Clicks Claim. "Show this to your handler!".
