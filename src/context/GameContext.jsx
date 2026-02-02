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
        redeemMission
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
