import React from 'react'

import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { formatTimeAgo } from '@/utils'

import styles from './MessageBubble.module.scss'

export interface MessageBubbleData {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender?: { firstName: string; lastName: string; userRole?: string }
}

interface MessageBubbleProps {
  message: MessageBubbleData
}

const isRecruiterSide = (message: MessageBubbleData) =>
  message.sender?.userRole === 'recruiter' ||
  message.sender?.userRole === 'admin'

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const alignRight = isRecruiterSide(message)

  return (
    <div
      className={`${styles.row} ${alignRight ? styles.own : styles.received}`}>
      <div className={styles.bubble}>
        <RichTextDisplay content={message.content} className={styles.content} />
        {message.createdAt ? (
          <span className={styles.timestamp}>
            {formatTimeAgo(message.createdAt)}
          </span>
        ) : null}
      </div>
    </div>
  )
}
