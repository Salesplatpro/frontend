import useSWR from 'swr'

import {
  fetchTalentMessages,
  talentMessagesKey,
} from '../services/messagingService'

export const useTalentMessages = () => {
  const { data, error, isLoading, mutate } = useSWR(
    talentMessagesKey,
    fetchTalentMessages,
  )

  return {
    messages: data?.data.messages ?? [],
    unReadCount: data?.data.unReadCount ?? 0,
    error,
    isLoading,
    mutate,
  }
}
