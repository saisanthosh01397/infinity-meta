import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Timer, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Info, 
  Volume2, 
  Eye as BrailleIcon, 
  Trophy, 
  Flame,
  Clock
} from 'lucide-react';
import { Question, QuizConfig } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { speak, stopSpeaking, isSpeaking } = useAccessibility();
  
  const [quizData, setQuizData] = useState<{ questions: Question[], config: QuizConfig } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [fitbValue, setFitbValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime] = useState(Date.now());
  const [results, setResults] = useState<any[]>([]);
  const [encouragement, setEncouragement] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const encouragements = [
    "You got this!",
    "Brilliant work!",
    "Keep it up!",
    "You're on fire!",
    "Excellent choice!",
    "Smart move!",
    "Way to go!"
  ];

  const playSound = (type: 'correct' | 'wrong' | 'click') => {
    const soundEnabled = localStorage.getItem('quiz_sound_enabled') !== 'false';
    if (!soundEnabled) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1); // A2
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  };

  useEffect(() => {
    const data = sessionStorage.getItem('current_quiz');
    if (!data) {
      navigate('/configure');
      return;
    }
    const parsed = JSON.parse(data);
    setQuizData(parsed);
    setTimeLeft(parsed.config.secondsPerQuestion || 30);
    
    // Check if current question is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('quiz_bookmarks') || '[]');
    const isBooked = bookmarks.some((b: any) => b.id === parsed.questions[0].id);
    setIsBookmarked(isBooked);
  }, [navigate]);

  useEffect(() => {
    if (quizData?.config.timedMode && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizData, isSubmitted, currentIndex]);

  if (!quizData) return null;

  const currentQuestion = quizData.questions[currentIndex];
  const totalQuestions = quizData.questions.length;

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    playSound('click');
    if (currentQuestion.type === 'mcq') {
      setSelectedAnswers([option]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(option) ? prev.filter(a => a !== option) : [...prev, option]
      );
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let isCorrect = false;
    if (currentQuestion.type === 'mcq') {
      isCorrect = selectedAnswers[0] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'multi_mcq') {
      const correctSet = new Set(currentQuestion.correctAnswer as string[]);
      isCorrect = selectedAnswers.length === correctSet.size && selectedAnswers.every(a => correctSet.has(a));
    } else {
      isCorrect = fitbValue.toLowerCase().trim() === (currentQuestion.correctAnswer as string).toLowerCase().trim();
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      playSound('correct');
      setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
    } else {
      setStreak(0);
      playSound('wrong');
      setEncouragement("Don't worry, you'll get the next one!");
    }

    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      isCorrect,
      selected: currentQuestion.type === 'fitb' ? fitbValue : selectedAnswers,
      correct: currentQuestion.correctAnswer
    }]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setFitbValue('');
      setIsSubmitted(false);
      setEncouragement('');
      setTimeLeft(quizData.config.secondsPerQuestion || 30);
      
      // Check bookmark for next question
      const bookmarks = JSON.parse(localStorage.getItem('quiz_bookmarks') || '[]');
      const isBooked = bookmarks.some((b: any) => b.id === quizData.questions[currentIndex + 1].id);
      setIsBookmarked(isBooked);
    } else {
      const finalScore = results.reduce((acc, r) => acc + (r.isCorrect ? 1 : 0), 0);
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      
      if (percentage >= 80) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d4ff', '#7c3aed', '#10b981']
        });
      }

      const finalResult = {
        date: new Date().toISOString(),
        subject: quizData.config.subject,
        score: percentage,
        correctAnswers: finalScore,
        totalQuestions: totalQuestions,
        difficulty: quizData.config.difficulty,
        timeTaken: Math.floor((Date.now() - startTime) / 1000),
        streak: streak,
        results: [...results]
      };

      // Save to history
      const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
      localStorage.setItem('quiz_history', JSON.stringify([...history, finalResult]));

      sessionStorage.setItem('last_result', JSON.stringify(finalResult));
      navigate('/results');
    }
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('quiz_bookmarks') || '[]');
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((b: any) => b.id !== currentQuestion.id);
      localStorage.setItem('quiz_bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      const newBookmark = {
        ...currentQuestion,
        subject: quizData.config.subject,
        date: new Date().toISOString()
      };
      localStorage.setItem('quiz_bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setIsBookmarked(true);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto space-y-8 py-4 page-transition">
      {/* Quiz Header */}
      <div className="bg-surface border border-border p-6 rounded-[24px] flex items-center justify-between sticky top-4 z-40 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-syne font-extrabold text-text-primary">{currentIndex + 1}/{totalQuestions}</span>
              <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {quizData.config.timedMode && (
            <div className={clsx(
              "flex flex-col items-center",
              timeLeft <= 5 ? "text-red-400" : "text-brand-primary"
            )}>
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Time</span>
              <div className="flex items-center gap-1.5">
                <Clock size={18} />
                <span className="text-xl font-syne font-extrabold">{timeLeft}s</span>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center text-orange-400">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Streak</span>
            <div className="flex items-center gap-1.5">
              <Flame size={18} />
              <span className="text-xl font-syne font-extrabold">{streak}</span>
            </div>
          </div>
          <button 
            onClick={toggleBookmark}
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
              isBookmarked ? "bg-pink-500/10 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "bg-white/5 border-border text-text-primary/40 hover:text-text-primary"
            )}
          >
            <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="space-y-6"
        >
          <div className="bg-surface border border-border rounded-[32px] p-8 md:p-12 space-y-10 relative overflow-hidden shadow-2xl">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3">
                <span className={clsx(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                  currentQuestion.difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-400" :
                  currentQuestion.difficulty === 'medium' ? "bg-amber-500/10 text-amber-400" :
                  "bg-red-500/10 text-red-400"
                )}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-text-primary/40 text-xs font-bold uppercase tracking-widest">
                  {currentQuestion.type.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speak(currentQuestion.text)}
                className={clsx(
                  "w-12 h-12 rounded-full transition-all border flex items-center justify-center",
                  isSpeaking ? "bg-red-500/10 border-red-500 text-red-500" : "bg-white/5 border-border text-brand-primary hover:border-brand-primary/50"
                )}
              >
                <Volume2 size={24} className={isSpeaking ? "animate-pulse" : ""} />
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-text-primary">
              {currentQuestion.text}
            </h2>

            {/* Options Area */}
            <div className="space-y-4">
              {currentQuestion.type === 'fitb' ? (
                <div className="flex flex-col items-center py-10">
                  <input 
                    type="text"
                    value={fitbValue}
                    onChange={(e) => setFitbValue(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Type your answer here..."
                    className="w-full max-w-md bg-transparent border-b-4 border-border text-center text-3xl font-bold py-6 focus:border-brand-primary outline-none transition-all placeholder:text-text-primary/10"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options?.map((option, i) => {
                    const isSelected = selectedAnswers.includes(option);
                    const isCorrect = Array.isArray(currentQuestion.correctAnswer) 
                      ? currentQuestion.correctAnswer.includes(option)
                      : currentQuestion.correctAnswer === option;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(option)}
                        disabled={isSubmitted}
                        className={clsx(
                          "w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-6 group relative",
                          !isSubmitted && isSelected ? "bg-brand-primary/10 border-brand-primary text-brand-primary" :
                          !isSubmitted && !isSelected ? "bg-white/5 border-border hover:border-text-primary/20 hover:bg-white/10" :
                          isSubmitted && isCorrect ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 animate-pulse-glow" :
                          isSubmitted && isSelected && !isCorrect ? "bg-red-500/10 border-red-500 text-red-400 animate-shake" :
                          "bg-white/5 border-border opacity-40"
                        )}
                      >
                        <div className={clsx(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-syne font-extrabold text-lg shrink-0 transition-all",
                          isSelected ? "bg-brand-primary text-brand-bg" : "bg-white/10 text-text-primary/40 group-hover:bg-brand-primary group-hover:text-brand-bg"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-lg font-bold">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit / Next Actions */}
            <div className="pt-6">
              {!isSubmitted ? (
                <button 
                  onClick={handleSubmit}
                  disabled={currentQuestion.type === 'fitb' ? !fitbValue : selectedAnswers.length === 0}
                  className="w-full h-[64px] bg-brand-primary text-brand-bg font-syne font-extrabold text-xl rounded-2xl btn-scale disabled:opacity-50 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="space-y-6">
                  {encouragement && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={clsx(
                        "text-center text-xl font-bold",
                        results[currentIndex]?.isCorrect ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      {encouragement}
                    </motion.p>
                  )}
                  <button 
                    onClick={handleNext}
                    className="w-full h-[64px] bg-white text-brand-bg font-syne font-extrabold text-xl rounded-2xl btn-scale flex items-center justify-center gap-3 shadow-xl"
                  >
                    {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Explanation Section */}
            <AnimatePresence>
              {isSubmitted && quizData.config.explanationMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-10 border-t border-border"
                >
                  <div className="bg-surface-light border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-text-primary/40 uppercase tracking-widest">
                      <Info size={18} className="text-brand-primary" /> Why is this correct?
                    </div>
                    <p className="text-lg text-text-secondary leading-relaxed italic">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
