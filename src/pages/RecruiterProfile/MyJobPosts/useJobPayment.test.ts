import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useJobPayment } from './useJobPayment'

const { profileMock, activateJobPaymentMock, notifyMock } = vi.hoisted(() => ({
  profileMock: vi.fn(),
  activateJobPaymentMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({ profile: profileMock() }),
}))

vi.mock('@/redux/api/recruiter', () => ({
  useActivateJobPaymentMutation: () => [activateJobPaymentMock],
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: (...args: unknown[]) => notifyMock(...args),
}))

const onPlan = (billingPlan?: string) =>
  profileMock.mockReturnValue(
    billingPlan === undefined
      ? { activeOrganization: null }
      : { activeOrganization: { billingPlan } },
  )

describe('useJobPayment — canPay', () => {
  it.each([
    // plan, status, hasAiConfig, expected
    ['pay_per_use', 'pending_payment', false, true],
    ['pay_per_use', 'draft', true, true],
    ['pay_per_use', 'draft', false, false],
    ['pay_per_use', 'active', true, false],
    ['pay_per_use', 'closed', true, false],
    // A full subscription overflows activations into pending_payment.
    ['sme_basic', 'pending_payment', true, true],
    ['pro', 'pending_payment', false, true],
    // Subscribed drafts go through normal activation, not straight to checkout.
    ['sme_basic', 'draft', true, false],
    ['enterprise', 'active', true, false],
  ])('%s + %s (aiConfig: %s) → %s', (plan, status, hasAiConfig, expected) => {
    onPlan(plan)
    const { result } = renderHook(() => useJobPayment())
    expect(result.current.canPay(status, hasAiConfig)).toBe(expected)
  })

  it('treats a company with no plan written yet as pay-per-use', () => {
    onPlan(undefined)
    const { result } = renderHook(() => useJobPayment())
    expect(result.current.canPay('draft', true)).toBe(true)
  })
})

describe('useJobPayment — payForJob', () => {
  const assignMock = vi.fn()
  const originalLocation = window.location

  beforeEach(() => {
    onPlan('pay_per_use')
    activateJobPaymentMock.mockReset()
    notifyMock.mockReset()
    assignMock.mockReset()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign: assignMock },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('redirects to the checkout link and marks the job as paying', async () => {
    activateJobPaymentMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({ data: { link: 'https://checkout.example/abc' } }),
    })
    const { result } = renderHook(() => useJobPayment())

    await act(() => result.current.payForJob('job-1'))

    expect(activateJobPaymentMock).toHaveBeenCalledWith('job-1')
    expect(assignMock).toHaveBeenCalledWith('https://checkout.example/abc')
    expect(result.current.payingJobId).toBe('job-1')
    expect(notifyMock).not.toHaveBeenCalled()
  })

  it('shows the server’s error and clears the paying state when checkout is refused', async () => {
    activateJobPaymentMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: { message: 'Your plan still has job slots available' },
        }),
    })
    const { result } = renderHook(() => useJobPayment())

    await act(() => result.current.payForJob('job-1'))

    expect(assignMock).not.toHaveBeenCalled()
    expect(result.current.payingJobId).toBeNull()
    expect(notifyMock).toHaveBeenCalledWith('error', expect.any(String))
  })

  it('treats a response without a link as a failure', async () => {
    activateJobPaymentMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: {} }),
    })
    const { result } = renderHook(() => useJobPayment())

    await act(() => result.current.payForJob('job-1'))

    expect(assignMock).not.toHaveBeenCalled()
    expect(result.current.payingJobId).toBeNull()
    expect(notifyMock).toHaveBeenCalledWith('error', expect.any(String))
  })
})
