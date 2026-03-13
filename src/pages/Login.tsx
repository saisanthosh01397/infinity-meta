import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [error, setError] = useState('');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Simple demo login
    const name = email.split('@')[0];
    login({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      avatar_initial: name.charAt(0).toUpperCase()
    });
    navigate('/home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Please fill in all fields');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }
    
    login({
      name: regName,
      email: regEmail,
      avatar_initial: regName.charAt(0).toUpperCase()
    });
    navigate('/home');
  };

  const handleDemoAccess = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    login({
      name: 'Demo User',
      email: 'demo@example.com',
      avatar_initial: 'D'
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-surface border border-border rounded-[20px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Zap className="text-brand-primary" size={32} />
          </div>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary mb-1">QUIZ.AI</h1>
          <p className="text-text-secondary text-sm">Your personal quiz companion</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary/80 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[52px] bg-white/5 border border-border rounded-xl pl-12 pr-4 text-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary/80 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[52px] bg-white/5 border border-border rounded-xl pl-12 pr-12 text-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border bg-white/5 text-brand-primary focus:ring-brand-primary" />
              <span className="text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-brand-primary hover:underline font-medium">Forgot password?</button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full h-[52px] bg-brand-primary text-brand-bg font-syne font-bold text-lg rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            Sign In
          </button>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute w-full border-t border-border"></div>
            <span className="relative bg-surface px-4 text-text-secondary text-sm">— or —</span>
          </div>

          <button 
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="w-full h-[52px] bg-transparent border border-border text-text-primary font-syne font-bold text-lg rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            Create New Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={handleDemoAccess}
            className="text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium"
          >
            Try without account →
          </button>
        </div>
      </motion.div>

      {/* Register Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[440px] bg-surface border border-border rounded-[20px] p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-syne font-extrabold text-text-primary mb-6">Create Account</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80 ml-1">Full Name</label>
                  <input 
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-[52px] bg-white/5 border border-border rounded-xl px-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80 ml-1">Email Address</label>
                  <input 
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-[52px] bg-white/5 border border-border rounded-xl px-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80 ml-1">Password</label>
                  <input 
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[52px] bg-white/5 border border-border rounded-xl px-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary/80 ml-1">Confirm Password</label>
                  <input 
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[52px] bg-white/5 border border-border rounded-xl px-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                  />
                </div>

                {regError && <p className="text-red-500 text-sm text-center">{regError}</p>}

                <div className="mt-8 space-y-4">
                  <button 
                    type="submit"
                    className="w-full h-[52px] bg-brand-primary text-brand-bg font-syne font-bold text-lg rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Create Account
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="w-full h-[52px] bg-transparent text-text-secondary font-medium rounded-xl hover:text-text-primary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
