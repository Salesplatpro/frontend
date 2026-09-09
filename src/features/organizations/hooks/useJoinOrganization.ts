import { useState } from 'react'

import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { requestJoinOrganization } from '../services/organizationService'
import { JoinOrganizationRequestPayload } from '../types'

export const useJoinOrganization = () => {
  const [isRequesting, setIsRequesting] = useState(false)

  const requestJoin = async (
    organizationId: string,
    payload: JoinOrganizationRequestPayload,
  ) => {
    setIsRequesting(true)
    try {
      const res = await requestJoinOrganization(organizationId, payload)
      notify(
        'success',
        res.message ||
          'Join request submitted. The company owner will review your request.',
      )
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to submit join request'))
      return false
    } finally {
      setIsRequesting(false)
    }
  }

  return { requestJoin, isRequesting }
}
