import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useScoutStore } from '@/features/scout/store/useScoutStore'

import { UploadStep } from './UploadStep'

const { navigateMock, startRunMock, useGetScoutCampaignQueryMock, notifyMock } =
  vi.hoisted(() => ({
    navigateMock: vi.fn(),
    startRunMock: vi.fn(),
    useGetScoutCampaignQueryMock: vi.fn(),
    notifyMock: vi.fn(),
  }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutCampaignQuery: useGetScoutCampaignQueryMock,
  useStartScoutRunMutation: () => [startRunMock, { isLoading: false }],
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: notifyMock,
  notifyPromise: vi.fn(),
}))

const campaign = {
  id: 'c-1',
  name: 'Q1 Enterprise AE hiring',
  jobBrief: 'brief',
  recruiterGuide: 'guide',
  roleId: 'r-1',
  shortlistSize: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const pdf = (name: string): File =>
  new File(['x'], name, { type: 'application/pdf' })

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/recruiterDashboard/scout/c-1/upload']}>
      <Routes>
        <Route
          path="/recruiterDashboard/scout/:campaignId/upload"
          element={<UploadStep />}
        />
      </Routes>
    </MemoryRouter>,
  )

const fileInput = (container: HTMLElement): HTMLInputElement =>
  container.querySelector('input[type="file"]') as HTMLInputElement

const startButton = () => screen.getByRole('button', { name: 'Start scouting' })

beforeEach(() => {
  vi.clearAllMocks()
  useScoutStore.getState().resetScout()
  useGetScoutCampaignQueryMock.mockReturnValue({
    data: { data: { scoutJob: campaign } },
    isLoading: false,
    isError: false,
  })
  startRunMock.mockReturnValue({
    unwrap: () => Promise.resolve({ data: { run: { id: 'run-1' } } }),
  })
})

describe('UploadStep', () => {
  it('cannot start scouting with no CVs added', () => {
    renderPage()
    expect(startButton().hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('No CVs added yet')).toBeTruthy()
  })

  it('tells the recruiter honestly what happens to the CVs', () => {
    renderPage()
    expect(screen.getByText('How we handle these CVs')).toBeTruthy()
    expect(screen.getByText(/store each CV securely/i)).toBeTruthy()
    expect(screen.getByText(/other recruiters may also discover/i)).toBeTruthy()
    expect(
      screen.getByText(/only upload CVs you have permission to share/i),
    ).toBeTruthy()
  })

  it('says how many candidates the AI will shortlist', () => {
    renderPage()
    expect(screen.getByText(/the 5 best matches/i)).toBeTruthy()
  })

  it('enables Start once a CV is added and counts them', () => {
    const { container } = renderPage()

    fireEvent.change(fileInput(container), {
      target: { files: [pdf('a.pdf'), pdf('b.pdf')] },
    })

    expect(screen.getByText('2 CVs ready to review')).toBeTruthy()
    expect(startButton().hasAttribute('disabled')).toBe(false)
  })

  it('submits every CV with one idempotency key, then opens the run', async () => {
    const { container } = renderPage()
    const key = useScoutStore.getState().idempotencyKey

    fireEvent.change(fileInput(container), {
      target: { files: [pdf('a.pdf'), pdf('b.pdf')] },
    })
    fireEvent.click(startButton())

    await waitFor(() => {
      expect(startRunMock).toHaveBeenCalled()
    })
    const args = startRunMock.mock.calls[0]?.[0] as {
      campaignId: string
      body: FormData
    }
    expect(args.campaignId).toBe('c-1')
    expect(args.body.get('idempotencyKey')).toBe(key)
    expect(args.body.getAll('cv')).toHaveLength(2)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        '/recruiterDashboard/scout/c-1/runs/run-1',
      )
    })
  })

  it('clears the selection and issues a new key after a successful run', async () => {
    const { container } = renderPage()
    const key = useScoutStore.getState().idempotencyKey

    fireEvent.change(fileInput(container), {
      target: { files: [pdf('a.pdf')] },
    })
    fireEvent.click(startButton())

    await waitFor(() => {
      expect(useScoutStore.getState().cvFiles).toHaveLength(0)
    })
    // A fresh key: reusing it would make the server hand back the finished run.
    expect(useScoutStore.getState().idempotencyKey).not.toBe(key)
  })

  it('keeps the same key when the submit fails, so a retry is not a second run', async () => {
    startRunMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({ data: { error: { message: 'Network down' } } }),
    })
    const { container } = renderPage()
    const key = useScoutStore.getState().idempotencyKey

    fireEvent.change(fileInput(container), {
      target: { files: [pdf('a.pdf')] },
    })
    fireEvent.click(startButton())

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith('error', expect.any(String))
    })
    expect(useScoutStore.getState().idempotencyKey).toBe(key)
    expect(useScoutStore.getState().cvFiles).toHaveLength(1)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('reports a file it cannot accept instead of silently dropping it', () => {
    const { container } = renderPage()

    fireEvent.change(fileInput(container), {
      target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] },
    })

    expect(screen.getByText("1 file couldn't be added")).toBeTruthy()
    expect(startButton().hasAttribute('disabled')).toBe(true)
  })

  it('shows an error state when the campaign cannot be loaded', () => {
    useGetScoutCampaignQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    renderPage()

    expect(screen.getByText("Couldn't load this campaign")).toBeTruthy()
  })
})
