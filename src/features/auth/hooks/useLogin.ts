import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { notify } from '@/utils/toastNotifications'

import { loginRequest } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import { LoginRequest } from '../types'

export const useLogin = () => {
  const setSubmitting = useAuthStore((state) => state.setSubmitting)
  const setError = useAuthStore((state) => state.setError)
  const setSession = useAuthStore((state) => state.setSession)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const { trigger, isMutating } = useSWRMutation(
    AUTH_ENDPOINTS.LOGIN,
    (_key, { arg }: { arg: LoginRequest }) => loginRequest(arg),
  )

  const submitLogin = async (values: LoginRequest) => {
    setError(null)
    setSubmitting(true)
    try {
      const { data } = await trigger(values)
      setSession(data.data)
      notify('success', 'Logged in successfully', { autoClose: 5000 })
      return data
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'An error occurred while logging in'
      setError(message)
      notify('error', message, { autoClose: 5000, transition: Bounce })
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  return { submitLogin, isLoading: isSubmitting || isMutating }
}
