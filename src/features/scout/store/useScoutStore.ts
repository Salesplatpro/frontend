import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  type CampaignSlice,
  campaignInitialState,
  createCampaignSlice,
} from './slices/campaignSlice'
import {
  type ResultsSlice,
  createResultsSlice,
  resultsInitialState,
} from './slices/resultsSlice'
import {
  type SearchSlice,
  createSearchSlice,
  searchInitialState,
} from './slices/searchSlice'
import {
  type UploadSlice,
  createUploadSlice,
  uploadInitialState,
} from './slices/uploadSlice'

export type ScoutStore = UploadSlice &
  CampaignSlice &
  SearchSlice &
  ResultsSlice & {
    /** Wipes every slice — used on logout and when switching company. */
    resetScout: () => void
  }

export const scoutInitialState = {
  ...uploadInitialState,
  ...campaignInitialState,
  ...searchInitialState,
  ...resultsInitialState,
}

/**
 * All scouting and Talent Search state. Replaces the scout reducers that used to
 * live in the Redux files slice; Redux keeps only its RTK Query API slices, so the
 * run-progress screen still gets polling and cache invalidation for free.
 *
 * Only the campaign draft and the last search are persisted. `cvFiles` holds `File`
 * objects, which cannot be serialised — putting them in storage (as the Redux
 * version effectively tried to) silently loses them and trips serializability
 * checks, so the upload and results slices are deliberately in-memory only.
 */
export const useScoutStore = create<ScoutStore>()(
  persist(
    (set, get, api) => ({
      ...createUploadSlice(set, get, api),
      ...createCampaignSlice(set, get, api),
      ...createSearchSlice(set, get, api),
      ...createResultsSlice(set, get, api),
      // Merges the initial values back in rather than replacing the whole store,
      // which would also drop every action. resetUpload is delegated to so the
      // idempotency key is regenerated instead of reused.
      resetScout: () => {
        set({
          ...campaignInitialState,
          ...searchInitialState,
          ...resultsInitialState,
        })
        get().resetUpload()
      },
    }),
    {
      name: 'scout-store',
      partialize: (state) => ({
        draft: state.draft,
        criteria: state.criteria,
      }),
    },
  ),
)
