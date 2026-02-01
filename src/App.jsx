import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TheBreach from './games/TheBreach/Game';
import NeonRunner from './games/NeonRunner/Game';
import BlackMarket from './games/BlackMarket/Game';
import EncryptionProtocol from './games/Encryption/Game';
import TheHeist from './games/TheHeist/Game';
import { useGame } from './context/GameContext';

// Placeholder for other pages
const Shop = () => <div className="p-4"><h1>Shop (Under Construction)</h1></div>;
const Profile = () => <div className="p-4"><h1>Profile (Under Construction)</h1></div>;

function App() {
    const { bits, rank } = useGame();

    return (
        <div className="app-container">
            {/* HUD / Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'var(--bg-panel)',
                borderBottom: '1px solid var(--neon-blue)'
            }}>
                <div className="neon-text-cyan" style={{ fontWeight: 'bold' }}>WILLS MATHS</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className="neon-text-pink">₿ {bits}</span>
                    <span style={{ color: 'var(--neon-yellow)' }}>[{rank}]</span>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ padding: '1rem', flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/game/breach" element={<TheBreach />} />
                    <Route path="/game/runner" element={<NeonRunner />} />
                    <Route path="/game/market" element={<BlackMarket />} />
                    <Route path="/game/encrypt" element={<EncryptionProtocol />} />
                    <Route path="/game/heist" element={<TheHeist />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </main>

            {/* Bottom Nav (Mobile Style) */}
            <footer style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '1rem',
                background: 'var(--bg-panel)',
                borderTop: '1px solid var(--neon-blue)',
                position: 'sticky',
                bottom: 0
            }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>HOME</Link>
                <Link to="/shop" style={{ color: 'white', textDecoration: 'none' }}>SHOP</Link>
                <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>AGENT</Link>
            </footer>
        </div>
    );
}

export default App;
