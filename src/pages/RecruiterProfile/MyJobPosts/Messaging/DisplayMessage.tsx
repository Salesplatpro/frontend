import React from 'react'

type MessageProps = {
  messages?: {
    acknowledged: boolean
    application: string
    content: string
    conversation: string
    deleted: boolean
    isRead: boolean
    recipient: string
    sender: string
  }[]
}

const DEFAULT_MESSAGE = 'No messages yet.'

export const DisplayMessage = ({ messages }: MessageProps) => {
  const hasMessages = messages && messages.length > 0

  return hasMessages ? (
    <div className="flex flex-col space-y-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className="max-w-[803px] h-[61px] border border-gray-300 bg-[#f8f8f8] rounded-[10px] flex justify-start items-start">
          <div key={index} className="p-4 text-left">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="max-w-[803px] h-[171px] border border-gray-300 bg-[#f8f8f8] rounded-[10px] flex justify-center items-center">
      <div className="text-center p-4">{DEFAULT_MESSAGE}</div>
    </div>
  )
}
