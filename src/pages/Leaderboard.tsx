import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, User, Calendar, Star, Medal } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate global leaderboard by mixing local history with mock data
    const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    const userLeaders = history.map((h: any) => ({
      username: 'You',
      subject: h.subject,
      score: h.correctAnswers,
      total_questions: h.totalQuestions,
      percentage: h.score,
      date: h.date,
      isUser: true
    }));

    const mockLeaders = [
      { username: 'Alex J.', subject: 'Mathematics', score: 10, total_questions: 10, percentage: 100, date: new Date().toISOString(), isUser: false },
      { username: 'Sarah W.', subject: 'Physics', score: 9, total_questions: 10, percentage: 90, date: new Date().toISOString(), isUser: false },
      { username: 'David K.', subject: 'History', score: 10, total_questions: 10, percentage: 100, date: new Date().toISOString(), isUser: false },
      { username: 'Emma L.', subject: 'Programming', score: 8, total_questions: 10, percentage: 80, date: new Date().toISOString(), isUser: false },
      { username: 'Michael R.', subject: 'Biology', score: 9, total_questions: 10, percentage: 90, date: new Date().toISOString(), isUser: false },
    ];

    const allLeaders = [...userLeaders, ...mockLeaders].sort((a, b) => b.percentage - a.percentage);
    setLeaders(allLeaders.slice(0, 10));
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8 page-transition">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-bold uppercase tracking-widest">
          <Trophy size={14} /> Global Rankings
        </div>
        <h1 className="text-4xl md:text-6xl font-syne font-extrabold text-text-primary">The Hall of Fame</h1>
        <p className="text-text-secondary text-xl max-w-2xl mx-auto">
          Celebrate the top performers in the QUIZ.AI community. Can you make it to the top?
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
        {leaders.slice(0, 3).map((l, i) => {
          const order = i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3';
          const height = i === 0 ? 'h-72' : i === 1 ? 'h-60' : 'h-52';
          const color = i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : 'text-amber-600';
          const bg = i === 0 ? 'bg-yellow-400/5' : i === 1 ? 'bg-gray-300/5' : 'bg-amber-600/5';
          const border = i === 0 ? 'border-yellow-400/20' : i === 1 ? 'border-gray-300/20' : 'border-amber-600/20';

          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={clsx("flex flex-col items-center gap-4", order)}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  {l.isUser ? (
                    <div className="w-full h-full bg-brand-primary flex items-center justify-center text-brand-bg font-syne font-extrabold text-2xl">
                      {l.username[0]}
                    </div>
                  ) : (
                    <User size={40} className="text-white/20" />
                  )}
                </div>
                <div className={clsx("absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-brand-bg", i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : 'bg-amber-600')}>
                  <span className="text-brand-bg font-syne font-extrabold text-lg">{i + 1}</span>
                </div>
              </div>
              <div className={clsx("w-full rounded-t-[32px] border-t border-x p-8 flex flex-col items-center justify-center text-center space-y-4", height, bg, border)}>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-text-primary">{l.username}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">{l.subject}</div>
                </div>
                <div className={clsx("text-4xl font-syne font-extrabold", color)}>
                  {l.percentage}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* List View */}
      <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-mono text-text-primary/40 uppercase tracking-[0.2em] border-b border-border font-bold">
                <th className="px-10 py-6">Rank</th>
                <th className="px-10 py-6">User</th>
                <th className="px-10 py-6">Subject</th>
                <th className="px-10 py-6">Score</th>
                <th className="px-10 py-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaders.map((l, i) => (
                <tr key={i} className={clsx(
                  "hover:bg-white/[0.02] transition-colors group",
                  l.isUser && "bg-brand-primary/5"
                )}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-text-primary/40 group-hover:text-text-primary transition-colors">#{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                        l.isUser ? "bg-brand-primary text-brand-bg" : "bg-white/5 text-text-primary/20"
                      )}>
                        {l.username[0]}
                      </div>
                      <span className={clsx("font-bold text-lg", l.isUser ? "text-brand-primary" : "text-text-primary")}>
                        {l.username} {l.isUser && " (You)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-text-secondary font-bold">{l.subject}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-text-primary font-syne font-extrabold text-lg">
                      <Star size={16} className="text-brand-primary" fill="currentColor" />
                      {l.score}/{l.total_questions}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-base text-text-secondary">
                    {format(new Date(l.date), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
