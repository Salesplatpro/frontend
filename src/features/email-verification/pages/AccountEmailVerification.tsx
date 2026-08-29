import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { HiArrowRightOnRectangle } from 'react-icons/hi2'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useProfile } from '@/features/profile/hooks/useProfile'

import { EmailVerificationPanel } from '../components/EmailVerificationPanel'
import { useEmailVerification } from '../hooks/useEmailVerification'
import styles from './AccountEmailVerification.module.scss'

type TokenStatus = 'verifying' | 'success' | 'already-verified' | 'error'

const dashboardPathForRole = (userRole?: string): string =>
  userRole === 'recruiter'
    ? '/recruiterDashboard/dashboard'
    : userRole === 'talent'
    ? '/talentDashboard'
    : '/adminDashboard/viewcandidates'

// Only ever resume into the apply wizard — anything else is rejected so this
// query param can never be turned into an open redirect.
const SAFE_REDIRECT_PATTERN = /^\/apply\/[A-Za-z0-9-]+$/

const AccountEmailVerification: React.FC = () => {
  const logout = useAuthStore((state) => state.logout)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get('token')
  const redirect = searchParams.get('redirect')
  const safeRedirect =
    redirect && SAFE_REDIRECT_PATTERN.test(redirect) ? redirect : null
  const continueTarget = safeRedirect ?? dashboardPathForRole(userRole)

  const { submitVerifyToken } = useEmailVerification()
  const { mutate } = useProfile()

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('verifying')
  // Tracks which token value has already been submitted, so the same token
  // never double-fires (e.g. StrictMode's double-invoke) while a genuinely
  // different token (a fresh mount via a new emailed link) always does.
  const processedTokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!token || processedTokenRef.current === token) return
    processedTokenRef.current = token
    setTokenStatus('verifying')

    submitVerifyToken(token)
      .then(() => setTokenStatus('success'))
      .catch(async () => {
        if (isLoggedIn) {
          const refreshed = await mutate()
          if (refreshed?.data?.user?.emailVerifiedAt) {
            setTokenStatus('already-verified')
            return
          }
        }
        setTokenStatus('error')
      })
  }, [token])

  useEffect(() => {
    if (token && tokenStatus === 'success' && isLoggedIn) {
      navigate(continueTarget, { replace: true })
    }
  }, [token, tokenStatus, isLoggedIn, continueTarget, navigate])

  if (token) {
    if (tokenStatus === 'verifying') {
      return <Spinner fullPage />
    }

    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <img className={styles.logo} src={logo} alt="company" />
        </div>

        <div className={styles.content}>
          {tokenStatus === 'success' && (
            <>
              <h1 className={styles.title}>Email verified</h1>
              <p className={styles.subtitle}>Your email has been verified.</p>
              {!isLoggedIn && (
                <Link to="/login">
                  <Button>Log in</Button>
                </Link>
              )}
            </>
          )}

          {tokenStatus === 'already-verified' && (
            <>
              <h1 className={styles.title}>Already verified</h1>
              <p className={styles.subtitle}>
                Your email address is already verified.
              </p>
              <Button onClick={() => navigate(continueTarget)}>
                {safeRedirect ? 'Continue application' : 'Go to dashboard'}
              </Button>
            </>
          )}

          {tokenStatus === 'error' && (
            <>
              <h1 className={styles.title}>Link invalid or expired</h1>
              <p className={styles.subtitle}>
                This verification link is invalid or has expired.
              </p>
              {isLoggedIn ? (
                <Button
                  onClick={() =>
                    setSearchParams(
                      safeRedirect ? { redirect: safeRedirect } : {},
                    )
                  }>
                  Resend verification email
                </Button>
              ) : (
                <Link to="/login">
                  <Button>Log in to resend</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

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

        <EmailVerificationPanel redirectPath={safeRedirect ?? undefined} />
      </div>
    </div>
  )
}

export default AccountEmailVerification
