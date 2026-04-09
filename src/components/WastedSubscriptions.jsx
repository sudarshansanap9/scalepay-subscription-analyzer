import { useStore } from '../store/useStore';
import { Trash2, AlertCircle, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export const WastedSubscriptions = () => {
  const subscriptions = useStore((state) => state.subscriptions);
  const toggleStatus = useStore((state) => state.toggleSubscriptionStatus);

  // Consider only active subscriptions
  const activeSubs = subscriptions.filter(s => s.status !== 'cancel');

  // Identify candidates: Costly (>1000) or Optional
  const candidates = activeSubs.filter(s => s.amount >= 1000 || s.tag === 'Optional');

  // Sort by amount descending to get the "worst" offenders first
  const topWasted = candidates.sort((a, b) => b.amount - a.amount).slice(0, 3);

  if (topWasted.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mt-8 border-t-4 border-t-amber-500/80"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Trash2 size={20} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text">Top Optimization Targets</h2>
          <p className="text-xs text-textMuted">Subscriptions draining your wallet</p>
        </div>
      </div>

      <div className="space-y-4">
        {topWasted.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="p-4 rounded-xl border border-white/5 bg-surface/50 hover:bg-surface/80 transition-colors group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-semibold text-text truncate max-w-[150px]">{sub.name}</h4>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider mt-1 text-danger/80">
                  <AlertCircle size={10} />
                  {sub.amount >= 1000 && sub.tag === 'Optional' ? 'High Cost • Optional' : sub.amount >= 1000 ? 'High Cost' : 'Optional Expense'}
                </div>
              </div>
              <p className="text-sm font-bold text-text flex items-center">
                <IndianRupee size={12} strokeWidth={2.5} />
                {sub.amount.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-amber-500/90 font-medium">Cancel this to save ₹{sub.amount.toLocaleString('en-IN')}/mo</p>
              <button
                onClick={() => toggleStatus(sub.id)}
                className="text-[10px] px-2 py-1 bg-white/5 hover:bg-danger/20 hover:text-danger text-textMuted rounded transition-colors"
              >
                Quick Cancel
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
