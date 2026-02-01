import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateObstacle, LANE_COUNT } from './RunnerLogic';
import Player from './components/Player';
import Track from './components/Track';
import Obstacle from './components/Obstacle';
import CyberButton from '../../components/ui/CyberButton';

const NeonRunner = () => {
    const navigate = useNavigate();
    const { addBits } = useGame();

    // -- UI State --
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [renderObstacles, setRenderObstacles] = useState([]);
    const [playerLane, setPlayerLane] = useState(1);
    const [activeQuestion, setActiveQuestion] = useState("GET READY");
    const [screenShake, setScreenShake] = useState(false);

    // -- Game Logic Refs --
    const gameStateRef = useRef('playing');
    const obstaclesRef = useRef([]); // Array of Items 
    const playerLaneRef = useRef(1);
    const speedRef = useRef(0.3); // Base Speed (Slower start)
    const scoreRef = useRef(0);
    const lastSpawnZRef = useRef(0);
    const requestRef = useRef();

    // Track the 'current' question being solved (the one closest to player)
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

    useEffect(() => {
        gameStateRef.current = 'playing';
        scoreRef.current = 0;
        obstaclesRef.current = [];
        playerLaneRef.current = 1;

        humRef.current.loop = true;
        humRef.current.volume = 0.3;
        humRef.current.play().catch(e => { });

        requestRef.current = requestAnimationFrame(gameLoop);
        spawnRow(0);

        window.addEventListener('keydown', handleInput);
        return () => {
            cancelAnimationFrame(requestRef.current);
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

    const spawnRow = (startZ = -100) => {
        const rowData = generateObstacle(1);
        const correct = rowData.lanes.find(l => l.type === 'correct');

        // Store label in the obstacles themselves so we can retrieve it later
        const label = correct.label;

        // Create 3 Obstacles
        const newItems = rowData.lanes.map((laneData, idx) => ({
            id: rowData.id + '_' + idx,
            lane: idx,
            value: laneData.value,
            type: laneData.type,
            z: startZ,
            hit: false,
            questionLabel: label // Attach the question directly to the object
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
            spawnRow(-110);
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
                        // Very slow ramp up. 0.3 -> 0.6 over 30 hits. 
                        // (0.3 gap / 30 = 0.01 per hit)
                        speedRef.current += 0.01;
                    } else {
                        gameStateRef.current = 'gameover';
                        setGameState('gameover');
                        playSfx('crash');
                        setScreenShake(true);
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
                if (gameState !== 'playing') return;
                if (e.clientX < window.innerWidth / 2) moveLane(-1);
                else moveLane(1);
            }}
        >
            <div style={{
                width: '100%', height: '100%',
                animation: screenShake ? 'shake 0.5s' : 'none'
            }}>
                <style>{`
            @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 100% { transform: translate(0,0); } }
          `}</style>

                {/* HUD */}
                <div style={{ position: 'absolute', top: 20, width: '100%', textAlign: 'center', zIndex: 100 }}>
                    <div className="neon-text-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score}</div>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)', border: '2px solid var(--neon-cyan)',
                        padding: '10px 30px', display: 'inline-block', borderRadius: '20px', marginTop: '10px'
                    }}>
                        <span style={{ color: '#aaa', marginRight: '10px' }}>SOLVE:</span>
                        <span className="neon-text-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {activeQuestion}
                        </span>
                    </div>
                </div>

                <Track />
                <Player lane={playerLane} />
                {renderObstacles.map(obs => <Obstacle key={obs.id} data={obs} />)}
            </div>

            {gameState === 'gameover' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)', zIndex: 200,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h1 className="neon-text-pink">CRASHED</h1>
                    <p>FINAL SCORE: {score}</p>
                    <CyberButton variant="primary" onClick={() => window.location.reload()}>RETRY</CyberButton>
                    <br />
                    <CyberButton variant="glitch" onClick={() => navigate('/')}>QUIT</CyberButton>
                </div>
            )}
        </div>
    );
};

export default NeonRunner;
