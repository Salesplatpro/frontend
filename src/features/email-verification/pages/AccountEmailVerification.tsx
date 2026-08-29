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

const AccountEmailVerification: React.FC = () => {
  const logout = useAuthStore((state) => state.logout)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { submitVerifyToken } = useEmailVerification()
  const { mutate } = useProfile()

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('verifying')
  const hasRun = useRef(false)

  useEffect(() => {
    if (!token || hasRun.current) return
    hasRun.current = true

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
    // Runs exactly once per mount — hasRun guards against dependency changes
    // re-triggering the verify call.
  }, [token])

  useEffect(() => {
    if (token && tokenStatus === 'success' && isLoggedIn) {
      navigate(dashboardPathForRole(userRole), { replace: true })
    }
  }, [token, tokenStatus, isLoggedIn, userRole, navigate])

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
              <Button onClick={() => navigate(dashboardPathForRole(userRole))}>
                Go to dashboard
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
                <Button onClick={() => setSearchParams({})}>
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

        <EmailVerificationPanel />
      </div>
    </div>
  )
}

export default AccountEmailVerification
