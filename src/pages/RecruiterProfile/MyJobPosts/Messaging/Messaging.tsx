import React, { useEffect, useState } from 'react'
import { Bounce, toast } from 'react-toastify'

import { OutlineButton, RecruiterButton } from '../../../../components'
import {
  useGetMessagesSentToTalentQuery,
  useSendTalentMessageMutation,
} from '../../../../redux/api/recruiter'
import { DisplayMessage } from './DisplayMessage'

interface MessagingProps {
  applicationId?: string
  talentId?: string
}

export const Messaging = ({ applicationId, talentId }: MessagingProps) => {
  const [sendMessage, setSendMessage] = useState({
    content: '',
    recipient: '',
    application: applicationId,
  })
  const { data: messages } = useGetMessagesSentToTalentQuery({ applicationId })

  const [sendTalentMessage, { isLoading: isSending }] =
    useSendTalentMessageMutation()

  useEffect(() => {
    if (talentId) {
      setSendMessage((prevState) => ({
        ...prevState,
        recipient: talentId,
      }))
    }
  }, [talentId])

  const handleSendMessage = async () => {
    if (!sendMessage.content.trim()) {
      toast.error('DisplayMessage can not be empty', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      return
    }
    try {
      await sendTalentMessage({
        data: sendMessage,
      }).unwrap()

      setSendMessage((prevState) => ({ ...prevState, content: '' }))
      toast.success('Message sent successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col justify-center gap-8">
      <div>
        <div className="text-[20px] font-medium">Messages</div>
        <DisplayMessage messages={messages?.data?.messages} />
      </div>
      <div>
        <textarea
          className="border rounded-[10px] border-gray-300 p-4 resize-none w-full sm:max-w-[803px]"
          cols={91}
          rows={5}
          placeholder="Type here..."
          value={sendMessage.content}
          onChange={(e) =>
            setSendMessage((prevState) => ({
              ...prevState,
              content: e.target.value,
            }))
          }
        />
      </div>
      <div className="w-full flex justify-between">
        <div className="w-1/3">
          <RecruiterButton
            buttonTitle={`${isSending ? 'Sending...' : 'Send'}`}
            onClick={handleSendMessage}
            disabled={isSending}
          />
        </div>
        <div className="w-1/3">
          <OutlineButton buttonTitle="Broadcast" />
        </div>
      </div>
    </div>
  )
}
