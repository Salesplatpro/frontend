import useSWR from 'swr'

import { fetchMessages, messagesKey } from '../services/messagingService'

export const useMessages = (applicationId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    applicationId ? messagesKey(applicationId) : null,
    () => fetchMessages(applicationId!),
  )

  return {
    messages: data?.data.messages ?? [],
    unReadCount: data?.data.unReadCount ?? 0,
    error,
    isLoading,
    mutate,
  }
}
