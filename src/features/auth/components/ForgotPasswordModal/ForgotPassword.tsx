import React, { useEffect, useState } from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import CheckMark from '@/assets/CheckMark.png'
import logo from '@/assets/logo.png'
import { Alert } from '@/components/feedback'
import { PasswordInput, TextInput } from '@/components/forms'
import { Button } from '@/components/ui/Button'
import { focusFieldByName } from '@/utils/focusField'

import { useForgotPasswordFlow } from '../../hooks/useForgotPasswordFlow'
import styles from './ForgotPasswordModal.module.scss'

interface ForgotPasswordProps {
  handleClose: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ handleClose }) => {
  const navigate = useNavigate()
  const {
    submitRequestOtp,
    submitResetPassword,
    isRequestingOtp,
    isResettingPassword,
  } = useForgotPasswordFlow()

  const [currentScreen, setCurrentScreen] = useState<
    'emailInput' | 'confirmation' | 'newPassword'
  >('emailInput')

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (currentScreen === 'confirmation') return
    const frame = window.requestAnimationFrame(() => {
      focusFieldByName('email')
    })
    return () => window.cancelAnimationFrame(frame)
  }, [currentScreen])

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setFieldErrors({ email: 'Please enter a valid email.' })
      setError(null)
      focusFieldByName('email')
      return
    }

    setFieldErrors({})
    setError(null)
    try {
      await submitRequestOtp({ email })
      setCurrentScreen('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      focusFieldByName('email')
    }
  }

  const handleResetPassword = async () => {
    const nextErrors: Record<string, string> = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    if (!otp.trim()) nextErrors.otp = 'Enter the code we sent you.'
    if (!password) nextErrors.password = 'Enter a new password.'
    if (!confirmPassword)
      nextErrors.confirmPassword = 'Confirm your new password.'
    else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setError(null)
      focusFieldByName(
        ['email', 'otp', 'password', 'confirmPassword'].find(
          (name) => nextErrors[name],
        ) || 'email',
      )
      return
    }

    setFieldErrors({})
    setError(null)
    try {
      await submitResetPassword({ email, otp, password })
      navigate('/login')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update password. Please try again.',
      )
    }
  }

  return (
    <div className="flex justify-center items-center flex-col">
      {currentScreen === 'emailInput' && (
        <>
          <img className="logo pb-2" src={logo} alt="company" />
          <div>
            <div className="font-bold font-raleway text-grey-900 text-2xl lg:text-4xl md:text-3xl sm:text-3xl leading-[32px]">
              Forgot password
            </div>
            <div className="font-normal font-raleway leading-[14px] lg:text-lg lg:leading-[24px] text-grey-500 text-center pt-3">
              Please enter your details
            </div>
          </div>

          <div className={styles.field}>
            <TextInput
              title="Email"
              label="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFieldErrors((prev) => ({ ...prev, email: '' }))
              }}
              error={fieldErrors.email}
            />
            {error && <Alert variant="error">{error}</Alert>}
          </div>

          <Button
            fullWidth
            loading={isRequestingOtp}
            onClick={handleRequestOtp}
            aria-label="Move to confirmation">
            Reset Password
          </Button>

          <button
            type="button"
            className={styles.backLink}
            onClick={handleClose}
            aria-label="Close modal">
            <IoArrowBackOutline size={27} />
            Back to Login
          </button>
        </>
      )}

      {currentScreen === 'confirmation' && (
        <>
          <div className="flex items-center flex-col">
            <img
              src={CheckMark}
              alt="checklist"
              className="w-[100px] lg:w-[150px] md:w-[100px]"
            />
            <div className="font-bold font-raleway text-grey-900 text-2xl lg:text-4xl md:text-3xl sm:text-3xl leading-[32px]">
              Reset Password
            </div>
            <div className="text-grey-500 font-raleway font-normal text-base leading-[18px] lg:text-lg w-[330px] lg:w-[460px] md:w-[440px] sm:w-[360px] text-center lg:leading-[22px] py-2">
              Link to reset your password has been sent to the email registered
              to this account {email}
            </div>
          </div>

          <a
            href={`https://mail.google.com/${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-sm lg:text-xl md:text-lg sm:text-base bg-primary-strong hover:bg-primary"
            aria-label="Move to confirmation">
            Go to Mail
          </a>

          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => setCurrentScreen('newPassword')}
            aria-label="Move to newPassword">
            Reset Password
          </button>
        </>
      )}

      {currentScreen === 'newPassword' && (
        <>
          <img className="logo pb-2" src={logo} alt="company" />
          <div className="text-center">
            <div className="font-bold font-raleway text-grey-900 text-2xl lg:text-4xl md:text-3xl sm:text-3xl leading-[32px]">
              Reset password
            </div>
            <div className="font-normal font-raleway leading-[14px] lg:text-lg lg:leading-[24px] text-grey-500 text-center pt-3">
              Please enter your new password details
            </div>
          </div>

          <div className={styles.field}>
            <TextInput
              title="Email"
              label="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFieldErrors((prev) => ({ ...prev, email: '' }))
              }}
              error={fieldErrors.email}
            />

            <TextInput
              title="One Time OTP"
              label="otp"
              name="otp"
              autoComplete="one-time-code"
              placeholder="One time OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setFieldErrors((prev) => ({ ...prev, otp: '' }))
              }}
              error={fieldErrors.otp}
            />

            <PasswordInput
              title="New Password"
              label="password"
              name="password"
              autoComplete="new-password"
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, password: '' }))
              }}
              error={fieldErrors.password}
            />

            <PasswordInput
              title="Confirm New Password"
              label="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
              }}
              error={fieldErrors.confirmPassword}
            />

            {error ? (
              <Alert variant="error">{error}</Alert>
            ) : (
              <p className="font-raleway font-normal text-sm text-grey-500 leading-[22px]">
                Must be at least 8 charaters.
              </p>
            )}
          </div>

          <Button
            fullWidth
            loading={isResettingPassword}
            onClick={handleResetPassword}>
            Reset Password
          </Button>

          <button
            type="button"
            className={styles.backLink}
            onClick={handleClose}
            aria-label="Close modal">
            <IoArrowBackOutline size={27} />
            Back to Login
          </button>
        </>
      )}
    </div>
  )
}

export default ForgotPassword
