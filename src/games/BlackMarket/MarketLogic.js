// Logic for Black Market

export const MARKET_ITEMS = [
    { id: 'chip_v1', name: 'Neural Chip v1', basePrice: 50, volatility: 0.1 },
    { id: 'coolant', name: 'Cryo Coolant', basePrice: 120, volatility: 0.15 },
    { id: 'ai_core', name: 'Rogue AI Core', basePrice: 500, volatility: 0.25 },
    { id: 'data_cube', name: 'Encrypted Cube', basePrice: 900, volatility: 0.3 }
];

export const generateInitialMarket = () => {
    return MARKET_ITEMS.map(item => ({
        ...item,
        currentPrice: item.basePrice,
        history: [item.basePrice],
        trend: 'stable' // up, down, stable
    }));
};

export const updateMarketPrices = (currentItems) => {
    return currentItems.map(item => {
        // Random Walk Price Change
        const changePercent = (Math.random() - 0.5) * 2 * item.volatility; // +/- volatility
        let newPrice = Math.floor(item.currentPrice * (1 + changePercent));

        // Clamp limits
        const minPrice = Math.floor(item.basePrice * 0.2);
        const maxPrice = Math.floor(item.basePrice * 3.0);
        newPrice = Math.max(minPrice, Math.min(newPrice, maxPrice));

        const trend = newPrice > item.currentPrice ? 'up' : newPrice < item.currentPrice ? 'down' : 'stable';

        return {
            ...item,
            currentPrice: newPrice,
            trend,
            // Keep last 10 points for graph
            history: [...item.history.slice(-9), newPrice]
        };
    });
};

export const calculateProfit = (buyPrice, currentPrice, quantity) => {
    return (currentPrice - buyPrice) * quantity;
};
