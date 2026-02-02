import React from 'react';
import { useNavigate } from 'react-router-dom';
import CyberButton from '../ui/CyberButton';

const GAMES = [
    {
        id: 'breach',
        title: 'THE BREACH',
        subtitle: 'Reflex Recall',
        desc: 'Hack the firewall. Speed recall.',
        path: '/game/breach',
        locked: false,
        color: 'var(--neon-pink)'
    },
    {
        id: 'runner',
        title: 'NEON RUNNER',
        subtitle: 'Multiplication Chase',
        path: '/game/runner',
        locked: false,
        color: 'var(--neon-cyan)'
    },
    {
        id: 'market',
        title: 'E-SHOP',
        subtitle: 'Cyber Merchant',
        desc: 'Serve customers. Calculate change.',
        path: '/game/market',
        locked: false,
        color: 'var(--neon-yellow)'
    },
    {
        id: 'encrypt',
        title: 'ENCRYPTION',
        subtitle: 'Logic & Patterns',
        desc: 'Crack the sequence.',
        path: '/game/encrypt',
        locked: false,
        color: 'var(--neon-blue)'
    },
    {
        id: 'heist',
        title: 'THE HEIST',
        subtitle: 'Boss Battle',
        desc: 'Defeat the Warden.',
        path: '/game/heist',
        locked: false,
        color: 'white'
    }
];

const GameCard = ({ game, onClick }) => (
    <div style={{
        position: 'relative',
        background: 'var(--bg-panel)',
        border: `1px solid ${game.locked ? '#333' : game.color}`,
        borderRadius: '10px',
        padding: '1.5rem',
        marginBottom: '1rem',
        opacity: game.locked ? 0.6 : 1,
        transition: 'transform 0.2s',
        overflow: 'hidden'
    }}>
        {/* Locked Overlay */}
        {game.locked && (
            <div style={{
                position: 'absolute',
                top: '10px', right: '10px',
                color: '#555',
                fontFamily: 'var(--font-mono)',
                border: '1px solid #555',
                padding: '2px 6px',
                fontSize: '0.7rem'
            }}>
                LOCKED
            </div>
        )}

        <h3 style={{ margin: 0, color: game.locked ? '#777' : game.color }}>
            {game.title}
        </h3>
        <div style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            color: '#aaa'
        }}>
            {game.subtitle}
        </div>

        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem' }}>
            {game.desc}
        </p>

        <CyberButton
            variant={game.locked ? 'glitch' : 'primary'}
            disabled={game.locked}
            onClick={() => onClick(game)}
            style={{ width: '100%' }}
        >
            {game.locked ? 'OFFLINE' : 'START MISSION'}
        </CyberButton>
    </div>
);

const GameGrid = () => {
    const navigate = useNavigate();

    const handlePlay = (game) => {
        if (game.locked) return;
        // Play confirm sound here or via button
        navigate(game.path);
    };

    return (
        <div className="game-grid">
            {GAMES.map(game => (
                <GameCard key={game.id} game={game} onClick={handlePlay} />
            ))}
        </div>
    );
};

export default GameGrid;
