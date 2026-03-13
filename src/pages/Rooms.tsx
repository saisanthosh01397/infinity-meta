import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Globe, Lock, Hash } from 'lucide-react';
import { useRoomStore } from '../store/useRoomStore';

export default function Rooms({ username }: { username: string }) {
  const { rooms, addRoom } = useRoomStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', subject: 'Mathematics', description: '', privacy: 'public' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateRoom = () => {
    if (!newRoom.name) return;
    const room = {
      id: newRoom.name.toLowerCase().replace(/\s+/g, '-'),
      ...newRoom,
      members: 1,
      online: true
    };
    addRoom(room);
    setShowCreateModal(false);
    setNewRoom({ name: '', subject: 'Mathematics', description: '', privacy: 'public' });
  };

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-text-primary">Study Groups</h1>
          <p className="text-text-secondary">Join a room and start learning together.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-brand-primary text-brand-bg font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Create Room
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
        <input 
          type="text" 
          placeholder="Search rooms by name or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-brand-primary transition-colors text-text-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <motion.div 
            key={room.id}
            whileHover={{ y: -5 }}
            className="bg-surface p-6 rounded-2xl space-y-4 border border-border hover:border-brand-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <Hash size={24} />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${room.online ? 'bg-green-500 animate-pulse' : 'bg-text-primary/20'}`} />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/40">{room.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">{room.name}</h3>
              <p className="text-xs font-mono text-text-primary/40 uppercase tracking-widest">{room.subject}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users size={16} />
                <span>{room.members} members</span>
              </div>
              <Link 
                to={`/room/${room.id}`}
                className="px-4 py-2 bg-white/5 hover:bg-brand-primary hover:text-brand-bg rounded-lg text-sm font-bold transition-all text-text-primary"
              >
                Join Room
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface max-w-md w-full p-8 rounded-3xl space-y-6 relative border border-border shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-text-primary">Create New Room</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Room Name</label>
                  <input 
                    type="text" 
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    placeholder="e.g. Physics Study Group"
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-text-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Subject</label>
                  <select 
                    value={newRoom.subject}
                    onChange={(e) => setNewRoom({ ...newRoom, subject: e.target.value })}
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-text-primary"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="History">History</option>
                    <option value="Programming">Programming</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Privacy</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setNewRoom({ ...newRoom, privacy: 'public' })}
                      className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${newRoom.privacy === 'public' ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-white/5 border-border text-text-secondary'}`}
                    >
                      <Globe size={18} /> Public
                    </button>
                    <button 
                      onClick={() => setNewRoom({ ...newRoom, privacy: 'private' })}
                      className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${newRoom.privacy === 'private' ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-white/5 border-border text-text-secondary'}`}
                    >
                      <Lock size={18} /> Private
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-colors text-text-primary border border-border"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateRoom}
                  className="flex-1 py-4 bg-brand-primary text-brand-bg rounded-xl font-bold hover:scale-[1.02] transition-transform"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
