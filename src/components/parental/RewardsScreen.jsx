import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import CyberButton from '../ui/CyberButton';
import { useNavigate } from 'react-router-dom';

const RewardsScreen = () => {
    const navigate = useNavigate();
    const { missions, redeemMission } = useGame();
    const [tab, setTab] = useState('directives'); // directives, vault

    const activeMissions = missions.filter(m => !m.redeemed);
    const unlockedRewards = missions.filter(m => m.redeemed && m.isRealWorld);

    return (
        <div style={{
            height: '100vh',
            background: 'radial-gradient(circle at center, #1a1a2e 0%, #000 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflowY: 'auto'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px'
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#888', fontSize: '0.8rem', letterSpacing: '2px' }}>SYNDICATE REWARDS</h2>
                    <h1 className="neon-text-yellow" style={{ margin: 0, fontSize: '2rem' }}>THE VAULT</h1>
                </div>
                <CyberButton
                    variant="glitch"
                    style={{ padding: '8px 16px', fontSize: '0.75rem', maxWidth: '120px' }}
                    onClick={() => navigate('/')}
                >
                    &lt; RETURN
                </CyberButton>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <CyberButton
                    variant={tab === 'directives' ? 'primary' : 'secondary'}
                    style={{ flex: 1, padding: '10px 5px', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    onClick={() => setTab('directives')}
                >
                    DIRECTIVES {activeMissions.length > 0 && `(${activeMissions.length})`}
                </CyberButton>
                <CyberButton
                    variant={tab === 'vault' ? 'primary' : 'secondary'}
                    style={{ flex: 1, padding: '10px 5px', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    onClick={() => setTab('vault')}
                >
                    VAULT {unlockedRewards.length > 0 && `(${unlockedRewards.length})`}
                </CyberButton>
            </div>

            {/* DIRECTIVES TAB */}
            {tab === 'directives' && (
                <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {activeMissions.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1', textAlign: 'center', padding: '50px',
                            border: '1px dashed #333', borderRadius: '10px', color: '#666'
                        }}>
                            <h3>NO ACTIVE DIRECTIVES</h3>
                            <p>Request new orders from your Handler (Parents).</p>
                        </div>
                    )}
                    {activeMissions.map(m => {
                        const progress = Math.min(100, (m.current / m.target) * 100);
                        const isComplete = m.current >= m.target;

                        return (
                            <div key={m.id} style={{
                                background: 'linear-gradient(180deg, #111 0%, #050510 100%)',
                                border: isComplete ? '1px solid var(--neon-green)' : '1px solid #333',
                                borderRadius: '12px',
                                padding: '20px',
                                position: 'relative',
                                boxShadow: isComplete ? '0 0 15px rgba(0,255,100,0.1)' : 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>
                                            {m.gameId === 'any' ? 'GLOBAL OBJECTIVE' : m.gameId.replace('_', ' ').toUpperCase()}
                                        </div>
                                        <h3 style={{ margin: 0, color: m.isRealWorld ? 'var(--neon-pink)' : 'var(--neon-cyan)', fontSize: '1.2rem' }}>
                                            {m.title}
                                        </h3>
                                    </div>
                                    {m.isRealWorld && (
                                        <div style={{
                                            background: 'var(--neon-pink)', color: '#000',
                                            borderRadius: '50%', width: '30px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                        }}>
                                            R
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>
                                    <span>PROGRESS</span>
                                    <span style={{ color: isComplete ? 'var(--neon-green)' : '#fff' }}>{m.current} / {m.target}</span>
                                </div>

                                <div style={{ height: '6px', background: '#222', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        background: isComplete ? 'var(--neon-green)' : (m.isRealWorld ? 'var(--neon-pink)' : 'var(--neon-cyan)'),
                                        boxShadow: `0 0 10px ${isComplete ? 'var(--neon-green)' : 'var(--neon-cyan)'}`
                                    }} />
                                </div>

                                {isComplete ? (
                                    <CyberButton
                                        variant="primary"
                                        style={{ width: '100%' }}
                                        onClick={() => redeemMission(m.id)}
                                    >
                                        {m.isRealWorld ? 'Generate Certificate' : 'Claim Reward'}
                                    </CyberButton>
                                ) : (
                                    <div style={{
                                        textAlign: 'center', color: '#444', fontSize: '0.8rem',
                                        padding: '10px', border: '1px solid #222', borderRadius: '4px'
                                    }}>
                                        AWAITING COMPLETION
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* VAULT TAB (Certificates) */}
            {tab === 'vault' && (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {unlockedRewards.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '50px', color: '#444' }}>
                            <h2>VAULT EMPTY</h2>
                            <p>Complete Real World missions to earn certificates.</p>
                        </div>
                    )}
                    {unlockedRewards.map(m => (
                        <div key={m.id} style={{
                            background: '#000',
                            border: '1px solid var(--neon-gold)',
                            borderRadius: '15px',
                            padding: '5px', // Frame padding
                            position: 'relative',
                            boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)',
                        }}>
                            {/* Inner Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #222 0%, #111 100%)',
                                borderRadius: '10px',
                                padding: '25px',
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center'
                            }}>
                                <div style={{
                                    borderBottom: '1px solid #444', paddingBottom: '10px',
                                    marginBottom: '20px', letterSpacing: '2px', color: 'var(--neon-gold)', fontSize: '0.8rem'
                                }}>
                                    OFFICIAL SYNDICATE REWARD
                                </div>

                                <h1 style={{
                                    fontSize: '2rem', margin: '0 0 20px 0', color: '#fff',
                                    textShadow: '0 0 10px rgba(255,255,255,0.3)',
                                    lineHeight: 1.2
                                }}>
                                    {m.reward}
                                </h1>

                                <div style={{
                                    background: '#111', padding: '15px', borderRadius: '8px',
                                    border: '1px dashed #555', display: 'inline-block', margin: '0 auto'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>AUTHENTICATION CODE</div>
                                    <div style={{
                                        fontSize: '2.2rem', fontFamily: 'monospace', letterSpacing: '4px',
                                        color: 'var(--neon-green)', fontWeight: 'bold'
                                    }}>
                                        {m.claimCode}
                                    </div>
                                </div>

                                <p style={{ marginTop: '25px', fontSize: '0.7rem', color: '#444' }}>
                                    ISSUED: {new Date(m.unlockedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RewardsScreen;
