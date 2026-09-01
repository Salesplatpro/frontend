import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { loginRequest } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import { LoginFormValues, LoginRequest } from '../types'

export const useLogin = () => {
  const setSubmitting = useAuthStore((state) => state.setSubmitting)
  const setError = useAuthStore((state) => state.setError)
  const setSession = useAuthStore((state) => state.setSession)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const { trigger, isMutating } = useSWRMutation(
    AUTH_ENDPOINTS.LOGIN,
    (_key, { arg }: { arg: LoginRequest }) => loginRequest(arg),
  )

  const submitLogin = async (values: LoginFormValues) => {
    const { remember, ...credentials } = values
    setError(null)
    setSubmitting(true)
    try {
      const { data } = await trigger(credentials)
      setSession(data.data, { persist: remember })
      notify('success', 'Logged in successfully', { autoClose: 2000 })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'An error occurred while logging in')
      setError(message)
      notify('error', message, { autoClose: 2000 })
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  return { submitLogin, isLoading: isSubmitting || isMutating }
}
