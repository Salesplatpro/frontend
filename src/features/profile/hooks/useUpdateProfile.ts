import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { patchProfile, PROFILE_ENDPOINT } from '../services/profileService'
import { ProfilePatchPayload } from '../types'
import { useProfile } from './useProfile'

export const useUpdateProfile = () => {
  const { mutate } = useProfile()

  const { trigger, isMutating } = useSWRMutation(
    PROFILE_ENDPOINT,
    (_key, { arg }: { arg: Partial<ProfilePatchPayload> }) => patchProfile(arg),
  )

  const updateProfile = async (payload: Partial<ProfilePatchPayload>) => {
    try {
      await trigger(payload)
      await mutate()
      if (payload.roleIds !== undefined) {
        // A role change is the only edit that regenerates the assessment
        // server-side, so it's the only case where the cached assessment
        // (see usePreAssessment) needs to be invalidated.
        void import('@/features/pre-assessment/store').then(
          ({ usePreAssessmentStore }) =>
            usePreAssessmentStore.getState().reset(),
        )
      }
      notify('success', 'Profile updated successfully', { autoClose: 5000 })
      return true
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update profile')
      notify('error', message, { autoClose: 5000, transition: Bounce })
      return false
    }
  }

  return { updateProfile, isUpdating: isMutating }
}
