import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { MyScoutJobs } from './MyScoutJobs'

const { navigateMock, useGetScoutJobsQueryMock, deleteScoutJobMock } =
  vi.hoisted(() => ({
    navigateMock: vi.fn(),
    useGetScoutJobsQueryMock: vi.fn(),
    deleteScoutJobMock: vi.fn(),
  }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutJobsQuery: useGetScoutJobsQueryMock,
  useGetCampaignNameQuery: () => ({ data: undefined, isLoading: false }),
  useDeleteScoutJobMutation: () => [deleteScoutJobMock, { isLoading: false }],
}))

const scoutJobRow = {
  id: 'sj-1',
  name: 'Q1 Engineering Scout',
  role: { name: 'Software Engineer' },
  createdAt: '2026-01-01T00:00:00.000Z',
}

// The row's actions cell renders a "Scout" button followed by the kebab
// dropdown trigger — the trigger is the last button within the row.
const openRowActionsMenu = () => {
  const row = screen.getByText('Q1 Engineering Scout').closest('tr')!
  const rowButtons = within(row).getAllByRole('button')
  fireEvent.click(rowButtons[rowButtons.length - 1])
}

describe('MyScoutJobs (scout history list)', () => {
  it('shows an empty state with a Create New CTA when there are no scout jobs', () => {
    useGetScoutJobsQueryMock.mockReturnValue({
      data: { data: { scoutJobs: [] } },
      isLoading: false,
      isError: false,
    })
    render(
      <MemoryRouter>
        <MyScoutJobs />
      </MemoryRouter>,
    )

    expect(screen.getByText('No scout jobs yet')).toBeTruthy()
  })

  it('shows an error state distinct from the empty state when the list fails to load', () => {
    useGetScoutJobsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    render(
      <MemoryRouter>
        <MyScoutJobs />
      </MemoryRouter>,
    )

    expect(screen.getByText("Couldn't load your scout jobs")).toBeTruthy()
    expect(screen.queryByText('No scout jobs yet')).toBeNull()
  })

  it('lists previously created scout jobs and navigates to history from the actions menu', () => {
    useGetScoutJobsQueryMock.mockReturnValue({
      data: { data: { scoutJobs: [scoutJobRow] } },
      isLoading: false,
      isError: false,
    })
    render(
      <MemoryRouter>
        <MyScoutJobs />
      </MemoryRouter>,
    )

    expect(screen.getByText('Q1 Engineering Scout')).toBeTruthy()
    expect(screen.getByText('Software Engineer')).toBeTruthy()

    openRowActionsMenu()
    fireEvent.click(screen.getByText('View History'))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/history/sj-1',
    )
  })

  it('deletes a scout campaign after the confirm dialog is accepted', async () => {
    useGetScoutJobsQueryMock.mockReturnValue({
      data: { data: { scoutJobs: [scoutJobRow] } },
      isLoading: false,
      isError: false,
    })
    deleteScoutJobMock.mockReturnValue({ unwrap: () => Promise.resolve({}) })
    render(
      <MemoryRouter>
        <MyScoutJobs />
      </MemoryRouter>,
    )

    openRowActionsMenu()
    fireEvent.click(screen.getByText('Delete'))

    const confirmButton = await screen.findByRole('button', {
      name: 'Delete Campaign',
    })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(deleteScoutJobMock).toHaveBeenCalledWith('sj-1')
    })
  })
})
