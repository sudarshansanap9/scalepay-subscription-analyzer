import { useStore } from '../store/useStore';
import { Lightbulb, Info, AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const InsightsPanel = () => {
  const subscriptions = useStore((state) => state.subscriptions);

  // Compute insights
  const totalSpend = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  const activeSubs = subscriptions.filter(s => s.status !== 'cancel');
  const canceledSubs = subscriptions.filter(s => s.status === 'cancel');
  
  const potentialSavings = canceledSubs.reduce((acc, sub) => acc + sub.amount, 0);
  const currentMonthlySpend = totalSpend - potentialSavings;
  
  const unusedEstimate = activeSubs.filter(s => ['Unknown', 'Optional'].includes(s.tag));
  const highCostSubs = subscriptions.filter(s => s.amount >= 1000);

  const insights = [
    {
      id: 1,
      icon: <Info size={18} className="text-primary" />,
      text: `You have ${subscriptions.length} detected subscriptions.`,
      color: 'bg-primary/10 border-primary/20'
    },
    {
      id: 2,
      icon: <AlertTriangle size={18} className="text-accent" />,
      text: `We found ${unusedEstimate.length} potentially unused or optional subscriptions.`,
      color: 'bg-accent/10 border-accent/20'
    },
    {
      id: 3,
      icon: <TrendingDown size={18} className="text-danger" />,
      text: highCostSubs.length > 0 
        ? `Note: ${highCostSubs.length} subscriptions cost more than ₹1,000 each.` 
        : `Great job keeping subscriptions affordable!`,
      color: 'bg-danger/10 border-danger/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Lightbulb size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">
          Smart Insights
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`flex items-start gap-4 p-4 rounded-xl border ${insight.color} backdrop-blur-sm`}
          >
            <div className="mt-0.5">{insight.icon}</div>
            <p className="text-sm font-medium text-text/90 leading-relaxed">
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-textMuted flex items-center gap-2">Total Monthly Spend</p>
          <p className="text-lg font-bold text-text">₹{totalSpend.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-textMuted flex items-center gap-2">Potential Savings</p>
          <p className="text-lg font-bold text-accent">+₹{potentialSavings.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <p className="text-sm font-semibold text-text">Net Spend After Cancellation</p>
          <p className="text-2xl font-bold text-primary">₹{currentMonthlySpend.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </motion.div>
  );
};
