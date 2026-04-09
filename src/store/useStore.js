import { create } from 'zustand';
import { detectSubscriptions } from '../utils/subscriptionDetector';

export const useStore = create((set, get) => ({
  isLoading: false,
  transactions: [],
  subscriptions: [],
  
  setLoading: (loading) => set({ isLoading: loading }),

  loadDemoData: (demoTransactions) => {
    set({ isLoading: true });
    // Simulate network delay
    setTimeout(() => {
      const detected = detectSubscriptions(demoTransactions);
      set({
        transactions: demoTransactions,
        subscriptions: detected.map(sub => ({ ...sub, status: 'keep' })), // 'keep' or 'cancel'
        isLoading: false
      });
    }, 800);
  },

  processCSV: (parsedData) => {
    set({ isLoading: true });
    setTimeout(() => {
      // Map parsed fields to standard format: { date, description, amount }
      // Assume parsedData is mapped by frontend
      const detected = detectSubscriptions(parsedData);
      set({
        transactions: parsedData,
        subscriptions: detected.map(sub => ({ ...sub, status: 'keep' })),
        isLoading: false
      });
    }, 800);
  },

  toggleSubscriptionStatus: (id) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === 'keep' ? 'cancel' : 'keep' }
          : sub
      ),
    }));
  },

}));
