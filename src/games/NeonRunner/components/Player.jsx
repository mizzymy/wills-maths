import React from 'react';
import { motion } from 'framer-motion';

const Player = ({ lane }) => {
    // Lane positions in % (Left, Center, Right)
    // Assuming container is relative. 
    // Let's use fixed percentages: 16%, 50%, 84% approximate centers of 3 cols
    const positions = ['16%', '50%', '84%'];

    return (
        <motion.div
            animate={{ left: positions[lane] }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'absolute',
                bottom: '50px',
                width: '60px', // Bike width
                height: '100px', // Bike length
                x: '-50%', // Ceenter on the left coordinate
                zIndex: 10
            }}
        >
            {/* Bike Visuals */}
            <div style={{
                width: '100%', height: '100%',
                background: 'var(--neon-cyan)',
                clipPath: 'polygon(50% 0, 100% 80%, 80% 100%, 20% 100%, 0 80%)',
                boxShadow: '0 0 20px var(--neon-cyan)',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                    width: '10px', height: '40px', background: 'rgba(255,255,255,0.8)'
                }} />
                {/* Engine Glow */}
                <div style={{
                    position: 'absolute', bottom: '0', left: '20%', right: '20%',
                    height: '10px', background: 'var(--neon-pink)',
                    boxShadow: '0 0 10px var(--neon-pink)'
                }} />
            </div>

            {/* Trail Effect (Simple) */}
            <div style={{
                position: 'absolute', top: '100%', left: '30%', right: '30%',
                height: '50px',
                background: 'linear-gradient(to bottom, var(--neon-cyan), transparent)',
                opacity: 0.5
            }} />
        </motion.div>
    );
};

export default Player;
