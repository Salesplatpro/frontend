import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Stored as unknown so this file has no component imports.
// PostJob.tsx casts the draft back to PostJobFormValues after reading.
type JobDraftStore = {
  draft: unknown | null
  saveDraft: (values: unknown) => void
  clearDraft: () => void
}

export const useJobDraftStore = create<JobDraftStore>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (values) => set({ draft: values }),
      clearDraft: () => set({ draft: null }),
    }),
    { name: 'job-draft' },
  ),
)
