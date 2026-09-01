import 'react-responsive-modal/styles.css'

import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { Modal } from 'react-responsive-modal'
import { Link } from 'react-router-dom'

import CheckMark from '@/assets/CheckMark.png'
import { Alert } from '@/components/feedback'
import {
  FormikFocusOnError,
  TextInput,
  useFocusFieldOnMount,
} from '@/components/forms'
import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import { paths } from '@/paths'

import { AuthLayout } from '../components/AuthLayout'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { forgotPasswordSchema } from '../validation/AuthValidationSchema'
import styles from './ForgotPasswordPage.module.scss'

type ForgotPasswordValues = {
  email: string
}

const initialValues: ForgotPasswordValues = { email: '' }

export const ForgotPasswordPage = () => {
  const { submitForgotPassword, isRequesting } = useForgotPassword()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const formik = useFormik<ForgotPasswordValues>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (isRequesting) return
      setSubmitError(null)
      try {
        await submitForgotPassword({ email: values.email.trim() })
        setIsSuccessOpen(true)
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong.',
        )
      }
    },
  })

  useFocusFieldOnMount('email')

  return (
    <>
      <AuthLayout
        title="Forgot password"
        subtitle="Enter your email and we'll send a reset link">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <FormikFocusOnError />
            {submitError && (
              <Alert variant="error" className={styles.alert}>
                {submitError}
              </Alert>
            )}

            <TextInput
              title="Email"
              label="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ''
              }
            />

            <div className={styles.actions}>
              <Button
                type="submit"
                fullWidth
                loading={isRequesting}
                disabled={!formik.isValid || isRequesting}>
                Send reset link
              </Button>
            </div>

            <div className={styles.already}>
              Remember your password? <Link to={`/${paths.login}`}>Log in</Link>
            </div>
          </form>
        </FormikProvider>
      </AuthLayout>

      <Modal
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        center
        animationDuration={0}
        classNames={{
          root: 'dashboard-modal-overlay',
          overlay: 'dashboard-modal-overlay',
        }}>
        <div
          className={styles.modalContent}
          role="alertdialog"
          aria-modal="true">
          <img src={CheckMark} alt="" className={styles.checkmark} />
          <Heading level={2}>Check your mailbox</Heading>
          <Text as="p" color="primary" className={styles.description}>
            A password reset email was sent. Check your mailbox for a link to
            continue.
          </Text>
          <Button type="button" onClick={() => setIsSuccessOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
