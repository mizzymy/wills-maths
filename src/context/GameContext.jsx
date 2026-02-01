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

    useEffect(() => {
        localStorage.setItem('wm-bits', bits);
    }, [bits]);

    useEffect(() => {
        localStorage.setItem('wm-rank', rank);
    }, [rank]);

    const addBits = (amount) => {
        setBits(prev => prev + amount);
    };

    const value = {
        bits,
        rank,
        addBits,
        setRank
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
