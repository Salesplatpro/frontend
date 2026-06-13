import React, { useState } from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import CheckMark from '../../assets/CheckMark.png'
import logo from '../../assets/logo.png'
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../../redux/api/apiSlice'
import { notify } from '../../utils/toastNotifications'

interface ForgotPasswordProps {
  handleClose: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ handleClose }) => {
  const navigation = useNavigate()
  const [currentScreen, setCurrentScreen] = useState<
    'emailInput' | 'confirmation' | 'newPassword'
  >('emailInput')

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState<string | number>('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestOtp] = useForgotPasswordMutation()
  const [resetPassword] = useResetPasswordMutation()

  const handleRequestOtp = async () => {
    if (!email) {
      setError('Please enter a valid email.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await requestOtp({ email }).unwrap()

      // await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulates a 2-second delay
      if (response) {
        setCurrentScreen('confirmation')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong.')
      } else {
        setError('Something went wrong.')
      }
    } finally {
      setLoading(false)
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

    try {
      setLoading(true)
      setError(null)

      const response = await resetPassword({
        email,
        otp,
        password,
      }).unwrap()
      if (response) {
        notify('success', `Password reset successfully`, {
          autoClose: 5000,
        })
        navigation('/login')
      }

      // Simulate API call to update the password
      // await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulates a 2-second delay

      // alert('Password successfully updated!')
      // handleClose()
    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center flex-col">
      {currentScreen === 'emailInput' && (
        <>
          <img className="logo pb-2" src={logo} alt="company" />
          <div>
            <div className="font-bold font-raleway text-grey-900 text-[25px] lg:text-[36px] md:text-[34px] sm:text-[30px] leading-[32px]">
              Forgot password
            </div>
            <div className="font-normal font-raleway leading-[14px] lg:text-[18px] lg:leading-[24px] text-grey-500 text-center pt-3">
              Please enter your details
            </div>
          </div>
          <div className="py-3">
            <form
              className="flex justify-start items-start flex-col space-y-2 "
              onSubmit={(e) => {
                e.preventDefault()
                handleRequestOtp()
              }}>
              <label
                htmlFor="email"
                className="text-[14px] text-grey-700 leading-[22px] font-raleway font-medium">
                Email
              </label>
              <input
                id="email"
                title="Email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[240px] lg:w-[370px] md:w-[300px] h-[48px] py-2 rounded-lg pl-4 border border-grey-300 bg-white font-raleway text-grey-500 font-medium leading-[25px]"
                style={{
                  boxShadow: '0px 1.07px 2.14px 0px rgba(16, 24, 40, 0.05)',
                }}
              />

              {error && (
                <div className="text-red-500 text-sm mt-2 font-raleway">
                  {error}
                </div>
              )}
            </form>
          </div>
          <button
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-primary-strong hover:bg-primary"
            // onClick={() => setCurrentScreen('confirmation')}
            onClick={handleRequestOtp}
            disabled={loading}
            aria-label="Move to confirmation">
            {loading ? 'Sending...' : 'Reset Password'}
          </button>

          <button
            className="px-20 py-1 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-grey-500 hover:cursor-pointer hover:text-[#4f5563]"
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
            <div className="font-bold font-raleway text-grey-900 text-[25px] lg:text-[36px] md:text-[34px] sm:text-[30px] leading-[32px]">
              Reset Password
            </div>
            <div className="text-grey-500 font-raleway font-normal text-[16px] leading-[18px] lg:text-[18px] w-[330px] lg:w-[460px] md:w-[440px] sm:w-[360px] text-center lg:leading-[22px] py-2">
              Link to reset your password has been sent to the email registered
              to this account {email}
            </div>
          </div>

          <a
            href={`https://mail.google.com/${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-primary-strong hover:bg-primary"
            aria-label="Move to confirmation">
            Go to Mail
          </a>

          <button
            className="px-20 py-1 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-grey-500 hover:cursor-pointer hover:text-[#4f5563]"
            onClick={() => setCurrentScreen('newPassword')}
            aria-label="Move to newPassword">
            Reset Password
          </button>
        </>
      )}

      {currentScreen === 'newPassword' && (
        <>
          <img className="logo pb-2 " src={logo} alt="company" />
          <div className="text-center">
            <div className="font-bold font-raleway text-grey-900 text-[25px] lg:text-[36px] md:text-[34px] sm:text-[30px] leading-[32px]">
              Reset password
            </div>
            <div className="font-normal font-raleway leading-[14px] lg:text-[18px] lg:leading-[24px] text-grey-500 text-center pt-3">
              Please enter your new password details
            </div>
          </div>

          <form
            className="flex justify-center items-start flex-col mt-2 py-3 space-y-2 mx-12"
            onSubmit={(e) => {
              e.preventDefault()
              handleResetPassword()
            }}>
            <div className="pt-1 space-y-2">
              <label
                htmlFor="email"
                className="text-[14px] text-grey-700 leading-[22px] font-raleway font-medium">
                Email
              </label>
              <input
                id="email"
                title="Email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[240px] lg:w-[370px] md:w-[300px] h-[48px] py-2 rounded-lg pl-4 border border-grey-300 bg-white font-raleway text-grey-500 font-medium leading-[25px]"
                style={{
                  boxShadow: '0px 1.07px 2.14px 0px rgba(16, 24, 40, 0.05)',
                }}
              />
            </div>

            <div className="pt-1 space-y-2">
              <label
                htmlFor="otp"
                className="text-[14px] pt-10 text-grey-700 leading-[22px] font-raleway font-medium">
                One Time OTP
              </label>
              <input
                id="otp"
                type="password"
                placeholder="One time OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-[240px] lg:w-[370px] md:w-[300px] h-[48px] py-2 rounded-lg pl-4 border border-grey-300 bg-white font-raleway text-grey-500 font-medium leading-[25px]"
              />
            </div>
            <div className="pt-1 space-y-2">
              <label
                htmlFor="password"
                className="text-[14px] pt-10 text-grey-700 leading-[22px] font-raleway font-medium">
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[240px] lg:w-[370px] md:w-[300px] h-[48px] py-2 rounded-lg pl-4 border border-grey-300 bg-white font-raleway text-grey-500 font-medium leading-[25px]"
              />
            </div>

            <div className="pt-1 space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[14px] text-grey-700 leading-[22px] font-raleway font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[240px] lg:w-[370px] md:w-[300px] h-[48px] py-2 rounded-lg pl-4 border border-grey-300 bg-white font-raleway text-grey-500 font-medium leading-[25px]"
              />
            </div>

            {error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <p className="font-raleway font-normal text-[13px] text-grey-500 leading-[22px]">
                Must be at least 8 charaters.
              </p>
            )}
          </form>

          <button
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-2 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-primary-strong hover:bg-primary whitespace-nowrap"
            onClick={handleResetPassword}
            disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            className="px-20 py-3 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-grey-500 hover:cursor-pointer hover:text-[#4f5563]"
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
