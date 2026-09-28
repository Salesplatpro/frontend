import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { planHistoryKey, usePlanHistory } from './usePlanHistory'

const { fetchPlanHistoryMock } = vi.hoisted(() => ({
  fetchPlanHistoryMock: vi.fn(),
}))

vi.mock('../services/planHistoryService', () => ({
  fetchPlanHistory: (...args: unknown[]) => fetchPlanHistoryMock(...args),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

describe('usePlanHistory', () => {
  beforeEach(() => {
    fetchPlanHistoryMock.mockReset()
  })

  it('keys the cache by organization so Verify can refresh it', () => {
    expect(planHistoryKey('org-1')).toBe('/organizations/org-1/plan-history')
  })

  it('returns the organization’s history', async () => {
    const history = [{ id: 'h-1', toPlan: 'pro' }]
    fetchPlanHistoryMock.mockResolvedValue({ data: { history } })

    const { result } = renderHook(() => usePlanHistory('org-1'), { wrapper })

    await waitFor(() => expect(result.current.history).toEqual(history))
    expect(fetchPlanHistoryMock).toHaveBeenCalledWith('org-1')
    expect(result.current.error).toBeUndefined()
  })

  it('does not fetch without an active organization', () => {
    const { result } = renderHook(() => usePlanHistory(null), { wrapper })

    expect(fetchPlanHistoryMock).not.toHaveBeenCalled()
    expect(result.current.history).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('surfaces a failed request as an error with an empty list', async () => {
    fetchPlanHistoryMock.mockRejectedValue(new Error('403'))

    const { result } = renderHook(() => usePlanHistory('org-1'), { wrapper })

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
    expect(result.current.history).toEqual([])
  })
})
