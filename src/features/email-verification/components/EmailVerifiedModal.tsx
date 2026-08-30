import 'react-responsive-modal/styles.css'

import React from 'react'
import { Modal } from 'react-responsive-modal'
import { useLocation, useNavigate } from 'react-router-dom'

import { Heading, Text } from '@/components/ui/Typography'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import styles from './EmailVerifiedModal.module.scss'

type EmailVerifiedLocationState = {
  showEmailVerifiedModal?: boolean
}

export const EmailVerifiedModal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = useAuthStore((state) => state.user?.userRole)
  const { showEmailVerifiedModal } =
    (location.state as EmailVerifiedLocationState) || {}

  if (!showEmailVerifiedModal) return null

  const handleClose = () => {
    navigate(location.pathname, { replace: true, state: null })
  }

  const description =
    userRole === 'recruiter'
      ? "Your email address is confirmed. You're all set to start hiring."
      : "Your email address is confirmed. You're all set to start your job search."

  return (
    <Modal
      open
      onClose={handleClose}
      center
      classNames={{
        root: 'dashboard-modal-overlay',
        overlay: 'dashboard-modal-overlay',
      }}>
      <div className={styles.content}>
        <span className={styles.emoji} role="img" aria-label="Celebration">
          🎉
        </span>
        <Heading level={2}>Email verified!</Heading>
        <Text as="p" color="primary" className={styles.description}>
          {description}
        </Text>
      </div>
    </Modal>
  )
}
