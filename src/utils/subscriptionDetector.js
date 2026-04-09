const CATEGORY_MAP = {
  netflix: 'OTT',
  prime: 'OTT',
  youtube: 'OTT',
  hotstar: 'OTT',
  spotify: 'Music',
  apple: 'Music',
  adobe: 'Software',
  gym: 'Fitness',
  fitzone: 'Fitness',
  curefit: 'Fitness',
  electricity: 'Utilities',
  water: 'Utilities',
  swiggy: 'Food',
  zomato: 'Food',
  uber: 'Transport',
  ola: 'Transport'
};

const EXCLUDED_CATEGORIES = ['Transport', 'Food'];

export const detectSubscriptions = (transactions) => {
  const grouped = {};
  
  transactions.forEach(t => {
    // Normalize description: Remove numbers, special chars at end, extra spaces
    let normalizedDesc = t.description.replace(/[0-9]+/g, '').replace(/[\-#]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    if (normalizedDesc.endsWith('.COM')) normalizedDesc = normalizedDesc.replace('.COM', '');
    
    // Attempt to map category based on keyword
    let detectedCategory = t.category !== 'Unknown' ? t.category : 'Other';
    const lowerDesc = normalizedDesc.toLowerCase();
    for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
      if (lowerDesc.includes(key)) {
        detectedCategory = cat;
        break;
      }
    }
    
    if (!grouped[normalizedDesc]) {
      grouped[normalizedDesc] = {
        id: crypto.randomUUID(),
        name: normalizedDesc,
        amounts: [],
        dates: [],
        category: detectedCategory
      };
    }
    grouped[normalizedDesc].amounts.push(Math.abs(t.amount));
    grouped[normalizedDesc].dates.push(new Date(t.date));
  });

  const subscriptions = [];

  for (const key in grouped) {
    const group = grouped[key];
    
    // Exclude basic non-subscription categories immediately
    if (EXCLUDED_CATEGORIES.includes(group.category)) continue;
    
    // Condition 1: Occurs at least 2 times
    if (group.dates.length >= 2) {
      
      // Condition 2: Similar amount (variance check)
      const maxAmount = Math.max(...group.amounts);
      const minAmount = Math.min(...group.amounts);
      // If the difference is huge (e.g. > 30% of max amount), it might not be a fixed subscription
      // although utility bills vary, so we are a bit lenient
      if (maxAmount > 0 && ((maxAmount - minAmount) / maxAmount) > 0.5) {
        continue; // Too much variance in amount, likely not a fixed sub
      }

      // Find latest date and latest amount
      group.dates.sort((a, b) => b - a); // descending
      
      const lastChargedDate = group.dates[0].toISOString().split('T')[0];
      const recentAmount = group.amounts[group.amounts.length - 1] || group.amounts[0];
      
      subscriptions.push({
        id: group.id,
        name: group.name,
        amount: recentAmount, 
        billingCycle: 'Monthly',
        lastCharged: lastChargedDate,
        category: group.category !== 'Other' ? group.category : 'Uncategorized',
        tag: determineTag(group.category)
      });
    }
  }

  // Sort by highest amount first
  return subscriptions.sort((a, b) => b.amount - a.amount);
};

// Helper to auto-tag a subscription
const determineTag = (category) => {
  const essential = ['Utilities', 'Education', 'Transport', 'Medical'];
  const optional = ['OTT', 'Software', 'Shopping', 'Entertainment', 'Fitness', 'Music'];

  if (essential.includes(category)) return 'Essential';
  if (optional.includes(category)) return 'Optional';
  return 'Unknown';
};
