import React from 'react';

const Obstacle = ({ data }) => {
    // 3D Projection Simulation
    // data.z: -100 (Horizon) -> 100 (Player/Camera)

    const z = data.z;
    if (z < -120 || z > 150) return null;

    // Progress 0.0 to 1.0
    const progress = (z + 100) / 200;

    // Scale: 0.1 to 1.0
    const scale = 0.1 + Math.pow(progress, 3) * 1.5;

    // Vertical Position: 40% (Horizon) -> 100% (Bottom)
    const top = 40 + (progress * 60);

    // Lane Spread Logic (Mobile / Desktop Responsive)
    // We use 'vw' units so it scales with screen width.
    // Lane -1 = -28vw, Lane 0 = 0, Lane 1 = +28vw
    // We multiply by 'scale' so lanes converge at the horizon.
    const laneIndex = data.lane - 1;
    const xBase = 28; // vw
    const xOffset = laneIndex * xBase * scale; // vw value

    const opacity = z < -80 ? (z + 100) / 20 : 1;
    const isCorrect = data.type === 'correct';

    return (
        <div
            style={{
                position: 'absolute',
                top: `${top}%`,
                left: `calc(50% + ${xOffset}vw)`, // Responsive Horizontal Position
                transform: `translate(-50%, -100%) scale(${scale})`,
                opacity: opacity,
                zIndex: Math.floor(z + 100),
                pointerEvents: 'none'
            }}
        >
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                {/* Gate Visual */}
                <div style={{
                    width: '26vw', height: '18vw', // Responsive size (was 120px/80px)
                    border: `4px solid ${isCorrect ? 'var(--neon-cyan)' : 'var(--neon-pink)'}`,
                    background: isCorrect ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 0, 100, 0.15)',
                    color: 'white',
                    fontSize: '2rem', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${isCorrect ? 'var(--neon-cyan)' : 'var(--neon-pink)'}`,
                    textShadow: '0 0 5px black',
                    borderRadius: '8px'
                }}>
                    {data.value}
                </div>

                {/* Legs */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 10px' }}>
                    <div style={{ width: '6px', height: '200px', background: isCorrect ? 'var(--neon-cyan)' : 'var(--neon-pink)', opacity: 0.8 }} />
                    <div style={{ width: '6px', height: '200px', background: isCorrect ? 'var(--neon-cyan)' : 'var(--neon-pink)', opacity: 0.8 }} />
                </div>
            </div>
        </div>
    );
};

export default Obstacle;
