import useSWRMutation from 'swr/mutation'

import {
  ApplicationDecision,
  bulkUpdateApplicationStatus,
} from '../services/applicationService'

interface BulkUpdateArgs {
  applicationIds: string[]
  status: ApplicationDecision
}

export const useBulkUpdateApplicationStatus = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/applications/status',
    async (_key, { arg }: { arg: BulkUpdateArgs }) =>
      bulkUpdateApplicationStatus(arg.applicationIds, arg.status),
  )

  return { bulkUpdateStatus: trigger, isBulkUpdating: isMutating }
}
