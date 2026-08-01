import React from 'react'

import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'

import { calculateDaysFromCreation } from '../../../utils'
import styles from './InboxItem.module.scss'

interface Sender {
  firstName: string
  lastName: string
}

interface Message {
  content: string
  createdAt: string
  sender: Sender
  id: string
  acknowledged: boolean
  isRead: boolean
}

interface InboxItemProps {
  message: Message
  isExpanded: boolean
  onToggleExpand: () => void
  onAcknowledge: () => void
  onReject: () => void
  truncateLimit: number
  displayMessage: string
}

export const InboxItem: React.FC<InboxItemProps> = ({
  message,
  isExpanded,
  onToggleExpand,
  onAcknowledge,
  onReject,
  truncateLimit,
  displayMessage,
}) => {
  const { content, sender, createdAt, acknowledged, isRead } = message

  const messageStatus = isRead
    ? acknowledged
      ? 'Acknowledged'
      : 'Rejected'
    : null

  return (
    <div className={styles.card}>
      <div className={styles.timestamp}>
        {calculateDaysFromCreation(createdAt)} days ago
      </div>
      <div className={styles.body}>
        <div className={styles.sender}>
          {sender.firstName} {sender.lastName}
        </div>

        {isExpanded ? (
          <RichTextDisplay content={content} className={styles.content} />
        ) : (
          <p className={styles.content}>{displayMessage}</p>
        )}

        {content.length > truncateLimit && (
          <button
            type="button"
            onClick={onToggleExpand}
            className={styles.readMore}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}

        {isRead && (
          <p
            className={`${styles.status} ${
              acknowledged ? styles.acknowledged : styles.rejected
            }`}>
            {messageStatus}
          </p>
        )}
      </div>

      {!isRead && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.rejectButton}
            onClick={onReject}>
            Reject
          </button>
          <button
            type="button"
            className={styles.acknowledgeButton}
            onClick={onAcknowledge}>
            Acknowledge
          </button>
        </div>
      )}
    </div>
  )
}
