import React from 'react'

import { calculateDaysFromCreation } from '../../../utils'

// Types
interface Sender {
  firstName: string
  lastName: string
}

interface Notification {
  message: string
  createdAt: string
  sender: Sender
}

interface NotificationItemProps {
  notification: Notification
  isExpanded: boolean
  onToggleExpand: () => void
  onClear: () => void
  truncateLimit: number
  displayMessage: string
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isExpanded,
  onToggleExpand,
  onClear,
  truncateLimit,
  displayMessage,
}) => {
  const { message, createdAt } = notification

  return (
    <div className="lg:w-[90%] lg:min-h-[180px] rounded-[16px] bg-[#F8F8F8] border border-[#D0D5DD]">
      <h1 className="px-6 py-5">
        {calculateDaysFromCreation(createdAt)} Days ago
      </h1>
      <div className="px-6 lg:flex lg:justify-start lg:items-start flex-col space-y-2">
        <h1 className="font-raleway font-semibold text-[18px] leading-[18px] text-[#0D0C22]">
          {/* {sender?.firstName} {sender?.lastName} */}
        </h1>
        <p className="lg:w-[540px] lg:min-h-[26px] font-raleway font-normal text-[16px] leading-[24px] text-[#0D0C22]">
          {displayMessage}
        </p>

        {message.length > truncateLimit && (
          <button
            onClick={onToggleExpand}
            className="text-blue-500 font-medium">
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      <div className="flex justify-end items-center mx-5 lg:mx-8 my-4 space-x-2">
        <button
          onClick={onClear}
          className="lg:w-[100px] rounded-lg flex justify-center items-center font-semibold font-raleway text-[16px] text-[#3c6fd4] hover:cursor-pointer py-3">
          Clear
        </button>
      </div>
    </div>
  )
}
