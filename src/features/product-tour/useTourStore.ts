import { create } from 'zustand'

import { TourRole } from './tourSteps'

interface TourState {
  /** A replay the user asked for from the Guide. */
  active: { role: TourRole } | null
  /** Stages the user paused this session; cleared by the reload on logout. */
  paused: string[]
  start: (role: TourRole) => void
  stop: () => void
  pause: (key: string) => void
}

export const useTourStore = create<TourState>()((set) => ({
  active: null,
  paused: [],
  start: (role) => set({ active: { role } }),
  stop: () => set({ active: null }),
  pause: (key) =>
    set((state) =>
      state.paused.includes(key) ? state : { paused: [...state.paused, key] },
    ),
}))
