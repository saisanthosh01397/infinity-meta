import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Trash2, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import clsx from 'clsx';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are a helpful study assistant for students. Answer questions clearly and at an appropriate educational level.",
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, there was an error connecting to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-primary text-black rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Bot size={28} />
      </button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] z-[60] glass border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">AI Study Assistant</h3>
                  <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setMessages([])}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-500 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Bot size={48} />
                  <p className="text-sm max-w-[200px]">
                    Hello! I'm your AI study assistant. Ask me anything about your subjects!
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={clsx(
                    "flex gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    msg.role === 'user' ? "bg-brand-secondary text-white" : "bg-brand-primary text-black"
                  )}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className={clsx(
                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-brand-secondary/20 rounded-tr-none" : "bg-white/5 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary text-black flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-brand-primary transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
