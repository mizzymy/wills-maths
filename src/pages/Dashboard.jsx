import React from 'react';
import StatsPanel from '../components/launcher/StatsPanel';
import GameGrid from '../components/launcher/GameGrid';
import { useGame } from '../context/GameContext';

const Dashboard = () => {
    const { rank } = useGame();

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            {/* Header / ID Card Section */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h2 className="neon-text-cyan" style={{
                    fontSize: '1rem',
                    letterSpacing: '2px',
                    marginBottom: '0.2rem'
                }}>
                    SYNDICATE OS v1.0
                </h2>
                <h1 style={{
                    fontSize: '2rem',
                    margin: 0,
                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}>
                    WELCOME AGENT
                </h1>
            </div>

            <StatsPanel />

            <h3 style={{
                borderBottom: '1px solid var(--neon-blue)',
                paddingBottom: '0.5rem',
                marginTop: '2rem',
                marginBottom: '1rem',
                color: 'var(--neon-blue)',
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>AVAILABLE CONTRACTS</span>
                <span>STATUS: ONLINE</span>
            </h3>

            <GameGrid />
        </div>
    );
};

export default Dashboard;
