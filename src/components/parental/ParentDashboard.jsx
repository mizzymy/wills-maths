import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import CyberButton from '../ui/CyberButton';

const ParentDashboard = ({ onClose }) => {
    const { history, missions, addMission, redeemMission, parentPin, setParentPin } = useGame();
    const [tab, setTab] = useState('analytics'); // analytics, missions, settings
    const [newPin, setNewPin] = useState('');

    // -- Analytics Helpers --
    const getAverageScore = (gameId) => {
        const gameLogs = history.filter(h => h.gameId === gameId);
        if (gameLogs.length === 0) return 0;
        const total = gameLogs.reduce((acc, curr) => acc + curr.score, 0);
        return Math.round(total / gameLogs.length);
    };

    // -- Mission Form --
    const [missionForm, setMissionForm] = useState({ title: '', target: 50, gameId: 'any', isRealWorld: false });

    const handleAddMission = () => {
        if (!missionForm.title) return;
        addMission({
            title: missionForm.title,
            type: 'score_cumulative',
            target: parseInt(missionForm.target),
            gameId: missionForm.gameId,
            icon: missionForm.isRealWorld ? 'certificate' : 'trophy',
            reward: missionForm.title,
            isRealWorld: missionForm.isRealWorld
        });
        setMissionForm({ title: '', target: 50, gameId: 'any', isRealWorld: false });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: '#050510',
            zIndex: 1500,
            padding: '20px',
            overflowY: 'auto',
            color: '#eee'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="neon-text-pink" style={{ margin: 0, letterSpacing: '2px' }}>PARENT DASHBOARD</h2>
                <CyberButton variant="glitch" onClick={onClose} style={{ fontSize: '0.8rem', padding: '5px 15px' }}>
                    CLOSE ACCESS
                </CyberButton>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <CyberButton
                    variant={tab === 'analytics' ? 'primary' : 'secondary'}
                    onClick={() => setTab('analytics')}
                    style={{ flex: 1 }}
                >
                    ANALYTICS
                </CyberButton>
                <CyberButton
                    variant={tab === 'missions' ? 'primary' : 'secondary'}
                    onClick={() => setTab('missions')}
                    style={{ flex: 1 }}
                >
                    MISSIONS
                </CyberButton>
                <CyberButton
                    variant={tab === 'settings' ? 'primary' : 'secondary'}
                    onClick={() => setTab('settings')}
                    style={{ flex: 1 }}
                >
                    SETTINGS
                </CyberButton>
            </div>

            {/* ANALYTICS TAB */}
            {tab === 'analytics' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {[
                        { id: 'neon_runner', name: 'Neon Runner' },
                        { id: 'the_breach', name: 'The Breach' },
                        { id: 'encryption_protocol', name: 'Encryption' },
                        { id: 'black_market', name: 'Black Market' }
                    ].map(game => (
                        <div key={game.id} style={{
                            background: '#111', padding: '20px', borderRadius: '10px',
                            border: '1px solid #333'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--neon-cyan)' }}>{game.name}</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {getAverageScore(game.id)} <span style={{ fontSize: '1rem', color: '#666' }}>avg pts</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                                Sessions: {history.filter(h => h.gameId === game.id).length}
                            </div>
                        </div>
                    ))}

                    <div style={{
                        background: '#111', padding: '20px', borderRadius: '10px',
                        border: '1px solid var(--neon-pink)', gridColumn: '1 / -1'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'var(--neon-pink)' }}>TOTAL REWARDS UNLOCKED</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            {missions.filter(m => m.redeemed).length} / {missions.length}
                        </div>
                    </div>
                </div>
            )}

            {/* MISSIONS TAB */}
            {tab === 'missions' && (
                <div>
                    <h2>ADD NEW REWARD</h2>
                    <div style={{ background: '#111', padding: '20px', marginBottom: '20px' }}>

                        {/* Type Toggle */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <CyberButton
                                variant={!missionForm.isRealWorld ? 'primary' : 'secondary'}
                                onClick={() => setMissionForm({ ...missionForm, isRealWorld: false })}
                                style={{ flex: 1, padding: '15px', fontSize: '0.9rem', justifyContent: 'center' }}
                            >
                                DIGITAL BITS
                            </CyberButton>
                            <CyberButton
                                variant={missionForm.isRealWorld ? 'primary' : 'secondary'}
                                onClick={() => setMissionForm({ ...missionForm, isRealWorld: true })}
                                style={{
                                    flex: 1, padding: '15px', fontSize: '0.9rem', justifyContent: 'center',
                                    ...(missionForm.isRealWorld ? {
                                        borderColor: 'var(--neon-pink)',
                                        color: 'var(--neon-pink)',
                                        boxShadow: '0 0 10px var(--neon-pink)'
                                    } : {})
                                }}
                            >
                                REAL WORLD
                            </CyberButton>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', color: '#888' }}>
                                {missionForm.isRealWorld ? 'Reward Name (e.g. "Pizza Night")' : 'Reward Title'}
                            </label>
                            <input
                                style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                                value={missionForm.title}
                                onChange={e => setMissionForm({ ...missionForm, title: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', color: '#888' }}>Target Game</label>
                            <select
                                style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                                value={missionForm.gameId}
                                onChange={e => setMissionForm({ ...missionForm, gameId: e.target.value })}
                            >
                                <option value="any">Any Game (Total Score)</option>
                                <option value="neon_runner">Neon Runner</option>
                                <option value="the_breach">The Breach</option>
                                <option value="black_market">Black Market</option>
                                <option value="encryption_protocol">Encryption Protocol</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', color: '#888' }}>Target Points (Cumulative)</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                                value={missionForm.target}
                                onChange={e => setMissionForm({ ...missionForm, target: e.target.value })}
                            />
                        </div>
                        <CyberButton variant="primary" onClick={handleAddMission}>CREATE MISSION</CyberButton>
                    </div>

                    <h3>ACTIVE MISSIONS</h3>
                    {missions.map(m => (
                        <div key={m.id} style={{
                            background: m.redeemed ? '#131' : '#111',
                            padding: '15px', marginBottom: '10px',
                            borderLeft: `4px solid ${m.redeemed ? '#0f0' : 'var(--neon-pink)'}`,
                            display: 'flex', flexWrap: 'wrap', gap: '10px', // Allow wrapping
                            justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ flex: 1, minWidth: '200px' }}> {/* Allow growing */}
                                <h4 style={{ margin: 0 }}>{m.title}</h4>
                                <p style={{ margin: 0, color: '#888' }}>Target: {m.target} pts</p>
                                <div style={{ background: '#333', height: '5px', width: '100%', marginTop: '5px' }}> {/* Fluid width */}
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(100, (m.current / m.target) * 100)}%`,
                                        background: m.redeemed ? '#0f0' : 'var(--neon-cyan)'
                                    }} />
                                </div>
                            </div>
                            <div>
                                {m.redeemed ? (
                                    <span style={{ color: '#0f0', fontWeight: 'bold' }}>CLAIMED</span>
                                ) : (
                                    <span style={{ color: '#888' }}>IN PROGRESS</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SETTINGS TAB */}
            {tab === 'settings' && (
                <div>
                    <h2>SECURITY</h2>
                    <p>Current PIN: ****</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            maxLength={4}
                            placeholder="New PIN"
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            style={{ padding: '10px' }}
                        />
                        <CyberButton variant="glitch" onClick={() => {
                            if (newPin.length === 4) {
                                setParentPin(newPin);
                                setNewPin('');
                                alert('PIN UPDATED');
                            }
                        }}>UPDATE PIN</CyberButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentDashboard;
