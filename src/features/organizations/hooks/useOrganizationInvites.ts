import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  fetchOrganizationInvites,
  revokeOrganizationInvite,
  sendOrganizationInvite,
} from '../services/organizationService'

const invitesKey = (organizationId: string) =>
  `/organizations/${organizationId}/invites`

export const useOrganizationInvites = (organizationId: string | null) => {
  const { data, isLoading, mutate } = useSWR(
    organizationId ? invitesKey(organizationId) : null,
    () =>
      organizationId
        ? fetchOrganizationInvites(organizationId).then(
            (res) => res.data.invites,
          )
        : null,
  )

  const { trigger: triggerSend, isMutating: isSending } = useSWRMutation(
    organizationId ? invitesKey(organizationId) : null,
    (_key, { arg: email }: { arg: string }) =>
      organizationId
        ? sendOrganizationInvite(organizationId, { email })
        : Promise.reject(new Error('No organization selected')),
  )

  const { trigger: triggerRevoke, isMutating: isRevoking } = useSWRMutation(
    organizationId ? invitesKey(organizationId) : null,
    (_key, { arg: inviteId }: { arg: string }) =>
      organizationId
        ? revokeOrganizationInvite(organizationId, inviteId)
        : Promise.reject(new Error('No organization selected')),
  )

  const sendInvite = async (email: string) => {
    try {
      await triggerSend(email)
      await mutate()
      notify('success', 'Invite sent by email')
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to send invite'))
      return false
    }
  }

  const revokeInvite = async (inviteId: string) => {
    try {
      await triggerRevoke(inviteId)
      await mutate()
      notify('success', 'Invite revoked')
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to revoke invite'))
      return false
    }
  }

  return {
    invites: data ?? [],
    isLoading,
    sendInvite,
    revokeInvite,
    isSending,
    isRevoking,
    refresh: mutate,
  }
}
