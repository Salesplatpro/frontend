import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ScoutCampaigns } from './ScoutCampaigns'

const { navigateMock, useGetScoutCampaignsQueryMock, deleteCampaignMock } =
  vi.hoisted(() => ({
    navigateMock: vi.fn(),
    useGetScoutCampaignsQueryMock: vi.fn(),
    deleteCampaignMock: vi.fn(),
  }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutCampaignsQuery: useGetScoutCampaignsQueryMock,
  useDeleteScoutCampaignMutation: () => [
    deleteCampaignMock,
    { isLoading: false },
  ],
}))

const campaign = {
  id: 'c-1',
  name: 'Q1 Engineering Scout',
  jobBrief: 'brief',
  recruiterGuide: 'guide',
  roleId: 'r-1',
  role: { id: 'r-1', name: 'Software Engineer' },
  shortlistSize: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
  runCount: 2,
  cvsScanned: 14,
  bestScore: 91,
  lastActivityAt: new Date().toISOString(),
}

const mockResult = (
  scoutJobs: unknown[],
  overrides: Record<string, unknown> = {},
) =>
  useGetScoutCampaignsQueryMock.mockReturnValue({
    data: { data: { scoutJobs, total: scoutJobs.length } },
    isLoading: false,
    isError: false,
    ...overrides,
  })

const renderPage = () =>
  render(
    <MemoryRouter>
      <ScoutCampaigns />
    </MemoryRouter>,
  )

const openRowMenu = () => {
  const row = screen.getByText('Q1 Engineering Scout').closest('tr')!
  const buttons = within(row).getAllByRole('button')
  fireEvent.click(buttons[buttons.length - 1]!)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ScoutCampaigns', () => {
  it('invites the recruiter to create their first campaign when there are none', () => {
    mockResult([])
    renderPage()

    expect(screen.getByText('No campaigns yet')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Create your first campaign' }),
    )
    expect(navigateMock).toHaveBeenCalledWith('/recruiterDashboard/scout/new')
  })

  it('shows a distinct error state rather than an empty one when loading fails', () => {
    useGetScoutCampaignsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    renderPage()

    expect(screen.getByText("Couldn't load your campaigns")).toBeTruthy()
    expect(screen.queryByText('No campaigns yet')).toBeNull()
  })

  it('lists a campaign with its rollups', () => {
    mockResult([campaign])
    renderPage()

    expect(screen.getByText('Q1 Engineering Scout')).toBeTruthy()
    expect(screen.getByText('Software Engineer')).toBeTruthy()
    // CVs scanned and run count are the signal the old screen had no room for.
    expect(screen.getByText('14')).toBeTruthy()
    expect(screen.getByText('2 runs')).toBeTruthy()
  })

  it('shows placeholders for a campaign that has never been run', () => {
    mockResult([
      {
        ...campaign,
        runCount: 0,
        cvsScanned: 0,
        bestScore: null,
        lastActivityAt: null,
      },
    ])
    renderPage()

    expect(screen.getByText('No activity yet')).toBeTruthy()
    expect(screen.queryByText('2 runs')).toBeNull()
  })

  it('goes straight to upload from the primary row action', () => {
    mockResult([campaign])
    renderPage()

    const row = screen.getByText('Q1 Engineering Scout').closest('tr')!
    fireEvent.click(within(row).getByRole('button', { name: 'Upload CVs' }))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/c-1/upload',
    )
  })

  it('opens the campaign from the row menu', () => {
    mockResult([campaign])
    renderPage()

    openRowMenu()
    fireEvent.click(screen.getByText('View campaign'))

    expect(navigateMock).toHaveBeenCalledWith('/recruiterDashboard/scout/c-1')
  })

  it('deletes a campaign only after the confirm dialog is accepted', async () => {
    mockResult([campaign])
    deleteCampaignMock.mockReturnValue({ unwrap: () => Promise.resolve({}) })
    renderPage()

    openRowMenu()
    fireEvent.click(screen.getByText('Delete'))

    // The dialog spells out what is lost before anything is deleted.
    expect(screen.getByText(/every CV scored under it/i)).toBeTruthy()
    expect(deleteCampaignMock).not.toHaveBeenCalled()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Delete campaign' }),
    )
    await waitFor(() => {
      expect(deleteCampaignMock).toHaveBeenCalledWith('c-1')
    })
  })

  it('searches on the server rather than filtering the page in the browser', () => {
    mockResult([campaign])
    renderPage()

    // The search field lives in the collapsed filter panel.
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))
    fireEvent.change(screen.getByLabelText('Search campaigns'), {
      target: { value: 'lagos' },
    })

    const lastArgs = useGetScoutCampaignsQueryMock.mock.calls.at(-1)?.[0] as {
      search?: string
    }
    expect(lastArgs?.search).toBe('lagos')
  })

  it('requests only one page of rows at a time', () => {
    mockResult([campaign])
    renderPage()

    const args = useGetScoutCampaignsQueryMock.mock.calls[0]?.[0] as {
      limit?: number
      offset?: number
    }
    expect(args?.limit).toBe(10)
    expect(args?.offset).toBe(0)
  })
})
