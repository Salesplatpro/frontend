import { fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CampaignDetail } from './CampaignDetail'

const { navigateMock, useGetScoutCampaignQueryMock, useGetScoutRunsQueryMock } =
  vi.hoisted(() => ({
    navigateMock: vi.fn(),
    useGetScoutCampaignQueryMock: vi.fn(),
    useGetScoutRunsQueryMock: vi.fn(),
  }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutCampaignQuery: useGetScoutCampaignQueryMock,
  useGetScoutRunsQuery: useGetScoutRunsQueryMock,
}))

const campaign = {
  id: 'c-1',
  name: 'Q1 Enterprise AE hiring',
  jobBrief: 'Sell payments software to Nigerian banks.',
  recruiterGuide: 'Prefer people who have sold to banks.',
  roleId: 'r-1',
  role: { id: 'r-1', name: 'Account Executive' },
  shortlistSize: 5,
  experienceLevel: '4-6 years',
  mustHaveSkills: ['negotiation'],
  niceToHaveSkills: ['salesforce'],
  workMode: 'hybrid',
  locationCountry: 'Nigeria',
  locationState: 'Lagos',
  locationCity: 'Ikeja',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const run = {
  id: 'run-1',
  scoutJobId: 'c-1',
  status: 'completed' as const,
  totalCvs: 12,
  shortlistSize: 5,
  createdAt: '2026-01-02T00:00:00.000Z',
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/recruiterDashboard/scout/c-1']}>
      <Routes>
        <Route
          path="/recruiterDashboard/scout/:campaignId"
          element={<CampaignDetail />}
        />
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.clearAllMocks()
  useGetScoutCampaignQueryMock.mockReturnValue({
    data: { data: { scoutJob: campaign } },
    isLoading: false,
    isError: false,
  })
  useGetScoutRunsQueryMock.mockReturnValue({
    data: { data: { runs: [run], total: 1 } },
    isLoading: false,
  })
})

describe('CampaignDetail', () => {
  it('shows what the AI was told, verbatim', () => {
    renderPage()

    expect(screen.getByText('Q1 Enterprise AE hiring')).toBeTruthy()
    expect(
      screen.getByText('Sell payments software to Nigerian banks.'),
    ).toBeTruthy()
    expect(
      screen.getByText('Prefer people who have sold to banks.'),
    ).toBeTruthy()
  })

  it('shows the targeting the AI weighs', () => {
    renderPage()

    expect(screen.getByText('5 candidates')).toBeTruthy()
    expect(screen.getByText('4-6 years')).toBeTruthy()
    expect(screen.getByText('Ikeja, Lagos, Nigeria')).toBeTruthy()
    expect(screen.getByText('negotiation')).toBeTruthy()
    expect(screen.getByText('salesforce')).toBeTruthy()
  })

  it('lists past runs with their outcome', () => {
    renderPage()

    expect(screen.getByText('Complete')).toBeTruthy()
    expect(screen.getByText('12')).toBeTruthy()
  })

  it('opens a run from the history', () => {
    renderPage()

    const row = screen.getByText('Complete').closest('tr')!
    fireEvent.click(within(row).getByRole('button', { name: 'View results' }))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/c-1/runs/run-1',
    )
  })

  it('invites a first upload when nothing has been run yet', () => {
    useGetScoutRunsQueryMock.mockReturnValue({
      data: { data: { runs: [], total: 0 } },
      isLoading: false,
    })
    renderPage()

    expect(screen.getByText('No CVs uploaded yet')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Upload CVs' }))
    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/c-1/upload',
    )
  })

  it('labels a run that finished with some CVs skipped', () => {
    useGetScoutRunsQueryMock.mockReturnValue({
      data: {
        data: {
          runs: [{ ...run, status: 'completed_with_errors' as const }],
          total: 1,
        },
      },
      isLoading: false,
    })
    renderPage()

    expect(screen.getByText('Complete, some skipped')).toBeTruthy()
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
