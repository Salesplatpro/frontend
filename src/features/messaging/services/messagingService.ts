import { httpClient } from '@/features/auth/services/httpClient'

import { ChatSessionGroup, Message, TalentChatSession } from '../types'

export const messagesKey = (applicationId: string) =>
  `/messages?application=${applicationId}`
export const participantMessagesKey = (participantId: string) =>
  `/messages?participantId=${participantId}`
export const chatSessionsKey = '/messages/sessions'
export const talentMessagesKey = '/messages'

export const fetchMessages = (applicationId: string) =>
  httpClient
    .get<{ data: { messages: Message[]; unReadCount: number } }>(
      messagesKey(applicationId),
    )
    .then((response) => response.data)

// Reads a direct conversation by the other participant's id — used for
// admin-to-talent messaging, which isn't scoped to any job application.
export const fetchMessagesByParticipant = (participantId: string) =>
  httpClient
    .get<{ data: { messages: Message[]; unReadCount: number } }>(
      participantMessagesKey(participantId),
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

export interface BroadcastMessageResult {
  sent: number
  emailed: number
  emailFailures: { applicationId: string; error: string }[]
}

export const broadcastMessage = (payload: {
  application: string
  content?: string
  talentIds?: string[]
  /** One drafted message per recipient — takes priority over `content` when present. */
  messages?: { applicationId: string; subject?: string; content: string }[]
  /** Also email each recipient in addition to the in-app message. */
  sendEmail?: boolean
}) =>
  httpClient
    .post<{ data: BroadcastMessageResult }>('/messages/broadcast', payload)
    .then((response) => response.data.data)

export const acknowledgeMessage = (messageId: string, acknowledge: boolean) =>
  httpClient
    .patch(`/messages/${messageId}`, { acknowledge })
    .then((response) => response.data)

export const fetchChatSessions = () =>
  httpClient
    .get<{ data: { sessions: ChatSessionGroup[] } }>(chatSessionsKey)
    .then((response) => response.data)

export const fetchTalentChatSessions = () =>
  httpClient
    .get<{ data: { sessions: TalentChatSession[] } }>(chatSessionsKey)
    .then((response) => response.data)
