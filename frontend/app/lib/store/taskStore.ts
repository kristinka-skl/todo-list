import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

const getTodayString = () => format(new Date(), 'yyyy-MM-dd');

export interface TaskDraft {
  name: string;
  priority: number,
  date: string;
}

interface TaskDraftStore {
  draft: TaskDraft;
  setDraft: (task: TaskDraft) => void;
  clearDraft: () => void;
}

const initialDraft: TaskDraft = {
  name: '',
  priority: 1,
  date: getTodayString(),
};

export const useTaskStore = create<TaskDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (task) => set({ draft: task }),
      clearDraft: () =>
        set({
          draft: { name: '', priority: 1, date: getTodayString() },
        }),
    }),
    {
      name: 'task-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
