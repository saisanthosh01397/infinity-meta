import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Brain, 
  History as HistoryIcon, 
  Award, 
  Zap, 
  Flame,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Analytics() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    setHistory(rawHistory);

    if (rawHistory.length > 0) {
      // Calculate stats
      const subjectMap: Record<string, { total: number, correct: number, count: number }> = {};
      rawHistory.forEach((h: any) => {
        if (!subjectMap[h.subject]) {
          subjectMap[h.subject] = { total: 0, correct: 0, count: 0 };
        }
        subjectMap[h.subject].total += h.totalQuestions;
        subjectMap[h.subject].correct += h.correctAnswers;
        subjectMap[h.subject].count += 1;
      });

      const subjectStats = Object.entries(subjectMap).map(([subject, data]) => ({
        subject,
        accuracy: Math.round((data.correct / data.total) * 100),
        count: data.count
      }));

      const avgAccuracy = Math.round(
        rawHistory.reduce((acc: number, h: any) => acc + h.score, 0) / rawHistory.length
      );

      const bestStreak = rawHistory.reduce((max: number, h: any) => Math.max(max, h.streak || 0), 0);
      const topSubject = [...subjectStats].sort((a, b) => b.accuracy - a.accuracy)[0]?.subject || 'N/A';

      setStats({
        avgAccuracy,
        bestStreak,
        topSubject,
        subjectStats
      });
    }
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 bg-surface border border-border rounded-[32px] space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <Brain className="text-text-primary/10" size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-syne text-text-primary">No Analytics Yet</h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">Complete your first quiz to see your performance insights and learning trends.</p>
        </div>
        <button 
          onClick={() => navigate('/configure')}
          className="px-10 h-[56px] bg-brand-primary text-brand-bg font-syne font-extrabold text-lg rounded-full btn-scale"
        >
          Start Your First Quiz
        </button>
      </div>
    );
  }

  const trendData = history.slice(-10).map((h: any) => ({
    date: format(new Date(h.date), 'MMM dd'),
    accuracy: h.score
  }));

  const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 page-transition">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Performance Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-syne text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary text-lg">Deep insights into your learning journey and mastery.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Quizzes', value: history.length, icon: Award, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Avg Accuracy', value: `${stats.avgAccuracy}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Best Streak', value: stats.bestStreak, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Top Subject', value: stats.topSubject, icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10' }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-border p-8 rounded-[24px] space-y-6 shadow-xl"
          >
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", kpi.bg, kpi.color)}>
              <kpi.icon size={24} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest font-bold mb-1">{kpi.label}</div>
              <div className="text-3xl font-extrabold font-syne text-text-primary truncate">{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend */}
        <div className="bg-surface border border-border p-8 rounded-[32px] space-y-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-brand-primary">
              <TrendingUp size={24} />
              <h3 className="font-syne font-extrabold text-xl text-text-primary">Accuracy Trend</h3>
            </div>
            <span className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest font-bold">Last 10 Quizzes</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#00d4ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#00d4ff" 
                  strokeWidth={4} 
                  dot={{ fill: '#00d4ff', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Accuracy */}
        <div className="bg-surface border border-border p-8 rounded-[32px] space-y-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-400">
              <Target size={24} />
              <h3 className="font-syne font-extrabold text-xl text-text-primary">Subject Mastery</h3>
            </div>
            <span className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest font-bold">Performance by Category</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="subject" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} barSize={48}>
                  {stats.subjectStats.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HistoryIcon size={24} className="text-text-primary/40" />
            <h3 className="font-syne font-extrabold text-xl text-text-primary">Recent Quiz History</h3>
          </div>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm font-bold text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            View Full History <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-mono text-text-primary/40 uppercase tracking-[0.2em] border-b border-border font-bold">
                <th className="px-10 py-6">Date</th>
                <th className="px-10 py-6">Subject</th>
                <th className="px-10 py-6">Difficulty</th>
                <th className="px-10 py-6">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.slice(-5).reverse().map((h, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-base text-text-secondary">{format(new Date(h.date), 'MMM dd, yyyy')}</td>
                  <td className="px-10 py-6 font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors">{h.subject}</td>
                  <td className="px-10 py-6">
                    <span className={clsx(
                      "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      h.difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-500" :
                      h.difficulty === 'medium' ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {h.difficulty}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full",
                            h.score >= 80 ? "bg-emerald-500" :
                            h.score >= 50 ? "bg-amber-500" :
                            "bg-red-500"
                          )}
                          style={{ width: `${h.score}%` }}
                        />
                      </div>
                      <span className={clsx(
                        "font-mono font-bold text-lg",
                        h.score >= 80 ? "text-emerald-500" :
                        h.score >= 50 ? "text-amber-500" :
                        "text-red-500"
                      )}>
                        {h.score}%
                      </span>
                    </div>
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
