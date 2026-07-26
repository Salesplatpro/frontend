import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import {
  ApplicationDecision,
  applicationKey,
  updateApplicationStatus,
} from '../services/applicationService'

// Mutating the same key `useApplication` reads (`applicationKey(id)`) makes SWR
// auto-revalidate that query on success, so the status/verdict shown to the
// recruiter refreshes immediately without any manual refetch wiring.
export const useUpdateApplicationStatus = (applicationId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    applicationKey(applicationId),
    async (_key, { arg }: { arg: ApplicationDecision }) => {
      const result = await updateApplicationStatus(applicationId, arg)
      notify('success', `Talent is ${arg} successfully`, { autoClose: 2000 })
      return result
    },
  )

  return { updateStatus: trigger, isUpdating: isMutating }
}
