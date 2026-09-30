import { StateCreator } from 'zustand'

import type { TalentSearchFormValues } from '../../types'
import type { ScoutStore } from '../useScoutStore'

export type SearchSlice = {
  /** The last search that was run, so returning to the page shows it again. */
  criteria: TalentSearchFormValues | null
  page: number
  setCriteria: (criteria: TalentSearchFormValues) => void
  setSearchPage: (page: number) => void
  clearSearch: () => void
}

export const searchInitialState = {
  criteria: null as TalentSearchFormValues | null,
  page: 0,
}

export const createSearchSlice: StateCreator<
  ScoutStore,
  [],
  [],
  SearchSlice
> = (set) => ({
  ...searchInitialState,
  // A new search always starts at the first page — keeping the old offset would
  // show page 4 of a result set that may only have one page.
  setCriteria: (criteria) => set({ criteria, page: 0 }),
  setSearchPage: (page) => set({ page }),
  clearSearch: () => set({ criteria: null, page: 0 }),
})
