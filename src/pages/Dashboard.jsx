import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SpendBarChart, CategoryPieChart } from '../components/ChartCards';
import { InsightsPanel } from '../components/InsightsPanel';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { SpendingHealth } from '../components/SpendingHealth';
import { WastedSubscriptions } from '../components/WastedSubscriptions';
import { AIAssistant } from '../components/AIAssistant';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Activity, CreditCard } from 'lucide-react';

export const Dashboard = () => {
  const { subscriptions, transactions } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (transactions.length === 0) {
      navigate('/upload');
    }
  }, [transactions, navigate]);

  const activeSubs = subscriptions.filter(s => s.status !== 'cancel');
  
  const totalSpend = activeSubs.reduce((acc, sub) => acc + sub.amount, 0);

  // Prepare chart data
  const categoryData = useMemo(() => {
    const counts = {};
    activeSubs.forEach(sub => {
      counts[sub.category] = (counts[sub.category] || 0) + sub.amount;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activeSubs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-10"
    >
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text">Overview</h1>
          <p className="text-textMuted mt-1">Your subscription snapshot</p>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 border-t-[3px] border-t-primary"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Wallet className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-textMuted">Monthly Spend</p>
              <h3 className="text-2xl font-bold text-text">₹{totalSpend.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 border-t-[3px] border-t-accent"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Activity className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm text-textMuted">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-text">{activeSubs.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-6 border-t-[3px] border-t-purple-500"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <CreditCard className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-textMuted">Total Data Sources</p>
              <h3 className="text-2xl font-bold text-text">{transactions.length} records</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spending Risk Indicator Section */}
      <SpendingHealth />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SpendBarChart data={categoryData} />
            <CategoryPieChart data={categoryData} />
          </div>
          
          <AIAssistant />
        </div>
        
        <div className="lg:col-span-1">
          <InsightsPanel />
          <WastedSubscriptions />
        </div>
      </div>

      {/* Subscription List on Dashboard for immediate interactivity */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-6">Manage Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub, i) => (
            <SubscriptionCard key={sub.id} subscription={sub} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
