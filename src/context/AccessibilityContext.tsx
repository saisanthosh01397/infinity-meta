import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

interface AccessibilitySettings {
  dyslexiaMode: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  lineHeight: number;
  ttsEnabled: boolean;
  brailleMode: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  dyslexiaMode: false,
  highContrast: false,
  fontSize: 'md',
  lineHeight: 1.6,
  ttsEnabled: true,
  brailleMode: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('a11y_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('a11y_settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (s: AccessibilitySettings) => {
    const html = document.documentElement;
    const body = document.body;

    // Font Size
    const fontSizes: Record<FontSize, string> = {
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
    };
    html.style.fontSize = fontSizes[s.fontSize];

    // Line Height
    html.style.setProperty('--line-height', s.lineHeight.toString());

    // Dyslexia Mode
    if (s.dyslexiaMode) {
      body.classList.add('dyslexia-mode');
    } else {
      body.classList.remove('dyslexia-mode');
    }

    // High Contrast
    if (s.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string) => {
    if (!settings.ttsEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider value={{ ...settings, updateSettings, speak, stopSpeaking, isSpeaking }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
