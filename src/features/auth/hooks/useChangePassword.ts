import useSWRMutation from 'swr/mutation'

import { AUTH_ENDPOINTS } from '@/services/api/endpoints'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { changePasswordRequest } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import { ChangePasswordRequest } from '../types'

export const useChangePassword = () => {
  const setSession = useAuthStore((state) => state.setSession)

  const changePassword = useSWRMutation(
    AUTH_ENDPOINTS.CHANGE_PASSWORD,
    (_key, { arg }: { arg: ChangePasswordRequest }) =>
      changePasswordRequest(arg),
  )

  const submitChangePassword = async (payload: ChangePasswordRequest) => {
    try {
      const { data } = await changePassword.trigger(payload)
      if (!data.data?.user || !data.data.token) {
        throw new Error(
          'Password changed but no session was returned. Please log in again.',
        )
      }
      setSession(data.data)
      notify('success', 'Password changed successfully', { autoClose: 2000 })
      return data
    } catch (err) {
      throw new Error(
        getErrorMessage(err, 'Failed to change password. Please try again.'),
      )
    }
  }

  return {
    submitChangePassword,
    isChanging: changePassword.isMutating,
  }
}
