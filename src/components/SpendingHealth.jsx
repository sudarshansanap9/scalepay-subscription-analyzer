import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export const SpendingHealth = () => {
  const subscriptions = useStore((state) => state.subscriptions);
  const activeSubs = subscriptions.filter(s => s.status !== 'cancel');
  const spend = activeSubs.reduce((acc, sub) => acc + sub.amount, 0);

  let state = {
    color: 'bg-accent',
    textColor: 'text-accent',
    border: 'border-accent/20',
    bgLight: 'bg-accent/10',
    icon: <ShieldCheck size={28} className="text-accent" />,
    message: '✅ Your subscription spending is perfectly healthy.'
  };

  if (spend >= 5000) {
    state = {
      color: 'bg-danger',
      textColor: 'text-danger',
      border: 'border-danger/20',
      bgLight: 'bg-danger/10',
      icon: <ShieldAlert size={28} className="text-danger" />,
      message: '⚠️ You are overspending on subscriptions. Cancel some above to improve health!'
    };
  } else if (spend >= 2000) {
    state = {
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      border: 'border-amber-500/20',
      bgLight: 'bg-amber-500/10',
      icon: <Activity size={28} className="text-amber-500" />,
      message: '⚡ Your subscription stack is getting heavy. Consider some optimizations.'
    };
  }

  // Calculate width for progress bar (cap visually at 100% equating to ₹8,000 max scaling)
  const maxScale = 8000;
  let progressPct = (spend / maxScale) * 100;
  if (progressPct > 100) progressPct = 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 border ${state.border} ${state.bgLight} mb-8 transition-colors duration-500`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface/60 rounded-2xl shadow-inner">
            {state.icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-text mb-1">Spending Health</h2>
            <p className="text-sm text-textMuted font-medium">{state.message}</p>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex justify-between text-xs font-semibold px-1">
            <span className="text-accent">Safe</span>
            <span className="text-amber-500">Warning</span>
            <span className="text-danger">Danger</span>
          </div>
          
          <div className="relative w-full h-3 bg-surfaceLight/50 rounded-full overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 h-full w-full opacity-30 flex">
              <div className="h-full w-[25%] bg-accent"></div>
              <div className="h-full w-[37.5%] bg-amber-500"></div>
              <div className="h-full w-[37.5%] bg-danger"></div>
            </div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 60 }}
              className={`h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ${state.color}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
