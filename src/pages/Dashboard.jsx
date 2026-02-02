import React, { useState, useEffect } from 'react';
import StatsPanel from '../components/launcher/StatsPanel';
import GameGrid from '../components/launcher/GameGrid';
import DailyLoginModal from '../components/ui/DailyLoginModal';
import ParentGate from '../components/parental/ParentGate';
import ParentDashboard from '../components/parental/ParentDashboard';
import { useNavigate } from 'react-router-dom';
import CyberButton from '../components/ui/CyberButton';
import { useGame } from '../context/GameContext';

const Dashboard = () => {
    const { rank, checkDailyReward } = useGame();
    const [showDaily, setShowDaily] = useState(false);
    const [showParentAuth, setShowParentAuth] = useState(false);
    const [showParentDash, setShowParentDash] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (checkDailyReward()) {
            setShowDaily(true);
        }
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingBottom: '50px' }}>
            {showDaily && <DailyLoginModal onClose={() => setShowDaily(false)} />}

            {/* Authenticated Admin View */}
            {showParentDash && <ParentDashboard onClose={() => setShowParentDash(false)} />}

            {/* Authentication Gate */}
            {showParentAuth && (
                <ParentGate
                    onUnlock={() => {
                        setShowParentAuth(false);
                        setShowParentDash(true);
                    }}
                    onClose={() => setShowParentAuth(false)}
                />
            )}

            {/* Header / ID Card Section */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h2 className="neon-text-cyan" style={{
                    fontSize: '1rem',
                    letterSpacing: '2px',
                    marginBottom: '0.2rem'
                }}>
                    SYNDICATE OS v1.0
                </h2>
                <h1 style={{
                    fontSize: '2rem',
                    margin: 0,
                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}>
                    WELCOME AGENT
                </h1>
            </div>

            <StatsPanel />
            {/* Rewards moved to AGENT nav */}

            <h3 style={{
                borderBottom: '1px solid var(--neon-blue)',
                paddingBottom: '0.5rem',
                marginTop: '2rem',
                marginBottom: '1rem',
                color: 'var(--neon-blue)',
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>AVAILABLE CONTRACTS</span>
                <span>STATUS: ONLINE</span>
            </h3>

            <GameGrid />

            {/* Parent Access Trigger */}
            <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.6 }}>
                <button
                    onClick={() => setShowParentAuth(true)}
                    style={{
                        background: 'transparent', border: '1px solid #333',
                        color: '#444', padding: '5px 10px', fontSize: '0.7rem',
                        cursor: 'pointer'
                    }}
                >
                    [ HANDLER ACCESS ]
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
