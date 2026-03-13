import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  FileText, 
  Brain, 
  Upload, 
  Check,
  Settings as SettingsIcon,
  Target,
  Sparkles
} from 'lucide-react';
import { QuizConfig, Difficulty, QuestionType } from '../types';
import { generateQuiz } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Configure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<QuizConfig>({
    sourceType: 'manual',
    subject: '',
    chapter: '',
    topic: '',
    difficulty: 'medium',
    numQuestions: 10,
    formats: ['mcq'],
    timedMode: false,
    secondsPerQuestion: 30,
    explanationMode: true
  });

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'document') {
      setConfig(prev => ({ ...prev, sourceType: 'upload' }));
      setStep(1); // Skip Step 0 if mode is pre-selected
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const questions = await generateQuiz(config);
      sessionStorage.setItem('current_quiz', JSON.stringify({ questions, config }));
      navigate('/quiz');
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, title: 'Source', subtitle: 'How should we generate it?' },
    { id: 1, title: 'Subject', subtitle: 'Topic and details' },
    { id: 2, title: 'Settings', subtitle: 'Difficulty and formats' }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setConfig({ ...config, documentContent: content, subject: file.name });
        nextStep();
      };
      reader.readAsText(file);
    }
  };

  const subjects = ["Mathematics", "Physics", "History", "Programming", "Biology", "Literature"];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 py-8 page-transition">
      {/* Left Panel - Stepper */}
      <div className="hidden lg:block space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-syne font-extrabold text-text-primary">Quiz Wizard</h2>
          <p className="text-lg text-text-secondary">Let's set up your quiz</p>
        </div>

        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step === s.id ? "bg-brand-primary text-brand-bg scale-110 shadow-[0_0_15px_rgba(0,212,255,0.4)]" : 
                  step > s.id ? "bg-emerald-500 text-white" : "bg-surface-light text-text-primary/20 border border-border"
                )}>
                  {step > s.id ? <Check size={18} /> : s.id + 1}
                </div>
                {s.id !== steps.length - 1 && (
                  <div className={clsx(
                    "w-px h-16 my-2 transition-colors",
                    step > s.id ? "bg-emerald-500" : "bg-border"
                  )} />
                )}
              </div>
              <div className="space-y-1 pt-2">
                <div className={clsx(
                  "text-lg font-bold transition-colors",
                  step === s.id ? "text-text-primary" : "text-text-primary/40"
                )}>
                  {s.title}
                </div>
                <div className="text-xs text-text-secondary uppercase tracking-widest font-mono">
                  {s.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="bg-surface border border-border rounded-[24px] p-8 md:p-12 relative overflow-hidden min-h-[540px] shadow-2xl">
        {loading && (
          <div className="absolute inset-0 z-50 bg-brand-bg/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
            <div className="relative">
              <Loader2 className="text-brand-primary animate-spin mb-6" size={64} />
              <Sparkles className="absolute -top-2 -right-2 text-brand-primary animate-pulse" size={24} />
            </div>
            <h3 className="text-3xl font-syne font-extrabold mb-3 text-text-primary">Generating Your Quiz...</h3>
            <p className="text-text-secondary text-lg max-w-md">Our AI is reading your requirements and crafting the perfect set of questions for you.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h3 className="text-3xl font-syne font-extrabold text-text-primary">How should we generate it?</h3>
                <p className="text-text-secondary text-lg">Choose where the quiz questions should come from.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => { setConfig({ ...config, sourceType: 'upload' }); nextStep(); }}
                  className="p-10 rounded-2xl border bg-surface-light border-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group text-left"
                >
                  <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="text-violet-400" size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-text-primary mb-3">Upload Document</h4>
                  <p className="text-text-secondary text-base">Generate questions from your own PDF or text notes.</p>
                </button>
                <button
                  onClick={() => { setConfig({ ...config, sourceType: 'manual' }); nextStep(); }}
                  className="p-10 rounded-2xl border bg-surface-light border-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group text-left"
                >
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Brain className="text-brand-primary" size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-text-primary mb-3">Manual Topic</h4>
                  <p className="text-text-secondary text-base">Just type a subject and let AI handle the rest.</p>
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h3 className="text-3xl font-syne font-extrabold text-text-primary">Subject Details</h3>
                <p className="text-text-secondary text-lg">Tell us what you want to learn about.</p>
              </div>
              
              {config.sourceType === 'upload' ? (
                <div className="space-y-8">
                  <div className="border-3 border-dashed border-border rounded-3xl p-16 text-center hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all relative group">
                    <input 
                      type="file" 
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="text-brand-primary" size={48} />
                      </div>
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-text-primary">
                          {config.documentContent ? 'Document Ready!' : 'Click or drag to upload .txt'}
                        </div>
                        <p className="text-text-secondary">We currently support text files for best results.</p>
                      </div>
                      {config.documentContent && (
                        <div className="inline-block px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg font-mono text-sm">
                          {config.subject}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-text-primary/60 uppercase tracking-widest ml-1">Quick Subjects</label>
                    <div className="flex flex-wrap gap-3">
                      {subjects.map(s => (
                        <button
                          key={s}
                          onClick={() => setConfig({ ...config, subject: s })}
                          className={clsx(
                            "px-6 py-3 rounded-full border text-base font-bold transition-all",
                            config.subject === s ? "bg-brand-primary text-brand-bg border-brand-primary shadow-lg" : "bg-surface-light border-border text-text-primary/60 hover:border-text-primary/30"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-text-primary/60 uppercase tracking-widest ml-1">Specific Topic</label>
                    <input 
                      type="text" 
                      value={config.subject}
                      onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                      placeholder="e.g. Ancient Rome or Python Basics"
                      className="w-full h-[64px] bg-surface-light border border-border rounded-2xl px-6 text-xl text-text-primary focus:border-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h3 className="text-3xl font-syne font-extrabold text-text-primary">Fine-Tuning</h3>
                <p className="text-text-secondary text-lg">Adjust the difficulty and format to your liking.</p>
              </div>

              <div className="space-y-6">
                <label className="block text-sm font-bold text-text-primary/60 uppercase tracking-widest ml-1">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig({ ...config, difficulty: d })}
                      className={clsx(
                        "py-5 rounded-2xl border text-base font-bold uppercase tracking-widest transition-all",
                        config.difficulty === d ? "bg-brand-primary text-brand-bg border-brand-primary shadow-lg" : "bg-surface-light border-border text-text-primary/40 hover:border-text-primary/30"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-text-primary/60 uppercase tracking-widest ml-1">Number of Questions</label>
                  <span className="text-2xl font-syne font-extrabold text-brand-primary">{config.numQuestions}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="5"
                  value={config.numQuestions}
                  onChange={(e) => setConfig({ ...config, numQuestions: parseInt(e.target.value) })}
                  className="w-full h-3 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div className="space-y-6">
                <label className="block text-sm font-bold text-text-primary/60 uppercase tracking-widest ml-1">Question Formats</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'mcq', label: 'Multiple Choice' },
                    { id: 'fitb', label: 'Fill in the Blank' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        const formats = config.formats.includes(f.id as QuestionType)
                          ? config.formats.filter(x => x !== f.id)
                          : [...config.formats, f.id as QuestionType];
                        if (formats.length > 0) setConfig({ ...config, formats });
                      }}
                      className={clsx(
                        "p-6 rounded-2xl border text-lg font-bold transition-all flex items-center justify-between",
                        config.formats.includes(f.id as QuestionType) ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-surface-light border-border text-text-primary/40"
                      )}
                    >
                      {f.label}
                      <div className={clsx(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        config.formats.includes(f.id as QuestionType) ? "bg-brand-primary border-brand-primary text-brand-bg" : "border-text-primary/20"
                      )}>
                        {config.formats.includes(f.id as QuestionType) && <Check size={14} strokeWidth={4} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-16 pt-10 border-t border-border">
          {step > 0 && (
            <button 
              onClick={prevStep}
              className="px-10 h-[64px] bg-transparent text-text-primary font-bold text-lg rounded-2xl border border-border hover:bg-white/5 transition-all flex items-center gap-3"
            >
              <ChevronLeft size={24} /> Back
            </button>
          )}
          {step < 2 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !config.subject}
              className="flex-1 h-[64px] bg-brand-primary text-brand-bg rounded-2xl font-syne font-extrabold text-xl flex items-center justify-center gap-3 btn-scale disabled:opacity-50 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              Continue <ChevronRight size={24} />
            </button>
          ) : (
            <button 
              onClick={handleGenerate}
              className="flex-1 h-[64px] bg-brand-primary text-brand-bg rounded-2xl font-syne font-extrabold text-xl flex items-center justify-center gap-3 btn-scale shadow-[0_0_30px_rgba(0,212,255,0.4)]"
            >
              Generate Quiz ⚡
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
