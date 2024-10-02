import React, { useState } from 'react'

import ChatModal from './ChatModal'

const Chat = () => {
  // Define state for each message using an array
  const [expandedMessages, setExpandedMessages] = useState([false, false])
  const [acknowledgedMessages, setAcknowledgedMessages] = useState([
    false,
    false,
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalName, setModalName] = useState('')

  const messages = [
    "Congratulations you have passed this stage, others failed; but you didn't, say cheese. Congratulations you have passed this stage, others failed; but you didn't, say cheese. Congratulations you have passed this stage, others failed; but you didn't, say cheese.",
    'This is another message, which should also be independently toggled. This will have its own Read More and Read Less functionality.',
  ]

  const truncateLimit = 120

  // Function to toggle Read More/Less for a specific message
  const toggleReadMore = (index: number) => {
    setExpandedMessages((prevState) =>
      prevState.map((expanded, i) => (i === index ? !expanded : expanded)),
    )
  }

  // Function to handle Acknowledge button click for a specific message
  const handleAcknowledge = (index: number) => {
    setAcknowledgedMessages((prevState) =>
      prevState.map((acknowledged, i) => (i === index ? true : acknowledged)),
    )

    setModalName('Congratulations')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="my-12 mx-8 space-y-7">
      {messages.map((message, index) => {
        const isExpanded = expandedMessages[index]
        // const isAcknowledged = acknowledgedMessages[index]
        const displayMessage = isExpanded
          ? message
          : message.length > truncateLimit
          ? `${message.slice(0, truncateLimit)}`
          : message

        return (
          <div
            key={index}
            className="lg:w-[1000px] lg:min-h-[180px] rounded-[16px] bg-[#F8F8F8] border border-[#D0D5DD]">
            <h1 className="px-6 py-5">September 23, 2025</h1>
            <div className="px-6 lg:flex lg:justify-start lg:items-start flex-col space-y-2">
              <h1 className="font-raleway font-semibold text-[18px] leading-[18px] text-[#0D0C22]">
                Salesplat Campaign
              </h1>

              <p className="lg:w-[540px] lg:min-h-[26px] font-raleway font-normal text-[16px] leading-[19px] text-[#0D0C22]">
                {displayMessage}
              </p>

              {message.length > truncateLimit && (
                <button
                  onClick={() => toggleReadMore(index)}
                  className="text-blue-500 font-medium">
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="lg:flex lg:justify-end lg:items-center lg:mx-8 space-x-2 my-4">
              <button className="lg:w-[100px] rounded-lg flex justify-center items-center font-semibold font-raleway text-[16px] leading-[24px] text-[#3c6fd4] hover:cursor-pointer py-3">
                Reject
              </button>

              <button
                className="w-[250px] lg:w-[151px] h-[44px] md:w-[120px] sm:w-[280px] rounded-lg bg-[#3c6fd4] border flex justify-center items-center font-semibold font-raleway text-[16px] leading-[24px] text-white hover:bg-[#4b82e1] py-3"
                onClick={() => handleAcknowledge(index)}>
                Acknowledge
              </button>
            </div>
          </div>
        )
      })}

      {/* Modal Component */}
      {isModalOpen && <ChatModal onClose={closeModal} name={modalName} />}
    </div>
  )
}

export default Chat
