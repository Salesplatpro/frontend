import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  MY_ORGANIZATIONS_ENDPOINT,
  switchOrganization,
} from '../services/organizationService'

export const useSwitchOrganization = () => {
  const { mutate: mutateProfile } = useProfile()

  const { trigger, isMutating } = useSWRMutation(
    `${MY_ORGANIZATIONS_ENDPOINT}/switch`,
    (_key, { arg: organizationId }: { arg: string }) =>
      switchOrganization(organizationId),
  )

  const switchTo = async (organizationId: string) => {
    try {
      const response = await trigger(organizationId)
      // Loads the switched-to company's data into the profile store.
      await mutateProfile()
      notify('success', `Switched to ${response.data.organization.name}`, {
        autoClose: 2000,
      })
      return true
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to switch company'))
      return false
    }
  }

  return { switchOrganization: switchTo, isSwitching: isMutating }
}
