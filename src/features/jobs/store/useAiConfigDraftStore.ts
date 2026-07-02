import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Stored as unknown so this file has no component imports.
// AiConfig.tsx casts the draft back to AiConfigValues after reading.
type AiConfigDraftStore = {
  drafts: Record<string, unknown>
  saveDraft: (jobId: string, values: unknown) => void
  clearDraft: (jobId: string) => void
}

export const useAiConfigDraftStore = create<AiConfigDraftStore>()(
  persist(
    (set) => ({
      drafts: {},
      saveDraft: (jobId, values) =>
        set((state) => ({ drafts: { ...state.drafts, [jobId]: values } })),
      clearDraft: (jobId) =>
        set((state) => {
          const next = { ...state.drafts }
          delete next[jobId]
          return { drafts: next }
        }),
    }),
    { name: 'ai-config-draft' },
  ),
)
