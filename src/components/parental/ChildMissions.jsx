import React from 'react';
import { useGame } from '../../context/GameContext';
import CyberButton from '../ui/CyberButton';

const ChildMissions = () => {
    const { missions, redeemMission } = useGame();

    const activeMissions = missions.filter(m => !m.redeemed);

    if (activeMissions.length === 0) return null;

    return (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <h3 style={{ color: 'var(--neon-yellow)', fontSize: '1rem', letterSpacing: '2px' }}>
                ACTIVE DIRECTIVES
            </h3>

            {activeMissions.map(m => {
                const progress = Math.min(100, (m.current / m.target) * 100);
                const isComplete = m.current >= m.target;
                const gameLabel = m.gameId && m.gameId !== 'any'
                    ? m.gameId.replace('_', ' ').toUpperCase()
                    : 'GENERAL SCORE';

                return (
                    <div key={m.id} style={{
                        background: 'rgba(0, 20, 0, 0.4)',
                        border: `1px solid ${isComplete ? 'var(--neon-yellow)' : '#333'}`,
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', display: 'block' }}>{m.title}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>[{gameLabel}]</span>
                            </div>
                            <span style={{ color: isComplete ? 'var(--neon-yellow)' : '#888' }}>
                                {m.current} / {m.target} pts
                            </span>
                        </div>

                        <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: isComplete ? 'var(--neon-yellow)' : 'var(--neon-cyan)',
                                transition: 'width 0.5s ease-out'
                            }} />
                        </div>

                        {isComplete && (
                            <CyberButton
                                variant="glitch"
                                style={{ width: '100%', fontSize: '0.8rem' }}
                                onClick={() => redeemMission(m.id)}
                            >
                                CLAIM REWARD TICKET
                            </CyberButton>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ChildMissions;
