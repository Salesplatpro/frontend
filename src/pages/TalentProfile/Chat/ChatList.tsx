import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

import Loading from '../../../components/Loading/Loading'
import {
  useGetMessagesQuery,
  usePatchMessageMutation,
} from '../../../redux/api/talent'
import { truncateText } from '../../../utils/truncateTexts'
import { ChatItem } from './ChatItem'
import ChatModal from './ChatModal'

interface Sender {
  firstName: string
  lastName: string
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

const ChatList = () => {
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

      // Update the local state after the PATCH request
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

  // Open the modal for acknowledgment
  const handleAcknowledge = (messageId: string) => {
    setModalAction('acknowledge')
    setSelectedMessageId(messageId)
    setIsModalOpen(true)
  }

  // Open the modal for rejection
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

  return (
    <div className="md:w-[90%] my-12 md:mx-auto mx-8 space-y-7">
      <h2 className="text-2xl font-semibold font-raleway text-black">Chat</h2>
      {allMessages.map((message, index) => (
        <ChatItem
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

      {isModalOpen && (
        <ChatModal
          onClose={closeModal}
          onConfirm={handleConfirmAction}
          actionType={modalAction}
        />
      )}
    </div>
  )
}

export default ChatList
