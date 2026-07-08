import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ForgotPassword from './ForgotPassword'
import styles from './ForgotPasswordModal.module.scss'

type ForgotPasswordModalProps = {
  onClose: () => void
  email: string
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
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
      className={styles.modal}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div
        className={`${styles.overlay} overlay`}
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      <div
        className={`${styles.content} ${isVisible ? 'scale-up-center' : ''}`}
        role="document">
        <ForgotPassword handleClose={handleClose} />
      </div>
    </div>
  )
}
