import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateLevel, checkSolution } from './GameLogic';
import HexGrid from './components/HexGrid';
import CyberButton from '../../components/ui/CyberButton';
import DifficultySelector from '../../components/ui/DifficultySelector';

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
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover

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
    }, [gameState]);

    const startGame = (selectedDiff) => {
        setDifficulty(selectedDiff);

        // Timer Scaling (Increased by 15%)
        // 1: 104s, 2: 69s, 3: 52s, 4: 35s
        const time = selectedDiff === 1 ? 104
            : selectedDiff === 2 ? 69
                : selectedDiff === 3 ? 52
                    : 35;

        setTimeLeft(time);

        // Start Audio
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.4;
        bgmRef.current.play().catch(e => console.log('BGM Autoplay blocked'));

        setGameState('playing');

        // Generate Board
        const levelData = generateLevel(selectedDiff);
        setTarget(levelData.target);
        setNodes(levelData.nodes);
        setSelectedNodes([]);
    };

    const startNewRound = () => {
        // Regenerate nodes if low, or just keep same target
        // For MVP, we regenerate the whole board if empty, or just fill gaps?
        // Let's keep it simple: One "Round" is one board for now, or endless refill.
        // Endless refill is better for "Flow".

        const levelData = generateLevel(difficulty || 1);
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

            // Remove nodes
            const solvedIds = newSelection.map(n => n.id);
            const remainingNodes = nodes.filter(n => !solvedIds.includes(n.id));

            setNodes(remainingNodes);
            setSelectedNodes([]);

            // If board empty or low, refill
            if (remainingNodes.length < 6) {
                // Add new batch (simple merge) - KEEP SAME TARGET
                const nextLevel = generateLevel(difficulty, target);
                setNodes([...remainingNodes, ...nextLevel.nodes]);
            }
        } else if (result.reason === 'overflow') {
            // Wrong combo
            // Maybe play error sound?
            setSelectedNodes([]); // Reset
        }
    };

    const endGame = () => {
        setGameState('gameover');
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            logGameSession('the_breach', score, { difficulty });
        }
    }, [gameState]);

    return (
        <div style={{ padding: '1rem', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <CyberButton variant="glitch" onClick={() => navigate('/')} style={{ fontSize: '0.8rem' }}>
                    ABORT
                </CyberButton>
                <div className="neon-text-pink" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {timeLeft}s
                </div>
                <div className="neon-text-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    SCORE: {score}
                </div>
            </div>

            {gameState === 'menu' && <DifficultySelector onSelect={startGame} />}

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
            ) : (
                /* Game Over Screen */
                <div style={{ marginTop: '20vh' }}>
                    <h1 className="neon-text-pink">MISSION COMPLETE</h1>
                    <p>FINAL SCORE: {score}</p>
                    <CyberButton variant="primary" onClick={() => window.location.reload()}>RETRY</CyberButton>
                    <br /><br />
                    <CyberButton variant="glitch" onClick={() => navigate('/')}>RETURN TO BASE</CyberButton>
                </div>
            )}
        </div>
    );
};

export default TheBreach;
