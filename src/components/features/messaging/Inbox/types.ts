export type InboxConversation = {
  applicationId: string
  counterpartId: string
  title: string
  subtitle: string
  lastMessageAt: string
  lastMessagePreview?: string
  unreadCount: number
}

export type InboxSection = {
  id: string
  heading?: string
  conversations: InboxConversation[]
}
