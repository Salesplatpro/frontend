import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { removeLogo as removeLogoFile } from '../services/organizationService'
import { useMyOrganizations } from './useMyOrganizations'

export const useRemoveLogo = (organizationId: string) => {
  const { mutate: mutateProfile } = useProfile()
  const { mutate: mutateOrganizations } = useMyOrganizations()

  const { trigger, isMutating } = useSWRMutation(
    `/organizations/${organizationId}/logo/remove`,
    async () => {
      try {
        await removeLogoFile(organizationId)
        await Promise.all([mutateOrganizations(), mutateProfile()])
        notify('success', 'Company logo removed', { autoClose: 2000 })
      } catch (error) {
        notify('error', getErrorMessage(error, 'Failed to remove company logo'))
        throw error
      }
    },
  )

  return { removeLogo: trigger, isRemoving: isMutating }
}
