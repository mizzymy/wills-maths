import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generatePuzzle } from './PuzzleLogic';
import Keypad from './components/Keypad';
import CyberButton from '../../components/ui/CyberButton';

const EncryptionProtocol = () => {
    const navigate = useNavigate();
    const { addBits } = useGame();

    const [puzzle, setPuzzle] = useState(null);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameState, setGameState] = useState('playing'); // playing, gameover
    const [feedback, setFeedback] = useState(''); // 'ACCESS GRANTED' / 'DENIED'

    // Audio Ref
    const audioRef = useRef({
        type: new Audio('/assets/audio/sfx/ui/sfx_ui_hover_master.mp3'),
        success: new Audio('/assets/audio/sfx/breach/sfx_breach_glass_shatter.mp3'),
        fail: new Audio('/assets/audio/sfx/runner/sfx_runner_impact_smash.mp3')
    });

    // ... (useEffect remains)

    const handleInput = (num) => {
        if (gameState !== 'playing') return;
        if (input.length < 5) setInput(prev => prev + num);
        // Beep
        const clone = audioRef.current.type.cloneNode();
        clone.volume = 0.2;
        clone.play().catch(() => { });
    };

    // ... (handleClear)

    const handleSubmit = () => {
        if (gameState !== 'playing') return;

        // Check answer
        if (parseInt(input) === puzzle.answer) {
            // Correct
            setScore(prev => prev + 100);
            setFeedback('ACCESS GRANTED');
            addBits(5);
            audioRef.current.success.play().catch(() => { });

            setTimeout(() => {
                startNewRound();
            }, 1000);
        } else {
            // Wrong
            setFeedback('ACCESS DENIED');
            setInput('');
            setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty
            audioRef.current.fail.play().catch(() => { });
        }
    };

    // Helper for flash color
    const getFlashColor = () => {
        if (feedback === 'ACCESS GRANTED') return 'rgba(0, 255, 0, 0.3)';
        if (feedback === 'ACCESS DENIED') return 'rgba(255, 0, 0, 0.3)';
        return 'transparent';
    };

    return (
        <div style={{
            padding: '1rem',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#051010', // Darker green-black
            color: '#0f0',
            fontFamily: '"Courier New", Courier, monospace',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Screen Flash Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: getFlashColor(),
                pointerEvents: 'none',
                transition: 'background 0.2s',
                zIndex: 50
            }} />

            {/* Terminal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>sys::root_access</div>
                <div>T-{timeLeft}s</div>
            </div>

            {gameState === 'playing' && puzzle ? (
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
                <div style={{ textAlign: 'center', marginTop: '30vh' }}>
                    <h1 style={{ color: 'red' }}>SYSTEM LOCKOUT</h1>
                    <p>DATA SECURED: {score} BYTES</p>
                    <CyberButton variant="glitch" onClick={() => navigate('/')}>EXIT</CyberButton>
                </div>
            )}

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
