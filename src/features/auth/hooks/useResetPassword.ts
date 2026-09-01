import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  resetPasswordRequest,
  validateResetTokenRequest,
} from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import { ResetPasswordRequest, ValidateResetTokenRequest } from '../types'

export const useResetPassword = () => {
  const setSession = useAuthStore((state) => state.setSession)

  const validateToken = useSWRMutation(
    AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN,
    (_key, { arg }: { arg: ValidateResetTokenRequest }) =>
      validateResetTokenRequest(arg),
  )

  const resetPassword = useSWRMutation(
    AUTH_ENDPOINTS.RESET_PASSWORD,
    (_key, { arg }: { arg: ResetPasswordRequest }) => resetPasswordRequest(arg),
  )

  const submitValidateToken = async (token: string) => {
    const { data } = await validateToken.trigger({ token })
    return data
  }

  const submitResetPassword = async (payload: ResetPasswordRequest) => {
    try {
      const { data } = await resetPassword.trigger(payload)
      if (!data.data?.user || !data.data.token) {
        throw new Error('Password reset succeeded but no session was returned.')
      }
      setSession(data.data, { persist: true })
      notify('success', 'Password reset successfully', { autoClose: 2000 })
      return data
    } catch (err) {
      throw new Error(
        getErrorMessage(err, 'Failed to update password. Please try again.'),
      )
    }
  }

  return {
    submitValidateToken,
    submitResetPassword,
    isValidating: validateToken.isMutating,
    isResetting: resetPassword.isMutating,
  }
}
