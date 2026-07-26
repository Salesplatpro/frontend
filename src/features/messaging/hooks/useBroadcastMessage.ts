import useSWRMutation from 'swr/mutation'

import { broadcastMessage } from '../services/messagingService'

interface BroadcastArgs {
  application: string
  content: string
  talentIds?: string[]
}

export const useBroadcastMessage = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/messages/broadcast',
    async (_key, { arg }: { arg: BroadcastArgs }) => broadcastMessage(arg),
  )

  return { sendBroadcast: trigger, isBroadcasting: isMutating }
}
