import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Node from './Node';

const HexGrid = ({ nodes, selectedNodes, onNodeClick }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '1rem'
        }}>
            <AnimatePresence>
                {nodes.map(node => (
                    <Node
                        key={node.id}
                        node={node}
                        isSelected={selectedNodes.some(n => n.id === node.id)}
                        onClick={onNodeClick}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HexGrid;
