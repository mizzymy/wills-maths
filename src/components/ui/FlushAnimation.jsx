import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Assets
const TOILET_IMG = '/assets/images/rewards/toilet.png';
const SCOOBER_IMG = '/assets/images/rewards/bad_scoober.png';

const FlushAnimation = ({ onComplete }) => {
    const [isFlushing, setIsFlushing] = useState(false);

    useEffect(() => {
        // Auto-start flush after 1 second delay
        const timer = setTimeout(() => setIsFlushing(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '300px',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* The Toilet (Background) */}
            <img
                src={TOILET_IMG}
                alt="Toilet"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: 'auto',
                    zIndex: 10,
                    bottom: 0
                }}
            />

            {/* Will / Scoober (The Victim) */}
            <motion.img
                src={SCOOBER_IMG}
                alt="Scoober Will"
                initial={{ y: -50, scale: 1, rotateY: 0, opacity: 1 }}
                animate={isFlushing ? {
                    y: 100,         // Move deeper down
                    scale: 0,       // Shrink to nothing
                    rotateY: 1080,  // Spin horizontally (around Y axis)
                    opacity: 0      // Fade out at end
                } : {}}
                transition={{
                    duration: 2,    // Slower flush for effect
                    ease: "anticipate" // Pulls back then shoots down
                }}
                onAnimationComplete={() => {
                    if (onComplete) onComplete();
                }}
                style={{
                    position: 'absolute',
                    width: '120px',
                    height: 'auto',
                    zIndex: 5, // Behind the front rim of toilet if we had depth, but z-index trickery needed
                    // Actually, to look like he goes "in", he should probably overlap initially then go behind?
                    // Simplified: He just shrinks to the center.
                    top: '20%'
                }}
            />

            {/* Water Overlay (Optional blue tint to sell it) */}
            {isFlushing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.5 }}
                    style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, cyan, transparent)',
                        top: '50%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                />
            )}
        </div>
    );
};

export default FlushAnimation;
