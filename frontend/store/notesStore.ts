import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  isPublic: boolean;
  shareId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastEditedAt: string;
  tags?: any[];
  aiInsights?: any[];
}

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  isLoading: boolean;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setActiveNoteId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  activeNoteId: null,
  isLoading: true,
  setNotes: (notes) => set({ notes, isLoading: false }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n))
  })),
  removeNote: (id) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== id),
    activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
  })),
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
