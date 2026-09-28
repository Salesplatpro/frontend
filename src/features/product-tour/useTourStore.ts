import { create } from 'zustand'

import { TourRole } from './tourSteps'

type TourSource = 'firstRun' | 'replay'

interface TourState {
  active: { role: TourRole; source: TourSource } | null
  start: (role: TourRole, source?: TourSource) => void
  stop: () => void
}

export const useTourStore = create<TourState>()((set) => ({
  active: null,
  start: (role, source = 'replay') => set({ active: { role, source } }),
  stop: () => set({ active: null }),
}))
