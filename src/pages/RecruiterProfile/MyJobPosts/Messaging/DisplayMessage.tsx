import React, { useMemo } from 'react'

import { MessageBubble, MessageBubbleData } from '@/components/ui/MessageBubble'

import styles from './Messaging.module.scss'

type DisplayMessageProps = {
  messages?: MessageBubbleData[]
}

const DEFAULT_MESSAGE = 'No messages yet.'

const byCreatedAtAsc = (a: MessageBubbleData, b: MessageBubbleData) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

export const DisplayMessage = ({ messages }: DisplayMessageProps) => {
  const ordered = useMemo(
    () => [...(messages ?? [])].sort(byCreatedAtAsc),
    [messages],
  )
  const hasMessages = ordered.length > 0

  return hasMessages ? (
    <div className={styles.messageList}>
      {ordered.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  ) : (
    <div className={styles.emptyMessages}>
      <div>{DEFAULT_MESSAGE}</div>
    </div>
  )
}
