import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, Type, AlignLeft, Volume2, Check } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import clsx from 'clsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettings({ isOpen, onClose }: Props) {
  const { 
    dyslexiaMode, highContrast, fontSize, lineHeight, ttsEnabled, brailleMode,
    updateSettings 
  } = useAccessibility();

  // Close on Escape
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-title"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <Eye size={24} />
              </div>
              <div>
                <h2 id="a11y-title" className="text-xl font-bold">Accessibility Settings</h2>
                <p className="text-xs text-white/40 uppercase tracking-widest">Personalize your experience</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close settings"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Visual Aids */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                <Eye size={16} /> Visual Aids
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSettings({ dyslexiaMode: !dyslexiaMode })}
                  className={clsx(
                    "p-4 rounded-2xl border transition-all flex items-center justify-between text-left",
                    dyslexiaMode ? "bg-brand-primary/20 border-brand-primary" : "glass border-white/10 hover:border-white/30"
                  )}
                >
                  <div>
                    <div className="font-bold">Dyslexia Friendly</div>
                    <div className="text-xs text-white/40">Specialized font & spacing</div>
                  </div>
                  {dyslexiaMode && <Check className="text-brand-primary" size={20} />}
                </button>

                <button
                  onClick={() => updateSettings({ highContrast: !highContrast })}
                  className={clsx(
                    "p-4 rounded-2xl border transition-all flex items-center justify-between text-left",
                    highContrast ? "bg-brand-primary/20 border-brand-primary" : "glass border-white/10 hover:border-white/30"
                  )}
                >
                  <div>
                    <div className="font-bold">High Contrast</div>
                    <div className="text-xs text-white/40">Enhanced visibility</div>
                  </div>
                  {highContrast && <Check className="text-brand-primary" size={20} />}
                </button>
              </div>
            </section>

            {/* Typography */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                <Type size={16} /> Typography
              </h3>
              <div className="space-y-8">
                {/* Font Size */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Font Size</span>
                    <span className="font-bold uppercase text-brand-primary">{fontSize}</span>
                  </div>
                  <div className="flex gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSettings({ fontSize: size })}
                        className={clsx(
                          "flex-1 py-3 rounded-xl border font-bold transition-all",
                          fontSize === size ? "bg-brand-primary text-black border-brand-primary" : "glass border-white/10 hover:bg-white/5"
                        )}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Text Spacing (Line Height)</span>
                    <span className="font-bold text-brand-primary">{lineHeight.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range"
                    min="1.4"
                    max="2.0"
                    step="0.2"
                    value={lineHeight}
                    onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-widest">
                    <span>Compact</span>
                    <span>Spacious</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Assistance */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                <Volume2 size={16} /> Assistance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSettings({ ttsEnabled: !ttsEnabled })}
                  className={clsx(
                    "p-4 rounded-2xl border transition-all flex items-center justify-between text-left",
                    ttsEnabled ? "bg-brand-primary/20 border-brand-primary" : "glass border-white/10 hover:border-white/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className={ttsEnabled ? "text-brand-primary" : "text-white/40"} />
                    <div>
                      <div className="font-bold">Text-to-Speech</div>
                      <div className="text-xs text-white/40">Enable read aloud</div>
                    </div>
                  </div>
                  {ttsEnabled && <Check className="text-brand-primary" size={20} />}
                </button>

                <button
                  onClick={() => updateSettings({ brailleMode: !brailleMode })}
                  className={clsx(
                    "p-4 rounded-2xl border transition-all flex items-center justify-between text-left",
                    brailleMode ? "bg-brand-primary/20 border-brand-primary" : "glass border-white/10 hover:border-white/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Eye size={20} className={brailleMode ? "text-brand-primary" : "text-white/40"} />
                    <div>
                      <div className="font-bold">Braille Mode</div>
                      <div className="text-xs text-white/40">Show Braille text</div>
                    </div>
                  </div>
                  {brailleMode && <Check className="text-brand-primary" size={20} />}
                </button>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-brand-primary text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
