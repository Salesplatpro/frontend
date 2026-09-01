import { describe, expect, it } from 'vitest'

import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './AuthValidationSchema'

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', async () => {
    await expect(
      forgotPasswordSchema.validate({ email: 'talent@example.com' }),
    ).resolves.toBeTruthy()
  })

  it('rejects an empty email', async () => {
    await expect(forgotPasswordSchema.validate({ email: '' })).rejects.toThrow(
      'Email is required',
    )
  })

  it('rejects an invalid email format', async () => {
    await expect(
      forgotPasswordSchema.validate({ email: 'not-an-email' }),
    ).rejects.toThrow('Enter a valid email address')
  })
})

describe('resetPasswordSchema', () => {
  it('accepts a password that meets backend rules', async () => {
    await expect(
      resetPasswordSchema.validate({
        password: 'NewPassword1!',
        confirmPassword: 'NewPassword1!',
      }),
    ).resolves.toBeTruthy()
  })

  it('rejects a password that is too short', async () => {
    await expect(
      resetPasswordSchema.validate({
        password: 'Ab1!',
        confirmPassword: 'Ab1!',
      }),
    ).rejects.toThrow('Password must be between 8 and 72 characters')
  })

  it('rejects mismatched confirmation', async () => {
    await expect(
      resetPasswordSchema.validate({
        password: 'NewPassword1!',
        confirmPassword: 'OtherPassword1!',
      }),
    ).rejects.toThrow('Passwords must match')
  })
})

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'OldPassword1!',
    newPassword: 'NewPassword1!',
    confirmPassword: 'NewPassword1!',
  }

  it('accepts a valid current, new, and confirm password', async () => {
    await expect(changePasswordSchema.validate(valid)).resolves.toBeTruthy()
  })

  it('rejects an empty current password', async () => {
    await expect(
      changePasswordSchema.validate({ ...valid, currentPassword: '' }),
    ).rejects.toThrow('Current password is required')
  })

  it('rejects a new password that is too short', async () => {
    await expect(
      changePasswordSchema.validate({
        ...valid,
        newPassword: 'Ab1!',
        confirmPassword: 'Ab1!',
      }),
    ).rejects.toThrow('Password must be between 8 and 72 characters')
  })

  it('rejects when the new password matches the current password', async () => {
    await expect(
      changePasswordSchema.validate({
        currentPassword: 'SamePassword1!',
        newPassword: 'SamePassword1!',
        confirmPassword: 'SamePassword1!',
      }),
    ).rejects.toThrow('New password must be different from current password')
  })

  it('rejects mismatched confirmation', async () => {
    await expect(
      changePasswordSchema.validate({
        ...valid,
        confirmPassword: 'OtherPassword1!',
      }),
    ).rejects.toThrow('Passwords must match')
  })
})
