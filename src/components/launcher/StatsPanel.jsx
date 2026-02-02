import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';

const StatsPanel = () => {
    const { bits, rank } = useGame();
    const [displayBits, setDisplayBits] = useState(bits);

    // Animated counter for Bits
    useEffect(() => {
        if (displayBits === bits) return;

        // Simple lerp animation for numbers
        const step = bits > displayBits ? 1 : -1;
        const diff = Math.abs(bits - displayBits);

        // Jump if difference is huge, otherwise count 1 by 1
        if (diff > 50) {
            setDisplayBits(bits);
        } else {
            const timer = setTimeout(() => {
                setDisplayBits(prev => prev + step);
            }, 50); // Speed of count
            return () => clearTimeout(timer);
        }
    }, [bits, displayBits]);

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap', // Responsive wrapping
            gap: '15px', // Spacing when wrapped
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-panel)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--neon-blue)',
            marginBottom: '1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}>
            {/* Rank Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    border: '2px solid var(--neon-cyan)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Fallback if image missing */}
                    <img
                        src="/assets/images/ranks/rank_03_operative.png"
                        alt="Rank"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.textContent = rank[0]; // Show letter
                        }}
                    />
                </div>
                <div>
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--neon-cyan)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Clearance Level
                    </div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-mono)'
                    }}>
                        {rank}
                    </div>
                </div>
            </div>

            {/* Currency Section */}
            <div style={{ textAlign: 'right' }}>
                <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--neon-pink)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Encrypted Bits
                </div>
                <div className="neon-text-pink" style={{
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.5rem'
                }}>
                    <img src="/assets/images/ui/icon_currency_bit.svg" alt="B" style={{ width: '24px' }} />
                    {displayBits}
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
