import React from 'react';

const CyberButton = ({
    children,
    onClick,
    variant = 'primary', // primary, danger, glitch
    disabled = false,
    soundType = 'heavy', // heavy, light
    className = ''
}) => {

    const playSound = (type) => {
        // We will hook this up to a real audio manager later.
        // For now, it tries to play the placeholder files.
        const audioPath = type === 'hover'
            ? '/assets/audio/sfx/ui/sfx_ui_hover_master.mp3'
            : '/assets/audio/sfx/ui/sfx_ui_confirm_heavy.mp3';

        // Create audio object on the fly for now (quick implementation)
        // Ideally we preload these
        const audio = new Audio(audioPath);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed (interaction needed first)', e));
    };

    const handleMouseEnter = () => {
        if (disabled) return;
        playSound('hover');
    };

    const handleClick = (e) => {
        if (disabled) return;

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20); // Short tick
        }

        playSound('click');
        if (onClick) onClick(e);
    };

    // Styles
    const baseStyle = {
        position: 'relative',
        padding: '12px 24px',
        border: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'all 0.1s ease',
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        background: variant === 'danger' ? 'var(--neon-pink)' : 'var(--neon-cyan)',
        color: 'var(--bg-dark)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: disabled ? 'none' : `4px 4px 0px rgba(0,0,0,0.5)`,
        fontSize: '1rem',
        ...className
    };

    return (
        <button
            style={baseStyle}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            className={`cyber-btn ${variant}`}
        >
            {/* Decorative lines */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                boxShadow: `inset 0 0 10px ${variant === 'danger' ? '#500' : '#055'}`,
                pointerEvents: 'none'
            }} />

            {children}
        </button>
    );
};

export default CyberButton;
