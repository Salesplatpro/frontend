import React from 'react'

import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'

import styles from './MessageBubble.module.scss'

export interface MessageBubbleData {
  id: string
  content: string
  createdAt: string
  senderId: string
}

interface MessageBubbleProps {
  message: MessageBubbleData
  /** The viewer's own user id — determines which side the bubble aligns to. */
  currentUserId?: string
}

const formatTimestamp = (createdAt: string) =>
  new Date(createdAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const MessageBubble = ({
  message,
  currentUserId,
}: MessageBubbleProps) => {
  const isOwnMessage =
    currentUserId != null && message.senderId === currentUserId

  return (
    <div
      className={`${styles.row} ${
        isOwnMessage ? styles.own : styles.received
      }`}>
      <div className={styles.bubble}>
        <RichTextDisplay content={message.content} className={styles.content} />
        <span className={styles.timestamp}>
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
