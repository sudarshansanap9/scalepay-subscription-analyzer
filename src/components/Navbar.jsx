import { Menu, UserCircle } from 'lucide-react';

export const Navbar = ({ toggleMobileMenu }) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 glass border-b border-white/5 z-50">
      <div className="flex items-center gap-3">
        <button onClick={toggleMobileMenu} className="text-textMuted hover:text-text transition">
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Scalepay
        </span>
      </div>
      <button className="text-textMuted hover:text-text transition">
        <UserCircle size={24} />
      </button>
    </header>
  );
};
