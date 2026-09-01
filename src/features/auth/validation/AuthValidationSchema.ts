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

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Enter a valid email address'),
})

const newPasswordValidation = () =>
  Yup.string()
    .required('Password is required')
    .min(8, 'Password must be between 8 and 72 characters')
    .max(72, 'Password must be between 8 and 72 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#?.&]{8,}$/,
      'Password must contain at least one number, one letter and one special character',
    )

export const resetPasswordSchema = Yup.object().shape({
  password: newPasswordValidation(),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: newPasswordValidation().test(
    'different-from-current',
    'New password must be different from current password',
    function (value) {
      return !value || value !== this.parent.currentPassword
    },
  ),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
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

  userType: Yup.string()
    .oneOf(['talent', 'recruiter'], 'Invalid user type')
    .required('User type is required'),
})
