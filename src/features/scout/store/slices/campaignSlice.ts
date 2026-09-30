import { StateCreator } from 'zustand'

import type { ScoutCampaignFormValues } from '../../types'
import type { ScoutStore } from '../useScoutStore'

export type CampaignSlice = {
  /** In-progress new-campaign form, so a refresh or a stray back press doesn't lose it. */
  draft: ScoutCampaignFormValues | null
  saveDraft: (values: ScoutCampaignFormValues) => void
  clearDraft: () => void
}

export const campaignInitialState = {
  draft: null as ScoutCampaignFormValues | null,
}

export const createCampaignSlice: StateCreator<
  ScoutStore,
  [],
  [],
  CampaignSlice
> = (set) => ({
  ...campaignInitialState,
  saveDraft: (values) => set({ draft: values }),
  clearDraft: () => set({ draft: null }),
})
