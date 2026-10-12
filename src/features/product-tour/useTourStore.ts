import { create } from 'zustand'

import { TourRole } from './tourSteps'

interface TourState {
  /** A replay the user asked for: the whole-app overview, or just the current page. */
  active: { role: TourRole; scope?: 'page' } | null
  /** Stages the user paused this session; cleared by the reload on logout. */
  paused: string[]
  start: (role: TourRole, scope?: 'page') => void
  stop: () => void
  pause: (key: string) => void
}

export const useTourStore = create<TourState>()((set) => ({
  active: null,
  paused: [],
  start: (role, scope) => set({ active: { role, scope } }),
  stop: () => set({ active: null }),
  pause: (key) =>
    set((state) =>
      state.paused.includes(key) ? state : { paused: [...state.paused, key] },
    ),
}))
