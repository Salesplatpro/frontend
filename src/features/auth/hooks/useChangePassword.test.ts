import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '../store/useAuthStore'
import { AUTH_TOKEN_KEY } from '../utils/authPersistence'
import { useChangePassword } from './useChangePassword'

const { changePasswordRequestMock, notifyMock } = vi.hoisted(() => ({
  changePasswordRequestMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('../services/authService', () => ({
  changePasswordRequest: (...args: unknown[]) =>
    changePasswordRequestMock(...args),
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: (...args: unknown[]) => notifyMock(...args),
}))

describe('useChangePassword', () => {
  beforeEach(() => {
    changePasswordRequestMock.mockReset()
    notifyMock.mockReset()
    localStorage.clear()
    sessionStorage.clear()
    useAuthStore.setState({
      user: { email: 'talent@example.com', userRole: 'talent' },
      token: 'old-jwt',
      isLoggedIn: true,
      isSubmitting: false,
      error: null,
    })
    useAuthStore.getState().setSession(
      {
        user: { email: 'talent@example.com', userRole: 'talent' },
        token: 'old-jwt',
      },
      { persist: true },
    )
  })

  it('stores the returned session after a successful change', async () => {
    changePasswordRequestMock.mockResolvedValue({
      data: {
        data: {
          user: { email: 'talent@example.com', userRole: 'talent' },
          token: 'new-jwt',
        },
      },
    })
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await result.current.submitChangePassword({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
      })
    })

    expect(changePasswordRequestMock).toHaveBeenCalledWith({
      oldPassword: 'OldPassword1!',
      newPassword: 'NewPassword1!',
    })
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('new-jwt')
    expect(JSON.stringify(localStorage)).not.toContain('OldPassword1!')
    expect(JSON.stringify(localStorage)).not.toContain('NewPassword1!')
    expect(notifyMock).toHaveBeenCalledWith(
      'success',
      'Password changed successfully',
      expect.any(Object),
    )
  })

  it('does not replace the session when the request fails', async () => {
    changePasswordRequestMock.mockRejectedValue(new Error('Invalid password'))
    const { result } = renderHook(() => useChangePassword())

    await act(async () => {
      await expect(
        result.current.submitChangePassword({
          oldPassword: 'WrongPassword1!',
          newPassword: 'NewPassword1!',
        }),
      ).rejects.toThrow('Failed to change password. Please try again.')
    })

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('old-jwt')
    expect(notifyMock).not.toHaveBeenCalled()
  })
})
