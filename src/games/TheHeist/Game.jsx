import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { BOSS_STATS, generateShieldProblem } from './BossLogic';
import Boss from './components/Boss';
import Keypad from '../Encryption/components/Keypad'; // Reuse keypad
import CyberButton from '../../components/ui/CyberButton';

const TheHeist = () => {
    const navigate = useNavigate();
    const { addBits } = useGame();

    const [level, setLevel] = useState(1); // Boss Level
    const [boss, setBoss] = useState(BOSS_STATS[1]);
    const [hp, setHp] = useState(BOSS_STATS[1].hp);

    const [problem, setProblem] = useState(null);
    const [input, setInput] = useState('');

    const [timeLeft, setTimeLeft] = useState(BOSS_STATS[1].timer);
    const [gameState, setGameState] = useState('playing'); // playing, victory, defeat
    const [isHit, setIsHit] = useState(false);

    // Init
    useEffect(() => {
        startPhase(1);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('defeat');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const startPhase = (lvl) => {
        const stats = BOSS_STATS[lvl];
        setBoss(stats);
        setHp(stats.hp);
        setTimeLeft(stats.timer);
        generateNextProblem();
    };

    const generateNextProblem = () => {
        setProblem(generateShieldProblem(1)); // Difficulty scales slightly?
        setInput('');
    };

    const handleInput = (num) => {
        if (gameState !== 'playing') return;
        setInput(prev => prev + num);
    };

    const handleClear = () => setInput('');

    const handleSubmit = () => {
        if (gameState !== 'playing') return;
        if (parseInt(input) === problem.answer) {
            // Hit!
            const dmg = boss.damagePerHit;
            setIsHit(true);
            setTimeout(() => setIsHit(false), 200);

            setHp(prev => {
                const newHp = prev - dmg;
                if (newHp <= 0) {
                    // Boss Defeated
                    handleVictory();
                    return 0;
                }
                return newHp;
            });

            generateNextProblem();
        } else {
            // Miss - Penalty?
            setInput('');
            // Screen shake or error sound
        }
    };

    const handleVictory = () => {
        setGameState('victory');
        addBits(100 * level); // Big payout
    };

    const nextLevel = () => {
        if (level < 3) {
            setLevel(prev => prev + 1);
            setGameState('playing');
            startPhase(level + 1);
        } else {
            // Game Completed
            navigate('/');
        }
    };

    return (
        <div style={{
            padding: '1rem', height: '100vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'linear-gradient(to bottom, #200, #000)'
        }}>

            {/* HUD */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <CyberButton variant="glitch" onClick={() => navigate('/')}>RETREAT</CyberButton>
                <div className="neon-text-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft}s</div>
            </div>

            {gameState === 'playing' ? (
                <>
                    <Boss bossData={boss} hp={hp} maxHp={boss.hp} isHit={isHit} />

                    {/* Combat Interface */}
                    <div style={{ flex: 1, width: '100%', maxWidth: '400px', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            textAlign: 'center', fontSize: '2rem', fontWeight: 'bold',
                            color: '#fff', marginBottom: '10px',
                            textShadow: '0 0 10px white'
                        }}>
                            {problem ? problem.question : '...'} = <span style={{ color: 'var(--neon-yellow)' }}>{input}</span>
                        </div>

                        <Keypad onInput={handleInput} onClear={handleClear} onSubmit={handleSubmit} />
                    </div>
                </>
            ) : gameState === 'victory' ? (
                <div style={{ textAlign: 'center', var: '--neon-cyan', marginTop: '20vh' }}>
                    <h1 className="neon-text-cyan">TARGET ELIMINATED</h1>
                    <p>REWARD: {100 * level} BITS</p>
                    {level < 3 ? (
                        <CyberButton variant="primary" onClick={nextLevel}>NEXT TARGET</CyberButton>
                    ) : (
                        <CyberButton variant="glitch" onClick={() => navigate('/')}>MISSION COMPLETE</CyberButton>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                    <h1 className="neon-text-pink">SYSTEM FAILURE</h1>
                    <p>AGENT RETIRED</p>
                    <CyberButton variant="primary" onClick={() => window.location.reload()}>RETRY</CyberButton>
                    <br /><br />
                    <CyberButton variant="glitch" onClick={() => navigate('/')}>RETURN TO BASE</CyberButton>
                </div>
            )}

        </div>
    );
};

export default TheHeist;
