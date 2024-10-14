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
    .required('Phone Number is required')
    .test('valid-phone', 'Invalid phone number format', (value) =>
      /^[0-9]{10,15}$/.test(value || ''),
    ),

  userType: Yup.string()
    .oneOf(['talent', 'recruiter'], 'Invalid user type')
    .required('User type is required'),
})
