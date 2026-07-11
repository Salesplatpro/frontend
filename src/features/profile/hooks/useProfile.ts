import { useEffect } from 'react'
import useSWR from 'swr'

import { fetchProfile, PROFILE_ENDPOINT } from '../services/profileService'
import { useProfileStore } from '../store/useProfileStore'

export const useProfile = () => {
  const profile = useProfileStore((state) => state.profile)
  const setProfile = useProfileStore((state) => state.setProfile)

  const { data, error, isLoading, mutate } = useSWR(
    PROFILE_ENDPOINT,
    fetchProfile,
  )

  useEffect(() => {
    if (data?.data?.user) {
      console.log('[PROFILE_DEBUG] Initial/Refetched Profile:', data.data.user)
      setProfile(data.data.user)
    }
  }, [data, setProfile])

  return { profile, isLoading, error, mutate }
}
