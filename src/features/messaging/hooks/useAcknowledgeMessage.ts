import useSWRMutation from 'swr/mutation'

import {
  acknowledgeMessage,
  talentMessagesKey,
} from '../services/messagingService'

export const useAcknowledgeMessage = () => {
  const { trigger, isMutating } = useSWRMutation(
    talentMessagesKey,
    async (
      _key,
      { arg }: { arg: { messageId: string; acknowledge: boolean } },
    ) => acknowledgeMessage(arg.messageId, arg.acknowledge),
  )

  return { acknowledge: trigger, isAcknowledging: isMutating }
}
