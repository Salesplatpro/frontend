import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  createOrganization,
  MY_ORGANIZATIONS_ENDPOINT,
} from '../services/organizationService'
import { CreateOrganizationPayload } from '../types'
import { useMyOrganizations } from './useMyOrganizations'

export const useCreateOrganization = () => {
  const { mutate: mutateProfile } = useProfile()
  const { mutate: mutateOrganizations } = useMyOrganizations()

  const { trigger, isMutating } = useSWRMutation(
    MY_ORGANIZATIONS_ENDPOINT,
    (_key, { arg }: { arg: CreateOrganizationPayload }) =>
      createOrganization(arg),
  )

  const create = async (payload: CreateOrganizationPayload) => {
    try {
      const response = await trigger(payload)
      await Promise.all([mutateOrganizations(), mutateProfile()])
      notify('success', 'Company created — you are now working on it', {
        autoClose: 2000,
      })
      return response.data.organization
    } catch (error) {
      notify('error', getErrorMessage(error, 'Failed to create company'))
      return null
    }
  }

  return { createOrganization: create, isCreating: isMutating }
}
