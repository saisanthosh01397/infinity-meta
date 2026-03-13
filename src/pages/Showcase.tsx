import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Presentation, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Monitor, 
  Smartphone, 
  Layout,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Moon,
  Sun
} from 'lucide-react';
import Whiteboard from '../components/Whiteboard';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export default function Showcase() {
  const { theme, toggleTheme } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Generation",
      description: "Transform any document or topic into a comprehensive quiz in seconds using Gemini 3.1 Pro.",
      icon: Zap,
      color: "text-brand-primary",
      demo: (
        <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              <Sparkles size={20} />
            </div>
            <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/5 rounded-full" />
            <div className="h-3 w-3/4 bg-white/5 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-10 bg-white/5 rounded-xl border border-white/10" />
            <div className="h-10 bg-white/5 rounded-xl border border-white/10" />
          </div>
        </div>
      )
    },
    {
      title: "Real-time Collaboration",
      description: "Host live sessions with hundreds of participants. Sync progress and results instantly.",
      icon: Users,
      color: "text-violet-400",
      demo: (
        <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
          <div className="flex -space-x-3 overflow-hidden">
            {[1,2,3,4].map(i => (
              <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-white/10 flex items-center justify-center">
                <Users size={16} className="text-white/40" />
              </div>
            ))}
            <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-brand-primary flex items-center justify-center text-[10px] font-bold text-brand-bg">
              +42
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              <span>Live Progress</span>
              <span>84% Complete</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "84%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Analytics",
      description: "Deep dive into performance metrics with interactive charts and personalized insights.",
      icon: Monitor,
      color: "text-emerald-400",
      demo: (
        <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
          <div className="flex items-end gap-2 h-32">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="flex-1 bg-brand-primary/20 border-t-2 border-brand-primary rounded-t-sm"
              />
            ))}
          </div>
          <div className="flex justify-between gap-2">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-1 flex-1 bg-white/5 rounded-full" />)}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg selection:bg-brand-primary selection:text-brand-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
              <Zap className="text-brand-bg" size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-syne font-extrabold tracking-tighter">QUIZ.AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Features</a>
            <a href="#classroom" className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Classroom</a>
            <a href="#demo" className="text-sm font-bold text-text-secondary hover:text-white transition-colors">Live Demo</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="px-6 h-11 bg-white text-brand-bg font-syne font-extrabold text-sm rounded-xl hover:bg-brand-primary transition-all shadow-xl">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/20"
          >
            <Sparkles size={14} /> The Future of Interactive Learning
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-syne font-extrabold tracking-tighter leading-[0.9] max-w-5xl mx-auto"
          >
            Elevate Your <span className="text-brand-primary">Classroom</span> Experience.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            A professional quiz platform optimized for high-impact presentations and collaborative learning. Powered by advanced AI.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button className="w-full sm:w-auto px-10 h-16 bg-brand-primary text-brand-bg font-syne font-extrabold text-lg rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2">
              Start Presenting <Presentation size={20} />
            </button>
            <button className="w-full sm:w-auto px-10 h-16 bg-surface border border-border text-white font-syne font-extrabold text-lg rounded-2xl hover:bg-surface-light transition-all flex items-center justify-center gap-2">
              Watch Demo <Play size={20} fill="currentColor" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Interactive Classroom Preview */}
      <section id="classroom" className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold">Interactive Classroom</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Experience the live whiteboard and collaborative tools designed for modern educators.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
            {/* Whiteboard Area */}
            <div className="lg:col-span-2 h-full">
              <Whiteboard />
            </div>

            {/* Side Panel / Controls */}
            <div className="space-y-6 flex flex-col h-full">
              <div className="bg-surface border border-border rounded-2xl p-6 flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-syne font-bold text-xl">Session Controls</h3>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Active Participants", value: "128", icon: Users },
                    { label: "Average Score", value: "74%", icon: Zap },
                    { label: "Time Remaining", value: "12:45", icon: Globe }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 text-text-secondary">
                        <stat.icon size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="font-mono font-bold text-brand-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-3">
                  <button className="w-full h-12 bg-brand-primary text-brand-bg font-bold rounded-xl flex items-center justify-center gap-2">
                    Pause Session
                  </button>
                  <button className="w-full h-12 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    Reveal Answers
                  </button>
                </div>
              </div>

              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6">
                <p className="text-sm text-brand-primary font-medium leading-relaxed">
                  "The live whiteboard allows me to explain complex concepts in real-time while students follow along on their own devices."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary rounded-full" />
                  <div>
                    <div className="text-xs font-bold">Prof. Sarah Mitchell</div>
                    <div className="text-[10px] text-brand-primary/60 uppercase font-bold">Stanford University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-syne font-extrabold leading-tight">Built for <br /><span className="text-brand-primary">Performance.</span></h2>
              <p className="text-text-secondary text-xl max-w-xl">Every feature is meticulously crafted to provide a seamless, professional experience.</p>
            </div>
            <div className="flex gap-2">
              {features.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={clsx(
                    "w-12 h-1.5 rounded-full transition-all",
                    activeFeature === i ? "bg-brand-primary w-24" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  onMouseEnter={() => setActiveFeature(i)}
                  className={clsx(
                    "p-8 rounded-3xl border transition-all cursor-pointer group",
                    activeFeature === i ? "bg-surface border-brand-primary/30 shadow-2xl" : "border-transparent opacity-40 hover:opacity-100"
                  )}
                >
                  <div className="flex gap-6">
                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", activeFeature === i ? "bg-brand-primary text-brand-bg" : "bg-white/5 text-white/40")}>
                      <feature.icon size={28} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-syne font-extrabold">{feature.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                      <div className={clsx("flex items-center gap-2 text-sm font-bold transition-all", activeFeature === i ? "text-brand-primary opacity-100" : "opacity-0")}>
                        Learn more <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative aspect-square">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full max-w-md">
                    {features[activeFeature].demo}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demonstrations / Bento Grid */}
      <section id="demo" className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold">Visual Demonstrations</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Explore the versatility of QUIZ.AI across different devices and environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className="md:col-span-2 md:row-span-2 bg-surface border border-border rounded-[32px] p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Monitor size={24} />
                </div>
                <h3 className="text-3xl font-syne font-extrabold">Desktop Presentation Mode</h3>
                <p className="text-text-secondary max-w-md">Full-screen experience optimized for projectors and large displays. High-contrast visuals ensure readability from the back of the room.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-white/5 border-t border-l border-white/10 rounded-tl-3xl translate-y-10 translate-x-10 group-hover:translate-y-4 group-hover:translate-x-4 transition-transform duration-500" />
            </div>

            <div className="bg-violet-600 rounded-[32px] p-8 flex flex-col justify-between text-white group overflow-hidden relative">
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-syne font-extrabold">Mobile Companion</h3>
                <p className="text-white/70 text-sm">Control your presentation from your phone. View speaker notes and manage participants on the go.</p>
              </div>
              <Smartphone className="self-end opacity-20 group-hover:scale-110 transition-transform duration-500" size={80} />
            </div>

            <div className="bg-surface border border-border rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-syne font-extrabold">Global Reach</h3>
                <p className="text-text-secondary text-sm">Multi-language support and low-latency servers worldwide ensure a smooth experience for everyone.</p>
              </div>
              <Globe className="self-end text-brand-primary/20 group-hover:rotate-12 transition-transform duration-500" size={80} />
            </div>

            <div className="md:col-span-3 bg-brand-primary rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="space-y-4 text-brand-bg">
                <h3 className="text-4xl font-syne font-extrabold">Ready to transform your classroom?</h3>
                <p className="text-brand-bg/70 text-lg max-w-xl">Join thousands of educators who are already using QUIZ.AI to create more engaging learning experiences.</p>
              </div>
              <button className="px-10 h-16 bg-brand-bg text-brand-primary font-syne font-extrabold text-lg rounded-2xl hover:scale-105 transition-all shadow-2xl shrink-0">
                Get Started for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Zap className="text-brand-bg" size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-syne font-extrabold">QUIZ.AI</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Empowering educators and students with AI-driven interactive learning tools.
            </p>
          </div>
          
          {[
            { title: "Product", links: ["Features", "Classroom", "Pricing", "Updates"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] }
          ].map((col, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 font-bold">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-text-secondary hover:text-brand-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary">© 2026 QUIZ.AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "LinkedIn"].map(social => (
              <a key={social} href="#" className="text-xs text-text-secondary hover:text-white transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
