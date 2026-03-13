import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { History as HistoryIcon, Play, Trash2, Calendar, Target, Clock } from 'lucide-react';
import clsx from 'clsx';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    setHistory(savedHistory.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const deleteHistoryItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('quiz_history', JSON.stringify(newHistory));
  };

  return (
    <div className="space-y-8 page-transition">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary">Quiz History</h1>
          <p className="text-text-secondary text-lg">Review your past performances and practice again.</p>
        </div>
        <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
          <HistoryIcon className="text-brand-primary" size={28} />
        </div>
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-text-primary/20 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={clsx(
                  "w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-syne font-extrabold text-xl",
                  item.score >= 80 ? "bg-emerald-500/10 text-emerald-400" : 
                  item.score >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                )}>
                  {item.score}%
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">{item.subject}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Target size={14} /> {item.correctAnswers} / {item.totalQuestions} Correct</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {item.timeTaken || 'N/A'}s</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/quiz?subject=${item.subject}`)}
                  className="flex-1 md:flex-none h-12 px-6 bg-brand-primary text-brand-bg font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Play size={18} fill="currentColor" /> Practice Again
                </button>
                <button 
                  onClick={() => deleteHistoryItem(idx)}
                  className="w-12 h-12 bg-white/5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl flex items-center justify-center transition-all"
                  title="Delete from history"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-text-secondary">
            <HistoryIcon size={40} />
          </div>
          <p className="text-text-secondary text-xl">You haven't taken any quizzes yet.</p>
          <button 
            onClick={() => navigate('/configure')}
            className="px-8 py-4 bg-brand-primary text-brand-bg font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Start Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
