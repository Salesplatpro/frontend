import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ApplicationProgress } from './ApplicationProgress'

const { useApplicationMock, useUpdateApplicationStatusMock, updateStatusFn } =
  vi.hoisted(() => ({
    useApplicationMock: vi.fn(),
    useUpdateApplicationStatusMock: vi.fn(),
    updateStatusFn: vi.fn(),
  }))

vi.mock('@/features/applications/hooks/useApplication', () => ({
  useApplication: useApplicationMock,
}))
vi.mock('@/features/applications/hooks/useUpdateApplicationStatus', () => ({
  useUpdateApplicationStatus: useUpdateApplicationStatusMock,
}))
vi.mock('@/features/applications/hooks/useRegenerateVerdict', () => ({
  useRegenerateVerdict: () => ({
    regenerateVerdict: vi.fn(),
    isRegenerating: false,
  }),
}))
vi.mock('./Messaging/Messaging', () => ({
  Messaging: () => <div>messaging-stub</div>,
}))

const baseApplication = {
  talent: {
    id: 'talent-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    bio: 'Engineer',
    experience: '5-7 years',
    prescreeningScore: 80,
    cvFileName: 'ada-cv.pdf',
    cvUploadedAt: '2026-01-01T00:00:00.000Z',
  },
  cvSimilarityScore: 72,
  personalizedScore: 65,
  mbtiType: 'INTJ',
  status: 'awaiting_decision',
  currentStage: 'completed',
  matchVerdict: 'high',
  matchVerdictReasoning: 'Strong alignment with role requirements.',
  rank: 1,
  job: { noOfApplicants: 5 },
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/app-1']}>
      <Routes>
        <Route path="/:applicationId" element={<ApplicationProgress />} />
      </Routes>
    </MemoryRouter>,
  )

describe('ApplicationProgress', () => {
  it('renders the AI verdict badge with reasoning when a verdict is present', () => {
    useApplicationMock.mockReturnValue({
      data: { data: { application: baseApplication } },
      error: null,
      isLoading: false,
    })
    useUpdateApplicationStatusMock.mockReturnValue({
      updateStatus: updateStatusFn,
      isUpdating: false,
    })

    renderPage()

    expect(screen.getByText('High Match')).toBeTruthy()
  })

  it('shows an "Analyzing match…" state when the pipeline is complete but no verdict yet', () => {
    useApplicationMock.mockReturnValue({
      data: {
        data: {
          application: {
            ...baseApplication,
            matchVerdict: null,
            matchVerdictReasoning: null,
          },
        },
      },
      error: null,
      isLoading: false,
    })
    useUpdateApplicationStatusMock.mockReturnValue({
      updateStatus: updateStatusFn,
      isUpdating: false,
    })

    renderPage()

    expect(screen.getByText(/Analyzing match/)).toBeTruthy()
  })

  it('renders a CV open control when the talent has an uploaded CV', () => {
    useApplicationMock.mockReturnValue({
      data: { data: { application: baseApplication } },
      error: null,
      isLoading: false,
    })
    useUpdateApplicationStatusMock.mockReturnValue({
      updateStatus: updateStatusFn,
      isUpdating: false,
    })

    renderPage()

    expect(screen.getByRole('button', { name: 'ada-cv.pdf' })).toBeTruthy()
  })

  it('calls updateStatus with "shortlisted" when the Shortlist button is clicked', () => {
    useApplicationMock.mockReturnValue({
      data: { data: { application: baseApplication } },
      error: null,
      isLoading: false,
    })
    useUpdateApplicationStatusMock.mockReturnValue({
      updateStatus: updateStatusFn,
      isUpdating: false,
    })

    renderPage()
    fireEvent.click(screen.getByText('Shortlist'))

    expect(updateStatusFn).toHaveBeenCalledWith('shortlisted')
  })
})
