import { StateCreator } from 'zustand'

import type { ScoutStore } from '../useScoutStore'

export type ResultsTab = 'shortlist' | 'all' | 'unreadable'

export type ResultsSlice = {
  activeTab: ResultsTab
  sortKey: string
  sortDirection: 'asc' | 'desc'
  /** Id of the CV whose details drawer is open. */
  openCvId: string | null
  setActiveTab: (tab: ResultsTab) => void
  setSort: (key: string, direction: 'asc' | 'desc') => void
  openCvDetails: (cvId: string) => void
  closeCvDetails: () => void
  resetResults: () => void
}

export const resultsInitialState = {
  activeTab: 'shortlist' as ResultsTab,
  // Rank is the AI's own ordering, so it is what a recruiter should see first.
  sortKey: 'rank',
  sortDirection: 'asc' as 'asc' | 'desc',
  openCvId: null as string | null,
}

export const createResultsSlice: StateCreator<
  ScoutStore,
  [],
  [],
  ResultsSlice
> = (set) => ({
  ...resultsInitialState,
  setActiveTab: (activeTab) => set({ activeTab }),
  setSort: (sortKey, sortDirection) => set({ sortKey, sortDirection }),
  openCvDetails: (openCvId) => set({ openCvId }),
  closeCvDetails: () => set({ openCvId: null }),
  resetResults: () => set({ ...resultsInitialState }),
})
