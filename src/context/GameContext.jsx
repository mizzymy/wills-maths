import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    // Persist state to localStorage so progress is saved offline
    const [bits, setBits] = useState(() => {
        const saved = localStorage.getItem('wm-bits');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [rank, setRank] = useState(() => {
        return localStorage.getItem('wm-rank') || 'Rookie';
    });

    const [lastLogin, setLastLogin] = useState(() => {
        return localStorage.getItem('wm-last-login') || '';
    });

    const checkDailyReward = () => {
        const today = new Date().toDateString();
        if (lastLogin !== today) {
            return true; // Reward is available
        }
        return false;
    };

    const claimDailyReward = () => {
        const today = new Date().toDateString();
        setLastLogin(today);
        localStorage.setItem('wm-last-login', today);
        addBits(100); // 100 Bits Daily Bonus
        return 100;
    };

    useEffect(() => {
        localStorage.setItem('wm-bits', bits);
    }, [bits]);

    useEffect(() => {
        localStorage.setItem('wm-rank', rank);
    }, [rank]);

    const addBits = (amount) => {
        setBits(prev => prev + amount);
    };

    // -- Parental Control State --
    const [parentPin, setParentPin] = useState(() => localStorage.getItem('wm-pin') || '0000');

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('wm-history');
        return saved ? JSON.parse(saved) : [];
    });

    const [missions, setMissions] = useState(() => {
        const saved = localStorage.getItem('wm-missions');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence
    useEffect(() => { localStorage.setItem('wm-pin', parentPin); }, [parentPin]);
    useEffect(() => { localStorage.setItem('wm-history', JSON.stringify(history)); }, [history]);
    useEffect(() => { localStorage.setItem('wm-missions', JSON.stringify(missions)); }, [missions]);

    // -- Analytics Logic --
    const logGameSession = (gameId, score, details = {}) => {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            gameId,
            score,
            ...details // { correct: 5, wrong: 1, etc }
        };

        setHistory(prev => [entry, ...prev]);

        // Check Missions
        checkMissions('play', 1, gameId);
        checkMissions('score_cumulative', score, gameId);

        // Check Collectibles
        checkCollectibles(gameId, score);
    };

    // -- Mission Logic --
    const generateClaimCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code; // e.g., "K9X2"
    };

    const addMission = (mission) => {
        // mission: { title, target, gameId, reward, icon, type, isRealWorld }
        const newMission = {
            ...mission,
            id: Date.now(),
            current: 0,
            redeemed: false,
            claimCode: mission.isRealWorld ? generateClaimCode() : null,
            unlockedAt: null
        };
        setMissions(prev => [...prev, newMission]);
    };

    const checkMissions = (type, amount, gameFilter = null) => {
        setMissions(prev => prev.map(m => {
            if (m.redeemed) return m;
            if (m.type !== type) return m;

            // Critical filter
            if (m.gameId && m.gameId !== 'any' && m.gameId !== gameFilter) return m;

            const newCurrent = m.current + amount;
            return { ...m, current: newCurrent };
        }));
    };

    const redeemMission = (id) => {
        setMissions(prev => prev.map(m => {
            if (m.id !== id) return m;

            // If it's a real world reward, we just mark it as redeemed (unlocked in vault) for the child to see.
            // The parent physically "redeems" it by seeing the code.
            return {
                ...m,
                redeemed: true,
                unlockedAt: new Date().toISOString()
            };
        }));
    };

    // -- Collectibles Logic --
    const CARDS = [
        // Founders Series
        { id: 'c_01', name: 'The White Hat', desc: 'Secure the network.', type: 'welcome', rarity: 'common' },
        { id: 'c_02', name: 'Neon Ronin', desc: 'Speed is life.', type: 'wins_runner', val: 5, rarity: 'uncommon' },
        { id: 'c_03', name: 'Cipher Queen', desc: 'Encryption cracked.', type: 'wins_encryption', val: 10, rarity: 'rare' },
        { id: 'c_04', name: 'The Warden', desc: 'Law and Order.', type: 'wins_heist', val: 1, rarity: 'legendary' },
        // Elite Series
        { id: 'c_05', name: 'Ghost Protocol', desc: 'Unseen. Unheard.', type: 'wins_total', val: 20, rarity: 'epic' },
        { id: 'c_06', name: 'Data Hoarder', desc: 'Knowledge is power.', type: 'bits_total', val: 10000, rarity: 'epic' },
        { id: 'c_07', name: 'The Glitch', desc: 'R34L1TY_ERR0R', type: 'games_played', val: 50, rarity: 'legendary' },
        { id: 'c_08', name: 'System Overlord', desc: 'I see everything.', type: 'rank_master', val: 1, rarity: 'mythic' },
        // Field Agents Series (Common/Uncommon)
        { id: 'c_09', name: 'Street Samurai', desc: 'Razor sharp style.', type: 'play_runner', val: 3, rarity: 'common' },
        { id: 'c_10', name: 'Script Kiddie', desc: 'Just getting started.', type: 'play_encryption', val: 3, rarity: 'common' },
        { id: 'c_11', name: 'Getaway Driver', desc: 'Fast exit.', type: 'play_heist', val: 3, rarity: 'common' },
        { id: 'c_12', name: 'Drone Operator', desc: 'Eyes in the sky.', type: 'rank_agent', val: 1, rarity: 'uncommon' },
        // Rookie Series (Very Common)
        { id: 'c_13', name: 'Vending Bandit', desc: 'Free snacks.', type: 'score_total', val: 50, rarity: 'common' },
        { id: 'c_14', name: 'Scrap Merchant', desc: 'One man\'s trash...', type: 'bits_total', val: 100, rarity: 'common' },
        { id: 'c_15', name: 'Tag Writer', desc: 'Leaving a mark.', type: 'games_played', val: 3, rarity: 'common' },
        { id: 'c_16', name: 'Wire Rat', desc: 'Connected.', type: 'games_played', val: 6, rarity: 'common' }
    ];

    const [collectibles, setCollectibles] = useState(() => {
        const saved = localStorage.getItem('wm-collectibles');
        // Default unlock first card if empty (welcome gift)
        return saved ? JSON.parse(saved) : ['c_01'];
    });

    useEffect(() => { localStorage.setItem('wm-collectibles', JSON.stringify(collectibles)); }, [collectibles]);

    const checkCollectibles = (gameId, currentScore) => {
        let newUnlocks = [];

        // Calculate globals for checks
        const totalWins = history.filter(h => h.score > 0).length; // Crude win check
        const totalGames = history.length;
        const totalScore = history.reduce((acc, curr) => acc + (curr.score || 0), 0);

        CARDS.forEach(card => {
            if (collectibles.includes(card.id)) return;

            let unlocked = false;

            // Series 1 Checks
            if (card.type === 'wins_runner' && gameId === 'neon_runner') {
                const wins = history.filter(h => h.gameId === 'neon_runner').length;
                if (wins >= card.val) unlocked = true;
            }
            if (card.type === 'wins_encryption' && gameId === 'encryption_protocol') {
                const wins = history.filter(h => h.gameId === 'encryption_protocol').length;
                if (wins >= card.val) unlocked = true;
            }
            if (card.type === 'wins_heist' && gameId === 'the_breach') {
                const wins = history.filter(h => h.gameId === 'the_breach').length;
                if (wins >= 5) unlocked = true;
            }

            // Global Checks (Elite & Rookie)
            if (card.type === 'wins_total' && totalWins >= card.val) unlocked = true;
            if (card.type === 'bits_total' && bits >= card.val) unlocked = true;
            if (card.type === 'games_played' && totalGames >= card.val) unlocked = true;
            if (card.type === 'rank_master' && rank === 'Master') unlocked = true;
            if (card.type === 'score_total' && totalScore >= card.val) unlocked = true;

            // Field Agents Checks
            if (card.type === 'play_runner' && gameId === 'neon_runner') {
                const plays = history.filter(h => h.gameId === 'neon_runner').length;
                if (plays >= card.val) unlocked = true;
            }
            if (card.type === 'play_encryption' && gameId === 'encryption_protocol') {
                const plays = history.filter(h => h.gameId === 'encryption_protocol').length;
                if (plays >= card.val) unlocked = true;
            }
            if (card.type === 'play_heist' && gameId === 'the_breach') {
                const plays = history.filter(h => h.gameId === 'the_breach').length;
                if (plays >= card.val) unlocked = true;
            }
            if (card.type === 'rank_agent' && (rank === 'Agent' || rank === 'Operative' || rank === 'Elite' || rank === 'Master')) unlocked = true;

            if (unlocked) {
                newUnlocks.push(card.id);
            }
        });

        if (newUnlocks.length > 0) {
            setCollectibles(prev => [...prev, ...newUnlocks]);
        }
    };

    const value = {
        bits,
        rank,
        addBits,
        setRank,
        checkDailyReward,
        claimDailyReward,
        // Parent Props
        parentPin,
        setParentPin,
        history,
        logGameSession,
        missions,
        addMission,
        redeemMission,
        // Collectibles
        collectibles,
        CARDS,
        checkCollectibles
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
