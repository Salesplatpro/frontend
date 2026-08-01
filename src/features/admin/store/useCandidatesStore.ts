import { create } from 'zustand'

import { fetchCandidates } from '../services/adminService'
import { Candidate, CandidateFilters } from '../types'

interface CandidatesState {
  candidates: Candidate[]
  isLoading: boolean
  error: string | null
  filters: CandidateFilters
  setFilters: (filters: CandidateFilters) => void
  fetchCandidates: () => Promise<void>
  reset: () => void
}

const initialFilters: CandidateFilters = { limit: 50, offset: 0 }

export const useCandidatesStore = create<CandidatesState>()((set, get) => ({
  candidates: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),
  reset: () =>
    set({
      candidates: [],
      isLoading: false,
      error: null,
      filters: initialFilters,
    }),
  fetchCandidates: async () => {
    set({ isLoading: true, error: null })
    try {
      const candidates = await fetchCandidates(get().filters)
      set({ candidates, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load candidates',
      })
    }
  },
}))
