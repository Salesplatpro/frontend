import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import {
  applicationKey,
  regenerateVerdict,
} from '../services/applicationService'

// Mutating `applicationKey` auto-revalidates `useApplication` reads for this
// application. It does NOT cover `useJobApplications` (a different SWR key,
// `/jobs/applications/:jobId`) — callers backed by that list must pass their
// own refetch callback and invoke it after `regenerateVerdict()` resolves.
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
