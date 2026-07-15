import React, { useState } from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import CheckMark from '@/assets/CheckMark.png'
import logo from '@/assets/logo.png'
import { Alert } from '@/components/feedback'
import { PasswordInput, TextInput } from '@/components/forms'
import { Button } from '@/components/ui/Button'

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
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRequestOtp = async () => {
    if (!email) {
      setError('Please enter a valid email.')
      return
    }

    setError(null)
    try {
      await submitRequestOtp({ email })
      setCurrentScreen('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const handleResetPassword = async () => {
    if (!email || !otp || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

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
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextInput
              title="One Time OTP"
              label="otp"
              name="otp"
              autoComplete="one-time-code"
              placeholder="One time OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <PasswordInput
              title="New Password"
              label="password"
              name="password"
              autoComplete="new-password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordInput
              title="Confirm New Password"
              label="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
