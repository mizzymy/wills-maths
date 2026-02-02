import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import CyberButton from '../ui/CyberButton';
import ParentGate from './ParentGate';
import ParentDashboard from './ParentDashboard';
import TradingCard from '../ui/TradingCard';

const RewardsScreen = () => {
    const navigate = useNavigate();
    const {
        rank, bits,
        missions, redeemMission,
        parentPin, setParentPin,
        collectibles, CARDS // Import collectibles
    } = useGame();

    const [tab, setTab] = useState('vault'); // vault | archive
    const [showParentGate, setShowParentGate] = useState(false);
    const [isParentMode, setIsParentMode] = useState(false);

    const onGateSuccess = () => {
        setShowParentGate(false);
        setIsParentMode(true);
    };

    const unlockedRewards = missions.filter(m => m.redeemed);
    const pendingRewards = missions.filter(m => m.current >= m.target && !m.redeemed);
    const activeMissions = missions.filter(m => m.current < m.target);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050510',
            color: '#fff',
            padding: '20px',
            fontFamily: "'Rajdhani', sans-serif"
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
                borderBottom: '1px solid #333', paddingBottom: '20px', gap: '15px' // Added gap and wrap
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 className="neon-text-pink" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '3px', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                        REWARDS
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isParentMode && (
                        <CyberButton variant="secondary" onClick={() => setShowParentGate(true)}>
                            ⚙️ HANDLE
                        </CyberButton>
                    )}
                    <CyberButton variant="secondary" onClick={() => navigate('/dashboard')}>
                        RETURN
                    </CyberButton>
                </div>
            </div>

            {/* Parent Mode Overlay */}
            {isParentMode && (
                <ParentDashboard onClose={() => setIsParentMode(false)} />
            )}

            {/* Parent Gate Modal */}
            {showParentGate && (
                <ParentGate
                    onSuccess={onGateSuccess}
                    onClose={() => setShowParentGate(false)}
                />
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <CyberButton
                    onClick={() => setTab('vault')}
                    variant={tab === 'vault' ? 'primary' : 'secondary'}
                    style={{
                        flex: '1 1 auto',
                        justifyContent: 'center',
                        fontSize: 'clamp(0.8rem, 3vw, 1.2rem)',
                        borderColor: tab === 'vault' ? 'var(--neon-pink)' : '#333',
                        color: tab === 'vault' ? '#000' : '#888', // Black text on active
                        backgroundColor: tab === 'vault' ? 'var(--neon-pink)' : 'transparent', // Force background
                        boxShadow: tab === 'vault' ? '0 0 15px var(--neon-pink)' : 'none'
                    }}
                >
                    THE VAULT
                </CyberButton>

                <CyberButton
                    onClick={() => setTab('archive')}
                    variant={tab === 'archive' ? 'primary' : 'secondary'}
                    style={{
                        flex: '1 1 auto',
                        justifyContent: 'center',
                        fontSize: 'clamp(0.8rem, 3vw, 1.2rem)',
                        borderColor: tab === 'archive' ? 'var(--neon-cyan)' : '#333',
                        color: tab === 'archive' ? '#000' : '#888', // Black text on active
                        backgroundColor: tab === 'archive' ? 'var(--neon-cyan)' : 'transparent', // Force background
                        boxShadow: tab === 'archive' ? '0 0 15px var(--neon-cyan)' : 'none'
                    }}
                >
                    SYNDICATE ARCHIVES
                </CyberButton>
            </div>

            {tab === 'vault' && (
                <>
                    {/* Active Missions */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '20px' }}>ACTIVE DIRECTIVES</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {activeMissions.length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1', textAlign: 'center', padding: '50px',
                                    border: '1px dashed #333', borderRadius: '10px', color: '#666'
                                }}>
                                    <h3>NO ACTIVE DIRECTIVES</h3>
                                    <p>Request new orders from your Handler (Parents, Teacher, or Guardian).</p>
                                </div>
                            )}
                            {activeMissions.map(m => {
                                const progress = Math.min(100, (m.current / m.target) * 100);
                                const isComplete = m.current >= m.target;

                                return (
                                    <div key={m.id} style={{
                                        background: '#111', padding: '20px', borderRadius: '10px',
                                        border: '1px solid #333', position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{m.title}</span>
                                            <span style={{ color: 'var(--neon-pink)' }}>{m.current} / {m.target}</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{ height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', width: `${progress}%`,
                                                background: isComplete ? 'var(--neon-green)' : 'var(--neon-pink)',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>

                                        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#888' }}>
                                            Reward: {m.isRealWorld ? <span style={{ color: 'var(--neon-pink)' }}>REAL WORLD ITEM</span> : `${m.reward} BITS`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pending Claims */}
                    {pendingRewards.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <h3 className="neon-text-green" style={{ marginBottom: '20px' }}>MISSION ACCOMPLISHED</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {pendingRewards.map(m => (
                                    <div key={m.id} className="glitch-box" style={{ padding: '20px', textAlign: 'center' }}>
                                        <h3 style={{ margin: 0, color: 'var(--neon-green)' }}>{m.title} COMPLETE</h3>
                                        <p>CODE: <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '5px', color: '#fff' }}>{m.claimCode || 'AUTO'}</span></p>
                                        <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Show this code to your Handler to unlock the vault.</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* The Vault (Unlocked) */}
                    <div>
                        <h3 style={{ color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🔓</span> SECURE VAULT STORAGE
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {unlockedRewards.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '50px', color: '#444' }}>
                                    <h2>VAULT EMPTY</h2>
                                    <p>Complete missions to earn real world rewards and in-game challenges from your teacher or guardian.</p>
                                </div>
                            )}
                            {unlockedRewards.map(m => (
                                <div key={m.id} style={{
                                    background: '#1a1a1a', padding: '20px', borderRadius: '10px',
                                    border: '1px solid var(--neon-green)', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎁</div>
                                    <div style={{ fontWeight: 'bold' }}>{m.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Unlocked: {new Date(m.unlockedAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* SYNDICATE ARCHIVES TAB */}
            {tab === 'archive' && (
                <div>
                    <div style={{
                        background: 'rgba(0, 255, 255, 0.05)',
                        border: '1px solid var(--neon-cyan)',
                        padding: '20px', borderRadius: '10px', marginBottom: '30px'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'var(--neon-cyan)' }}>PERSONNEL DATABASE</h3>
                        <p style={{ margin: 0, color: '#aaa' }}>
                            Collect character cards by completing secret milestones across the network.
                            <br />
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Current Collection: {collectibles ? collectibles.length : 0} / {CARDS ? CARDS.length : 0}</span>
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' }}>
                        {CARDS && CARDS.map(card => (
                            <TradingCard
                                key={card.id}
                                card={card}
                                unlocked={collectibles && collectibles.includes(card.id)}
                                onClick={() => { }} // Could open modal details
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardsScreen;
