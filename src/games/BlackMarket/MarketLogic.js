// Logic for Cyber Merchant (E-Shop Redesign)

const MARKET_ITEMS = [
    // Snacks & Food
    { name: 'Chocolate Bar', base: 2 },
    { name: 'Bag of Chips', base: 3 },
    { name: 'Ice Cream', base: 4 },
    { name: 'Pizza Slice', base: 5 },
    { name: 'Burger', base: 8 },
    { name: 'Donut', base: 3 },
    { name: 'Soda Can', base: 2 },
    { name: 'Popcorn', base: 5 },
    { name: 'Juice Box', base: 1 },
    { name: 'Cookie Box', base: 4 },

    // Toys & Fun
    { name: 'Action Figure', base: 15 },
    { name: 'Plushie', base: 12 },
    { name: 'Board Game', base: 25 },
    { name: 'Puzzle', base: 10 },
    { name: 'Water Gun', base: 18 },
    { name: 'Slime Pot', base: 6 },
    { name: 'Fidget Spinner', base: 8 },
    { name: 'Kite', base: 12 },
    { name: 'Card Pack', base: 5 },
    { name: 'Lego Set', base: 45 },

    // Electronics & Gaming
    { name: 'Video Game', base: 50 },
    { name: 'Headphones', base: 40 },
    { name: 'Controller', base: 60 },
    { name: 'Smart Watch', base: 85 },
    { name: 'Tablet', base: 250 },
    { name: 'Drone', base: 120 },
    { name: 'Phone Case', base: 15 },
    { name: 'Earbuds', base: 30 },
    { name: 'Gaming Mouse', base: 35 },
    { name: 'TV', base: 450 },

    // Clothes & Gear
    { name: 'Sneakers', base: 70 },
    { name: 'Hoodie', base: 35 },
    { name: 'Cap', base: 15 },
    { name: 'Backpack', base: 25 },
    { name: 'Sunglasses', base: 12 },
    { name: 'T-Shirt', base: 18 },
    { name: 'Socks', base: 8 },

    // Hobbies
    { name: 'Comic Book', base: 8 },
    { name: 'Sketchbook', base: 6 },
    { name: 'Marker Set', base: 12 },
    { name: 'Bike', base: 150 },
    { name: 'Skateboard', base: 55 }
];

export const generateTransaction = (difficulty) => {
    // difficulty: 1 (Rookie), 2 (Agent), 3 (Veteran), 4 (Elite)
    let type = 'change';
    let question = '';
    let answer = 0;

    // Helper to get random item
    const getRandomItem = () => MARKET_ITEMS[Math.floor(Math.random() * MARKET_ITEMS.length)];

    // ROOKIE: Sums 0-20 (Basic Change)
    if (difficulty === 1) {
        const item = getRandomItem();
        // Cost is 1-19
        const cost = Math.floor(Math.random() * 19) + 1;

        // Pay is next logical bill/coin up to 20
        let pay = 0;
        if (cost < 5) pay = 5;
        else if (cost < 10) pay = 10;
        else if (cost < 15) pay = 15; // A 10 and a 5
        else pay = 20;

        question = `Customer Buying: ${item.name}\nCost: ₿${cost}\nPaid: ₿${pay}\n\nCALCULATE CHANGE:`;
        answer = pay - cost;
        return { id: Math.random().toString(), item, question, answer, difficulty };
    }

    // AGENT: Sums 0-50 (Intermediate Change)
    else if (difficulty === 2) {
        const item = getRandomItem();
        // Cost is 20-49
        const cost = Math.floor(Math.random() * 29) + 20;

        // Pay is next 10
        const pay = Math.ceil((cost + 1) / 10) * 10;

        question = `Customer Buying: ${item.name}\nCost: ₿${cost}\nPaid: ₿${pay}\n\nCALCULATE CHANGE:`;
        answer = pay - cost;
        return { id: Math.random().toString(), item, question, answer, difficulty };
    }

    // VETERAN: Add 2 Items + Change (Sums 50-100)
    else if (difficulty === 3) {
        const item1 = getRandomItem();
        const item2 = getRandomItem();

        const cost1 = Math.floor(Math.random() * 30) + 10;
        const cost2 = Math.floor(Math.random() * 30) + 10;
        const total = cost1 + cost2;

        const pay = Math.ceil((total + Math.random() * 20) / 10) * 10;

        question = `Purchase:\n1. ${item1.name} (₿${cost1})\n2. ${item2.name} (₿${cost2})\n\nTotal Paid: ₿${pay}\n\nCALCULATE CHANGE:`;
        answer = pay - total;
        return { id: Math.random().toString(), item: item1, question, answer, difficulty };
    }

    // ELITE: Add 3 Items + Change (Sums 100+)
    else {
        const item1 = getRandomItem();
        const item2 = getRandomItem();
        const item3 = getRandomItem();

        const cost1 = Math.floor(Math.random() * 40) + 10;
        const cost2 = Math.floor(Math.random() * 40) + 10;
        const cost3 = Math.floor(Math.random() * 40) + 10;
        const total = cost1 + cost2 + cost3;

        const pay = Math.ceil((total + Math.random() * 50) / 50) * 50; // Pays with 50s/100s

        question = `Purchase:\n1. ${item1.name} (₿${cost1})\n2. ${item2.name} (₿${cost2})\n3. ${item3.name} (₿${cost3})\n\nTotal Paid: ₿${pay}\n\nCALCULATE CHANGE:`;
        answer = pay - total;
        return { id: Math.random().toString(), item: item1, question, answer, difficulty };
    }
};
