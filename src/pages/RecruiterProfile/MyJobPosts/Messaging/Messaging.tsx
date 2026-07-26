import React, { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { useMessaging } from '@/features/messaging/hooks/useMessaging'
import { notify } from '@/utils/toastNotifications'

import { DisplayMessage } from './DisplayMessage'
import styles from './Messaging.module.scss'

interface MessagingProps {
  applicationId?: string
  talentId?: string
}

export const Messaging = ({ applicationId, talentId }: MessagingProps) => {
  const [content, setContent] = useState('')
  const { messages, isLoading, sendMessage, isSending, currentUserId } =
    useMessaging(applicationId, talentId)
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()

  const handleSendMessage = async () => {
    if (!content.trim()) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    try {
      await sendMessage(content)
      setContent('')
      notify('success', 'Message sent successfully', { autoClose: 2000 })
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  const handleBroadcast = async () => {
    if (!content.trim() || !applicationId) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    if (!window.confirm('Send this message to every applicant on this job?'))
      return

    try {
      await sendBroadcast({ application: applicationId, content })
      setContent('')
      notify('success', 'Message sent to every applicant', { autoClose: 2000 })
    } catch {
      notify('error', 'Failed to broadcast message', { autoClose: 2000 })
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.heading}>Messages</div>
        {isLoading ? (
          <Spinner />
        ) : (
          <DisplayMessage messages={messages} currentUserId={currentUserId} />
        )}
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Type here..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="wide"
          onClick={handleSendMessage}
          disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </Button>
        <Button
          variant="outline"
          size="wide"
          onClick={handleBroadcast}
          disabled={isBroadcasting}>
          {isBroadcasting ? 'Broadcasting...' : 'Broadcast'}
        </Button>
      </div>
    </div>
  )
}
