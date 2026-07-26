import { httpClient } from '@/features/auth/services/httpClient'

import { ChatSessionGroup, Message } from '../types'

export const messagesKey = (applicationId: string) =>
  `/messages?application=${applicationId}`
export const chatSessionsKey = '/messages/sessions'
export const talentMessagesKey = '/messages'

export const fetchMessages = (applicationId: string) =>
  httpClient
    .get<{ data: { messages: Message[]; unReadCount: number } }>(
      messagesKey(applicationId),
    )
    .then((response) => response.data)

export const fetchTalentMessages = () =>
  httpClient
    .get<{ data: { messages: Message[]; unReadCount: number } }>(
      talentMessagesKey,
    )
    .then((response) => response.data)

export const sendMessage = (payload: {
  content: string
  recipient: string
  application?: string
}) => httpClient.post('/messages', payload).then((response) => response.data)

export const broadcastMessage = (payload: {
  application: string
  content: string
  talentIds?: string[]
}) =>
  httpClient
    .post('/messages/broadcast', payload)
    .then((response) => response.data)

export const acknowledgeMessage = (messageId: string, acknowledge: boolean) =>
  httpClient
    .patch(`/messages/${messageId}`, { acknowledge })
    .then((response) => response.data)

export const fetchChatSessions = () =>
  httpClient
    .get<{ data: { sessions: ChatSessionGroup[] } }>(chatSessionsKey)
    .then((response) => response.data)
