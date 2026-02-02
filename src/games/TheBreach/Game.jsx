import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateLevel, checkSolution } from './GameLogic';
import HexGrid from './components/HexGrid';
import CyberButton from '../../components/ui/CyberButton';
import DifficultySelector from '../../components/ui/DifficultySelector';

// ... imports remain the same

const TheBreach = () => {
    const navigate = useNavigate();
    const { addBits, logGameSession } = useGame();

    // Game State
    const [difficulty, setDifficulty] = useState(null);
    const [target, setTarget] = useState(10);
    const [nodes, setNodes] = useState([]);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState('menu'); // menu, mode_select, playing, gameover

    // New State for Modes
    const [gameMode, setGameMode] = useState('time'); // 'time', '10', '20'
    const [progress, setProgress] = useState(0);

    // Audio Refs (Quick implementation)
    const bgmRef = useRef(new Audio('/assets/audio/bgm/bgm_breach_flow.mp3'));

    // Init Level
    useEffect(() => {
        return () => {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
        };
    }, []);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (gameMode === 'time') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState, gameMode]);

    const selectDifficulty = (selectedDiff) => {
        setDifficulty(selectedDiff);
        setGameState('mode_select');
    };

    const startSession = (mode) => {
        setGameMode(mode);
        setScore(0);
        setProgress(0);

        // Timer Scaling for Time Attack
        if (mode === 'time') {
            const time = difficulty === 1 ? 104
                : difficulty === 2 ? 69
                    : difficulty === 3 ? 52
                        : 35;
            setTimeLeft(time);
        } else {
            setTimeLeft(0);
        }

        // Start Audio
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.4;
        bgmRef.current.play().catch(e => console.log('BGM Autoplay blocked'));

        setGameState('playing');

        // Generate Board
        const levelData = generateLevel(difficulty);
        setTarget(levelData.target);
        setNodes(levelData.nodes);
        setSelectedNodes([]);
    };

    const playSfx = (type) => {
        const sfx = new Audio(
            type === 'shatter' ? '/assets/audio/sfx/breach/sfx_breach_glass_shatter.mp3' :
                type === 'select' ? '/assets/audio/sfx/breach/sfx_breach_node_select.mp3' : ''
        );
        sfx.volume = 0.6;
        sfx.play().catch(() => { }); // Silent catch for SFX errors
    };

    const handleNodeClick = (node) => {
        if (gameState !== 'playing') return;

        // Toggle selection
        let newSelection;
        if (selectedNodes.find(n => n.id === node.id)) {
            newSelection = selectedNodes.filter(n => n.id !== node.id);
        } else {
            newSelection = [...selectedNodes, node];
            playSfx('select');
        }

        setSelectedNodes(newSelection);

        // Check Logic
        const result = checkSolution(newSelection, target);
        if (result.valid) {
            // Success!
            playSfx('shatter');
            setScore(prev => prev + (newSelection.length * 10)); // Simple scoring
            addBits(1); // Give currency

            // Handle Progress for Fixed Modes
            if (gameMode !== 'time') {
                const newProgress = progress + 1;
                setProgress(newProgress);
                const targetCount = parseInt(gameMode);

                if (newProgress >= targetCount) {
                    setTimeout(endGame, 500);
                    return;
                }
            }

            // Remove nodes
            const solvedIds = newSelection.map(n => n.id);
            const remainingNodes = nodes.filter(n => !solvedIds.includes(n.id));

            setNodes(remainingNodes);
            setSelectedNodes([]);

            // If board empty or low, refill
            if (remainingNodes.length < 6) {
                // Add new batch elements
                const nextLevel = generateLevel(difficulty, target);
                setNodes([...remainingNodes, ...nextLevel.nodes]);
            }
        } else if (result.reason === 'overflow') {
            // Wrong combo
            setSelectedNodes([]); // Reset
        }
    };

    const endGame = () => {
        setGameState('gameover');
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            logGameSession('the_breach', score, { difficulty, mode: gameMode });
        }
    }, [gameState]);

    return (
        <div style={{ padding: '1rem', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <CyberButton variant="glitch" onClick={() => navigate('/')} style={{ fontSize: '0.8rem' }}>
                    ABORT
                </CyberButton>

                {gameState === 'playing' && (
                    <div className="neon-text-pink" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {gameMode === 'time' ? `${timeLeft}s` : `${progress} / ${gameMode}`}
                    </div>
                )}

                <div className="neon-text-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    SCORE: {score}
                </div>
            </div>

            {gameState === 'menu' && <DifficultySelector onSelect={selectDifficulty} />}

            {gameState === 'mode_select' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <h2 className="neon-text-cyan">SELECT MISSION TYPE</h2>

                    <button
                        onClick={() => startSession('time')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-cyan)',
                            boxShadow: '0 0 10px var(--neon-cyan)',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: 'var(--neon-cyan)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>⏱️ TIME ATTACK</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Clear breaches before critical failure!</div>
                    </button>

                    <button
                        onClick={() => startSession('10')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-green)',
                            boxShadow: '0 0 10px var(--neon-green)',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: 'var(--neon-green)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🛡️ 10 BREACHES</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Seal 10 leaks. Take your time.</div>
                    </button>

                    <button
                        onClick={() => startSession('20')}
                        style={{
                            background: '#000',
                            border: '1px solid var(--neon-purple)',
                            boxShadow: '0 0 10px var(--neon-purple)',
                            width: '100%', maxWidth: '300px', padding: '20px',
                            color: 'var(--neon-purple)',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>🛡️ 20 BREACHES</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>Extended Operation. Seal 20 leaks.</div>
                    </button>
                </div>
            )}

            {gameState === 'playing' ? (
                <>
                    {/* Target Display */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ color: '#aaa', letterSpacing: '2px' }}>TARGET SUM</div>
                        <div style={{
                            fontSize: 'clamp(3rem, 10vw, 5rem)', // Responsive sizing
                            fontWeight: '900',
                            color: 'white',
                            textShadow: '0 0 20px var(--neon-pink)',
                            lineHeight: 1
                        }}>
                            {target}
                        </div>

                        {/* Current Sum Helper */}
                        <div style={{ height: '20px', color: 'var(--neon-yellow)' }}>
                            {selectedNodes.length > 0 && `Current: ${selectedNodes.reduce((a, n) => a + n.value, 0)}`}
                        </div>
                    </div>

                    {/* Grid */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '2rem' }}>
                        <HexGrid
                            nodes={nodes}
                            selectedNodes={selectedNodes}
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                </>
            ) : gameState === 'gameover' ? (
                /* Game Over Screen */
                <div style={{ marginTop: '20vh' }}>
                    <h1 className="neon-text-pink">MISSION COMPLETE</h1>
                    <p>FINAL SCORE: {score}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <CyberButton variant="primary" onClick={() => setGameState('menu')}>NEW MISSION</CyberButton>
                        <CyberButton variant="glitch" onClick={() => navigate('/')}>RETURN TO BASE</CyberButton>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default TheBreach;
