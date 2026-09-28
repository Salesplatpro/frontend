import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProfileStore } from '@/features/profile/store/useProfileStore'

import { ProductTourHost } from './ProductTourHost'
import { useTourStore } from './useTourStore'

const { completeTourMock, profileRef } = vi.hoisted(() => ({
  completeTourMock: vi.fn(),
  profileRef: { current: null as Record<string, unknown> | null },
}))

vi.mock('@/features/profile/services/profileService', () => ({
  completeTour: completeTourMock,
}))
vi.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({ profile: profileRef.current }),
}))

const renderHost = ({
  path = '/recruiterDashboard/dashboard',
  state,
  blocked,
}: { path?: string; state?: unknown; blocked?: boolean } = {}) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: path, state }]}>
      <ProductTourHost
        audience="recruiter"
        homePath="/recruiterDashboard/dashboard"
        blocked={blocked}
      />
    </MemoryRouter>,
  )

const newRecruiter = { userRole: 'recruiter', tourCompletedAt: null }

describe('ProductTourHost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    useTourStore.getState().stop()
    useProfileStore.getState().setProfile({ ...newRecruiter })
    profileRef.current = { ...newRecruiter }
    completeTourMock.mockResolvedValue({
      data: { tourCompletedAt: '2026-09-28T10:00:00.000Z' },
    })
  })

  it('starts for a new user on the dashboard', () => {
    renderHost()
    expect(
      screen.getByRole('dialog', { name: /welcome to auxhr/i }),
    ).toBeTruthy()
  })

  it.each([
    ['the tour was already done', { tourCompletedAt: '2026-01-01' }],
    ['the API did not say', { tourCompletedAt: undefined }],
    ['the user has another role', { userRole: 'talent' }],
  ])('does not start when %s', (_label, patch) => {
    profileRef.current = { ...newRecruiter, ...patch }
    renderHost()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not start before the profile has loaded', () => {
    profileRef.current = null
    renderHost()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('waits for the dashboard home page', () => {
    renderHost({ path: '/recruiterDashboard/postjob' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('waits for the welcome modal to close', () => {
    renderHost({ state: { showWelcomeModal: true } })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('waits while it is blocked', () => {
    renderHost({ blocked: true })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not start again after being dismissed this session', () => {
    window.sessionStorage.setItem('auxhr-tour-dismissed-recruiter', '1')
    renderHost()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('records completion when the first-run tour is skipped', async () => {
    renderHost()
    fireEvent.click(screen.getByRole('button', { name: /skip tour/i }))

    expect(screen.queryByRole('dialog')).toBeNull()
    await waitFor(() => expect(completeTourMock).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(useProfileStore.getState().profile?.tourCompletedAt).toBe(
        '2026-09-28T10:00:00.000Z',
      ),
    )
    expect(
      window.sessionStorage.getItem('auxhr-tour-dismissed-recruiter'),
    ).toBe('1')
  })

  it('stays closed when saving completion fails', async () => {
    completeTourMock.mockRejectedValue(new Error('offline'))
    renderHost()
    fireEvent.click(screen.getByRole('button', { name: /skip tour/i }))

    await waitFor(() => expect(completeTourMock).toHaveBeenCalled())
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(useProfileStore.getState().profile?.tourCompletedAt).toBeNull()
  })

  it('replays on request without saving anything', async () => {
    profileRef.current = {
      userRole: 'recruiter',
      tourCompletedAt: '2026-01-01',
    }
    renderHost({ path: '/recruiterDashboard/guide' })

    act(() => useTourStore.getState().start('recruiter'))
    expect(
      screen.getByRole('dialog', { name: /welcome to auxhr/i }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /skip tour/i }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(completeTourMock).not.toHaveBeenCalled()
  })

  it('ignores a tour started for the other role', () => {
    renderHost({ path: '/recruiterDashboard/guide' })
    act(() => useTourStore.getState().start('talent'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
