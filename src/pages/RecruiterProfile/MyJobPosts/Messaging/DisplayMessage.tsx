import React from 'react'

import { MessageBubble, MessageBubbleData } from '@/components/ui/MessageBubble'

import styles from './Messaging.module.scss'

type DisplayMessageProps = {
  messages?: MessageBubbleData[]
  currentUserId?: string
}

const DEFAULT_MESSAGE = 'No messages yet.'

export const DisplayMessage = ({
  messages,
  currentUserId,
}: DisplayMessageProps) => {
  const hasMessages = messages && messages.length > 0

  return hasMessages ? (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  ) : (
    <div className={styles.emptyMessages}>
      <div>{DEFAULT_MESSAGE}</div>
    </div>
  )
}
