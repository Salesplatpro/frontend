import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { useMessages } from './useMessages'
import { useSendMessage } from './useSendMessage'

// Combines the thread read/send hooks for a single application's chat — the
// recruiter-side "one conversation" view (`Messaging.tsx`).
export const useMessaging = (applicationId?: string, recipientId?: string) => {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const { messages, isLoading } = useMessages(applicationId)
  const { send, isSending } = useSendMessage(applicationId ?? '')

  const sendMessage = async (content: string) => {
    if (!recipientId) return
    await send({ content, recipient: recipientId })
  }

  return { messages, isLoading, sendMessage, isSending, currentUserId }
}
