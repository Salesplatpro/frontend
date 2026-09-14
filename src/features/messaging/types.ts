export interface MessageSender {
  id?: string
  firstName: string
  lastName: string
  userRole?: string
}

export interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  recipientId: string
  applicationId: string | null
  acknowledged: boolean | null
  isRead: boolean
  sender?: MessageSender
}

export interface ChatSessionThread {
  applicationId: string
  talentId: string
  talentName: string
  lastMessagePreview?: string
  lastMessageAt: string
  unreadCount: number
}

export interface ChatSessionGroup {
  jobId: string
  jobTitle: string
  threads: ChatSessionThread[]
}

export interface TalentChatSession {
  applicationId: string
  recruiterId: string
  recruiterName: string
  companyName: string
  jobTitle: string
  lastMessagePreview: string
  lastMessageAt: string
  unreadCount: number
}
