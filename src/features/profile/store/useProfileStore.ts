import { create } from 'zustand'

import { ProfileUser } from '../types'

interface ProfileState {
  profile: ProfileUser | null
  setProfile: (profile: ProfileUser) => void
  patchProfile: (patch: Partial<ProfileUser>) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  patchProfile: (patch) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...patch } : state.profile,
    })),
  clearProfile: () => set({ profile: null }),
}))
