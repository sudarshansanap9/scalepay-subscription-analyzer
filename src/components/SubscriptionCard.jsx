import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Calendar, Tag, IndianRupee } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SubscriptionCard = ({ subscription, delay = 0 }) => {
  const toggleStatus = useStore((state) => state.toggleSubscriptionStatus);
  const isCanceled = subscription.status === 'cancel';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className={`relative overflow-hidden glass-card p-5 group transition-all duration-300 ${
        isCanceled 
          ? 'opacity-60 grayscale-[0.2] border-danger/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-danger/5' 
          : 'hover:border-primary/30 hover:shadow-primary/5 border-white/5 bg-surface/40'
      }`}
    >
      {/* Accent Line */}
      <div className={`absolute top-0 left-0 w-1 h-full ${isCanceled ? 'bg-danger' : 'bg-primary'}`} />

      <div className="flex justify-between items-start mb-4 pl-2">
        <div>
          <h3 className={`text-lg font-semibold truncate max-w-[180px] md:max-w-xs ${isCanceled ? 'text-textMuted line-through' : 'text-text'}`} title={subscription.name}>
            {subscription.name}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-surfaceLight/50 text-textMuted mt-2">
            <Tag size={12} />
            {subscription.tag}
          </span>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold flex items-center justify-end ${isCanceled ? 'text-textMuted' : 'text-text'}`}>
            <IndianRupee size={18} strokeWidth={2.5} className="mr-0.5" />
            {subscription.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-textMuted mt-1">/ {subscription.billingCycle}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4 pl-2">
        <div className="flex items-center gap-2 text-xs text-textMuted">
          <Calendar size={14} className={isCanceled ? "text-danger/70" : "text-primary/70"} />
          <span>Last billed: {new Date(subscription.lastCharged).toLocaleDateString()}</span>
        </div>
        
        <button
          onClick={() => toggleStatus(subscription.id)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
            isCanceled 
              ? 'text-danger bg-danger/10 hover:bg-danger/20 border border-danger/20' 
              : 'text-text bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          {isCanceled ? <ToggleLeft size={20} className="text-danger" /> : <ToggleRight size={20} className="text-primary" />}
          {isCanceled ? 'Cancel' : 'Keep'}
        </button>
      </div>
    </motion.div>
  );
};
