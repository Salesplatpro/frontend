import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { messagesKey, sendMessage } from '../services/messagingService'

interface SendMessageArgs {
  content: string
  recipient: string
}

// Mutates the same key `useMessages` reads for this application, so the thread
// refreshes automatically after sending — replacing the missing-cache-tag gap
// the old RTK Query endpoints had.
export const useSendMessage = (applicationId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    messagesKey(applicationId),
    async (_key, { arg }: { arg: SendMessageArgs }) => {
      const result = await sendMessage({ ...arg, application: applicationId })
      notify('success', 'Message sent successfully', { autoClose: 2000 })
      return result
    },
  )

  return { send: trigger, isSending: isMutating }
}
