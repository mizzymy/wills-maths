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
    const [missionForm, setMissionForm] = useState({ title: '', target: 50, gameId: 'any' });

    const handleAddMission = () => {
        if (!missionForm.title) return;
        addMission({
            title: missionForm.title,
            type: 'score_cumulative',
            target: parseInt(missionForm.target),
            gameId: missionForm.gameId, // NEW: Specific game targeting
            icon: 'trophy',
            reward: missionForm.title
        });
        setMissionForm({ title: '', target: 50, gameId: 'any' });
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 className="neon-text-pink">HANDLER CONTROL</h1>
                <CyberButton variant="glitch" onClick={onClose}>EXIT MODE</CyberButton>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333' }}>
                {['analytics', 'missions', 'settings'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            padding: '10px 20px',
                            background: tab === t ? 'var(--neon-pink)' : 'transparent',
                            color: tab === t ? 'black' : '#888',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* ANALYTICS TAB */}
            {tab === 'analytics' && (
                <div>
                    <h2 style={{ borderBottom: '1px solid #333' }}>PERFORMANCE REPORT</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
                        {['neon_runner', 'the_breach', 'black_market', 'encryption_protocol'].map(game => (
                            <div key={game} style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                                <h3 style={{ margin: '0', color: 'var(--neon-cyan)', textTransform: 'capitalize' }}>{game.replace('_', ' ')}</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{getAverageScore(game)} <span style={{ fontSize: '0.8rem', color: '#666' }}>AVG SCORE</span></p>
                                <p style={{ color: '#888' }}>{history.filter(h => h.gameId === game).length} Sessions Played</p>
                            </div>
                        ))}
                    </div>

                    <h3>RECENT LOGS</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#000', padding: '10px' }}>
                        {history.slice(0, 20).map(entry => (
                            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', padding: '5px 0' }}>
                                <span style={{ color: '#aaa' }}>{new Date(entry.date).toLocaleDateString()}</span>
                                <span style={{ color: 'var(--neon-yellow)' }}>{entry.gameId}</span>
                                <span style={{ fontWeight: 'bold' }}>{entry.score} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MISSIONS TAB */}
            {tab === 'missions' && (
                <div>
                    <h2>ADD NEW REWARD</h2>
                    <div style={{ background: '#111', padding: '20px', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', color: '#888' }}>Reward Title (e.g. "1 Hour PS5")</label>
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
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{m.title}</h4>
                                <p style={{ margin: 0, color: '#888' }}>Target: {m.target} pts</p>
                                <div style={{ background: '#333', height: '5px', width: '200px', marginTop: '5px' }}>
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
