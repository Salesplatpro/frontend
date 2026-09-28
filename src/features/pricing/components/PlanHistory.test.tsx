import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PlanHistoryEntry } from '../types'
import { PlanHistory } from './PlanHistory'

const { usePlanHistoryMock, refreshMock } = vi.hoisted(() => ({
  usePlanHistoryMock: vi.fn(),
  refreshMock: vi.fn(),
}))

vi.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({ profile: { activeOrganizationId: 'org-1' } }),
}))

vi.mock('../hooks/usePlanHistory', () => ({
  usePlanHistory: usePlanHistoryMock,
}))

vi.mock('../hooks/usePricingCatalog', () => ({
  usePricingCatalog: () => ({
    catalog: {
      plans: [
        { key: 'pay_per_use', name: 'Pay per Use' },
        { key: 'sme_basic', name: 'SME Basic' },
        { key: 'pro', name: 'Pro' },
      ],
    },
  }),
}))

const entry = (overrides: Partial<PlanHistoryEntry>): PlanHistoryEntry => ({
  id: 'h-1',
  fromPlan: 'pay_per_use',
  toPlan: 'sme_basic',
  billingInterval: 'monthly',
  reason: 'purchase',
  paymentId: 'pay-1',
  createdAt: '2026-08-01T10:00:00.000Z',
  ...overrides,
})

const mockHistory = (state: {
  history?: PlanHistoryEntry[]
  isLoading?: boolean
  error?: unknown
}) =>
  usePlanHistoryMock.mockReturnValue({
    history: state.history ?? [],
    isLoading: state.isLoading ?? false,
    error: state.error,
    refresh: refreshMock,
  })

const bodyRows = () => screen.getAllByRole('row').slice(1)

describe('PlanHistory', () => {
  beforeEach(() => {
    usePlanHistoryMock.mockReset()
    refreshMock.mockReset()
  })

  it('asks for the active organization’s history', () => {
    mockHistory({})
    render(<PlanHistory />)
    expect(usePlanHistoryMock).toHaveBeenCalledWith('org-1')
  })

  it('shows a spinner while loading, not the empty state', () => {
    mockHistory({ isLoading: true })
    render(<PlanHistory />)
    expect(screen.queryByText('No plan changes yet')).toBeNull()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('shows an empty state when the plan has never changed', () => {
    mockHistory({ history: [] })
    render(<PlanHistory />)
    expect(screen.getByText('No plan changes yet')).toBeTruthy()
  })

  it('lists each change with catalogue names, billing and a readable reason', () => {
    mockHistory({
      history: [
        entry({
          id: 'h-3',
          fromPlan: 'pro',
          toPlan: 'pay_per_use',
          billingInterval: null,
          reason: 'expired',
          paymentId: null,
          createdAt: '2026-09-15T10:00:00.000Z',
        }),
        entry({
          id: 'h-2',
          fromPlan: 'sme_basic',
          toPlan: 'pro',
          billingInterval: 'annually',
          createdAt: '2026-08-20T10:00:00.000Z',
        }),
        entry({ id: 'h-1' }),
      ],
    })
    render(<PlanHistory />)

    const rows = bodyRows()
    expect(rows).toHaveLength(3)

    const [expired, upgrade, first] = rows.map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )
    expect(expired).toEqual([
      '15 Sept 2026',
      'Pro→toPay per Use',
      '—',
      'Paid period ended',
    ])
    expect(upgrade).toEqual([
      '20 Aug 2026',
      'SME Basic→toPro',
      'Yearly',
      'Plan purchased',
    ])
    expect(first?.[1]).toBe('Pay per Use→toSME Basic')
    expect(first?.[2]).toBe('Monthly')
  })

  it.each([
    ['subscription_disabled', 'Subscription cancelled'],
    ['subscription_enabled', 'Subscription activated'],
  ] as const)('labels %s as “%s”', (reason, label) => {
    mockHistory({ history: [entry({ reason })] })
    render(<PlanHistory />)
    expect(screen.getByText(label)).toBeTruthy()
  })

  it('falls back to a title-cased key for a plan the catalogue no longer lists', () => {
    mockHistory({
      history: [entry({ fromPlan: 'paid', toPlan: 'legacy_gold' })],
    })
    render(<PlanHistory />)
    expect(screen.getByText('Paid')).toBeTruthy()
    expect(screen.getByText('Legacy Gold')).toBeTruthy()
  })

  it('treats a missing previous plan as Pay per Use', () => {
    mockHistory({ history: [entry({ fromPlan: null })] })
    render(<PlanHistory />)
    expect(screen.getByText('Pay per Use')).toBeTruthy()
  })

  it('shows an error with a retry that refetches', () => {
    mockHistory({ error: new Error('Network Error') })
    render(<PlanHistory />)

    expect(screen.getByText("We couldn't load your plan history")).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })
})
