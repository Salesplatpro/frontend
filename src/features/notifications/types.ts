export interface AppNotification {
  id: string
  userId: string
  title?: string | null
  message: string
  isRead: boolean
  deleted: boolean
  createdAt: string
}
