import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ChooseMethod } from './ChooseMethod'

const { navigateMock, useGetCampaignNameQueryMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useGetCampaignNameQueryMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetCampaignNameQuery: useGetCampaignNameQueryMock,
}))

const renderAt = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/scout/${id}`]}>
      <Routes>
        <Route path="/scout/:id" element={<ChooseMethod />} />
      </Routes>
    </MemoryRouter>,
  )

describe('ChooseMethod (scout job ownership guard)', () => {
  it('shows a spinner while the scout job is being verified', () => {
    useGetCampaignNameQueryMock.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    })
    const { container } = renderAt('sj-1')

    expect(container.firstChild).toHaveProperty(
      'className',
      expect.stringContaining('fullPage'),
    )
    expect(screen.queryByText('Upload CVs')).toBeNull()
  })

  it('shows an empty state instead of upload/search options when the job is not found or not owned by this recruiter', () => {
    useGetCampaignNameQueryMock.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    })
    renderAt('sj-not-mine')

    expect(screen.getByText('Scout job not found')).toBeTruthy()
    expect(screen.queryByText('Upload CVs')).toBeNull()
    expect(screen.queryByText('Search Talent DB')).toBeNull()
  })

  it('navigates back to My Scout Jobs from the not-found state', () => {
    useGetCampaignNameQueryMock.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    })
    renderAt('sj-not-mine')

    fireEvent.click(screen.getByText('Back to My Scout Jobs'))

    expect(navigateMock).toHaveBeenCalledWith('/recruiterDashboard/scout')
  })

  it('renders exactly two method cards (upload CVs, search talent) once ownership is confirmed', () => {
    useGetCampaignNameQueryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: { id: 'sj-1', name: 'Q1 Engineering Scout' } },
    })
    renderAt('sj-1')

    expect(screen.getByText('Upload CVs')).toBeTruthy()
    expect(screen.getByText('Search Talent DB')).toBeTruthy()
  })

  it('navigates to the upload flow when the Upload CVs card is clicked', () => {
    useGetCampaignNameQueryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: { id: 'sj-1', name: 'Q1 Engineering Scout' } },
    })
    renderAt('sj-1')

    fireEvent.click(screen.getByText('Upload CVs'))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/upload-cv/sj-1',
    )
  })
})
