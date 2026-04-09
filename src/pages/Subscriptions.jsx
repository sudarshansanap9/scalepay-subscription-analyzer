import { useStore } from '../store/useStore';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { motion } from 'framer-motion';

export const Subscriptions = () => {
  const subscriptions = useStore((state) => state.subscriptions);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-10"
    >
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text">All Subscriptions</h1>
          <p className="text-textMuted mt-1">Manage and optimize your recurring payments</p>
        </div>
        <div className="hidden md:block bg-surfaceLight/30 px-4 py-2 rounded-lg border border-white/5">
          <span className="text-sm text-textMuted">Found: <strong className="text-text">{subscriptions.length}</strong></span>
        </div>
      </header>

      {subscriptions.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-surfaceLight/50 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-text mb-2">No Subscriptions Found</h3>
          <p className="text-textMuted max-w-md mx-auto">Upload a bank statement to detect your subscriptions automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub, i) => (
            <SubscriptionCard key={sub.id} subscription={sub} delay={i * 0.05} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
