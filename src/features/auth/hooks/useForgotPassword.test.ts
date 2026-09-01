import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useForgotPassword } from './useForgotPassword'

const { requestPasswordResetMock, notifyMock } = vi.hoisted(() => ({
  requestPasswordResetMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('../services/authService', () => ({
  requestPasswordReset: (...args: unknown[]) =>
    requestPasswordResetMock(...args),
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: (...args: unknown[]) => notifyMock(...args),
}))

describe('useForgotPassword', () => {
  beforeEach(() => {
    requestPasswordResetMock.mockReset()
    notifyMock.mockReset()
  })

  it('toasts a generic success after a valid request', async () => {
    requestPasswordResetMock.mockResolvedValue({
      data: { status: true, message: 'ok' },
    })
    const { result } = renderHook(() => useForgotPassword())

    await act(async () => {
      await result.current.submitForgotPassword({
        email: 'talent@example.com',
      })
    })

    expect(requestPasswordResetMock).toHaveBeenCalledWith({
      email: 'talent@example.com',
    })
    expect(notifyMock).toHaveBeenCalledWith(
      'success',
      expect.stringMatching(/mailbox/i),
      expect.any(Object),
    )
  })

  it('surfaces an API failure without a success toast', async () => {
    requestPasswordResetMock.mockRejectedValue({
      response: { data: { error: { message: 'Too many requests' } } },
    })
    const { result } = renderHook(() => useForgotPassword())

    await act(async () => {
      await expect(
        result.current.submitForgotPassword({ email: 'talent@example.com' }),
      ).rejects.toThrow('Too many requests')
    })

    expect(notifyMock).not.toHaveBeenCalledWith(
      'success',
      expect.anything(),
      expect.anything(),
    )
  })
})
