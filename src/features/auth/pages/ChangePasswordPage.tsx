import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'

import { Alert } from '@/components/feedback'
import {
  FormikFocusOnError,
  PasswordInput,
  useFocusFieldOnMount,
} from '@/components/forms'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

import { useChangePassword } from '../hooks/useChangePassword'
import { changePasswordSchema } from '../validation/AuthValidationSchema'
import styles from './ChangePasswordPage.module.scss'

type ChangePasswordValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const initialValues: ChangePasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export const ChangePasswordPage = () => {
  const { submitChangePassword, isChanging } = useChangePassword()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const formik = useFormik<ChangePasswordValues>({
    initialValues,
    validationSchema: changePasswordSchema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      if (isChanging) return
      setSubmitError(null)
      try {
        await submitChangePassword({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
        helpers.resetForm()
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : 'Failed to change password. Please try again.',
        )
      }
    },
  })

  useFocusFieldOnMount('currentPassword')

  return (
    <PageShell wide>
      <PageHero
        compact
        title="Change password"
        lead="Enter your current password, then choose a new one."
      />
      <div className={styles.formArea}>
        <Card className={styles.card}>
          <FormikProvider value={formik}>
            <form
              className={styles.form}
              onSubmit={formik.handleSubmit}
              noValidate>
              <FormikFocusOnError />
              {submitError && (
                <Alert variant="error" className={styles.alert}>
                  {submitError}
                </Alert>
              )}

              <p className={styles.hint}>
                Use 8–72 characters with a letter, a number, and a special
                character (@ $ ! % * # . ? &).
              </p>

              <PasswordInput
                title="Current password"
                label="currentPassword"
                name="currentPassword"
                autoComplete="current-password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your current password"
                error={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                    ? formik.errors.currentPassword
                    : ''
                }
              />

              <PasswordInput
                title="New password"
                label="newPassword"
                name="newPassword"
                autoComplete="new-password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter a new password"
                error={
                  formik.touched.newPassword && formik.errors.newPassword
                    ? formik.errors.newPassword
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
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : ''
                }
              />

              <div className={styles.actions}>
                <Button
                  type="submit"
                  loading={isChanging}
                  disabled={!formik.isValid || isChanging}>
                  Change password
                </Button>
              </div>
            </form>
          </FormikProvider>
        </Card>
      </div>
    </PageShell>
  )
}
