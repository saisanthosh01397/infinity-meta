import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('quiz_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(newBookmarks);
    localStorage.setItem('quiz_bookmarks', JSON.stringify(newBookmarks));
  };

  return (
    <div className="space-y-8 page-transition">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary">Saved Questions</h1>
          <p className="text-text-secondary text-lg">Review the questions you found interesting or difficult.</p>
        </div>
        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
          <Bookmark className="text-pink-400" size={28} />
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookmarks.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface border border-white/5 p-8 rounded-2xl space-y-6 relative group"
            >
              <button 
                onClick={() => removeBookmark(item.id)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                title="Remove bookmark"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {item.subject || 'General'}
                </span>
                <span className="px-3 py-1 bg-white/5 text-text-secondary text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {item.difficulty || 'Medium'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-text-primary leading-relaxed pr-10">
                {item.text}
              </h3>

              <div className="space-y-3">
                <p className="text-sm font-bold text-text-primary/40 uppercase tracking-widest">Correct Answer</p>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">{item.correctAnswer}</span>
                </div>
              </div>

              {item.explanation && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-text-primary/40 uppercase tracking-widest">Explanation</p>
                  <p className="text-text-secondary leading-relaxed italic">
                    {item.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-text-secondary">
            <Bookmark size={40} />
          </div>
          <p className="text-text-secondary text-xl">No saved questions yet.</p>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">Click the bookmark icon during a quiz to save questions for later review.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
