import React from 'react';
import CyberButton from '../../../components/ui/CyberButton';

const MarketItem = ({ item, inventoryCount, cash, onBuy, onSell }) => {
    // item: { id, name, currentPrice, trend, history }

    const canBuy = cash >= item.currentPrice;
    const canSell = inventoryCount > 0;

    // Simple Sparkline using SVG
    const renderSparkline = () => {
        const points = item.history;
        if (points.length < 2) return null;

        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = max - min || 1;
        const width = 100;
        const height = 30;

        // Map points to SVG coordinates
        const polyline = points.map((p, i) => {
            const x = (i / (points.length - 1)) * width;
            const y = height - ((p - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width="100%" height="40" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                <polyline
                    points={polyline}
                    fill="none"
                    stroke={item.trend === 'up' ? 'var(--neon-cyan)' : item.trend === 'down' ? 'var(--neon-pink)' : '#aaa'}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    return (
        <div style={{
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${item.trend === 'up' ? 'var(--neon-cyan)' : '#333'}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '0.8rem',
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '1rem',
            alignItems: 'center'
        }}>
            {/* Info */}
            <div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    Trend: <span style={{ color: item.trend === 'up' ? 'var(--neon-cyan)' : 'var(--neon-pink)' }}>
                        {item.trend === 'up' ? '▲ RISING' : item.trend === 'down' ? '▼ CRASHING' : 'FLAT'}
                    </span>
                </div>
                <div style={{ marginTop: '5px' }}>
                    {renderSparkline()}
                </div>
            </div>

            {/* Price & Stock */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--neon-yellow)' }}>
                    ₿ {item.currentPrice}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>OWNED: {inventoryCount}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <CyberButton
                    variant="primary"
                    disabled={!canBuy}
                    onClick={() => onBuy(item)}
                    style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                >
                    BUY
                </CyberButton>
                <CyberButton
                    variant="danger"
                    disabled={!canSell}
                    onClick={() => onSell(item)}
                    style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                >
                    SELL
                </CyberButton>
            </div>
        </div>
    );
};

export default MarketItem;
