import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  deleteOrganization,
  MY_ORGANIZATIONS_ENDPOINT,
} from '../services/organizationService'
import { useMyOrganizations } from './useMyOrganizations'

export const useDeleteOrganization = () => {
  const { mutate: mutateProfile } = useProfile()
  const { mutate: mutateOrganizations } = useMyOrganizations()

  const { trigger, isMutating } = useSWRMutation(
    `${MY_ORGANIZATIONS_ENDPOINT}/delete`,
    (_key, { arg: organizationId }: { arg: string }) =>
      deleteOrganization(organizationId),
  )

  const remove = async (organizationId: string) => {
    try {
      await trigger(organizationId)
      // Deleting the active company clears activeOrganizationId server-side,
      // so the profile has to be refetched or the banner keeps showing a ghost.
      await Promise.all([mutateOrganizations(), mutateProfile()])
      notify('success', 'Company deleted', { autoClose: 2000 })
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to delete company'))
      return false
    }
  }

  return { deleteOrganization: remove, isDeleting: isMutating }
}
