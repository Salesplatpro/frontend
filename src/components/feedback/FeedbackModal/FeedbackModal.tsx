import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { Modal } from 'react-responsive-modal'

import { Button } from '@/components/ui/Button'
import { useSubmitFeedbackMutation } from '@/redux/api/apiSlice'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import styles from './FeedbackModal.module.scss'

type FeedbackModalProps = {
  open: boolean
  onClose: () => void
}

export const FeedbackModal = ({ open, onClose }: FeedbackModalProps) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation()

  const reset = () => {
    setSubject('')
    setMessage('')
    setError(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!message.trim()) return
    setError(null)
    try {
      await submitFeedback({
        subject: subject.trim() || undefined,
        message: message.trim(),
      }).unwrap()
      notify('success', 'Thanks for the feedback!', { autoClose: 2000 })
      handleClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to submit feedback right now.'))
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      center
      classNames={{ overlay: 'dashboard-modal-overlay' }}>
      <div className={styles.container}>
        <h3 className={styles.title}>Leave us feedback</h3>

        <div className={styles.field}>
          <label htmlFor="feedback-subject" className={styles.label}>
            Subject (optional)
          </label>
          <input
            id="feedback-subject"
            type="text"
            className={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="feedback-message" className={styles.label}>
            Message
          </label>
          <textarea
            id="feedback-message"
            className={styles.textarea}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={isLoading}
            disabled={!message.trim() || isLoading}
            onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  )
}
