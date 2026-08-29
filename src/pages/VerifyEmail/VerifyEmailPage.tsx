import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useEmailVerification } from '@/features/email-verification/hooks/useEmailVerification'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './VerifyEmailPage.module.scss'

type Status = 'verifying' | 'success' | 'already-verified' | 'error'

const dashboardPathForRole = (userRole?: string): string =>
  userRole === 'recruiter'
    ? '/recruiterDashboard/dashboard'
    : userRole === 'talent'
    ? '/talentDashboard'
    : '/adminDashboard/viewcandidates'

const verifyEmailPathForRole = (userRole?: string): string =>
  userRole === 'recruiter'
    ? '/recruiterDashboard/verify-email'
    : '/talentDashboard/verify-email'

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)
  const { submitVerifyToken } = useEmailVerification()
  const { mutate } = useProfile()

  const [status, setStatus] = useState<Status>('verifying')
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (!token) {
      setStatus('error')
      return
    }

    submitVerifyToken(token)
      .then(() => setStatus('success'))
      .catch(async () => {
        if (isLoggedIn) {
          const refreshed = await mutate()
          if (refreshed?.data?.user?.emailVerifiedAt) {
            setStatus('already-verified')
            return
          }
        }
        setStatus('error')
      })
    // Runs exactly once per mount — hasRun guards against dependency changes
    // re-triggering the verify call.
  }, [])

  useEffect(() => {
    if (status === 'success' && isLoggedIn) {
      navigate(dashboardPathForRole(userRole), { replace: true })
    }
  }, [status, isLoggedIn, userRole, navigate])

  if (status === 'verifying') {
    return <Spinner fullPage />
  }

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <img className={styles.logo} src={logo} alt="company" />
        <h1 className={styles.title}>Email verified</h1>
        <p className={styles.message}>Your email has been verified.</p>
        {!isLoggedIn && (
          <Link to="/login">
            <Button>Log in</Button>
          </Link>
        )}
      </div>
    )
  }

  if (status === 'already-verified') {
    return (
      <div className={styles.page}>
        <img className={styles.logo} src={logo} alt="company" />
        <h1 className={styles.title}>Already verified</h1>
        <p className={styles.message}>
          Your email address is already verified.
        </p>
        <Button onClick={() => navigate(dashboardPathForRole(userRole))}>
          Go to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <img className={styles.logo} src={logo} alt="company" />
      <h1 className={styles.title}>Link invalid or expired</h1>
      <p className={styles.message}>
        This verification link is invalid or has expired.
      </p>
      {isLoggedIn ? (
        <Link to={verifyEmailPathForRole(userRole)}>
          <Button>Resend verification email</Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button>Log in to resend</Button>
        </Link>
      )}
    </div>
  )
}

export default VerifyEmailPage
