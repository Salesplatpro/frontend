import React, { useEffect, useState } from 'react'

import { Alert } from '@/components/feedback'
import { PasswordInput, TextInput } from '@/components/forms'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useProfile } from '@/features/profile/hooks/useProfile'

import { useEmailVerification } from '../hooks/useEmailVerification'
import { getEmailVerificationBadge } from '../utils/getEmailVerificationBadge'
import styles from './EmailVerificationPanel.module.scss'

const RESEND_COOLDOWN_SECONDS = 60

export const EmailVerificationPanel = () => {
  const { profile } = useProfile()
  const { submitResend, submitChangeEmail, isResending, isChangingEmail } =
    useEmailVerification()

  const [cooldown, setCooldown] = useState(0)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(
      () => setCooldown((prev) => Math.max(0, prev - 1)),
      1000,
    )
    return () => clearInterval(id)
  }, [cooldown])

  const isVerified = !!profile?.emailVerifiedAt

  const handleResend = async () => {
    setError(null)
    try {
      await submitResend()
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const handleChangeEmail = async () => {
    if (!newEmail || !currentPassword) {
      setError('Please fill in both fields.')
      return
    }
    setError(null)
    try {
      await submitChangeEmail({ newEmail, currentPassword })
      setNewEmail('')
      setCurrentPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.status}>
        <span className={styles.email}>{profile?.email}</span>
        <StatusBadge
          {...getEmailVerificationBadge(profile?.emailVerifiedAt)}
          showDot
        />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {isVerified ? (
        <p className={styles.verifiedMessage}>
          Your email address is verified.
        </p>
      ) : (
        <>
          <p className={styles.pendingMessage}>
            We sent a verification link to {profile?.email}. Click the link in
            that email to activate your account.
          </p>

          <Button
            loading={isResending}
            disabled={cooldown > 0}
            onClick={handleResend}>
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend verification email'}
          </Button>

          <div className={styles.changeEmail}>
            <h3 className={styles.changeEmailTitle}>Change email address</h3>
            <TextInput
              title="New email"
              label="newEmail"
              name="newEmail"
              autoComplete="email"
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <PasswordInput
              title="Current password"
              label="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Button loading={isChangingEmail} onClick={handleChangeEmail}>
              Update email
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
