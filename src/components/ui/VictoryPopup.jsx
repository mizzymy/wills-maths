import React from 'react';
import { motion } from 'framer-motion';
import CyberButton from './CyberButton';

const IMAGES = {
    will: '/assets/images/rewards/happy1.png',
    parents: '/assets/images/rewards/parents.png'
};

const VictoryPopup = ({ type = 'success', score, onContinue, onHome }) => {
    // type: 'success' (Will) | 'achievement' (Parents)

    const isAchievement = type === 'achievement';
    const mainImage = isAchievement ? IMAGES.parents : IMAGES.will;
    const title = isAchievement ? "PARENTS ARE PROUD!" : "I'M GREAT!";
    const subtitle = isAchievement ? "NEW MILESTONE REACHED" : "MISSION ACCOMPLISHED";
    const color = isAchievement ? 'var(--neon-yellow)' : 'var(--neon-cyan)';

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 300,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Burst Effect (Behind) */}
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: '600px', height: '600px',
                    background: `conic-gradient(from 0deg, transparent 0%, ${color} 10%, transparent 20%)`,
                    opacity: 0.3,
                    zIndex: -1
                }}
            />

            {/* Main Image */}
            <motion.img
                src={mainImage}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{
                    width: '250px',
                    height: 'auto',
                    borderRadius: '20px',
                    border: `4px solid ${color}`,
                    boxShadow: `0 0 50px ${color}`,
                    marginBottom: '20px',
                    background: '#000'
                }}
            />

            {/* Text */}
            <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    color: color,
                    fontSize: '3rem',
                    margin: 0,
                    textShadow: `0 0 20px ${color}`,
                    textAlign: 'center'
                }}
            >
                {title}
            </motion.h1>

            <h3 style={{ color: 'white', marginTop: '10px', letterSpacing: '2px' }}>
                {subtitle}
            </h3>

            <p className="neon-text-pink" style={{ fontSize: '1.5rem', margin: '20px 0' }}>
                REWARD: {score} BITS
            </p>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <CyberButton variant="primary" onClick={onContinue}>CONTINUE</CyberButton>
                <CyberButton variant="glitch" onClick={onHome}>BASE</CyberButton>
            </div>
        </div>
    );
};

export default VictoryPopup;
