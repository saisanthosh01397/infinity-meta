import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Play, 
  FileText, 
  BarChart3, 
  RefreshCw, 
  Trophy, 
  Bookmark, 
  ArrowRight,
  LogOut,
  Target,
  Star,
  Flame,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    quizzesTaken: 0,
    avgScore: 0,
    bestStreak: 0,
    subjects: 0
  });

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    setHistory(savedHistory.slice(0, 5));
    
    if (savedHistory.length > 0) {
      const totalScore = savedHistory.reduce((acc: number, curr: any) => acc + curr.score, 0);
      const uniqueSubjects = new Set(savedHistory.map((h: any) => h.subject)).size;
      const maxStreak = Math.max(...savedHistory.map((h: any) => h.streak || 0));
      
      setStats({
        quizzesTaken: savedHistory.length,
        avgScore: Math.round(totalScore / savedHistory.length),
        bestStreak: maxStreak,
        subjects: uniqueSubjects
      });
    }
  }, []);

  const featureCards = [
    {
      id: 'start',
      icon: Play,
      label: 'Start a Quiz',
      description: 'Pick a subject and let AI create questions for you',
      color: 'cyan',
      bg: 'bg-[#00d4ff08]',
      border: 'border-[#00d4ff30]',
      btnBg: 'bg-brand-primary',
      btnText: 'text-brand-bg',
      cta: "Let's Go →",
      path: '/configure'
    },
    {
      id: 'upload',
      icon: FileText,
      label: 'Quiz from My Document',
      description: 'Upload a PDF or text file and get questions from it',
      color: 'violet',
      bg: 'bg-[#7c3aed08]',
      border: 'border-[#7c3aed30]',
      btnBg: 'bg-violet-600',
      btnText: 'text-white',
      cta: 'Upload File →',
      path: '/configure?mode=document'
    },
    {
      id: 'results',
      icon: BarChart3,
      label: 'See My Results',
      description: "Check your scores and see how you're improving",
      color: 'green',
      bg: 'bg-[#10b98108]',
      border: 'border-[#10b98130]',
      btnBg: 'bg-emerald-500',
      btnText: 'text-white',
      cta: 'View Results →',
      path: '/analytics'
    },
    {
      id: 'practice',
      icon: RefreshCw,
      label: 'Practice Again',
      description: 'Redo your last quiz or pick from your history',
      color: 'amber',
      bg: 'bg-[#f59e0b08]',
      border: 'border-[#f59e0b30]',
      btnBg: 'bg-amber-500',
      btnText: 'text-white',
      cta: 'Practice →',
      path: '/history'
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      description: 'See how you rank against other learners',
      color: 'gold',
      bg: 'bg-[#fbbf2408]',
      border: 'border-[#fbbf2430]',
      btnBg: 'bg-transparent',
      btnText: 'text-amber-400',
      cta: 'View Rankings →',
      isOutline: true,
      path: '/leaderboard'
    },
    {
      id: 'bookmarks',
      icon: Bookmark,
      label: 'Saved Questions',
      description: 'Review questions you saved during your quizzes',
      color: 'pink',
      bg: 'bg-[#ec489908]',
      border: 'border-[#ec489930]',
      btnBg: 'bg-transparent',
      btnText: 'text-pink-400',
      cta: 'Review →',
      isOutline: true,
      path: '/bookmarks'
    }
  ];

  return (
    <div className="space-y-10 page-transition">
      {/* Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-syne font-extrabold text-text-primary">
            Good morning, {user?.name}! 👋
          </h1>
          <p className="text-text-secondary text-lg mt-1">What would you like to do today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-surface border border-border p-2 pr-4 rounded-full">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
              {user?.avatar_initial}
            </div>
            <span className="text-text-primary font-medium hidden sm:inline">{user?.name}</span>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {featureCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => navigate(card.path)}
            className={clsx(
              "group relative flex flex-col min-h-[180px] p-8 rounded-2xl border transition-all cursor-pointer",
              card.bg,
              card.border,
              "hover:-translate-y-1 hover:shadow-xl hover:border-opacity-60"
            )}
          >
            <div className="flex-1">
              <div className={clsx(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                card.id === 'start' ? "bg-brand-primary/10 text-brand-primary" :
                card.id === 'upload' ? "bg-violet-500/10 text-violet-400" :
                card.id === 'results' ? "bg-emerald-500/10 text-emerald-400" :
                card.id === 'practice' ? "bg-amber-500/10 text-amber-400" :
                card.id === 'leaderboard' ? "bg-yellow-500/10 text-yellow-400" :
                "bg-pink-500/10 text-pink-400"
              )}>
                <card.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">{card.label}</h3>
              <p className="text-text-secondary text-base leading-relaxed">{card.description}</p>
            </div>
            
            <div className="mt-8">
              <button className={clsx(
                "h-12 px-6 rounded-xl font-bold text-base flex items-center gap-2 transition-all",
                card.isOutline ? `border border-current ${card.btnText} hover:bg-current/10` : `${card.btnBg} ${card.btnText} hover:opacity-90`
              )}>
                {card.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Quizzes Taken', value: stats.quizzesTaken, color: 'text-brand-primary' },
          { icon: Star, label: 'Avg Score', value: `${stats.avgScore}%`, color: 'text-emerald-400' },
          { icon: Flame, label: 'Best Streak', value: stats.bestStreak, color: 'text-orange-400' },
          { icon: BookOpen, label: 'Subjects', value: stats.subjects, color: 'text-violet-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-center text-center">
            <stat.icon className={clsx("mb-3", stat.color)} size={24} />
            <span className="text-3xl font-syne font-extrabold text-text-primary">{stat.value}</span>
            <span className="text-sm text-text-secondary mt-1 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-2xl font-syne font-extrabold text-text-primary">Recently Played</h2>
        
        {history.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {history.map((item, idx) => (
              <div 
                key={idx}
                className="flex-shrink-0 w-[280px] bg-surface border border-border p-5 rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {item.subject}
                  </span>
                  <span className={clsx(
                    "text-lg font-bold",
                    item.score >= 80 ? "text-emerald-400" : item.score >= 50 ? "text-amber-400" : "text-red-400"
                  )}>
                    {item.score}%
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => navigate(`/quiz?subject=${item.subject}`)}
                  className="w-full h-10 bg-white/5 hover:bg-white/10 text-text-primary text-sm font-bold rounded-lg transition-all border border-border"
                >
                  Retry
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <p className="text-text-secondary text-lg">No quizzes yet! Start your first one above ☝️</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
