import useSWR from 'swr'

import {
  chatSessionsKey,
  fetchChatSessions,
} from '../services/messagingService'

export const useChatSessions = () => {
  const { data, error, isLoading } = useSWR(chatSessionsKey, fetchChatSessions)

  return { sessions: data?.data.sessions ?? [], error, isLoading }
}
