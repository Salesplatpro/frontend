<<<<<<< HEAD
import React, { useEffect, useState } from 'react'

import CheckMark from '../../assets/CheckMark.png'
import { useNavigate } from 'react-router-dom'

type ModalProps = {
  onClose: () => void
  name: string
}

const Modal: React.FC<ModalProps> = ({ onClose, name }) => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  const handleOverlayClick = (e: {
    target: { classList: { contains: (arg0: string) => any } }
  }) => {
    if (e.target.classList.contains('overlay')) {
      handleClose()
=======
import React, { useEffect } from 'react'

import CheckMark from '../../assets/CheckMark.png'

type ModalProps = {
  onClose: () => void // Function to close the modal
  name: string // Name to display in the modal
  onOpen?: () => void // Optional function to call when the modal opens
}

const Modal: React.FC<ModalProps> = ({ onClose, name }) => {
  const handleOverlayClick = (e: {
    // eslint-disable-next-line no-unused-vars
    target: { classList: { contains: (arg0: string) => any } }
  }) => {
    if (e.target.classList.contains('overlay')) {
      onClose()
>>>>>>> f93ef00... new updates
    }
  }

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Escape') {
<<<<<<< HEAD
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 800)
    navigate('/login') // Matches the duration of the scale-up-center animation
  }

=======
      onClose()
    }
  }

>>>>>>> f93ef00... new updates
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

<<<<<<< HEAD
=======
  // Add body overflow hidden when modal is open
>>>>>>> f93ef00... new updates
  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  return (
    <div
<<<<<<< HEAD
      className="modal w-full h-full fixed top-10 left-0 right-0 bottom-0"
=======
      className="modal w-full h-full fixed top-0 left-0 right-0 bottom-0"
>>>>>>> f93ef00... new updates
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div
        className="overlay w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-[rgba(49,49,49,0.8)]"
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      <div
<<<<<<< HEAD
        className={`modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 p-7 max-w-[600px] min-w-[300px] ${
          isVisible ? 'scale-up-center' : ''
        }`}
        role="document">
        <img src={CheckMark} alt="checklist" />
=======
        className="modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 p-7  max-w-[600px] min-w-[300px] scale-up-center"
        role="document">
        <img src={CheckMark} alt="checklist" />

>>>>>>> f93ef00... new updates
        <h2 id="modal-title" className="text-[28px] font-bold font-raleway">
          Welcome onboard {name}
        </h2>
        <p className="text-center px-10 py-3">
<<<<<<< HEAD
          SupportPro provides you with every opportunity to land your dream Job
          with corporate organizations.
        </p>
        <button
          className="close-modal px-24 border-[1px] py-2 my-10 rounded-lg text-white font-raleway font-medium text-center text-[20px] bg-[#3C6FD4] hover:bg-[#4985df]"
          onClick={handleClose}
          aria-label="Close modal">
          Go to Dashboard
=======
          SupportPro provide you with every opportunity to land your dream Job
          with cooperate organization.
        </p>
        <button
          className="close-modal px-24 border-[1px] py-2 my-10 rounded-lg text-white font-raleway font-medium text-center text-[20px] bg-[#3C6FD4] hover:bg-[#4985df]"
          onClick={onClose}
          aria-label="Close modal">
          Go to DashBoard
>>>>>>> f93ef00... new updates
        </button>
      </div>
    </div>
  )
}

export default Modal
