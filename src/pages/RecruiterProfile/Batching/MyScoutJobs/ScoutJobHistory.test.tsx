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
    data: {
      data: {
        scoutJob: {
          id: 'sj-1',
          name: 'Q1 Engineering Scout',
          jobBrief: 'We are hiring a senior backend engineer.',
          recruiterGuide: 'Weigh backend experience heavily.',
        },
      },
    },
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
              cvScore: 82,
              insights: 'Strong backend fit.',
              coverLetterScore: null,
              coverLetterInsights: null,
              evaluationScore: 82,
              candidateName: 'Ada Lovelace',
              candidateEmail: 'ada@example.com',
              candidatePhone: null,
              candidateAddress: null,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: 'r2',
              batchId: 'batch-2',
              cvName: 'resume2',
              cvScore: 65,
              insights: 'Some gaps in backend experience.',
              coverLetterScore: null,
              coverLetterInsights: null,
              evaluationScore: 65,
              candidateName: null,
              candidateEmail: null,
              candidatePhone: null,
              candidateAddress: null,
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

  it('renders the job description and does not render a Search Talent tab', () => {
    useGetScoutJobScoutsQueryMock.mockReturnValue({
      data: { data: { scoutReports: [] } },
      isLoading: false,
    })
    renderAt()

    expect(
      screen.getByText('We are hiring a senior backend engineer.'),
    ).toBeTruthy()
    expect(screen.queryByText('Search Talent')).toBeNull()
  })

  it('opens the candidate details panel with AI reasoning when "View details" is clicked', () => {
    useGetScoutJobScoutsQueryMock.mockReturnValue({
      data: {
        data: {
          scoutReports: [
            {
              id: 'r1',
              batchId: 'batch-1',
              cvName: 'resume1',
              cvScore: 82,
              insights: 'Strong backend fit.',
              coverLetterScore: null,
              coverLetterInsights: null,
              evaluationScore: 82,
              candidateName: 'Ada Lovelace',
              candidateEmail: 'ada@example.com',
              candidatePhone: null,
              candidateAddress: null,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
          ],
        },
      },
      isLoading: false,
    })
    renderAt()

    fireEvent.click(screen.getByText('View details'))

    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getByText('Strong backend fit.')).toBeTruthy()
  })
})
