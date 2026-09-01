import { FormikProvider, useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Alert } from '@/components/feedback'
import {
  FormikFocusOnError,
  PasswordInput,
  useFocusFieldOnMount,
} from '@/components/forms'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { paths } from '@/paths'

import { AuthLayout } from '../components/AuthLayout'
import { useResetPassword } from '../hooks/useResetPassword'
import { destinationAfterAuth } from '../utils/dashboardPath'
import { resetPasswordSchema } from '../validation/AuthValidationSchema'
import styles from './ResetPasswordPage.module.scss'

type TokenStatus = 'missing' | 'validating' | 'valid' | 'invalid'

type ResetPasswordValues = {
  password: string
  confirmPassword: string
}

const initialValues: ResetPasswordValues = {
  password: '',
  confirmPassword: '',
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() || ''
  const nextPath = searchParams.get('next')
  const { submitValidateToken, submitResetPassword, isResetting } =
    useResetPassword()

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(
    token ? 'validating' : 'missing',
  )
  const [submitError, setSubmitError] = useState<string | null>(null)
  const processedTokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!token) {
      setTokenStatus('missing')
      return
    }
    if (processedTokenRef.current === token) return
    processedTokenRef.current = token
    setTokenStatus('validating')

    submitValidateToken(token)
      .then(() => setTokenStatus('valid'))
      .catch(() => setTokenStatus('invalid'))
  }, [token])

  const formik = useFormik<ResetPasswordValues>({
    initialValues,
    validationSchema: resetPasswordSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (!token || isResetting) return
      setSubmitError(null)
      try {
        const data = await submitResetPassword({
          token,
          password: values.password,
        })
        const destination = destinationAfterAuth(
          data.data?.user.userRole,
          nextPath,
        )
        navigate(destination, { replace: true })
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : 'Failed to update password. Please try again.',
        )
      }
    },
  })

  useFocusFieldOnMount('password')

  if (tokenStatus === 'validating') {
    return <Spinner fullPage />
  }

  if (tokenStatus === 'missing' || tokenStatus === 'invalid') {
    return (
      <AuthLayout
        title="Reset link expired"
        subtitle="This password reset link is invalid or has expired.">
        <div>
          <Alert variant="error" className={styles.alert}>
            Request a new password reset to continue.
          </Alert>
          <div className={styles.actions}>
            <Link to={`/${paths.forgotPassword}`}>
              <Button type="button" fullWidth>
                Request a new reset
              </Button>
            </Link>
          </div>
          <div className={styles.already}>
            <Link to={`/${paths.login}`}>Back to log in</Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password">
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <FormikFocusOnError />
          {submitError && (
            <Alert variant="error" className={styles.alert}>
              {submitError}
            </Alert>
          )}

          <p className={styles.hint}>
            Use 8–72 characters with a letter, a number, and a special character
            (@ $ ! % * # . ? &).
          </p>

          <PasswordInput
            title="New password"
            label="password"
            name="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter a new password"
            error={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''
            }
          />

          <PasswordInput
            title="Confirm password"
            label="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm your new password"
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ''
            }
          />

          <div className={styles.actions}>
            <Button
              type="submit"
              fullWidth
              loading={isResetting}
              disabled={!formik.isValid || isResetting}>
              Change password
            </Button>
          </div>
        </form>
      </FormikProvider>
    </AuthLayout>
  )
}
