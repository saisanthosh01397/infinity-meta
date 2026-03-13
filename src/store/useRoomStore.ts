import { create } from 'zustand';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  attachment?: string;
}

interface RoomState {
  rooms: any[];
  messages: Record<string, Message[]>;
  notes: Record<string, string>;
  whiteboardData: Record<string, string>;
  participants: Record<string, string[]>;
  
  addRoom: (room: any) => void;
  addMessage: (roomId: string, message: Message) => void;
  updateNotes: (roomId: string, content: string) => void;
  updateWhiteboard: (roomId: string, dataUrl: string) => void;
  joinRoom: (roomId: string, username: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [
    { id: 'math-101', name: 'Advanced Calculus', subject: 'Mathematics', members: 12, online: true },
    { id: 'physics-lab', name: 'Quantum Mechanics', subject: 'Physics', members: 8, online: true },
    { id: 'history-hub', name: 'World War II', subject: 'History', members: 15, online: false },
    { id: 'code-camp', name: 'React & Node.js', subject: 'Programming', members: 24, online: true },
  ],
  messages: {},
  notes: {},
  whiteboardData: {},
  participants: {},

  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  
  addMessage: (roomId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: [...(state.messages[roomId] || []), message]
    }
  })),

  updateNotes: (roomId, content) => set((state) => ({
    notes: { ...state.notes, [roomId]: content }
  })),

  updateWhiteboard: (roomId, dataUrl) => set((state) => ({
    whiteboardData: { ...state.whiteboardData, [roomId]: dataUrl }
  })),

  joinRoom: (roomId, username) => set((state) => {
    const currentParticipants = state.participants[roomId] || [];
    if (currentParticipants.includes(username)) return state;
    return {
      participants: {
        ...state.participants,
        [roomId]: [...currentParticipants, username]
      }
    };
  }),
}));
