import 'react-responsive-modal/styles.css'

import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Modal from 'react-responsive-modal'
import { useOutletContext } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useAcknowledgeMessage } from '@/features/messaging/hooks/useAcknowledgeMessage'
import { useTalentMessages } from '@/features/messaging/hooks/useTalentMessages'

import { stripHtml, truncateText } from '../../../utils/truncateTexts'
import { InboxItem } from './InboxItem'
import styles from './InboxList.module.scss'

interface TalentSidebarContext {
  setUnreadCount: (count: number) => void
}

const truncateLimit = 120

const InboxList: React.FC = () => {
  const { setUnreadCount } = useOutletContext<TalentSidebarContext>()
  const { messages, isLoading, mutate } = useTalentMessages()
  const { acknowledge } = useAcknowledgeMessage()

  const [expandedMessages, setExpandedMessages] = useState<boolean[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<'acknowledge' | 'reject'>(
    'acknowledge',
  )
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  )

  const unreadCount = messages.filter((message) => !message.isRead).length

  useEffect(() => {
    setUnreadCount?.(unreadCount)
  }, [unreadCount, setUnreadCount])

  useEffect(() => {
    setExpandedMessages(new Array(messages.length).fill(false))
  }, [messages.length])

  const toggleReadMore = (index: number) => {
    setExpandedMessages((prevState) =>
      prevState.map((expanded, i) => (i === index ? !expanded : expanded)),
    )
  }

  const handleConfirmAction = async () => {
    if (!selectedMessageId) return

    try {
      await acknowledge({
        messageId: selectedMessageId,
        acknowledge: modalAction === 'acknowledge',
      })
      await mutate()
      setIsModalOpen(false)
    } catch (error) {
      console.error(`Failed to ${modalAction} the message:`, error)
    }
  }

  const handleAcknowledge = (messageId: string) => {
    setModalAction('acknowledge')
    setSelectedMessageId(messageId)
    setIsModalOpen(true)
  }

  const handleReject = (messageId: string) => {
    setModalAction('reject')
    setSelectedMessageId(messageId)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  if (isLoading) return <Spinner fullPage />
  if (messages.length === 0) {
    return (
      <Alert severity="info">You do not have any message at the moment</Alert>
    )
  }

  const modalTitle =
    modalAction === 'acknowledge' ? 'Acknowledge Message' : 'Reject Message'
  const modalMessage =
    modalAction === 'acknowledge'
      ? 'By acknowledging this message, you agree to take actions as stated.'
      : 'Are you sure you want to reject this message? This action cannot be undone.'

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Inbox</h2>
      {messages.map((message, index) => (
        <InboxItem
          key={message.id}
          message={{
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            acknowledged: message.acknowledged ?? false,
            isRead: message.isRead,
            sender: message.sender ?? { firstName: '', lastName: '' },
          }}
          isExpanded={expandedMessages[index] ?? false}
          onToggleExpand={() => toggleReadMore(index)}
          onAcknowledge={() => handleAcknowledge(message.id)}
          onReject={() => handleReject(message.id)}
          truncateLimit={truncateLimit}
          displayMessage={
            expandedMessages[index]
              ? message.content
              : truncateText(stripHtml(message.content), truncateLimit, false)
          }
        />
      ))}

      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{modalTitle}</h2>
          <p className={styles.modalMessage}>{modalMessage}</p>

          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirmAction}>
            {modalAction === 'acknowledge' ? 'Acknowledge' : 'Reject'}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default InboxList
