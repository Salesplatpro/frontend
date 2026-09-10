import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Alert } from '@/components/feedback'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { loginPathWithNext } from '@/features/auth/utils/dashboardPath'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import {
  acceptOrganizationInvite,
  fetchOrganizationInvitePreview,
} from '@/features/organizations/services/organizationService'
import { OrganizationInvitePreview } from '@/features/organizations/types'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'

import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'
import { useAuthStore } from '../store/useAuthStore'
import styles from './JoinCompanyInvitePage.module.scss'

export const JoinCompanyInvitePage = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)
  const userEmail = useAuthStore((state) => state.user?.email)
  const { profile } = useProfile()
  const { mutate: mutateOrganizations } = useMyOrganizations()

  const [preview, setPreview] = useState<OrganizationInvitePreview | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [acceptError, setAcceptError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(true)

  const redirectPath = token ? `/join-company/${token}` : undefined

  useEffect(() => {
    if (!token) {
      setLoadError('This invite link is invalid.')
      setIsLoadingPreview(false)
      return
    }

    fetchOrganizationInvitePreview(token)
      .then((res) => setPreview(res.data.invite))
      .catch((error) =>
        setLoadError(getErrorMessage(error, 'This invite link is invalid.')),
      )
      .finally(() => setIsLoadingPreview(false))
  }, [token])

  useEffect(() => {
    if (
      !token ||
      !preview ||
      !isLoggedIn ||
      userRole !== 'recruiter' ||
      !profile?.emailVerifiedAt
    ) {
      return
    }

    if (userEmail?.toLowerCase() !== preview.invitedEmail.toLowerCase()) {
      return
    }

    let cancelled = false
    setIsAccepting(true)
    acceptOrganizationInvite(token)
      .then(async () => {
        if (cancelled) return
        await mutateOrganizations()
        navigate('/recruiterDashboard/dashboard', {
          replace: true,
          state: {
            toast: {
              type: 'success',
              message: `You joined ${preview.organizationName}.`,
            },
          },
        })
      })
      .catch((error) => {
        if (cancelled) return
        setAcceptError(getErrorMessage(error, 'Failed to accept invite'))
      })
      .finally(() => {
        if (!cancelled) setIsAccepting(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    token,
    preview,
    isLoggedIn,
    userRole,
    userEmail,
    profile?.emailVerifiedAt,
    navigate,
    mutateOrganizations,
  ])

  if (isLoadingPreview || isAccepting) {
    return <Spinner fullPage />
  }

  if (loadError || !preview || !token) {
    return (
      <AuthLayout
        title="Invite unavailable"
        subtitle="This company invite can no longer be used.">
        <Alert variant="error">{loadError ?? 'Invite not found.'}</Alert>
        <div className={styles.footerLinks}>
          <Link to="/login">Go to login</Link>
        </div>
      </AuthLayout>
    )
  }

  if (
    isLoggedIn &&
    userEmail?.toLowerCase() !== preview.invitedEmail.toLowerCase()
  ) {
    return (
      <AuthLayout
        title="Wrong account"
        subtitle={`This invite was sent to ${preview.invitedEmail}.`}>
        <Alert variant="error">
          Sign in with {preview.invitedEmail} to join {preview.organizationName}
          .
        </Alert>
        <div className={styles.footerLinks}>
          <Link to={loginPathWithNext(redirectPath!)}>Switch account</Link>
        </div>
      </AuthLayout>
    )
  }

  if (isLoggedIn && userRole !== 'recruiter') {
    return (
      <AuthLayout
        title="Recruiter account required"
        subtitle={`Join ${preview.organizationName} as a recruiter.`}>
        <Alert variant="error">
          Talent accounts cannot accept company invites. Sign up or log in as a
          recruiter using {preview.invitedEmail}.
        </Alert>
      </AuthLayout>
    )
  }

  if (isLoggedIn && !profile?.emailVerifiedAt) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle={`Confirm ${preview.invitedEmail} before joining ${preview.organizationName}.`}>
        <Alert variant="warning">
          Check your inbox for a verification link. After verifying, you will
          join your team automatically.
        </Alert>
        <Button
          type="button"
          fullWidth
          onClick={() => navigate('/verify-email')}>
          Go to email verification
        </Button>
      </AuthLayout>
    )
  }

  if (acceptError) {
    return (
      <AuthLayout
        title="Could not join company"
        subtitle={preview.organizationName}>
        <Alert variant="error">{acceptError}</Alert>
      </AuthLayout>
    )
  }

  if (preview.inviteeExists) {
    return (
      <AuthLayout
        title={`Join ${preview.organizationName}`}
        subtitle="Log in with your recruiter account to accept this invite.">
        {preview.inviteeHasPaidPlan && (
          <Alert variant="warning">
            You are on a paid plan. Switch to the free plan before joining a
            company team.
          </Alert>
        )}
        <p className={styles.lead}>
          You were invited to join <strong>{preview.organizationName}</strong>.
          Log in with <strong>{preview.invitedEmail}</strong> to continue.
        </p>
        <LoginForm />
        <div className={styles.footerLinks}>
          <Link to={loginPathWithNext(redirectPath!)}>
            Use a different account
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={`Join ${preview.organizationName}`}
      subtitle="Create your recruiter account to accept this invite.">
      <p className={styles.lead}>
        You were invited to join <strong>{preview.organizationName}</strong> as
        a recruiter. Sign up with <strong>{preview.invitedEmail}</strong> —
        talent signup is not available for company invites.
      </p>

      <SignupForm
        forceRecruiter
        lockedEmail={preview.invitedEmail}
        onSuccess={() => navigate('/verify-email')}
      />

      <div className={styles.footerLinks}>
        Already have a recruiter account?{' '}
        <Link to={loginPathWithNext(redirectPath!)}>Log in</Link>
      </div>
    </AuthLayout>
  )
}
