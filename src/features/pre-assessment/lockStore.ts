import { create } from 'zustand'

interface AssessmentLockState {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

export const useAssessmentLockStore = create<AssessmentLockState>()((set) => ({
  isLocked: false,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}))
