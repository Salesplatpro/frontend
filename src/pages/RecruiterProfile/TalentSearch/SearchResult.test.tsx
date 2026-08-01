import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import SearchResult from './SearchResult'

const { useSearchTalentDbQueryMock } = vi.hoisted(() => ({
  useSearchTalentDbQueryMock: vi.fn(),
}))

vi.mock('../../../redux/api/recruiter', () => ({
  useSearchTalentDbQuery: useSearchTalentDbQueryMock,
  useGetCampaignNameQuery: () => ({ data: undefined, isLoading: false }),
}))

const talent = (id: string) => ({
  id,
  firstName: 'Ada',
  lastName: 'Lovelace',
  profile: {
    role: [{ id: 'r1', name: 'Software Engineer' }],
    experience: '4-6 years',
  },
})

const renderAt = (search = '?role=role-1') =>
  render(
    <MemoryRouter initialEntries={[`/talent-search/results${search}`]}>
      <Routes>
        <Route path="/talent-search/results" element={<SearchResult />} />
      </Routes>
    </MemoryRouter>,
  )

describe('SearchResult (standalone Talent Search page)', () => {
  it('shows a spinner while loading', () => {
    useSearchTalentDbQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    })
    const { container } = renderAt()

    expect(container.firstChild).toHaveProperty(
      'className',
      expect.stringContaining('fullPage'),
    )
    expect(screen.queryByText('No talents fit this description')).toBeNull()
  })

  it('shows a friendly error state instead of a raw error on failure', () => {
    useSearchTalentDbQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { status: 500 },
    })
    renderAt()

    expect(
      screen.getByText(
        /something went wrong while searching the talent database/i,
      ),
    ).toBeTruthy()
  })

  it('shows an empty state (not an error) when the search returns zero talents', () => {
    useSearchTalentDbQueryMock.mockReturnValue({
      data: { data: { talents: [] } },
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
    renderAt()

    expect(screen.getByText('No talents fit this description')).toBeTruthy()
  })

  it('renders matched talents without requiring any scout job context', () => {
    useSearchTalentDbQueryMock.mockReturnValue({
      data: { data: { talents: [talent('t1')] } },
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
    renderAt()

    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getByText('Software Engineer')).toBeTruthy()
    const lastCallArgs = useSearchTalentDbQueryMock.mock.calls.at(-1)?.[0]
    expect(lastCallArgs).not.toHaveProperty('scoutJobId')
  })

  it('disables Previous on the first page and disables Next when a page is short of a full page', () => {
    useSearchTalentDbQueryMock.mockReturnValue({
      data: { data: { talents: [talent('t1')] } },
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
    renderAt()

    expect(
      screen
        .getByRole('button', { name: /previous/i })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(
      screen.getByRole('button', { name: /next/i }).hasAttribute('disabled'),
    ).toBe(true)
  })

  it('advances to the next page — requesting a new offset — when a full page of results is returned', () => {
    const fullPage = Array.from({ length: 20 }, (_, i) => talent(`t${i}`))
    useSearchTalentDbQueryMock.mockReturnValue({
      data: { data: { talents: fullPage } },
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
    renderAt()

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton.hasAttribute('disabled')).toBe(false)

    fireEvent.click(nextButton)

    const lastCallArgs = useSearchTalentDbQueryMock.mock.calls.at(-1)?.[0]
    expect(lastCallArgs).toMatchObject({ offset: 20, limit: 20 })
  })
})
