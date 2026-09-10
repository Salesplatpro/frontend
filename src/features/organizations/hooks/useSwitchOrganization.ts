import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import {
  MY_ORGANIZATIONS_ENDPOINT,
  switchOrganization,
} from '../services/organizationService'

const resetCompanyWorkspaceCaches = async () => {
  const [
    { store },
    { recruiterApi },
    { talentApi },
    { clearScoutUploads },
    { useJobDraftStore },
    { useJobEditDraftStore },
    { useAiConfigDraftStore },
  ] = await Promise.all([
    import('@/redux/store/store'),
    import('@/redux/api/recruiter'),
    import('@/redux/api/talent'),
    import('@/redux/features/filesSlice/fileSlice'),
    import('@/features/jobs/store/useJobDraftStore'),
    import('@/features/jobs/store/useJobEditDraftStore'),
    import('@/features/jobs/store/useAiConfigDraftStore'),
  ])

  store.dispatch(recruiterApi.util.resetApiState())
  store.dispatch(talentApi.util.resetApiState())
  store.dispatch(clearScoutUploads())
  useJobDraftStore.getState().clearDraft()
  useJobEditDraftStore.getState().clearAllDrafts()
  useAiConfigDraftStore.getState().clearAllDrafts()
}

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
      await resetCompanyWorkspaceCaches()
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
