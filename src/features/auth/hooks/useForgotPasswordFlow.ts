import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { notify } from '@/utils/toastNotifications'

import {
  requestPasswordOtp,
  resetPasswordRequest,
} from '../services/authService'
import { ForgotPasswordRequest, ResetPasswordRequest } from '../types'

export const useForgotPasswordFlow = () => {
  const requestOtp = useSWRMutation(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    (_key, { arg }: { arg: ForgotPasswordRequest }) => requestPasswordOtp(arg),
  )

  const resetPassword = useSWRMutation(
    AUTH_ENDPOINTS.RESET_PASSWORD,
    (_key, { arg }: { arg: ResetPasswordRequest }) => resetPasswordRequest(arg),
  )

  const submitRequestOtp = async (payload: ForgotPasswordRequest) => {
    try {
      const { data } = await requestOtp.trigger(payload)
      return data
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Something went wrong.')
    }
  }

  const submitResetPassword = async (payload: ResetPasswordRequest) => {
    try {
      const { data } = await resetPassword.trigger(payload)
      notify('success', 'Password reset successfully', { autoClose: 5000 })
      return data
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          'Failed to update password. Please try again.',
      )
    }
  }

  return {
    submitRequestOtp,
    submitResetPassword,
    isRequestingOtp: requestOtp.isMutating,
    isResettingPassword: resetPassword.isMutating,
  }
}
