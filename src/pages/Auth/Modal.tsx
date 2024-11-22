import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CheckMark from '../../assets/CheckMark.png'

type ModalProps = {
  onClose: () => void
  name: string
}

const Modal: React.FC<ModalProps> = ({ onClose, name }) => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

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
    setTimeout(onClose, 800)
    navigate('/login') // Matches the duration of the scale-up-center animation
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
      className="modal w-full h-full fixed top-10 left-0 right-0 bottom-0"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div
        className="overlay w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-[rgba(49,49,49,0.8)]"
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      <div
        className={`modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 p-7 max-w-[600px] min-w-[300px] ${
          isVisible ? 'scale-up-center' : ''
        }`}
        role="document">
        <img
          src={CheckMark}
          alt="checklist"
          className="w-[100px] lg:w-[150px] md:w-[100px]"
        />
        <h2
          id="modal-title"
          className="text-[20px] text-center leading-8 lg:text-[28px] md:text-[26px] sm:text-[24px] font-bold font-raleway">
          Welcome onboard {name}
        </h2>
        <p className="text-center px-7 py-2 lg:py-3 text-[#667085] text-[15px] lg:text-[18px] md:text-[16px] font-raleway lg:leading-[28px] md:leading-[25px] sm:leading-[23px] leading-[21px]">
          SupportPro provides you with every opportunity to land your dream Job
          with corporate organizations.
        </p>
        <button
          className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-[#3C6FD4] hover:bg-[#4985df]"
          onClick={handleClose}
          aria-label="Close modal">
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default Modal
