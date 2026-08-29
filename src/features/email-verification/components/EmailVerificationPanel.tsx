import React, { useEffect, useState } from 'react'
import { HiOutlineMail, HiOutlineUser } from 'react-icons/hi'
import { IoCheckmarkCircle, IoPaperPlaneOutline } from 'react-icons/io5'
import { MdLockOutline } from 'react-icons/md'

import { Alert } from '@/components/feedback'
import { PasswordInput, TextInput } from '@/components/forms'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
    <div className={styles.wrapper}>
      {error && <Alert variant="error">{error}</Alert>}

      <Card className={styles.statusCard}>
        {!isVerified && (
          <div className={styles.illustration}>
            <div className={styles.circleOuter} />
            <div className={styles.circleInner} />
            <IoPaperPlaneOutline className={styles.planeIcon} />
            <div className={styles.envelopeWrap}>
              <HiOutlineMail className={styles.envelopeIcon} />
              <div className={styles.checkBadge}>
                <IoCheckmarkCircle />
              </div>
            </div>
          </div>
        )}

        <div className={styles.statusContent}>
          <div className={styles.statusRow}>
            <span className={styles.email}>{profile?.email}</span>
            <StatusBadge
              {...getEmailVerificationBadge(profile?.emailVerifiedAt)}
              showDot
            />
          </div>

          {isVerified ? (
            <p className={styles.message}>Your email address is verified.</p>
          ) : (
            <>
              <p className={styles.message}>
                We sent a verification link to {profile?.email}. Click the link
                in that email to activate your account.
              </p>

              <Button
                icon={<HiOutlineMail />}
                loading={isResending}
                disabled={cooldown > 0}
                onClick={handleResend}>
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend verification email'}
              </Button>
            </>
          )}
        </div>
      </Card>

      {!isVerified && (
        <Card className={styles.changeEmailCard}>
          <div className={styles.changeEmailHeader}>
            <div className={styles.changeEmailIcon}>
              <HiOutlineUser />
            </div>
            <div>
              <h3 className={styles.changeEmailTitle}>Change email address</h3>
              <p className={styles.changeEmailSubtitle}>
                Update your email address. You&apos;ll need to verify the new
                one.
              </p>
            </div>
          </div>

          <div className={styles.changeEmailForm}>
            <TextInput
              title="New email"
              label="newEmail"
              name="newEmail"
              autoComplete="email"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <PasswordInput
              title="Current password"
              label="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <Button
            icon={<MdLockOutline />}
            loading={isChangingEmail}
            onClick={handleChangeEmail}>
            Update email address
          </Button>
        </Card>
      )}
    </div>
  )
}
