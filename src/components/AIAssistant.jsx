import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistant = () => {
  const subscriptions = useStore((state) => state.subscriptions);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');

  const generateSummary = () => {
    setIsGenerating(true);
    setSummary('');

    // Computation
    const activeSubs = subscriptions.filter(s => s.status !== 'cancel');
    const totalSpend = activeSubs.reduce((acc, sub) => acc + sub.amount, 0);
    
    // Top Categories
    const counts = {};
    activeSubs.forEach(sub => counts[sub.category] = (counts[sub.category] || 0) + sub.amount);
    const sortedCategories = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    
    let categoryText = '';
    if (sortedCategories.length >= 2) {
      categoryText = `${sortedCategories[0][0]} and ${sortedCategories[1][0]}`;
    } else if (sortedCategories.length === 1) {
      categoryText = sortedCategories[0][0];
    } else {
      categoryText = 'varied categories';
    }

    // Optional Savings
    const optionalSubs = activeSubs.filter(s => s.tag === 'Optional');
    const optionalSavings = optionalSubs.reduce((acc, sub) => acc + sub.amount, 0);

    const generatedText = `You are currently spending ₹${totalSpend.toLocaleString('en-IN')}/month. Most of your heavy spending is concentrated heavily in ${categoryText}. Based on your habits, you have highly actionable opportunities—you can instantly save ₹${optionalSavings.toLocaleString('en-IN')} by safely canceling your optional subscriptions today.`;

    // Fake AI Delay
    setTimeout(() => {
      setIsGenerating(false);
      setSummary(generatedText);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bot size={24} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistant
          </h2>
        </div>
        
        {!summary && !isGenerating && (
          <button
            onClick={generateSummary}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors text-sm shadow-lg shadow-indigo-500/20"
          >
            <Sparkles size={16} />
            Generate Summary
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 bg-surfaceLight/20 rounded-xl"
          >
            <Loader2 className="animate-spin text-indigo-400" size={20} />
            <span className="text-sm font-medium text-textMuted animate-pulse">
              Analyzing spending patterns and optimizing...
            </span>
          </motion.div>
        )}

        {summary && !isGenerating && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl relative"
          >
            <div className="hidden sm:flex mt-1 h-8 w-8 min-w-[2rem] bg-indigo-500/20 rounded-full items-center justify-center border border-indigo-500/30">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm md:text-base text-text/90 leading-relaxed font-medium">
                {summary}
              </p>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={generateSummary}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline underline-offset-2"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!summary && !isGenerating && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center"
          >
            <Bot size={32} className="text-white/10 mb-3" />
            <p className="text-sm text-textMuted max-w-sm">
              Click the button above to generate a personalized algorithmic summary of your current spending state.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
