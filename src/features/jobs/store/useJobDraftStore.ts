import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { PostJobFormValues } from '@/utils/jobPostTypes'

interface JobDraftStore {
  draft: PostJobFormValues | null
  saveDraft: (values: PostJobFormValues) => void
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
