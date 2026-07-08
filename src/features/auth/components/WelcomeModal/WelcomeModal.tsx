import 'react-responsive-modal/styles.css'

import React from 'react'
import { Modal } from 'react-responsive-modal'
import { useLocation, useNavigate } from 'react-router-dom'

import CheckMark from '@/assets/CheckMark.png'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'

import styles from './WelcomeModal.module.scss'

type WelcomeLocationState = {
  showWelcomeModal?: boolean
  welcomeName?: string
}

export const WelcomeModal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showWelcomeModal, welcomeName } =
    (location.state as WelcomeLocationState) || {}

  if (!showWelcomeModal) return null

  const handleClose = () => {
    navigate(location.pathname, { replace: true, state: null })
  }

  return (
    <Modal
      open
      onClose={handleClose}
      center
      classNames={{ overlay: 'dashboard-modal-overlay' }}>
      <div className={styles.content}>
        <img src={CheckMark} alt="checklist" className={styles.checkmark} />
        <Heading level={2}>Welcome onboard {welcomeName}</Heading>
        <Text as="p" color="primary" className={styles.description}>
          We&apos;re glad to have you here. Let&apos;s get you started.
        </Text>
        <Button onClick={handleClose} aria-label="Close modal">
          Get started
        </Button>
      </div>
    </Modal>
  )
}
