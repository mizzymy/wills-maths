import React, { useState } from 'react';

const TradingCard = ({ card, unlocked, onClick }) => {
    // Rarity colors
    const colors = {
        common: '#00ffaa', // Neon Green
        uncommon: '#00ccff', // Neon Blue
        rare: '#ffaa00', // Gold
        legendary: '#ff00ff' // Neon Pink
    };

    const color = colors[card.rarity] || '#fff';

    return (
        <div
            onClick={unlocked ? onClick : null}
            style={{
                width: '100%',
                aspectRatio: '2/3',
                position: 'relative',
                perspective: '1000px',
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.6,
                filter: unlocked ? 'none' : 'grayscale(100%) blur(1px)',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
                if (unlocked) e.currentTarget.style.transform = 'scale(1.05) rotateY(10deg)';
            }}
            onMouseLeave={(e) => {
                if (unlocked) e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}
        >
            {/* Holographic Border */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${color}22 0%, #000 50%, ${color}22 100%)`,
                border: `2px solid ${color}`,
                borderRadius: '10px',
                boxShadow: unlocked ? `0 0 15px ${color}66` : 'none',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>

                {/* Image */}
                <div style={{
                    width: '90%', height: '60%',
                    background: '#000',
                    backgroundImage: unlocked ? `url(/assets/images/cards/${card.id.replace('c_', 'card_')}.png)` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid #333',
                    marginBottom: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {!unlocked && <span style={{ fontSize: '3rem' }}>🔒</span>}
                </div>

                {/* Info */}
                <div style={{ textAlign: 'center', width: '90%' }}>
                    <div style={{
                        color: color,
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        marginBottom: '2px'
                    }}>
                        {card.name}
                    </div>

                    {unlocked ? (
                        <div style={{ fontSize: '0.6rem', color: '#aaa', fontStyle: 'italic' }}>
                            "{card.desc}"
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.6rem', color: '#666' }}>
                            LOCKED CLASSIFIED
                        </div>
                    )}
                </div>

                {/* Rarity Badge */}
                <div style={{
                    position: 'absolute', top: '5px', right: '5px',
                    fontSize: '0.6rem',
                    background: color,
                    color: '#000',
                    padding: '2px 5px',
                    fontWeight: 'bold',
                    borderRadius: '2px'
                }}>
                    {card.rarity.toUpperCase()}
                </div>
            </div>

            {/* Scanlines Effect for holograph */}
            {unlocked && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    pointerEvents: 'none',
                    zIndex: 10
                }} />
            )}
        </div>
    );
};

export default TradingCard;
