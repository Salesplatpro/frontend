import 'react-responsive-modal/styles.css'

import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Modal from 'react-responsive-modal'
import { useOutletContext } from 'react-router-dom' // Make sure this import exists!

import Loading from '../../../components/Loading/Loading'
import {
  useGetMessagesQuery,
  usePatchMessageMutation,
} from '../../../redux/api/talent'
import { truncateText } from '../../../utils/truncateTexts'
import NotificationItem from './NotificationItem'

interface Sender {
  firstName: string
  lastName: string
}

interface TalentSidebarContext {
  setUnreadCount: (count: number) => void
}

interface Message {
  content: string
  createdAt: string
  sender: Sender
  _id: string
  acknowledged: boolean
  isRead: boolean
}

interface MessagesResponse {
  data: {
    messages: Message[]
  }
}

const NotificationList: React.FC = () => {
  const { setUnreadCount } = useOutletContext<TalentSidebarContext>()

  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = useGetMessagesQuery({}) as {
    data: MessagesResponse | undefined
    isLoading: boolean
    error: any
  }

  const [patchMessage] = usePatchMessageMutation()

  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [expandedMessages, setExpandedMessages] = useState<boolean[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalAction, setModalAction] = useState<'acknowledge' | 'reject'>(
    'acknowledge',
  )
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  )

  const unreadCount = allMessages.filter((msg) => !msg.isRead).length

  useEffect(() => {
    if (setUnreadCount) {
      setUnreadCount(unreadCount)
    }
  }, [unreadCount, setUnreadCount])

  const truncateLimit = 120

  useEffect(() => {
    if (messagesData?.data?.messages) {
      setAllMessages(messagesData.data.messages)
      setExpandedMessages(
        new Array(messagesData.data.messages.length).fill(false),
      )
    }
  }, [messagesData])

  const toggleReadMore = (index: number) => {
    setExpandedMessages((prevState) =>
      prevState.map((expanded, i) => (i === index ? !expanded : expanded)),
    )
  }

  // Handle the confirm action (Acknowledge or Reject)
  const handleConfirmAction = async () => {
    if (!selectedMessageId) return

    const isAcknowledging = modalAction === 'acknowledge'
    const body = { acknowledge: isAcknowledging }

    try {
      await patchMessage({
        messageId: selectedMessageId,
        body,
      })

      setAllMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === selectedMessageId
            ? { ...message, acknowledged: isAcknowledging, isRead: true }
            : message,
        ),
      )

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

  if (messagesLoading) return <Loading />
  if (messagesError) return <Alert severity="error">Error Fetching Data</Alert>
  if (allMessages.length === 0) {
    return (
      <Alert severity="info">You do not have any Message at the moment</Alert>
    )
  }

  const modalTitle =
    modalAction === 'acknowledge' ? 'Acknowledge Message' : 'Reject Message'
  const modalMessage =
    modalAction === 'acknowledge'
      ? 'By acknowledging this message, you agree to take actions as stated.'
      : 'Are you sure you want to reject this message? This action cannot be undone.'

  const handleClose = () => {
    closeModal()
  }

  const handleConfirm = () => {
    handleConfirmAction()
    handleClose()
  }

  return (
    <div className="md:w-[90%] my-12 md:mx-auto mx-8 space-y-7">
      <h2 className="text-2xl font-semibold font-raleway text-black">Chat</h2>
      {allMessages.map((message, index) => (
        <NotificationItem
          key={message._id}
          message={message}
          isExpanded={expandedMessages[index]}
          onToggleExpand={() => toggleReadMore(index)}
          onAcknowledge={() => handleAcknowledge(message._id)}
          onReject={() => handleReject(message._id)}
          truncateLimit={truncateLimit}
          displayMessage={truncateText(
            message.content,
            truncateLimit,
            expandedMessages[index],
          )}
        />
      ))}

      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="flex flex-col items-center justify-center rounded-lg p-6 sm:p-10 md:p-12 lg:p-14 max-w-[500px] w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-raleway text-center text-[#0D0C22]">
            {modalTitle}
          </h2>

          <p className="text-center font-raleway font-medium text-[16px] lg:text-[18px] py-2 text-[#0D0C22]">
            {modalMessage}
          </p>

          <button
            className="w-full sm:w-auto px-8 md:px-12 lg:px-16 py-2 mt-2 rounded-lg text-white font-raleway font-medium text-sm sm:text-base md:text-lg bg-[#3C6FD4] hover:bg-[#4985df] transition"
            onClick={handleConfirm}>
            {modalAction === 'acknowledge' ? 'Acknowledge' : 'Reject'}
          </button>

          <button
            className="w-full sm:w-auto px-8 py-2 mt-3 rounded-lg font-raleway font-medium text-base md:text-lg text-[#3C6FD4] hover:underline"
            onClick={handleClose}
            aria-label="Close modal">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default NotificationList
