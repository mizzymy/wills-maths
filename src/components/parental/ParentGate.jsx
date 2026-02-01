import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import CyberButton from '../ui/CyberButton';

const ParentGate = ({ onUnlock, onClose }) => {
    const { parentPin } = useGame();
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const handleNum = (num) => {
        if (input.length < 4) {
            setInput(prev => prev + num);
            setError(false);
        }
    };

    const handleClear = () => setInput('');

    const handleSubmit = () => {
        if (input === parentPin) {
            onUnlock();
        } else {
            setError(true);
            setInput('');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--neon-cyan)'
        }}>
            <h2 style={{ marginBottom: '2rem' }}>HANDLER AUTHENTICATION</h2>

            <div style={{
                fontSize: '2rem', marginBottom: '2rem', letterSpacing: '10px',
                borderBottom: `2px solid ${error ? 'red' : 'var(--neon-cyan)'}`,
                width: '150px', textAlign: 'center', height: '50px'
            }}>
                {input.padEnd(4, '•').replace(/./g, (char, i) => i < input.length ? '*' : '•')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <CyberButton key={num} variant="secondary" onClick={() => handleNum(num)} style={{ width: '60px' }}>
                        {num}
                    </CyberButton>
                ))}
                <CyberButton variant="glitch" onClick={handleClear}>C</CyberButton>
                <CyberButton variant="secondary" onClick={() => handleNum(0)}>0</CyberButton>
                <CyberButton variant="primary" onClick={handleSubmit}>OK</CyberButton>
            </div>

            <button
                onClick={onClose}
                style={{
                    marginTop: '2rem', background: 'none', border: 'none',
                    color: '#666', textDecoration: 'underline', cursor: 'pointer'
                }}
            >
                Cancel Access
            </button>
        </div>
    );
};

export default ParentGate;
