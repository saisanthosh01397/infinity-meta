import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Key, Type, Volume2, Save, Check } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import clsx from 'clsx';

const Settings: React.FC = () => {
  const { fontSize, setFontSize } = useAccessibility();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('quiz_gemini_api_key') || '');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('quiz_sound_enabled') !== 'false');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('quiz_gemini_api_key', apiKey);
    localStorage.setItem('quiz_sound_enabled', String(soundEnabled));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const fontSizes = [
    { id: 'normal', label: 'Normal', desc: 'Default text size' },
    { id: 'large', label: 'Large', desc: 'Easier to read' },
    { id: 'extra-large', label: 'Extra Large', desc: 'Maximum visibility' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 page-transition">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary">Settings</h1>
          <p className="text-text-secondary text-lg">Customize your experience and manage your account.</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
          <SettingsIcon className="text-text-primary" size={28} />
        </div>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <section className="bg-surface border border-border rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
              <Key size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Gemini API Key</h2>
          </div>
          <div className="space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              Your API key is stored locally on your device and is used to generate custom quiz questions. 
              Get your key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google AI Studio</a>.
            </p>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API Key"
              className="w-full h-[56px] bg-white/5 border border-border rounded-xl px-4 text-text-primary focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </section>

        {/* Font Size Section */}
        <section className="bg-surface border border-border rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-400">
              <Type size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Text Size</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id as any)}
                className={clsx(
                  "p-6 rounded-2xl border text-left transition-all",
                  fontSize === size.id ? "bg-brand-primary/10 border-brand-primary" : "bg-white/5 border-border hover:border-text-primary/20"
                )}
              >
                <div className={clsx(
                  "font-bold mb-1",
                  fontSize === size.id ? "text-brand-primary" : "text-text-primary"
                )}>
                  {size.label}
                </div>
                <div className="text-xs text-text-secondary">{size.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Sound Toggle Section */}
        <section className="bg-surface border border-border rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                <Volume2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Sound Effects</h2>
                <p className="text-xs text-text-secondary">Play soft tones when selecting answers</p>
              </div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={clsx(
                "w-14 h-8 rounded-full relative transition-all",
                soundEnabled ? "bg-brand-primary" : "bg-white/10"
              )}
            >
              <div className={clsx(
                "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                soundEnabled ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        </section>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            className={clsx(
              "w-full h-[64px] rounded-2xl font-syne font-extrabold text-xl flex items-center justify-center gap-3 transition-all",
              isSaved ? "bg-emerald-500 text-white" : "bg-brand-primary text-brand-bg hover:opacity-90"
            )}
          >
            {isSaved ? (
              <>
                <Check size={24} /> Settings Saved!
              </>
            ) : (
              <>
                <Save size={24} /> Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
