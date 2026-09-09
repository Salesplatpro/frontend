import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  approveJoinRequest,
  fetchOrganizationJoinRequests,
  rejectJoinRequest,
} from '../services/organizationService'

const joinRequestsKey = (organizationId: string) =>
  `/organizations/${organizationId}/join-requests`

export const useOrganizationJoinRequests = (organizationId: string | null) => {
  const { mutate: mutateOrganizations } = useMyOrganizations()

  const { data, isLoading, mutate } = useSWR(
    organizationId ? joinRequestsKey(organizationId) : null,
    () =>
      organizationId
        ? fetchOrganizationJoinRequests(organizationId).then(
            (res) => res.data.joinRequests,
          )
        : null,
  )

  const { trigger: triggerApprove, isMutating: isApproving } = useSWRMutation(
    organizationId ? joinRequestsKey(organizationId) : null,
    (_key, { arg: requestId }: { arg: string }) =>
      approveJoinRequest(requestId),
  )

  const { trigger: triggerReject, isMutating: isRejecting } = useSWRMutation(
    organizationId ? joinRequestsKey(organizationId) : null,
    (_key, { arg: requestId }: { arg: string }) => rejectJoinRequest(requestId),
  )

  const approve = async (requestId: string) => {
    try {
      await triggerApprove(requestId)
      await Promise.all([mutate(), mutateOrganizations()])
      notify('success', 'Recruiter approved and added to your company')
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to approve join request'))
      return false
    }
  }

  const reject = async (requestId: string) => {
    try {
      await triggerReject(requestId)
      await mutate()
      notify('success', 'Join request rejected')
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to reject join request'))
      return false
    }
  }

  return {
    joinRequests: data ?? [],
    isLoading,
    approve,
    reject,
    isApproving,
    isRejecting,
    refresh: mutate,
  }
}
