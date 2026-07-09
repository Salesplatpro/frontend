import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { registerRecruiter, registerTalent } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import { TalentRegisterRequest, UserRole } from '../types'

export type SignupRequest = TalentRegisterRequest & {
  userType: UserRole
}

export const useSignup = () => {
  const setSubmitting = useAuthStore((state) => state.setSubmitting)
  const setError = useAuthStore((state) => state.setError)
  const setSession = useAuthStore((state) => state.setSession)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const { trigger, isMutating } = useSWRMutation(
    AUTH_ENDPOINTS.REGISTER_TALENT,
    (_key, { arg }: { arg: SignupRequest }) => {
      const { userType, ...payload } = arg
      return userType === 'recruiter'
        ? registerRecruiter(payload)
        : registerTalent(payload)
    },
  )

  const submitSignup = async (values: SignupRequest) => {
    setError(null)
    setSubmitting(true)
    try {
      const { data } = await trigger(values)
      setSession(data.data)
      notify('success', 'Signed up successfully', { autoClose: 5000 })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'An error occurred while signing up')
      setError(message)
      notify('error', message, { autoClose: 5000, transition: Bounce })
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  return { submitSignup, isLoading: isSubmitting || isMutating }
}
