import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ScoutJobHistory } from './ScoutJobHistory'

const { navigateMock, useGetScoutJobScoutsQueryMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useGetScoutJobScoutsQueryMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutJobScoutsQuery: useGetScoutJobScoutsQueryMock,
  useGetCampaignNameQuery: () => ({
    data: { data: { id: 'sj-1', name: 'Q1 Engineering Scout' } },
    isLoading: false,
  }),
}))

const renderAt = () =>
  render(
    <MemoryRouter initialEntries={['/scout/history/sj-1']}>
      <Routes>
        <Route
          path="/scout/history/:scoutJobId"
          element={<ScoutJobHistory />}
        />
      </Routes>
    </MemoryRouter>,
  )

describe('ScoutJobHistory (persisted batch results for a scout job)', () => {
  it('shows an empty state when no CVs have been scored for this job yet', () => {
    useGetScoutJobScoutsQueryMock.mockReturnValue({
      data: { data: { scoutReports: [] } },
      isLoading: false,
    })
    renderAt()

    expect(
      screen.getByText('No CVs have been scored for this job yet.'),
    ).toBeTruthy()
  })

  it('renders every persisted scout report for the job', () => {
    useGetScoutJobScoutsQueryMock.mockReturnValue({
      data: {
        data: {
          scoutReports: [
            {
              id: 'r1',
              batchId: 'batch-1',
              cvName: 'resume1',
              evaluationScore: 82,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: 'r2',
              batchId: 'batch-2',
              cvName: 'resume2',
              evaluationScore: 65,
              createdAt: '2026-01-02T00:00:00.000Z',
            },
          ],
        },
      },
      isLoading: false,
    })
    renderAt()

    expect(screen.getByText('resume1')).toBeTruthy()
    expect(screen.getByText('resume2')).toBeTruthy()
    expect(screen.getByText('82%')).toBeTruthy()
    expect(screen.getByText('65%')).toBeTruthy()
  })

  it('navigates to Talent Search — a distinct, live data source — instead of rendering it inline', () => {
    useGetScoutJobScoutsQueryMock.mockReturnValue({
      data: { data: { scoutReports: [] } },
      isLoading: false,
    })
    renderAt()

    fireEvent.click(screen.getByText('Search Talent'))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/search-talent/sj-1',
    )
  })
})
