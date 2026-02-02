import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateTransaction } from './MarketLogic';
// Reusing Keypad from Encryption as it's just a number pad
import Keypad from '../Encryption/components/Keypad';
import CyberButton from '../../components/ui/CyberButton';
import DifficultySelector from '../../components/ui/DifficultySelector';

const BlackMarket = () => {
    const navigate = useNavigate();
    const { addBits, logGameSession } = useGame();

    const [difficulty, setDifficulty] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0); // Total Profit
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [feedback, setFeedback] = useState(''); // SUCCESS / ERROR

    const sfx = useRef({
        error: new Audio('/assets/audio/sfx/ui/sfx_ui_error.mp3'),
        cash: new Audio('/assets/audio/sfx/ui/sfx_ui_confirm.mp3')
    });

    const [gameMode, setGameMode] = useState('time'); // 'time', '10', '20'
    const [progress, setProgress] = useState(0); // For 10/20 modes

    const selectDifficulty = (selectedDiff) => {
        setDifficulty(selectedDiff);
        setGameState('mode_select');
    };

    const startSession = (mode) => {
        setGameMode(mode);
        setScore(0);
        setProgress(0);
        setFeedback('');
        setInput('');

        // Timer Logic
        if (mode === 'time') {
            const time = difficulty === 1 ? 90 : difficulty === 2 ? 75 : 60;
            setTimeLeft(time);
        } else {
            setTimeLeft(0); // Count up or unused
        }

        setGameState('playing');
        nextTransaction(difficulty);
    };

    const nextTransaction = (diff) => {
        const t = generateTransaction(diff);
        setTransaction(t);
        setInput('');
        setFeedback('');
    };

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (gameMode === 'time') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('gameover');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState, gameMode]);

    const handleInput = (val) => {
        setFeedback(''); // Clear error/success immediately on input
        if (input.length < 6) setInput(prev => prev + val);
    };

    const handleClear = () => {
        setFeedback('');
        setInput('');
    };

    const handleSubmit = () => {
        if (gameState !== 'playing' || !transaction) return;

        const val = parseInt(input);
        if (val === transaction.answer) {
            // Correct
            sfx.current.cash.play().catch(() => { });
            setScore(prev => prev + (difficulty * 50) + 10);
            setFeedback('DEAL COMPLETE');
            addBits(5);

            // Handle Progress
            if (gameMode !== 'time') {
                const newProgress = progress + 1;
                setProgress(newProgress);
                const target = parseInt(gameMode);

                if (newProgress >= target) {
                    setTimeout(() => setGameState('gameover'), 800);
                    return;
                }
            }

            setTimeout(() => {
                nextTransaction(difficulty);
            }, 800);
        } else {
            // Wrong
            sfx.current.error.play().catch(() => { });
            setFeedback('CALCULATION ERROR');
            setInput('');
            if (gameMode === 'time') {
                setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty only in time mode
            }
        }
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            logGameSession('black_market', score, { difficulty, mode: gameMode });
        }
    }, [gameState]);

    return (
        <div style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>E-SHOP OS v9.0</div>
                    <div className="neon-text-yellow">{score} CREDITS EARNED</div>
                </div>
                {gameState === 'playing' && (
                    <div className="neon-text-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {gameMode === 'time' ? `${timeLeft}s` : `${progress} / ${gameMode}`}
                    </div>
                )}
                <CyberButton variant="glitch" onClick={() => navigate('/')}>ABORT</CyberButton>
            </div>

            {gameState === 'menu' && (
                <DifficultySelector
                    onSelect={selectDifficulty}
                    customLevels={[
                        { id: 1, label: 'ROOKIE', color: 'var(--neon-green)', desc: 'Values 0-20. Basic Change.' },
                        { id: 2, label: 'AGENT', color: 'var(--neon-cyan)', desc: 'Values 0-50. Intermediate Change.' },
                        { id: 3, label: 'VETERAN', color: 'var(--neon-purple)', desc: 'Multi-Item Order (2 Items). Add then Deduct.' },
                        { id: 4, label: 'ELITE', color: 'var(--neon-red)', desc: 'Mega Order (3 Items). Complex Mental Sums.' }
                    ]}
                />
            )}

            {gameState === 'mode_select' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <h2 className="neon-text-cyan">SELECT SHIFT TYPE</h2>

                    <button
                        onClick={() => startSession('time')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-cyan)',
                            boxShadow: '0 0 10px var(--neon-cyan)',
                            width: '300px', padding: '20px',
                            color: 'var(--neon-cyan)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>⏱️ TIME ATTACK</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Get rich before time runs out!</div>
                    </button>

                    <button
                        onClick={() => startSession('10')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-green)',
                            boxShadow: '0 0 10px var(--neon-green)',
                            width: '300px', padding: '20px',
                            color: 'var(--neon-green)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>📦 10 DEALS</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Quick Shift. 10 Transactions.</div>
                    </button>

                    <button
                        onClick={() => startSession('20')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-purple)',
                            boxShadow: '0 0 10px var(--neon-purple)',
                            width: '300px', padding: '20px',
                            color: 'var(--neon-purple)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🚚 20 DEALS</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Long Shift. 20 Transactions.</div>
                    </button>
                </div>
            )}

            {gameState === 'playing' && transaction && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

                    {/* Transaction Display */}
                    <div style={{
                        background: '#111', border: '1px solid var(--neon-yellow)',
                        padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--neon-yellow)' }}>NEW CUSTOMER</h2>
                        <pre style={{
                            fontFamily: 'monospace', fontSize: '1.2rem', lineHeight: '1.5',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {transaction.question}
                        </pre>

                        {/* Input Display */}
                        <div style={{
                            marginTop: '2rem', background: '#000', padding: '10px',
                            fontSize: '2rem', textAlign: 'right', border: '1px solid #444',
                            color: feedback === 'CALCULATION ERROR' ? 'red' : feedback === 'DEAL COMPLETE' ? 'var(--neon-green)' : 'white'
                        }}>
                            {feedback || `₿ ${input || '0'}`}
                        </div>
                    </div>

                    {/* Controls */}
                    <Keypad onInput={handleInput} onClear={handleClear} onSubmit={handleSubmit} />
                </div>
            )}

            {gameState === 'gameover' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 className="neon-text-green">SHIFT COMPLETE</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>TOTAL PROFIT: ₿ {score}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <CyberButton variant="primary" onClick={() => setGameState('menu')}>NEW SHIFT</CyberButton>
                        <CyberButton variant="glitch" onClick={() => navigate('/')}>LEAVE SHOP</CyberButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlackMarket;
