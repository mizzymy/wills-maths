import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateInitialMarket, updateMarketPrices, calculateProfit } from './MarketLogic';
import MarketItem from './components/MarketItem';
import CyberButton from '../../components/ui/CyberButton';
import DifficultySelector from '../../components/ui/DifficultySelector';

const BlackMarket = () => {
    const navigate = useNavigate();
    const { bits, addBits, logGameSession } = useGame();

    const [difficulty, setDifficulty] = useState(null);
    const [sessionCash, setSessionCash] = useState(1000);
    const [startCash] = useState(1000);
    const [inventory, setInventory] = useState({}); // { itemId: count }
    const [market, setMarket] = useState([]);
    const [timeLeft, setTimeLeft] = useState(45);

    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover

    // Audio Refs
    const sfxRef = useRef({
        buy: new Audio('/assets/audio/sfx/ui/sfx_ui_click.mp3'),
        sell: new Audio('/assets/audio/sfx/ui/sfx_ui_confirm.mp3'),
        profit: new Audio('/assets/audio/sfx/breach/sfx_breach_node_select.mp3')
    });

    const startGame = (selectedDiff) => {
        setDifficulty(selectedDiff);

        // Timer Scaling
        // 1: 90s, 2: 60s, 3: 45s, 4: 30s
        const time = selectedDiff === 1 ? 90
            : selectedDiff === 2 ? 60
                : selectedDiff === 3 ? 45
                    : 30;

        setTimeLeft(time);
        setMarket(generateInitialMarket());
        setGameState('playing');
    };

    // Game Loop (Timer & Market)
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('gameover');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const marketTicker = setInterval(() => {
            setMarket(prevItems => updateMarketPrices(prevItems));
        }, 3000); // Price shift every 3s

        return () => {
            clearInterval(timer);
            clearInterval(marketTicker);
        };
    }, [gameState]);

    const handleBuy = (item) => {
        if (sessionCash >= item.currentPrice) {
            setSessionCash(prev => prev - item.currentPrice);
            setInventory(prev => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) + 1
            }));
        }
    };

    const handleSell = (item) => {
        if (inventory[item.id] > 0) {
            setSessionCash(prev => prev + item.currentPrice);
            setInventory(prev => ({
                ...prev,
                [item.id]: prev[item.id] - 1
            }));
        }
    };

    const handleCashOut = () => {
        // End game early
        setGameState('gameover');
    };

    const calculateScore = () => {
        // Liquidate inventory automatically
        let total = sessionCash;
        market.forEach(item => {
            const count = inventory[item.id] || 0;
            total += count * item.currentPrice;
        });
        return total - startCash; // Net Profit
    };

    const finalizeGame = () => {
        const profit = calculateScore();
        if (profit > 0) {
            // Add profit to global wallet
            addBits(Math.ceil(profit * 0.1)); // 10% Exchange rate to Meta-Currency
        }
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            finalizeGame();
        }
    }, [gameState]);

    return (
        <div style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* HUD */}
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

            {gameState === 'menu' && <DifficultySelector onSelect={startGame} />}

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
                    <h1 className="neon-text-yellow">MARKET CLOSED</h1>
                    <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        NET PROFIT: {calculateScore()} Credits
                    </div>
                    <div style={{ color: '#aaa', marginBottom: '2rem' }}>
                        (Converted to {Math.ceil(calculateScore() * 0.1)} Bits)
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
