import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Clock, 
  Flame, 
  RefreshCw, 
  Plus, 
  FileDown, 
  LayoutDashboard,
  Bookmark,
  ChevronRight,
  Star
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import clsx from 'clsx';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('last_result');
    if (!data) {
      navigate('/home');
      return;
    }
    setResult(JSON.parse(data));
  }, [navigate]);

  if (!result) return null;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Quiz Results: ${result.subject}`, 20, 20);
    doc.setFontSize(16);
    doc.text(`Score: ${result.score}%`, 20, 40);
    doc.text(`Correct Answers: ${result.correctAnswers} / ${result.totalQuestions}`, 20, 50);
    doc.text(`Time Taken: ${result.timeTaken}s`, 20, 60);
    doc.text(`Difficulty: ${result.difficulty}`, 20, 70);
    doc.save(`quiz_results_${result.subject.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  const badges = [
    { id: 'perfect', label: 'Perfect Score', icon: Star, condition: result.score === 100, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'speed', label: 'Speed Demon', icon: Clock, condition: result.timeTaken < result.totalQuestions * 5, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'streak', label: 'Unstoppable', icon: Flame, condition: result.streak >= 5, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ].filter(b => b.condition);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 page-transition">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-white/5 fill-none"
              strokeWidth="8"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-brand-primary fill-none"
              strokeWidth="8"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * result.score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl md:text-7xl font-syne font-extrabold text-text-primary">{result.score}%</span>
            <span className="text-sm md:text-base text-text-secondary font-bold uppercase tracking-widest">Final Score</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-text-primary">
            {result.score >= 80 ? 'Outstanding Job!' : result.score >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h1>
          <p className="text-text-secondary text-xl max-w-lg mx-auto">
            You've completed the <span className="text-text-primary font-bold">{result.subject}</span> quiz. 
            Here's how you performed today.
          </p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 shadow-lg",
                badge.bg, badge.color
              )}
            >
              <badge.icon size={20} />
              <span className="font-bold text-sm uppercase tracking-widest">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, label: 'Accuracy', value: `${result.correctAnswers}/${result.totalQuestions}`, color: 'text-emerald-400' },
          { icon: Clock, label: 'Time Taken', value: `${result.timeTaken}s`, color: 'text-cyan-400' },
          { icon: Flame, label: 'Best Streak', value: result.streak, color: 'text-orange-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-border p-8 rounded-3xl flex flex-col items-center text-center space-y-3">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center bg-white/5", stat.color)}>
              <stat.icon size={28} />
            </div>
            <span className="text-3xl font-syne font-extrabold text-text-primary">{stat.value}</span>
            <span className="text-sm text-text-secondary font-bold uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/configure')}
          className="h-[64px] bg-brand-primary text-brand-bg font-syne font-extrabold text-lg rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={24} /> New Quiz
        </button>
        <button 
          onClick={() => navigate(`/quiz?subject=${result.subject}`)}
          className="h-[64px] bg-white/5 border border-border text-text-primary font-syne font-extrabold text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <RefreshCw size={24} /> Try Again
        </button>
        <button 
          onClick={exportPDF}
          className="h-[64px] bg-white/5 border border-border text-text-primary font-syne font-extrabold text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <FileDown size={24} /> Export PDF
        </button>
        <button 
          onClick={() => navigate('/home')}
          className="h-[64px] bg-white/5 border border-border text-text-primary font-syne font-extrabold text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <LayoutDashboard size={24} /> Dashboard
        </button>
      </div>

      {/* Bookmarked Questions Section */}
      <div className="bg-surface border border-border rounded-[32px] p-8 md:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400">
              <Bookmark size={28} />
            </div>
            <h2 className="text-2xl font-syne font-extrabold text-text-primary">Review Saved Questions</h2>
          </div>
          <button 
            onClick={() => navigate('/bookmarks')}
            className="text-brand-primary font-bold flex items-center gap-2 hover:underline"
          >
            See All <ChevronRight size={20} />
          </button>
        </div>
        
        <p className="text-text-secondary text-lg">
          You can review all the questions you bookmarked during this session in your Saved Questions dashboard.
        </p>
      </div>
    </div>
  );
};

export default Results;
