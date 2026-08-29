import React from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { HiArrowRightOnRectangle } from 'react-icons/hi2'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { EmailVerificationPanel } from '../components/EmailVerificationPanel'
import styles from './AccountEmailVerification.module.scss'

const AccountEmailVerification: React.FC = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <img className={styles.logo} src={logo} alt="company" />
        <Button
          variant="outline"
          size="sm"
          icon={<HiArrowRightOnRectangle />}
          onClick={() => logout()}>
          Log out
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <HiOutlineMail />
          </div>
          <div>
            <h1 className={styles.title}>Email & account</h1>
            <p className={styles.subtitle}>
              Manage your email address and ensure your account is secure.
            </p>
          </div>
        </div>

        <EmailVerificationPanel />
      </div>
    </div>
  )
}

export default AccountEmailVerification
