import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateInitialMarket, updateMarketPrices, calculateProfit } from './MarketLogic';
import MarketItem from './components/MarketItem';
import CyberButton from '../../components/ui/CyberButton';

const BlackMarket = () => {
    const navigate = useNavigate();
    const { bits, addBits } = useGame();

    const [sessionCash, setSessionCash] = useState(1000);
    const [startCash] = useState(1000);
    const [inventory, setInventory] = useState({}); // { itemId: count }
    const [market, setMarket] = useState([]);
    const [timeLeft, setTimeLeft] = useState(45);

    const [gameState, setGameState] = useState('playing');

    // Audio Refs
    const sfxRef = useRef({
        buy: new Audio('/assets/audio/sfx/ui/sfx_ui_click.mp3'), // Placeholder for coin sound
        sell: new Audio('/assets/audio/sfx/ui/sfx_ui_confirm.mp3'), // Placeholder for register
        profit: new Audio('/assets/audio/sfx/breach/sfx_breach_node_select.mp3')
    });

    // ... (useEffect remains)

    const handleBuy = (item) => {
        if (sessionCash >= item.currentPrice) {
            setSessionCash(prev => prev - item.currentPrice);
            setInventory(prev => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) + 1
            }));
            sfxRef.current.buy.currentTime = 0;
            sfxRef.current.buy.play().catch(() => { });
        }
    };

    const handleSell = (item) => {
        if (inventory[item.id] > 0) {
            setSessionCash(prev => prev + item.currentPrice);
            setInventory(prev => ({
                ...prev,
                [item.id]: prev[item.id] - 1
            }));
            sfxRef.current.sell.currentTime = 0;
            sfxRef.current.sell.play().catch(() => { });
        }
    };

    // ... (handleCashOut, calculateScore remain)

    const finalizeGame = () => {
        const profit = calculateScore();
        if (profit > 0) {
            addBits(Math.ceil(profit * 0.1));
            sfxRef.current.profit.play().catch(() => { });
        }
    };

    // ... (useEffect gameState remain)

    return (
        <div style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* HUD ... */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem'
            }}>
                <div className="neon-text-pink" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {timeLeft}s
                </div>
                <div style={{ fontSize: '1.2rem', color: 'var(--neon-yellow)' }}>
                    CREDITS: {sessionCash}
                </div>
                <CyberButton variant="glitch" onClick={handleCashOut} style={{ fontSize: '0.7rem' }}>
                    CASH OUT
                </CyberButton>
            </div>

            {gameState === 'playing' ? (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1rem', color: '#888', textTransform: 'uppercase' }}>Market Feed</h2>
                    {market.map(item => (
                        <MarketItem
                            key={item.id}
                            item={item}
                            cash={sessionCash}
                            inventoryCount={inventory[item.id] || 0}
                            onBuy={handleBuy}
                            onSell={handleSell}
                        />
                    ))}
                </div>
            ) : (
                /* Summary Screen */
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <h1 className={calculateScore() > 0 ? "neon-text-cyan" : "neon-text-pink"}>
                        {calculateScore() > 0 ? "PROFIT SECURED" : "MARKET CRASH"}
                    </h1>

                    <div style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        color: calculateScore() > 0 ? '#0f0' : '#f00',
                        fontWeight: 'bold'
                    }}>
                        {calculateScore() > 0 ? '+' : ''}{calculateScore()} CR
                    </div>

                    <div style={{ color: '#aaa', marginBottom: '2rem' }}>
                        (Converted to {Math.ceil(Math.max(0, calculateScore()) * 0.1)} Bits)
                    </div>

                    <CyberButton variant="primary" onClick={() => window.location.reload()}>NEW TRADING DAY</CyberButton>
                    <br />
                    <CyberButton variant="glitch" onClick={() => navigate('/')}>RETURN TO LOBBY</CyberButton>
                </div>
            )}
        </div>
    );
};

export default BlackMarket;
