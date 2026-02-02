import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generatePuzzle } from './PuzzleLogic';
import Keypad from './components/Keypad';
import CyberButton from '../../components/ui/CyberButton';
import DifficultySelector from '../../components/ui/DifficultySelector';

const EncryptionProtocol = () => {
    const navigate = useNavigate();
    const { addBits, logGameSession } = useGame();

    const [difficulty, setDifficulty] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameState, setGameState] = useState('menu'); // menu, mode_select, playing, gameover
    const [feedback, setFeedback] = useState(''); // 'ACCESS GRANTED' / 'DENIED'

    // New State for Modes
    const [gameMode, setGameMode] = useState('time'); // 'time', '10', '20'
    const [progress, setProgress] = useState(0);

    // Audio Ref
    const typeSfx = useRef(new Audio('/assets/audio/sfx/ui/sfx_ui_hover_master.mp3'));
    // We can reuse the UI hover as a "key tap" or generate a specific one later.

    const selectDifficulty = (selectedDiff) => {
        setDifficulty(selectedDiff);
        setGameState('mode_select');
    };

    const startSession = (mode) => {
        setGameMode(mode);
        setScore(0);
        setProgress(0);

        // Timer Scaling
        if (mode === 'time') {
            const time = difficulty === 1 ? 120
                : difficulty === 2 ? 90
                    : difficulty === 3 ? 75
                        : 60;
            setTimeLeft(time);
        } else {
            setTimeLeft(0);
        }

        startNewRound(difficulty);
        setGameState('playing');
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

    const startNewRound = (diff = difficulty) => {
        // Generate new puzzle
        const p = generatePuzzle(diff || 1);
        setPuzzle(p);
        setInput('');
        setFeedback('');
    };

    const handleInput = (num) => {
        if (gameState !== 'playing') return;
        if (input.length < 5) setInput(prev => prev + num);
        // Beep
        const clone = typeSfx.current.cloneNode();
        clone.volume = 0.2;
        clone.play().catch(() => { });
    };

    const handleClear = () => setInput('');

    const handleSubmit = () => {
        if (gameState !== 'playing') return;

        // Check answer
        if (parseInt(input) === puzzle.answer) {
            // Correct
            setScore(prev => prev + 100);
            setFeedback('ACCESS GRANTED');
            addBits(5);

            // Handle Progress for Fixed Modes
            if (gameMode !== 'time') {
                const newProgress = progress + 1;
                setProgress(newProgress);
                const targetCount = parseInt(gameMode);

                if (newProgress >= targetCount) {
                    setTimeout(() => setGameState('gameover'), 1000);
                    // Early log? No, on exit is safer but let's stick to effect
                    return;
                }
            }

            // Keep partial log or remove? Let's check logic. 
            // Actually, usually we log session end. Let's rely on gameover effect for full session log.

            setTimeout(() => {
                startNewRound();
            }, 1000);
        } else {
            // Wrong
            setFeedback('ACCESS DENIED');
            setInput('');
            if (gameMode === 'time') {
                setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty only in time mode
            }
        }
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            // For now simply using total score.
            logGameSession('encryption_protocol', score, { difficulty, mode: gameMode });
        }
    }, [gameState]);

    return (
        <div style={{
            padding: '1rem',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#051010', // Darker green-black
            color: '#0f0',
            fontFamily: '"Courier New", Courier, monospace'
        }}>

            {/* Terminal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>sys::root_access</div>
                <div>{gameMode === 'time' ? `T-${timeLeft}s` : `SEQ: ${progress}/${gameMode}`}</div>
            </div>

            {gameState === 'menu' && <DifficultySelector onSelect={selectDifficulty} />}

            {gameState === 'mode_select' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <h2 style={{ color: '#0ff', textShadow: '0 0 10px #0ff' }}>SELECT DECRYPTION MODE</h2>

                    <button
                        onClick={() => startSession('time')}
                        style={{
                            background: '#000',
                            border: '1px solid #0ff',
                            boxShadow: '0 0 10px #0ff',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: '#0ff',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>⏱️ TIME ATTACK</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Decrypt before lockout!</div>
                    </button>

                    <button
                        onClick={() => startSession('10')}
                        style={{
                            background: '#000',
                            border: '1px solid #0f0',
                            boxShadow: '0 0 10px #0f0',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: '#0f0',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🔓 10 LINES</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Standard Decryption. 10 Codes.</div>
                    </button>

                    <button
                        onClick={() => startSession('20')}
                        style={{
                            background: '#000',
                            border: '1px solid #d0f',
                            boxShadow: '0 0 10px #d0f',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: '#d0f',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🛡️ 20 LINES</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Deep Dive. 20 Codes.</div>
                    </button>
                </div>
            )}

            {gameState === 'playing' ? (
                puzzle ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Logic Area */}
                        <div style={{
                            width: '100%',
                            maxWidth: '500px',
                            border: '1px solid #0f0',
                            padding: '20px',
                            marginBottom: '2rem',
                            position: 'relative',
                            background: 'rgba(0, 20, 0, 0.5)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid #0f0' }}>DECRYPTION REQUIRED</h3>
                            <div style={{ fontSize: '1.5rem', letterSpacing: '2px', textAlign: 'center' }}>
                                {puzzle.sequence.map((val, i) => (
                                    <span key={i} style={{
                                        margin: '0 10px',
                                        color: val === '?' ? (input ? '#fff' : 'var(--neon-pink)') : '#0f0'
                                    }}>
                                        {val === '?' ? (input || '?') : val}
                                    </span>
                                ))}
                            </div>
                            {feedback && (
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    background: '#000', border: '2px solid #fff', padding: '10px',
                                    color: feedback === 'ACCESS GRANTED' ? '#0ff' : 'red',
                                    fontWeight: 'bold', fontSize: '1.2rem'
                                }}>
                                    {feedback}
                                </div>
                            )}
                        </div>

                        <Keypad onInput={handleInput} onClear={handleClear} onSubmit={handleSubmit} />

                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '30vh', color: '#0f0' }}>INITIALIZING...</div>
                )
            ) : gameState === 'gameover' ? (
                <div style={{ textAlign: 'center', marginTop: '30vh' }}>
                    <h1 style={{ color: gameMode === 'time' ? 'red' : '#0f0' }}>
                        {gameMode === 'time' ? 'SYSTEM LOCKOUT' : 'DECRYPTION COMPLETE'}
                    </h1>
                    <p>DATA SECURED: {score} BYTES</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <CyberButton variant="primary" onClick={() => setGameState('menu')}>NEW DECRYPTION</CyberButton>
                        <CyberButton variant="glitch" onClick={() => navigate('/')}>EXIT</CyberButton>
                    </div>
                </div>
            ) : null}

            {/* Scanlines Overlay (CSS) */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%',
                pointerEvents: 'none',
                zIndex: 999
            }} />
        </div>
    );
};

export default EncryptionProtocol;
