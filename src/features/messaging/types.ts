export interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  recipientId: string
  applicationId: string | null
  acknowledged: boolean | null
  isRead: boolean
  sender?: { firstName: string; lastName: string }
}

export interface ChatSessionThread {
  applicationId: string
  talentId: string
  talentName: string
  lastMessageAt: string
  unreadCount: number
}

export interface ChatSessionGroup {
  jobId: string
  jobTitle: string
  threads: ChatSessionThread[]
}
