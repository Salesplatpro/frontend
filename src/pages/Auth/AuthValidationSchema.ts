import * as Yup from 'yup'

const emailValidation = () =>
  Yup.string()
    .test('valid-email', 'Invalid email format', (value) =>
      value ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : false,
    )
    .required('Email is required')

const passwordValidation = () =>
  Yup.string()
    .min(6, 'Password must be be at least 6 characters')
    .required('Password is required')
    .test('number', 'Password must have a number', (value) => /\d/.test(value))
    .test(
      'Special character',
      'Password must contain special characters',
      (value) => /[!#$%&*@^_]/.test(value),
    )

export const loginSchema = Yup.object().shape({
  email: emailValidation(),
  password: passwordValidation(),
})
