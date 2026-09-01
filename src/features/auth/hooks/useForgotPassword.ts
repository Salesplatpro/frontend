import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { requestPasswordReset } from '../services/authService'
import { ForgotPasswordRequest } from '../types'

export const useForgotPassword = () => {
  const requestReset = useSWRMutation(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    (_key, { arg }: { arg: ForgotPasswordRequest }) =>
      requestPasswordReset(arg),
  )

  const submitForgotPassword = async (payload: ForgotPasswordRequest) => {
    try {
      const { data } = await requestReset.trigger(payload)
      notify(
        'success',
        'Password reset email sent. Check your mailbox for the link.',
        { autoClose: 4000 },
      )
      return data
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Something went wrong.'))
    }
  }

  return {
    submitForgotPassword,
    isRequesting: requestReset.isMutating,
  }
}
