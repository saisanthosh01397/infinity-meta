import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Home, 
  Play, 
  FileText, 
  BarChart3, 
  Trophy, 
  Bookmark, 
  Settings, 
  LogOut, 
  Zap,
  User,
  Presentation,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Play, label: 'Start Quiz', path: '/configure' },
    { icon: FileText, label: 'Upload & Quiz', path: '/configure?mode=document' },
    { icon: BarChart3, label: 'My Results', path: '/analytics' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Bookmark, label: 'Saved Questions', path: '/bookmarks' },
    { icon: Presentation, label: 'Showcase', path: '/showcase' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] fixed top-0 left-0 h-full bg-surface border-r border-white/5 z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="text-brand-primary" size={20} />
          </div>
          <span className="text-xl font-syne font-extrabold text-text-primary">QUIZ.AI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && location.pathname + location.search === item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 h-12 rounded-xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "text-brand-primary bg-brand-primary/5" 
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 top-0 w-1 h-full bg-brand-primary"
                  />
                )}
                <item.icon size={20} className={clsx(isActive ? "text-brand-primary" : "text-text-secondary group-hover:text-text-primary")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 h-12 w-full rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
              {user?.avatar_initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 h-12 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[220px] pb-24 lg:pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-surface border-t border-white/5 flex items-center justify-around px-2 z-40">
        {[
          { icon: Home, label: 'Home', path: '/home' },
          { icon: Play, label: 'Quiz', path: '/configure' },
          { icon: BarChart3, label: 'Results', path: '/analytics' },
          { icon: Trophy, label: 'Trophy', path: '/leaderboard' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all",
                isActive ? "text-brand-primary" : "text-text-secondary"
              )}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
