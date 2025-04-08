import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// import CheckMark from '../../assets/CheckMark.png'
import ForgotPassword from './ForgotPassword'

type ForgotPasswordModalProps = {
  onClose: () => void
  email: string
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
}) => {
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
    setTimeout(onClose, 300)
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
        className={`modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 max-w-[600px] min-w-[300px] px-4 py-14 lg:px-32 lg:py-24 md:px-28 md:py-20 sm:px-24 sm:py-20 ${
          isVisible ? 'scale-up-center' : ''
        }`}
        role="document">
        <ForgotPassword handleClose={handleClose} />
      </div>
    </div>
  )
}

export default ForgotPasswordModal
