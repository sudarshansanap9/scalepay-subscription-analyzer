export const CATEGORIES = ['OTT', 'Software', 'Utilities', 'Food', 'Shopping', 'Fitness'];

export const generateDemoTransactions = () => {
  const transactions = [];
  const today = new Date();
  
  // Helper to generate dates over the last X months
  const addTransaction = (desc, amount, category, dayOfMonth) => {
    for (let i = 0; i < 4; i++) { // Last 4 months
      const date = new Date(today.getFullYear(), today.getMonth() - i, dayOfMonth);
      transactions.push({
        id: crypto.randomUUID(),
        date: date.toISOString().split('T')[0],
        description: desc,
        amount: amount,
        category: category
      });
    }
  };

  // Add recurring (subscriptions)
  addTransaction('Netflix Premium', 649, 'OTT', 15);
  addTransaction('Spotify Premium', 119, 'OTT', 3);
  addTransaction('Adobe Creative Cloud', 4230, 'Software', 10);
  addTransaction('Gym Membership', 2500, 'Fitness', 1);
  addTransaction('Amazon Prime', 1499, 'Shopping', 22);
  addTransaction('ChatGPT Plus', 1950, 'Software', 5);
  addTransaction('Swiggy One', 299, 'Food', 12);
  addTransaction('Electricity Bill', 1250, 'Utilities', 8);

  // Add some random non-recurring
  transactions.push({ id: crypto.randomUUID(), date: '2026-04-05', description: 'Uber Trip', amount: 340, category: 'Transport' });
  transactions.push({ id: crypto.randomUUID(), date: '2026-04-02', description: 'Grocery Store', amount: 1540, category: 'Shopping' });
  transactions.push({ id: crypto.randomUUID(), date: '2026-03-20', description: 'Movie Tickets', amount: 840, category: 'Entertainment' });

  // Shuffle for realism
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};
