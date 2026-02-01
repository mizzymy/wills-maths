import React from 'react';
import CyberButton from '../ui/CyberButton';

const LEVELS = [
    { id: 1, label: 'ROOKIE', color: 'var(--neon-green)', desc: 'Extended Time. Lower Speed. Basic Math.' },
    { id: 2, label: 'AGENT', color: 'var(--neon-cyan)', desc: 'Standard Operations. Balanced Challenge.' },
    { id: 3, label: 'VETERAN', color: 'var(--neon-purple)', desc: 'Fast Paced. Complex Operations. 75% Time.' },
    { id: 4, label: 'ELITE', color: 'var(--neon-red)', desc: 'Maximum Velocity. Chaos Mode. 50% Time.' }
];

const DifficultySelector = ({ onSelect, customLevels }) => {
    const levelsToRender = customLevels || LEVELS;

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <h1 className="neon-text-cyan" style={{ marginBottom: '10px', fontSize: '2rem' }}>
                SELECT CLEARANCE
            </h1>
            <p style={{ color: '#888', marginBottom: '30px', textAlign: 'center' }}>
                AUTHORIZATION LEVEL REQUIRED FOR MISSION ENTRY
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '400px' }}>
                {levelsToRender.map(lvl => (
                    <button
                        key={lvl.id}
                        onClick={() => onSelect(lvl.id)}
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: `1px solid ${lvl.color}`,
                            padding: '15px',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            boxShadow: `0 0 10px ${lvl.color}20`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${lvl.color}20`;
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <div>
                            <div style={{ color: lvl.color, fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {lvl.label}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>
                                {lvl.desc}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: lvl.color }}>
                            {'>'}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DifficultySelector;
