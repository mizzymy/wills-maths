import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateObstacle, LANE_COUNT } from './RunnerLogic';
import Player from './components/Player';
import Track from './components/Track';
import Obstacle from './components/Obstacle';
import FlushAnimation from '../../components/ui/FlushAnimation';
import VictoryPopup from '../../components/ui/VictoryPopup';
import CyberButton from '../../components/ui/CyberButton';

import DifficultySelector from '../../components/ui/DifficultySelector';

const NeonRunner = () => {
    const navigate = useNavigate();
    const { addBits, logGameSession } = useGame();

    // -- UI State --
    const [difficulty, setDifficulty] = useState(null); // 1-4
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover, victory
    const [renderObstacles, setRenderObstacles] = useState([]);
    const [playerLane, setPlayerLane] = useState(1);
    const [activeQuestion, setActiveQuestion] = useState("GET READY");
    const [screenShake, setScreenShake] = useState(false);

    // -- Game Logic Refs --
    const gameStateRef = useRef('menu');
    const obstaclesRef = useRef([]);
    const playerLaneRef = useRef(1);
    const speedRef = useRef(0.3);
    const difficultyRef = useRef(1); // NEW
    const scoreRef = useRef(0);
    const lastSpawnZRef = useRef(0);
    const requestRef = useRef();
    const currentQuestionRef = useRef("GET READY");

    // Audio Refs
    const humRef = useRef(new Audio('/assets/audio/sfx/runner/sfx_runner_motor_hum.mp3'));

    const playSfx = (type) => {
        const sfx = new Audio(
            type === 'crash' ? '/assets/audio/sfx/runner/sfx_runner_impact_smash.mp3' :
                type === 'score' ? '/assets/audio/sfx/breach/sfx_breach_glass_shatter.mp3' :
                    type === 'swipe' ? '/assets/audio/sfx/runner/sfx_runner_swipe_whoosh.mp3' : ''
        );
        sfx.volume = type === 'crash' ? 0.8 : 0.5;
        sfx.play().catch(e => { });
    };

    const startGame = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        difficultyRef.current = selectedDifficulty; // Update ref

        // Difficulty Balancing
        // 1: 0.15, 2: 0.2, 3: 0.25, 4: 0.35
        const baseSpeed = selectedDifficulty === 1 ? 0.15
            : selectedDifficulty === 2 ? 0.2
                : selectedDifficulty === 3 ? 0.25
                    : 0.35;

        speedRef.current = baseSpeed;

        setGameState('playing');
        gameStateRef.current = 'playing';

        // Reset Logic
        scoreRef.current = 0;
        setScore(0);
        obstaclesRef.current = [];
        playerLaneRef.current = 1;
        setPlayerLane(1);
        lastSpawnZRef.current = 0;

        humRef.current.loop = true;
        humRef.current.volume = 0.3;
        humRef.current.play().catch(e => { });

        requestRef.current = requestAnimationFrame(gameLoop);
        spawnRow(selectedDifficulty, 0); // Pass diff to spawn

        window.addEventListener('keydown', handleInput);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('keydown', handleInput);
            humRef.current.pause();
        };
    }, []);

    const handleInput = useCallback((e) => {
        if (gameStateRef.current !== 'playing') return;
        if (e.key === 'ArrowLeft') moveLane(-1);
        if (e.key === 'ArrowRight') moveLane(1);
    }, []);

    const moveLane = (dir) => {
        const next = playerLaneRef.current + dir;
        if (next >= 0 && next < LANE_COUNT) {
            playerLaneRef.current = next;
            setPlayerLane(next);
            playSfx('swipe');
        }
    };

    const handleEject = () => {
        if (gameStateRef.current !== 'playing') return;

        gameStateRef.current = 'victory';
        setGameState('victory');
        playSfx('score');
        humRef.current.pause();
        addBits(score); // Bank the bits
        logGameSession('neon_runner', score, { result: 'victory', difficulty });
    };

    const spawnRow = (diff, startZ = -100) => {
        const rowData = generateObstacle(diff);
        const correct = rowData.lanes.find(l => l.type === 'correct');
        const label = correct.label;

        const newItems = rowData.lanes.map((laneData, idx) => ({
            id: rowData.id + '_' + idx,
            lane: idx,
            value: laneData.value,
            type: laneData.type,
            z: startZ,
            hit: false,
            questionLabel: label
        }));

        obstaclesRef.current = [...obstaclesRef.current, ...newItems];
        lastSpawnZRef.current = startZ;
    };

    const gameLoop = () => {
        if (gameStateRef.current !== 'playing') return;

        // 1. Update positions
        obstaclesRef.current.forEach(obs => {
            obs.z += speedRef.current;
        });

        // 2. Spawn
        lastSpawnZRef.current += speedRef.current;
        if (lastSpawnZRef.current > -40) {
            spawnRow(difficultyRef.current, -110);
        }

        // 3. Update HUD Question
        const upcomingGroup = obstaclesRef.current
            .filter(o => o.type === 'correct' && !o.hit && o.z < 90)
            .sort((a, b) => b.z - a.z);

        if (upcomingGroup.length > 0) {
            const nextQ = upcomingGroup[0].questionLabel;
            if (nextQ !== currentQuestionRef.current) {
                currentQuestionRef.current = nextQ;
                setActiveQuestion(nextQ);
            }
        }

        // 4. Collision
        obstaclesRef.current.forEach(obs => {
            if (obs.hit) return;

            if (obs.z > 75 && obs.z < 85) {
                if (obs.lane === playerLaneRef.current) {
                    obs.hit = true;

                    if (obs.type === 'correct') {
                        playSfx('score');
                        setScore(s => s + 10);
                        // Slow ramp up
                        speedRef.current += 0.01;
                    } else {
                        gameStateRef.current = 'gameover';
                        setGameState('gameover');
                        playSfx('crash');
                        setScreenShake(true);
                        humRef.current.pause();
                        logGameSession('neon_runner', score, { result: 'crash', difficulty });
                    }
                }
            }
        });

        // 5. Cleanup
        obstaclesRef.current = obstaclesRef.current.filter(obs => obs.z < 120);
        setRenderObstacles([...obstaclesRef.current]);

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    return (
        <div
            className="runner-container"
            style={{
                width: '100vw', height: '100vh',
                background: '#000',
                position: 'relative',
                overflow: 'hidden'
            }}
            onClick={(e) => {
                // Ignore clicks on UI buttons
                if (e.target.tagName === 'BUTTON') return;

                if (gameState !== 'playing') return;
                if (e.clientX < window.innerWidth / 2) moveLane(-1);
                else moveLane(1);
            }}
        >
            {gameState === 'menu' && <DifficultySelector onSelect={startGame} />}

            <div style={{
                width: '100%', height: '100%',
                animation: screenShake ? 'shake 0.5s' : 'none',
                opacity: gameState === 'menu' ? 0.3 : 1
            }}>
                <style>{`
            @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 100% { transform: translate(0,0); } }
          `}</style>

                {/* HUD */}
                <div style={{ position: 'absolute', top: 20, width: '100%', textAlign: 'center', zIndex: 100 }}>
                    <div className="neon-text-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score}</div>

                    {/* Active Question Box */}
                    <div style={{
                        background: 'rgba(0,0,0,0.8)', border: '2px solid var(--neon-cyan)',
                        padding: '10px 30px', display: 'inline-block', borderRadius: '20px', marginTop: '10px'
                    }}>
                        <span style={{ color: '#aaa', marginRight: '10px' }}>SOLVE:</span>
                        <span className="neon-text-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {activeQuestion}
                        </span>
                    </div>

                    {/* EJECT Button */}
                    <div style={{ position: 'absolute', top: 0, right: 20 }}>
                        <CyberButton variant="glitch" onClick={handleEject}>EJECT</CyberButton>
                    </div>
                </div>

                <Track />
                <Player lane={playerLane} />
                {renderObstacles.map(obs => <Obstacle key={obs.id} data={obs} />)}
            </div>

            {/* Victory / Success Screen */}
            {gameState === 'victory' && (
                <VictoryPopup
                    type={score > 50 ? 'achievement' : 'success'}
                    score={score}
                    onContinue={() => window.location.reload()}
                    onHome={() => navigate('/')}
                />
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)', zIndex: 200,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <FlushAnimation onComplete={() => console.log("Flush Complete")} />
                    </div>

                    <h1 className="neon-text-pink" style={{ marginTop: '-50px', zIndex: 100 }}>WASTED</h1>
                    <p style={{ zIndex: 100 }}>FINAL SCORE: {score}</p>

                    <div style={{ zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <CyberButton variant="primary" onClick={() => window.location.reload()}>RETRY</CyberButton>
                        <CyberButton variant="glitch" onClick={() => navigate('/')}>QUIT</CyberButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeonRunner;
