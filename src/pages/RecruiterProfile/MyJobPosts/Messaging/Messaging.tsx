import React, { useState } from 'react'

import RichTextEditor from '@/components/forms/RichTextEditor'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { draftApplicantMessages } from '@/features/applications/services/applicationService'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { useMessaging } from '@/features/messaging/hooks/useMessaging'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { DisplayMessage } from './DisplayMessage'
import styles from './Messaging.module.scss'

interface MessagingProps {
  applicationId?: string
  talentId?: string
  /** Enables the "Draft with AI" shortcut — omit where no job context exists. */
  jobId?: string
}

const isContentEmpty = (html: string) => !html.replace(/<[^>]*>/g, '').trim()

export const Messaging = ({
  applicationId,
  talentId,
  jobId,
}: MessagingProps) => {
  const [content, setContent] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [isDrafting, setIsDrafting] = useState(false)
  const { messages, isLoading, sendMessage, isSending } = useMessaging(
    applicationId,
    talentId,
  )
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()

  const busy = isSending || isBroadcasting

  const handleDraftWithAi = async () => {
    if (!jobId || !applicationId) return
    setIsDrafting(true)
    try {
      const [draft] = await draftApplicantMessages(jobId, [applicationId])
      if (draft?.body) {
        setContent(draft.body.replace(/\n/g, '<br />'))
      } else if (draft?.error) {
        notify('error', draft.error, { autoClose: 2500 })
      }
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to draft a message'), {
        autoClose: 2500,
      })
    } finally {
      setIsDrafting(false)
    }
  }

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
        {isLoading ? <Spinner /> : <DisplayMessage messages={messages} />}
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
            {jobId && (
              <Button
                variant="outline"
                size="wide"
                onClick={() => void handleDraftWithAi()}
                loading={isDrafting}
                disabled={busy}>
                Draft with AI
              </Button>
            )}
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
