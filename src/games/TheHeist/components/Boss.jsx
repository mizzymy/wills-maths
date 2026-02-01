import React from 'react';
import { motion } from 'framer-motion';

const Boss = ({ bossData, hp, maxHp, isHit }) => {
    // bossData: { name: 'Firewall Daemon', phases: 1 ... }

    const hpPercent = (hp / maxHp) * 100;

    return (
        <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Health Bar */}
            <div style={{
                width: '100%',
                height: '20px',
                border: '2px solid var(--neon-pink)',
                marginBottom: '20px',
                position: 'relative'
            }}>
                <div style={{
                    width: `${hpPercent}%`,
                    height: '100%',
                    background: 'var(--neon-pink)',
                    transition: 'width 0.2s ease-out'
                }} />
                <div style={{
                    position: 'absolute', top: '-25px', left: 0,
                    color: 'var(--neon-pink)', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                    {bossData.name} [Lv.{bossData.phases}]
                </div>
            </div>

            {/* Boss Visual (CSS Geometry) */}
            <motion.div
                animate={isHit ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(2)', 'brightness(1)'] } : {}}
                transition={{ duration: 0.4 }}
                style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, #330000 0%, #000 100%)',
                    border: '4px solid var(--neon-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(45deg)',
                    boxShadow: '0 0 50px var(--neon-pink)'
                }}
            >
                <div style={{
                    width: '100px', height: '100px', background: '#500',
                    transform: 'rotate(-45deg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ fontSize: '4rem' }}>👁️</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Boss;
