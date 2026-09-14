import useSWR from 'swr'

import {
  chatSessionsKey,
  fetchTalentChatSessions,
} from '../services/messagingService'

export const useTalentChatSessions = () => {
  const { data, error, isLoading, mutate } = useSWR(
    chatSessionsKey,
    fetchTalentChatSessions,
  )

  const sessions = data?.data.sessions ?? []
  const unreadCount = sessions.reduce(
    (sum, session) => sum + (session.unreadCount ?? 0),
    0,
  )

  return { sessions, unreadCount, error, isLoading, mutate }
}
