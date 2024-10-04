import React, { useEffect, useState } from 'react'

// import CheckMark from '../../../assets/CheckMark.png'

type ModalProps = {
  onClose: () => void
  name: string
}

const ChatModal: React.FC<ModalProps> = ({ onClose, name }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.classList.contains('overlay')) {
      handleClose()
    }
  }

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 800) // Trigger the onClose callback after animation delay
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  return (
    <div
      className="modal w-full h-full fixed top-7 lg:left-16 md:left-0 right-0 bottom-0"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div
        className="overlay w-full h-full fixed top-0 lg:left-[295px] md:left-0 right-0 bottom-0 bg-[rgba(49,49,49,0.8)]"
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      <div
        className={`modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 p-5 lg:p-14 md:p-12 sm:p-13 max-w-[600px] min-w-[300px] ${
          isVisible ? 'scale-up-center' : ''
        }`}
        role="document">
        {/* <img src={CheckMark} alt="checklist" /> */}
        <h2
          id="modal-title"
          className="text-[18px] lg:text-[28px] md:text-[25px] sm:text-[20px] font-bold font-raleway">
          Acknowledge Message
        </h2>
        <p className="text-center px-10 py-3">
          By acknowledging this message, you agree to take actions and follow
          the instructions stated in the message
        </p>
        <button
          className="close-modal px-14 lg:px-24 md:px-24 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[14px] lg:text-[20px] md:text-[18px] bg-[#3C6FD4] hover:bg-[#4985df]"
          onClick={handleClose} // Close the modal without redirecting
          aria-label="Close modal">
          Acknowledge
        </button>

        <button
          className="close-modal px-32 py-2 rounded-lg font-raleway font-medium text-center text-[17px] lg:text-[20px] md:text-[18px] text-[#3C6FD4] hover:cursor-pointer"
          onClick={handleClose} // Close the modal without redirecting
          aria-label="Close modal">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ChatModal
