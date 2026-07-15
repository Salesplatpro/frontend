import { isValidPhoneNumber } from 'react-phone-number-input'
import * as Yup from 'yup'

const emailValidation = () => Yup.string().required('Email is required')

const passwordValidation = () =>
  Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )

const loginPasswordValidation = () =>
  Yup.string().required('Password is required')

export const loginSchema = Yup.object().shape({
  email: emailValidation(),
  password: loginPasswordValidation(),
})

export const SignUpSchema = Yup.object().shape({
  email: emailValidation(),
  password: passwordValidation(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),

  firstName: Yup.string()
    .required('First Name is required')
    .test('is-valid-name', 'First Name should only contain letters', (value) =>
      /^[a-zA-Z]+$/.test(value || ''),
    ),

  lastName: Yup.string()
    .required('Last Name is required')
    .test('is-valid-name', 'Last Name should only contain letters', (value) =>
      /^[a-zA-Z]+$/.test(value || ''),
    ),

  phone: Yup.string()
    .required('Phone number is required')
    .test('is-valid-phone', 'Invalid phone number', (value) => {
      if (!value) return false
      return isValidPhoneNumber(value)
    }),

  userType: Yup.string()
    .oneOf(['talent', 'recruiter'], 'Invalid user type')
    .required('User type is required'),
})
