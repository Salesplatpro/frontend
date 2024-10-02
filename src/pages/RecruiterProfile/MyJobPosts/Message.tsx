import React from 'react'

type MessageProps = {
  messages?: string[]
}

const DEFAULT_MESSAGE = 'No messages yet.'

export const Message = ({ messages }: MessageProps) => {
  return (
    <div
      className={`max-w-[803px] ${
        messages && messages.length > 0 ? 'h-[71px]' : 'h-[171px]'
      } border border-gray-300 bg-[#f8f8f8] rounded-[10px] flex flex-col justify-center items-center`}>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="p-4 text-left">
            {message}
          </div>
        ))
      ) : (
        <div className="text-center p-4">{DEFAULT_MESSAGE}</div>
      )}
    </div>
  )
}
