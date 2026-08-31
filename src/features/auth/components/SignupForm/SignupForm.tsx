import { Field, Form, Formik } from 'formik'
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
import { loginPathWithNext } from '@/features/auth/utils/dashboardPath'
import { paths } from '@/paths'

import { useSignup } from '../../hooks/useSignup'
import { useAuthStore } from '../../store/useAuthStore'
import { SignUpSchema } from '../../validation/AuthValidationSchema'
import { UserTypeSelect } from '../UserTypeSelect'
import styles from './SignupForm.module.scss'

type SignupFormValues = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  userType: 'talent' | 'recruiter' | ''
}

const userTypeOptions = [
  { value: 'talent', label: 'Talent' },
  { value: 'recruiter', label: 'Recruiter' },
]

type SignupFormProps = {
  onSuccess: (lastName: string, userType: 'talent' | 'recruiter') => void
  forceTalent?: boolean
  redirectPath?: string
}

export const SignupForm = ({
  onSuccess,
  forceTalent = false,
  redirectPath,
}: SignupFormProps) => {
  const { submitSignup, isLoading } = useSignup()
  const error = useAuthStore((state) => state.error)
  const location = useLocation()
  useFocusFieldOnMount('firstName')

  const initialValues: SignupFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: forceTalent ? 'talent' : '',
  }

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, userType, ...payload } = values
      const role = userType as 'talent' | 'recruiter'
      await submitSignup({
        ...payload,
        userType: role,
        ...(redirectPath ? { redirectPath } : {}),
      })
      onSuccess(values.lastName, role)
    } catch {
      // error is surfaced via useAuthStore().error
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={handleSubmit}>
      <Form noValidate>
        <FormikFocusOnError />
        {error && (
          <Alert variant="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        <Field
          title="First Name"
          label="firstName"
          name="firstName"
          autoComplete="given-name"
          as={TextInput}
          placeholder="Enter your First Name"
        />

        <Field
          title="Last Name"
          label="lastName"
          name="lastName"
          autoComplete="family-name"
          as={TextInput}
          placeholder="Enter your Last Name"
        />

        <Field
          title="Email"
          label="email"
          name="email"
          type="email"
          as={TextInput}
          autoComplete="email"
          placeholder="Email"
        />

        {!forceTalent && (
          <div className={styles.userType}>
            <Field
              name="userType"
              label="Register as:"
              component={UserTypeSelect}
              options={userTypeOptions}
            />
          </div>
        )}

        <Field
          title="Password"
          label="password"
          name="password"
          autoComplete="new-password"
          as={PasswordInput}
          placeholder="Enter your password"
        />

        <Field
          title="Confirm Password"
          label="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          as={PasswordInput}
          placeholder="Confirm your password"
        />

        <div className={styles.rememberMe}>
          <CheckBox name="remember" label="Remember me" />
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Sign Up
        </Button>

        <div className={styles.already}>
          Already have an account?{' '}
          <Link
            to={
              redirectPath
                ? loginPathWithNext(redirectPath)
                : { pathname: `/${paths.login}`, search: location.search }
            }>
            Log In
          </Link>
        </div>
      </Form>
    </Formik>
  )
}
