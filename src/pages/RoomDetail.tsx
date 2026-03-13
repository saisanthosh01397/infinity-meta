import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Video, PenTool, Trophy, FileText, 
  Send, Paperclip, Smile, Mic, MicOff, Camera, CameraOff, 
  Monitor, PhoneOff, Download, Save, Sparkles, AlertTriangle, X, Volume2,
  Smile as SentimentPositive, Meh as SentimentNeutral, Frown as SentimentNegative
} from 'lucide-react';
import { useRoomStore } from '../store/useRoomStore';
import Whiteboard from '../components/Whiteboard';
import { summarizeDiscussion } from '../services/geminiService';
import { useAccessibility } from '../context/AccessibilityContext';
import clsx from 'clsx';

export default function RoomDetail({ username }: { username: string }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, messages, notes, addMessage, updateNotes, joinRoom, participants } = useRoomStore();
  const { speak, stopSpeaking, isSpeaking } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'whiteboard' | 'quiz' | 'notes'>('chat');
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);
  const [toxicityWarning, setToxicityWarning] = useState<string | null>(null);
  const [nudges, setNudges] = useState<string[]>([]);

  const room = rooms.find(r => r.id === id);
  const roomMessages = messages[id || ''] || [];
  const roomNotes = notes[id || ''] || '';
  const roomParticipants = participants[id || ''] || [];

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !username) {
      if (!username) navigate('/configure');
      return;
    }
    joinRoom(id, username);
    
    // Simulate connection for video call
    setTimeout(() => setIsConnected(true), 2000);

    // Simulate nudges
    const nudgeTimer = setInterval(() => {
      const otherParticipants = roomParticipants.filter(p => p !== username);
      if (otherParticipants.length > 0) {
        const randomUser = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        setNudges(prev => [...prev, randomUser]);
      }
    }, 30000);

    return () => clearInterval(nudgeTimer);
  }, [id, username, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  if (!room) return <div>Room not found</div>;

  const toxicWords = ['hate', 'stupid', 'idiot', 'dumb', 'kill'];
  const isToxic = (text: string) => toxicWords.some(word => text.toLowerCase().includes(word));

  const getSentiment = (text: string) => {
    const positive = ['great', 'thanks', 'awesome', 'good', 'love', 'happy'];
    const negative = ['confused', 'stuck', 'lost', 'bad', 'hard', 'sad'];
    const lower = text.toLowerCase();
    if (positive.some(w => lower.includes(w))) return 'positive';
    if (negative.some(w => lower.includes(w))) return 'negative';
    return 'neutral';
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !id) return;

    if (isToxic(inputText)) {
      setToxicityWarning("⚠️ Your message was flagged. Please keep the conversation respectful.");
      setTimeout(() => setToxicityWarning(null), 5000);
      return;
    }

    const message = {
      id: Date.now().toString(),
      username,
      text: inputText,
      timestamp: Date.now(),
      sentiment: getSentiment(inputText) as 'positive' | 'neutral' | 'negative'
    };

    addMessage(id, message);
    setInputText('');
  };

  const handleSummarize = async () => {
    if (roomMessages.length === 0) return;
    setIsSummarizing(true);
    try {
      const s = await summarizeDiscussion(roomMessages.slice(-20));
      setSummary(s);
      setShowSummaryDrawer(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!id) return;
    updateNotes(id, e.target.value);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'video', icon: Video, label: 'Video' },
    { id: 'whiteboard', icon: PenTool, label: 'Whiteboard' },
    { id: 'quiz', icon: Trophy, label: 'Live Quiz' },
    { id: 'notes', icon: FileText, label: 'Notes' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      {/* Header */}
      <div className="bg-surface p-4 rounded-2xl flex justify-between items-center border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-bold text-text-primary">{room.name}</h2>
            <div className="text-xs text-text-secondary uppercase tracking-widest">{room.subject}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {roomParticipants.map((p, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-brand-primary border-2 border-surface flex items-center justify-center text-[10px] font-bold text-brand-bg">
                {p.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/rooms')}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-all"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-20 lg:w-48 flex md:flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex-1 md:flex-none flex items-center gap-3 p-4 rounded-xl transition-all border",
                activeTab === tab.id 
                  ? "bg-brand-primary text-brand-bg border-brand-primary" 
                  : "bg-surface text-text-primary border-border hover:bg-white/5"
              )}
            >
              <tab.icon size={20} />
              <span className="hidden lg:inline font-bold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-surface rounded-3xl overflow-hidden flex flex-col relative border border-border shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold text-text-primary">Group Discussion</h3>
                  <button 
                    onClick={handleSummarize}
                    disabled={isSummarizing || roomMessages.length === 0}
                    className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <Sparkles size={14} /> {isSummarizing ? 'Summarizing...' : 'Summarize Discussion'}
                  </button>
                </div>

                {/* Summary Drawer */}
                <AnimatePresence>
                  {showSummaryDrawer && (
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      className="absolute top-0 right-0 bottom-0 w-80 z-20 bg-surface border-l border-border shadow-2xl flex flex-col"
                    >
                      <div className="p-4 border-b border-border flex items-center justify-between bg-brand-primary/10">
                        <div className="flex items-center gap-2 text-brand-primary">
                          <Sparkles size={18} />
                          <h4 className="font-bold text-sm uppercase tracking-widest">AI Summary</h4>
                        </div>
                        <button 
                          onClick={() => setShowSummaryDrawer(false)}
                          className="p-1 hover:bg-white/10 rounded-lg text-text-secondary"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                          {summary}
                        </p>
                      </div>
                      <div className="p-4 border-t border-border text-center">
                        <button 
                          onClick={() => setShowSummaryDrawer(false)}
                          className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {roomMessages.map((msg) => (
                    <div key={msg.id} className={clsx("flex gap-3", msg.username === username ? "flex-row-reverse" : "")}>
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-brand-primary border border-border">
                        {msg.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={clsx("max-w-[70%] space-y-1", msg.username === username ? "items-end" : "")}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-secondary">{msg.username}</span>
                          <span className="text-[10px] text-text-secondary/40">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {msg.sentiment === 'positive' && <SentimentPositive size={14} className="text-green-500" />}
                          {msg.sentiment === 'negative' && <SentimentNegative size={14} className="text-red-500" />}
                        </div>
                        <div className={clsx(
                          "p-4 rounded-2xl text-sm leading-relaxed relative group/msg",
                          msg.username === username ? "bg-brand-primary text-brand-bg rounded-tr-none" : "bg-white/5 text-text-primary rounded-tl-none border border-border"
                        )}>
                          {msg.text}
                          <button
                            onClick={() => speak(msg.text)}
                            className={clsx(
                              "absolute -right-10 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-surface border border-border opacity-0 group-hover/msg:opacity-100 transition-all",
                              msg.username === username ? "right-auto -left-10" : ""
                            )}
                            aria-label="Read message aloud"
                          >
                            <Volume2 size={14} className="text-brand-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {toxicityWarning && (
                  <div className="mx-6 mb-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertTriangle size={16} /> {toxicityWarning}
                  </div>
                )}

                <div className="p-4 border-t border-border flex gap-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-text-secondary"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-2 outline-none focus:border-brand-primary text-text-primary"
                  />
                  <button className="p-2 hover:bg-white/10 rounded-lg text-text-secondary"><Smile size={20} /></button>
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-brand-primary text-brand-bg rounded-lg hover:scale-105 transition-transform"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div 
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-6 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                  {roomParticipants.map((p, i) => (
                    <div key={i} className="aspect-video bg-surface rounded-3xl relative overflow-hidden group border border-border shadow-sm">
                      {!isConnected ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 animate-pulse">
                          <div className="text-sm font-bold uppercase tracking-widest text-white/40">Connecting...</div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                          <div className={clsx(
                            "w-20 h-20 rounded-full bg-brand-primary/20 border-2 border-brand-primary flex items-center justify-center text-2xl font-bold text-brand-primary",
                            i === 0 ? "animate-bounce" : "" // Simulate speaking
                          )}>
                            {p.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-bold text-text-primary">{p} {p === username && '(You)'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={clsx("p-4 rounded-2xl transition-all border", isMuted ? "bg-red-500 text-white border-red-500" : "bg-surface text-text-primary border-border hover:bg-white/10")}
                  >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                  <button 
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={clsx("p-4 rounded-2xl transition-all border", isCameraOff ? "bg-red-500 text-white border-red-500" : "bg-surface text-text-primary border-border hover:bg-white/10")}
                  >
                    {isCameraOff ? <CameraOff size={24} /> : <Camera size={24} />}
                  </button>
                  <button 
                    onClick={() => setIsSharing(!isSharing)}
                    className={clsx("p-4 rounded-2xl transition-all border", isSharing ? "bg-brand-primary text-brand-bg border-brand-primary" : "bg-surface text-text-primary border-border hover:bg-white/10")}
                  >
                    <Monitor size={24} />
                  </button>
                  <button className="p-4 rounded-2xl bg-red-500 text-white hover:scale-105 transition-transform border border-red-500">
                    <PhoneOff size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'whiteboard' && (
              <motion.div 
                key="whiteboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <Whiteboard roomId={id} />
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div 
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-text-primary">Shared Study Notes</h3>
                    <span className="text-xs text-text-secondary/40 flex items-center gap-1">
                      {isSaving ? 'Saving...' : <><Save size={12} /> Saved ✓</>}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => isSpeaking ? stopSpeaking() : speak(roomNotes)}
                      className={clsx(
                        "p-2 rounded-lg transition-all border",
                        isSpeaking ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-surface text-brand-primary border-border hover:bg-white/10"
                      )}
                      aria-label={isSpeaking ? "Stop reading" : "Read notes aloud"}
                    >
                      <Volume2 size={16} className={isSpeaking ? "animate-pulse" : ""} />
                    </button>
                    <button className="px-4 py-2 bg-surface border border-border hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-2 text-text-primary">
                      <Download size={14} /> Export as TXT
                    </button>
                  </div>
                </div>
                <textarea 
                  value={roomNotes}
                  onChange={handleNoteChange}
                  placeholder="Start typing your shared notes here..."
                  className="flex-1 bg-white/5 border border-border rounded-3xl p-8 outline-none focus:border-brand-primary resize-none font-mono text-sm leading-relaxed text-text-primary"
                />
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center p-12 text-center"
              >
                <div className="max-w-md space-y-6">
                  <Trophy className="mx-auto text-brand-primary" size={64} />
                  <h3 className="text-2xl font-bold text-text-primary">Live Quiz Mode</h3>
                  <p className="text-text-secondary leading-relaxed">
                    Host a live quiz for your group! Questions will appear on everyone's screen simultaneously.
                  </p>
                  <button className="w-full py-4 bg-brand-primary text-brand-bg font-bold rounded-xl hover:scale-105 transition-transform">
                    Launch New Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nudge Notifications */}
          <div className="absolute bottom-24 right-6 space-y-4 pointer-events-none">
            <AnimatePresence>
              {nudges.map((n, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="bg-surface p-4 rounded-2xl border border-brand-primary/30 pointer-events-auto flex items-center gap-4 shadow-2xl"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg font-bold">
                    {n.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-text-primary">Hey {n}, what do you think? 💬</div>
                    <button 
                      onClick={() => setNudges(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-[10px] uppercase font-bold text-brand-primary hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
