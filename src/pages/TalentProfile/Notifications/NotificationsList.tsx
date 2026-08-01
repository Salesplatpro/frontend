import { Alert } from '@mui/material'
import React from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { useMarkNotificationRead } from '@/features/notifications/hooks/useMarkNotificationRead'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'

import { calculateDaysFromCreation } from '../../../utils'
import styles from './NotificationsList.module.scss'

const NotificationsList: React.FC = () => {
  const { notifications, isLoading, mutate } = useNotifications()
  const { markAsRead } = useMarkNotificationRead()

  const handleOpen = async (notificationId: string, isRead: boolean) => {
    if (isRead) return
    await markAsRead(notificationId)
    await mutate()
  }

  if (isLoading) return <Spinner fullPage />
  if (notifications.length === 0) {
    return (
      <Alert severity="info">
        You do not have any notifications at the moment
      </Alert>
    )
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Notifications</h2>
      {notifications.map((notification) => (
        <button
          key={notification.id}
          type="button"
          className={`${styles.card} ${
            notification.isRead ? '' : styles.unread
          }`}
          onClick={() => handleOpen(notification.id, notification.isRead)}>
          {notification.title && (
            <p className={styles.title}>{notification.title}</p>
          )}
          <p className={styles.message}>{notification.message}</p>
          <span className={styles.timestamp}>
            {calculateDaysFromCreation(notification.createdAt)} days ago
          </span>
        </button>
      ))}
    </div>
  )
}

export default NotificationsList
