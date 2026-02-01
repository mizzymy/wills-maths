import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Node = ({ node, isSelected, onClick }) => {
    return (
        <motion.button
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                backgroundColor: isSelected ? 'var(--neon-pink)' : 'rgba(0, 20, 40, 0.8)',
                borderColor: isSelected ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                boxShadow: isSelected ? '0 0 15px var(--neon-pink)' : '0 0 5px var(--neon-cyan)'
            }}
            exit={{ scale: 1.5, opacity: 0 }} // Shatter effect
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClick(node)}
            style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                border: '2px solid',
                color: 'white',
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', // Scales with valid range
                fontWeight: 'bold',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(5px)',
                zIndex: 10
            }}
        >
            <span style={{ position: 'relative', zIndex: 2 }}>{node.value}</span>

            {/* Glitch Overlay */}
            {isSelected && (
                <motion.div
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'var(--neon-pink)',
                        opacity: 0.2,
                        zIndex: 1
                    }}
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                />
            )}
        </motion.button>
    );
};

export default Node;
