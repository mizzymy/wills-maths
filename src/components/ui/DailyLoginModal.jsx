import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from './CyberButton';
import { useGame } from '../../context/GameContext';

const DailyLoginModal = ({ onClose }) => {
    const { claimDailyReward } = useGame();
    const [step, setStep] = useState('closed'); // closed, opening, open
    const [reward, setReward] = useState(0);

    const handleOpen = () => {
        setStep('opening');
        setTimeout(() => {
            const amount = claimDailyReward();
            setReward(amount);
            setStep('open');
            // Play sound here if we had one accessible
        }, 1000);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <h1 className="neon-text-yellow" style={{ marginBottom: '2rem' }}>DAILY SUPPLY DROP</h1>

            <AnimatePresence mode='wait'>
                {step === 'closed' && (
                    <motion.div
                        key="crate"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleOpen}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Placeholder Crate Visual */}
                        <div style={{
                            width: '200px', height: '200px',
                            background: 'repeating-linear-gradient(45deg, #333, #333 10px, #444 10px, #444 20px)',
                            border: '4px solid var(--neon-yellow)',
                            boxShadow: '0 0 30px var(--neon-yellow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem'
                        }}>
                            📦
                        </div>
                        <p className="neon-text-cyan" style={{ marginTop: '20px', textAlign: 'center' }}>TAP TO OPEN</p>
                    </motion.div>
                )}

                {step === 'opening' && (
                    <motion.div
                        key="opening"
                        animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        style={{ fontSize: '5rem' }}
                    >
                        ⚡
                    </motion.div>
                )}

                {step === 'open' && (
                    <motion.div
                        key="reward"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{
                            fontSize: '4rem',
                            color: 'var(--neon-yellow)',
                            textShadow: '0 0 20px var(--neon-yellow)'
                        }}>
                            +{reward}
                        </div>
                        <h2 style={{ color: 'white' }}>BITS RECEIVED</h2>
                        <br />
                        <CyberButton variant="primary" onClick={onClose}>ACCEPT</CyberButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailyLoginModal;
