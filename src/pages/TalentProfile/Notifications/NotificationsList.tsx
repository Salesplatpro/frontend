import { Alert } from '@mui/material'
import React from 'react'

import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { PageHero } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { Spinner } from '@/components/ui/Spinner'
import { useMarkNotificationRead } from '@/features/notifications/hooks/useMarkNotificationRead'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { stripHtml } from '@/utils/truncateTexts'

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
      <PageShell>
        <PageHero
          compact
          title="Notifications"
          lead="Updates about your applications and account."
        />
        <Alert severity="info">
          You do not have any notifications at the moment
        </Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHero
        compact
        title="Notifications"
        lead="Updates about your applications and account."
      />
      <PagePanel>
        {notifications.map((notification) => {
          const titleText = stripHtml(notification.title || '')
          const messageHtml = notification.message || ''
          const messageText = stripHtml(messageHtml)
          const showBody = Boolean(messageText) && messageText !== titleText
          return (
            <button
              key={notification.id}
              type="button"
              className={`${styles.card} ${
                notification.isRead ? '' : styles.unread
              }`}
              onClick={() => handleOpen(notification.id, notification.isRead)}>
              {titleText ? <p className={styles.title}>{titleText}</p> : null}
              {showBody ? (
                <RichTextDisplay
                  content={messageHtml}
                  className={styles.message}
                />
              ) : !titleText && messageText ? (
                <p className={styles.message}>{messageText}</p>
              ) : null}
              <span className={styles.timestamp}>
                {calculateDaysFromCreation(notification.createdAt)} days ago
              </span>
            </button>
          )
        })}
      </PagePanel>
    </PageShell>
  )
}

export default NotificationsList
