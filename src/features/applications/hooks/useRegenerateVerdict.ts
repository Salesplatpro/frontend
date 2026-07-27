import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import {
  applicationKey,
  regenerateVerdict,
} from '../services/applicationService'

// Mutating `applicationKey` makes SWR auto-revalidate `useApplication`/`useJobApplications`
// reads for this application, same pattern as `useUpdateApplicationStatus`.
export const useRegenerateVerdict = (applicationId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    applicationKey(applicationId),
    async () => {
      const result = await regenerateVerdict(applicationId)
      notify('success', 'AI match verdict regenerated', { autoClose: 2000 })
      return result
    },
  )

  return { regenerateVerdict: trigger, isRegenerating: isMutating }
}
