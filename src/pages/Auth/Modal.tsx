import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckMark from '../../assets/CheckMark.png'

type ModalProps = {
  onClose: () => void
  name: string
  redirectOnClose?: boolean // 👈 make redirect optional
}

const Modal: React.FC<ModalProps> = ({ onClose, name, redirectOnClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('overlay')) {
      handleClose()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }

  const handleClose = () => {
    setTimeout(() => {
      onClose()
      if (redirectOnClose) navigate('/login')
    }, 300)
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
      className="modal fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      {/* Overlay */}
      <div
        className="overlay absolute inset-0 bg-[rgba(49,49,49,0.8)]"
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      {/* Content */}
      <div
        className={`modal-content relative z-10 flex flex-col items-center rounded-lg bg-gray-100 p-7 max-w-[600px] min-w-[300px] ${
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
          className="text-[20px] text-center leading-8 lg:text-[28px] font-bold font-raleway">
          Welcome onboard {name}
        </h2>
        <p className="text-center px-7 py-2 text-[#667085] text-[15px] lg:text-[18px] font-raleway">
          SupportPro provides you with every opportunity to land your dream job
          with corporate organizations.
        </p>
        <button
          className="close-modal px-14 py-2 my-5 rounded-lg text-white font-raleway font-medium bg-[#3C6FD4] hover:bg-[#4985df]"
          onClick={handleClose}
          aria-label="Close modal">
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default Modal
