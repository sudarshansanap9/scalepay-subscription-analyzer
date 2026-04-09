import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/subscriptions', label: 'Subscriptions', icon: Receipt },
    { to: '/upload', label: 'Upload Data', icon: UploadCloud },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 h-full glass border-r border-white/5"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Scalepay
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/20' 
                  : 'text-textMuted hover:text-text hover:bg-white/5'
              }`
            }
          >
            <link.icon size={20} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-surfaceLight to-surface border border-white/5 shadow-inner">
          <p className="text-xs text-textMuted mb-2">Smart Subscription Analyzer</p>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
