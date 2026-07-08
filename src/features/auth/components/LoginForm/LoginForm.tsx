import { useFormik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'

import { Alert } from '@/components/feedback'
import { CheckBox, PasswordInput, TextInput } from '@/components/forms'
import { Button } from '@/components/ui/Button'
import { paths } from '@/paths'

import { useLogin } from '../../hooks/useLogin'
import { useAuthStore } from '../../store/useAuthStore'
import { LoginRequest } from '../../types'
import { loginSchema } from '../../validation/AuthValidationSchema'
import styles from './LoginForm.module.scss'

type LoginFormProps = {
  onForgotPassword: () => void
}

const initialValues: LoginRequest = { email: '', password: '' }

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { submitLogin, isLoading } = useLogin()
  const error = useAuthStore((state) => state.error)

  const formik = useFormik<LoginRequest>({
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

  return (
    <form onSubmit={formik.handleSubmit}>
      {error && (
        <Alert variant="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      <TextInput
        title="Email"
        label="email"
        name="email"
        autoComplete="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Email"
        error={
          formik.touched.email && formik.errors.email ? formik.errors.email : ''
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
        <CheckBox name="remember" label="Remember me" />
        <button
          type="button"
          className={styles.forgotPassword}
          onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>

      <Button type="submit" fullWidth loading={isLoading}>
        Log in
      </Button>

      <div className={styles.already}>
        Don&apos;t have an account?{' '}
        <Link to={`/${paths.register}`}>Sign up</Link>
      </div>
    </form>
  )
}
