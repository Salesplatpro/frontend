import { FormikProvider, useFormik } from 'formik'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Alert } from '@/components/feedback'
import {
  CheckBox,
  FormikFocusOnError,
  PasswordInput,
  TextInput,
  useFocusFieldOnMount,
} from '@/components/forms'
import { Button } from '@/components/ui/Button'
import { paths } from '@/paths'

import { useLogin } from '../../hooks/useLogin'
import { useAuthStore } from '../../store/useAuthStore'
import { LoginFormValues } from '../../types'
import { loginSchema } from '../../validation/AuthValidationSchema'
import styles from './LoginForm.module.scss'

const initialValues: LoginFormValues = {
  email: '',
  password: '',
  remember: false,
}

export const LoginForm = () => {
  const { submitLogin, isLoading } = useLogin()
  const error = useAuthStore((state) => state.error)
  const location = useLocation()

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await submitLogin(values)
      } catch {
        // error is surfaced via useAuthStore().error
      }
    },
  })

  useFocusFieldOnMount('email')

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} noValidate>
        <FormikFocusOnError />
        {error && (
          <Alert variant="error" className={styles.alert}>
            {error}
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

        <PasswordInput
          title="Password"
          label="password"
          name="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ''
          }
        />

        <div className={styles.rememberMe}>
          <CheckBox
            name="remember"
            label="Remember me"
            checked={formik.values.remember}
            onChange={formik.handleChange}
          />
          <Link
            to={`/${paths.forgotPassword}`}
            className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Log in
        </Button>

        <div className={styles.already}>
          Don&apos;t have an account?{' '}
          <Link
            to={{ pathname: `/${paths.register}`, search: location.search }}>
            Sign up
          </Link>
        </div>
      </form>
    </FormikProvider>
  )
}
