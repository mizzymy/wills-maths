import React from 'react';

const Track = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '0',
            left: '-50%', // Make it wider than screen
            width: '200%',
            height: '100%',
            transform: 'perspective(300px) rotateX(40deg)',
            zIndex: 0,
            background: 'linear-gradient(#000 0%, var(--bg-dark) 100%)',
            overflow: 'hidden'
        }}>
            {/* Grid Lines Vertical */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                backgroundSize: '33.33% 100%',
                backgroundImage: 'linear-gradient(90deg, transparent 48%, var(--neon-blue) 50%, transparent 52%)',
                opacity: 0.3
            }} />

            {/* Grid Lines Horizontal (Moving) */}
            <div className="grid-move" style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                backgroundSize: '100% 100px',
                backgroundImage: 'linear-gradient(0deg, transparent 48%, var(--neon-pink) 50%, transparent 52%)',
                opacity: 0.2,
                animation: 'gridScroll 1s linear infinite'
            }} />

            <style>{`
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to { background-position: 0 100px; }
        }
      `}</style>
        </div>
    );
};

export default Track;
