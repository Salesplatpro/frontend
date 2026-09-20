import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import {
  fetchMessagesByParticipant,
  participantMessagesKey,
  sendMessage,
} from '../services/messagingService'

// Admin viewing/sending a direct conversation with one talent — not scoped
// to any job application, unlike the recruiter-side useMessaging hook.
export const useAdminTalentMessaging = (talentId: string) => {
  const { data, isLoading } = useSWR(participantMessagesKey(talentId), () =>
    fetchMessagesByParticipant(talentId),
  )

  // useSWRMutation revalidates this same key by default on success, so the
  // thread refreshes automatically — same pattern as useSendMessage.
  const { trigger, isMutating } = useSWRMutation(
    participantMessagesKey(talentId),
    async (_key, { arg }: { arg: { content: string } }) => {
      const result = await sendMessage({ ...arg, recipient: talentId })
      notify('success', 'Message sent successfully', { autoClose: 2000 })
      return result
    },
  )

  return {
    messages: data?.data.messages ?? [],
    isLoading,
    sendMessage: (content: string) => trigger({ content }),
    isSending: isMutating,
  }
}
