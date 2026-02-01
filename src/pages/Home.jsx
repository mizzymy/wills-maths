import React from 'react';
import { useGame } from '../context/GameContext';

const Home = () => {
    const { rank } = useGame();

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1 className="neon-text-cyan" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                WELCOME AGENT
            </h1>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Status: {rank}</p>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="neon-border" style={{ padding: '2rem', borderRadius: '10px', background: '#111' }}>
                    <h2 className="neon-text-pink">THE BREACH</h2>
                    <p>Hack the firewall. Speed recall.</p>
                    <button style={{
                        marginTop: '1rem',
                        background: 'var(--neon-pink)',
                        border: 'none',
                        color: 'black',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
                    }}>
                        START MISSION
                    </button>
                </div>

                <div className="neon-border" style={{ padding: '2rem', borderRadius: '10px', background: '#111', opacity: 0.5 }}>
                    <h2 className="neon-text-cyan">NEON RUNNER</h2>
                    <p>Locked. Increase Rank to unlock.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
