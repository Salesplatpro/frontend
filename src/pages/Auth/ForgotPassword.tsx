import React, { Fragment, useState } from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'

import CheckMark from '../../assets/CheckMark.png'
import logo from '../../assets/logo.png'
// import Loading from './Loading'

interface ForgotPasswordProps {
  handleClose: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ handleClose }) => {
  const [currentScreen, setCurrentScreen] = useState<
    'emailInput' | 'confirmation' | 'newPassword'
  >('emailInput')

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter a valid email.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulates a 2-second delay

      setCurrentScreen('confirmation')
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

  const handleSetNewPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Both fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Simulate API call to update the password
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulates a 2-second delay

      alert('Password successfully updated!')
      handleClose()
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
            <div className="create-account">Forgot password</div>
            <div className="details">Please enter your details</div>
          </div>
          <div className="py-3">
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault()
                handleResetPassword()
              }}>
              <label
                htmlFor="email"
                className="text-lg text-[#344054] leading-[22px] font-raleway font-medium">
                Email
              </label>
              <input
                id="email"
                title="Email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[370px] h-[48px] py-2 rounded-lg pl-4 border border-[#D0D5DD] bg-[#FFFFFF] font-raleway text-[#667085] font-medium leading-[25px]"
                style={{
                  boxShadow: '0px 1.07px 2.14px 0px rgba(16, 24, 40, 0.05)',
                }}
              />

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </form>
          </div>
          <button
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-[#3C6FD4] hover:bg-[#4985df]"
            // onClick={() => setCurrentScreen('confirmation')}
            onClick={handleResetPassword}
            disabled={loading}
            aria-label="Move to confirmation">
            {loading ? 'Sending...' : 'Reset Password'}
          </button>

          <button
            className="px-20 py-1 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-[#667085] hover:cursor-pointer hover:text-[#4f5563]"
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
            <div className="create-account">Reset Password</div>
            <div className="text-[#667085] font-raleway font-normal text-[18px] text-center leading-[22px] w-[460px] py-2">
              Link to reset your password has been sent to the email registered
              to this account {email}
            </div>
          </div>

          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-5 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-[#3C6FD4] hover:bg-[#4985df]"
            aria-label="Move to confirmation">
            Go to Mail
          </a>

          <button
            className="px-20 py-1 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-[#667085] hover:cursor-pointer hover:text-[#4f5563]"
            onClick={() => setCurrentScreen('newPassword')}
            // onClick={handleResetPassword}
            // disabled={loading}
            aria-label="Move to newPassword">
            New Password
          </button>
        </>
      )}

      {currentScreen === 'newPassword' && (
        <>
          <img className="logo pb-2" src={logo} alt="company" />
          <div>
            <div className="create-account">Forgot password</div>
            <div className="details">Please enter your details</div>
          </div>

          <form
            className=" mt-4 py-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSetNewPassword()
            }}>
            <label
              htmlFor="password"
              className="text-[14px] pt-10 text-[#344054] leading-[22px] font-raleway font-medium">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[370px] h-[48px] rounded-lg pl-4 border border-[#D0D5DD] bg-[#FFFFFF] font-raleway text-[#667085] font-medium leading-[25px]"
            />

            <div className="pt-1 space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[14px] text-[#344054] leading-[22px] font-raleway font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[370px] h-[48px] rounded-lg pl-4 border border-[#D0D5DD] bg-[#FFFFFF] font-raleway text-[#667085] font-medium leading-[25px]"
              />
            </div>

            {error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <p className="font-raleway font-normal texet-[13px] text-[#667085] leading-[22px]">
                Must be at least 8 charaters.
              </p>
            )}
          </form>

          <button
            className="close-modal px-14 lg:px-24 md:px-20 sm:px-16 border-[1px] py-2 my-2 rounded-lg text-white font-raleway font-medium text-center text-[15px] lg:text-[20px] md:text-[17px] sm:text-[16px] bg-[#3C6FD4] hover:bg-[#4985df] whitespace-nowrap"
            onClick={handleSetNewPassword}
            disabled={loading}>
            {loading ? 'Saving...' : 'Create Password'}
          </button>

          <button
            className="px-20 py-3 rounded-lg flex justify-center items-center gap-x-2 font-raleway whitespace-nowrap font-medium leading-[20px] text-center text-[17px] lg:text-[19px] md:text-[18px] text-[#667085] hover:cursor-pointer hover:text-[#4f5563]"
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
