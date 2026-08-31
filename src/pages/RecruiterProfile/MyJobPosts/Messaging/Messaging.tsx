import React, { useState } from 'react'

import RichTextEditor from '@/components/forms/RichTextEditor'
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

const isContentEmpty = (html: string) => !html.replace(/<[^>]*>/g, '').trim()

export const Messaging = ({ applicationId, talentId }: MessagingProps) => {
  const [content, setContent] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const { messages, isLoading, sendMessage, isSending, currentUserId } =
    useMessaging(applicationId, talentId)
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()

  const busy = isSending || isBroadcasting

  const handleSendMessage = async () => {
    if (busy) return
    if (isContentEmpty(content)) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    try {
      await sendMessage(content)
      setContent('')
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  const handleBroadcast = async () => {
    if (busy) return
    if (isContentEmpty(content) || !applicationId) {
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
        {isLoading ? (
          <Spinner />
        ) : (
          <DisplayMessage messages={messages} currentUserId={currentUserId} />
        )}
      </div>

      {composerOpen ? (
        <div className={styles.composer}>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write a message to this talent…"
            size="compact"
          />
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="wide"
              onClick={() => setComposerOpen(false)}
              disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="wide"
              onClick={handleBroadcast}
              loading={isBroadcasting}
              disabled={isSending}>
              Broadcast
            </Button>
            <Button
              variant="primary"
              size="wide"
              onClick={handleSendMessage}
              loading={isSending}
              disabled={isBroadcasting}>
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.toggleRow}>
          <Button
            variant="primary"
            size="wide"
            onClick={() => setComposerOpen(true)}>
            Send talent a message
          </Button>
        </div>
      )}
    </div>
  )
}
