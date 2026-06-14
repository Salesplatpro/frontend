import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { Modal } from 'react-responsive-modal'
import { useNavigate } from 'react-router-dom'

import CheckMark from '@/assets/CheckMark.png'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'

import { AuthLayout } from '../components/AuthLayout'
import { SignupForm } from '../components/SignupForm'
import styles from './SignupPage.module.scss'

export const SignupPage = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')

  const handleSuccess = (lastName: string) => {
    setWelcomeName(lastName)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => navigate('/login'), 300)
  }

  return (
    <>
      <AuthLayout title="Create account" subtitle="Please enter your details.">
        <SignupForm onSuccess={handleSuccess} />
      </AuthLayout>

      <Modal open={isModalOpen} onClose={handleCloseModal} center>
        <div className={styles.content}>
          <img src={CheckMark} alt="checklist" className={styles.checkmark} />
          <Heading level={2}>Welcome onboard {welcomeName}</Heading>
          <Text as="p" color="primary" className={styles.description}>
            SupportPro provides you with every opportunity to land your dream
            job with corporate organizations.
          </Text>
          <Button onClick={handleCloseModal} aria-label="Close modal">
            Go to Login
          </Button>
        </div>
      </Modal>
    </>
  )
}
