import React from 'react'
import { calculateDaysFromCreation } from '../../../utils'

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

interface ChatItemProps {
  message: Message
  isExpanded: boolean
  onToggleExpand: () => void
  onAcknowledge: () => void
  onReject: () => void
  truncateLimit: number
  displayMessage: string
}

export const ChatItem: React.FC<ChatItemProps> = ({
  message,
  isExpanded,
  onToggleExpand,
  onAcknowledge,
  onReject,
  truncateLimit,
  displayMessage,
}) => {
  const { content, sender, createdAt, acknowledged, isRead } = message

  // Determine the label to display based on the read and acknowledge status
  const messageStatus = isRead
    ? acknowledged
      ? 'Acknowledged'
      : 'Rejected'
    : null

  return (
    <div className="lg:w-[90%] lg:min-h-[180px] rounded-[16px] bg-[#F8F8F8] border border-[#D0D5DD]">
      <h1 className="px-6 py-5">
        {calculateDaysFromCreation(createdAt)} Days ago
      </h1>
      <div className="px-6 lg:flex lg:justify-start lg:items-start flex-col space-y-2">
        <h1 className="font-raleway font-semibold text-[18px] leading-[18px] text-[#0D0C22]">
          {sender.firstName} {sender.lastName}
        </h1>

        <p className="lg:w-[540px] lg:min-h-[26px] font-raleway font-normal text-[16px] leading-[24px] text-[#0D0C22]">
          {displayMessage}
        </p>

        {content.length > truncateLimit && (
          <button
            onClick={onToggleExpand}
            className="text-blue-500 font-medium">
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}

        {isRead && (
          <p
            className={`font-raleway font-semibold text-[14px] ${
              acknowledged ? 'text-green-500' : 'text-red-500'
            }`}>
            {messageStatus}
          </p>
        )}
      </div>

      {!isRead && (
        <div className="flex justify-end items-center mx-5 lg:mx-8 my-4 space-x-2">
          <button
            className="lg:w-[100px] rounded-lg flex justify-center items-center font-semibold font-raleway text-[16px] text-[#3c6fd4] hover:cursor-pointer py-3"
            onClick={onReject}>
            Reject
          </button>

          <button
            className="w-[110px] text-[14px] lg:w-[151px] h-[44px] rounded-lg bg-[#3c6fd4] flex justify-center items-center font-semibold font-raleway lg:text-[16px] text-white hover:bg-[#4b82e1] py-3"
            onClick={onAcknowledge}>
            Acknowledge
          </button>
        </div>
      )}
    </div>
  )
}
