import React from 'react';
import CyberButton from '../../../components/ui/CyberButton';

const Keypad = ({ onInput, onClear, onSubmit }) => {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, 'ENTER'];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '300px',
            margin: '0 auto'
        }}>
            {keys.map(k => (
                <CyberButton
                    key={k}
                    variant={k === 'ENTER' ? 'primary' : k === 'CLR' ? 'danger' : 'glitch'}
                    onClick={() => {
                        if (k === 'CLR') onClear();
                        else if (k === 'ENTER') onSubmit();
                        else onInput(k);
                    }}
                    style={{
                        height: '60px',
                        fontSize: '1.2rem',
                        clipPath: 'none', // Square buttons for keypad feel
                        borderRadius: '4px'
                    }}
                >
                    {k}
                </CyberButton>
            ))}
        </div>
    );
};

export default Keypad;
