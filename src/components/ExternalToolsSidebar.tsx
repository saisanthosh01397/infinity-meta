import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, Calculator, Timer, Search, X, 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw,
  BookOpen, Sparkles, MessageSquare, ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

export default function ExternalToolsSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_open');
    return saved ? JSON.parse(saved) : false;
  });
  const [activeTool, setActiveTool] = useState<'calc' | 'pomodoro' | 'dict' | null>(null);

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(isOpen));
  }, [isOpen]);

  // Pomodoro State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomoRunning && pomoTime > 0) {
      interval = setInterval(() => setPomoTime(t => t - 1), 1000);
    } else if (pomoTime === 0) {
      setIsPomoRunning(false);
      alert("Pomodoro session finished!");
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');

  const handleCalc = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcFormula('');
    } else if (val === '=') {
      try {
        const result = eval(calcFormula);
        setCalcDisplay(result.toString());
        setCalcFormula(result.toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(prev => prev === '0' ? val : prev + val);
      setCalcFormula(prev => prev + val);
    }
  };

  const externalTools = [
    { name: 'LearnStream', url: 'https://www.vidyanotes.com', icon: Play, desc: 'Video study notes' },
    { name: 'Image Gen', url: 'https://lmarena.ai', icon: Sparkles, desc: 'AI visual aids' },
    { name: 'Chat Dash', url: 'https://chatdash.ai', icon: MessageSquare, desc: 'Advanced AI chat' }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close tools sidebar" : "Open tools sidebar"}
        className={clsx(
          "fixed left-0 top-1/2 -translate-y-1/2 z-[70] p-2 bg-brand-primary text-black rounded-r-xl shadow-xl transition-all",
          isOpen ? "left-[300px]" : "left-0"
        )}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-[300px] z-[65] glass border-r border-white/10 flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Wrench className="text-brand-primary" size={24} />
          <h3 className="font-bold">Study Tools</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* External Tools Section */}
          <div className="space-y-2">
            <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">External Resources</div>
            <div className="grid grid-cols-1 gap-2">
              {externalTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors border border-white/5 group"
                >
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                    <tool.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{tool.name}</div>
                    <div className="text-[10px] text-white/40">{tool.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 mx-2" />

          {/* Pomodoro Tool */}
          <div className="glass p-4 rounded-2xl space-y-4 border border-white/5">
            <div className="flex items-center gap-2 text-brand-primary">
              <Timer size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Pomodoro</span>
            </div>
            <div className="text-4xl font-black text-center font-mono">
              {formatTime(pomoTime)}
            </div>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setIsPomoRunning(!isPomoRunning)}
                className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-black transition-all"
              >
                {isPomoRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button 
                onClick={() => { setPomoTime(25 * 60); setIsPomoRunning(false); }}
                className="p-2 glass hover:bg-white/10 rounded-lg"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Calculator Tool */}
          <div className="glass p-4 rounded-2xl space-y-4 border border-white/5">
            <div className="flex items-center gap-2 text-brand-primary">
              <Calculator size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Calculator</span>
            </div>
            <div className="bg-black/20 p-3 rounded-xl text-right font-mono text-xl overflow-hidden">
              {calcDisplay}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', 'C', '=', '+'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalc(btn)}
                  className={clsx(
                    "p-2 rounded-lg text-sm font-bold transition-all",
                    btn === '=' ? "bg-brand-primary text-black col-span-1" : 
                    btn === 'C' ? "bg-red-500/20 text-red-500" : "glass hover:bg-white/10"
                  )}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Dictionary/Search Tool */}
          <div className="glass p-4 rounded-2xl space-y-4 border border-white/5">
            <div className="flex items-center gap-2 text-brand-primary">
              <BookOpen size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Dictionary</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search term..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs outline-none focus:border-brand-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.open(`https://www.google.com/search?q=define+${(e.target as HTMLInputElement).value}`, '_blank');
                  }
                }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            </div>
            <p className="text-[10px] text-white/40 italic">Press Enter to search on Google</p>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Quiz.AI Tools v1.0</p>
        </div>
      </motion.div>
    </>
  );
}
