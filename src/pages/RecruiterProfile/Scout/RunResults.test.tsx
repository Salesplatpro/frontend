import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useScoutStore } from '@/features/scout/store/useScoutStore'
import type {
  ScoutCv,
  ScoutRunProgress,
  ScoutRunStatus,
} from '@/features/scout/types'

import { RunResults } from './RunResults'

const {
  navigateMock,
  useGetScoutRunQueryMock,
  retryCvMock,
  downloadScoutReportMock,
  openCvMock,
  notifyMock,
} = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useGetScoutRunQueryMock: vi.fn(),
  retryCvMock: vi.fn(),
  downloadScoutReportMock: vi.fn(),
  openCvMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useGetScoutRunQuery: useGetScoutRunQueryMock,
  useRetryScoutCvMutation: () => [retryCvMock, { isLoading: false }],
}))

vi.mock('@/features/scout/services/scoutService', () => ({
  downloadScoutReport: downloadScoutReportMock,
  openScoutCandidateCv: openCvMock,
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: notifyMock,
  notifyPromise: vi.fn(),
}))

const cv = (overrides: Partial<ScoutCv> = {}): ScoutCv => ({
  id: 'cv-1',
  scoutRunId: 'run-1',
  cvName: 'ada-obi',
  status: 'scored',
  position: 0,
  rank: 1,
  shortlisted: true,
  evaluationScore: 88,
  cvScore: 88,
  recommendation:
    'She closed six-figure bank deals at Paystack for three years.',
  insights:
    'Strengths: Closed six-figure deals\nConcerns: No public-sector work',
  candidateName: 'Ada Obi',
  candidateEmail: 'ada@example.com',
  candidatePhone: '+2348012345678',
  candidateAddress: 'Lagos, Nigeria',
  candidateId: 'cand-1',
  attempts: 0,
  lastError: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

type MockRunOptions = {
  status?: ScoutRunStatus
  cvs?: ScoutCv[]
  totalCvs?: number
  progress?: ScoutRunProgress
  shortlistSummary?: string | null
}

const mockRun = ({
  status = 'completed',
  cvs = [cv()],
  totalCvs = 1,
  progress,
  shortlistSummary = 'Both finalists sell into banks.',
}: MockRunOptions = {}) =>
  useGetScoutRunQueryMock.mockReturnValue({
    data: {
      data: {
        run: {
          id: 'run-1',
          scoutJobId: 'c-1',
          status,
          totalCvs,
          shortlistSize: 2,
          shortlistSummary,
          createdAt: '2026-01-01T00:00:00.000Z',
          scoutJob: { id: 'c-1', name: 'Q1 Enterprise AE hiring' },
        },
        progress: progress ?? {
          queued: 0,
          processing: 0,
          scored: cvs.length,
          failed: 0,
        },
        cvs,
      },
    },
    isLoading: false,
    isError: false,
  })

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/recruiterDashboard/scout/c-1/runs/run-1']}>
      <Routes>
        <Route
          path="/recruiterDashboard/scout/:campaignId/runs/:runId"
          element={<RunResults />}
        />
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.clearAllMocks()
  useScoutStore.getState().resetScout()
  retryCvMock.mockReturnValue({ unwrap: () => Promise.resolve({}) })
  downloadScoutReportMock.mockResolvedValue(undefined)
})

describe('RunResults while the run is in flight', () => {
  it('shows progress and reassures the recruiter they can leave', () => {
    mockRun({
      status: 'processing',
      cvs: [cv({ status: 'queued', rank: null, shortlisted: false })],
      totalCvs: 4,
      progress: { queued: 3, processing: 1, scored: 0, failed: 0 },
    })
    renderPage()

    expect(screen.getByText('Reviewing your CVs')).toBeTruthy()
    expect(screen.getByText(/close this tab/i)).toBeTruthy()
    expect(screen.getByText('0 of 4 reviewed')).toBeTruthy()
    expect(screen.getByText('Waiting')).toBeTruthy()
  })

  it('polls while processing', () => {
    mockRun({ status: 'processing' })
    renderPage()

    const options = useGetScoutRunQueryMock.mock.calls[0]?.[1] as {
      pollingInterval?: number
    }
    expect(options?.pollingInterval).toBeGreaterThan(0)
  })

  it('stops polling once the run reaches a terminal state', async () => {
    mockRun({ status: 'completed' })
    renderPage()

    await waitFor(() => {
      const last = useGetScoutRunQueryMock.mock.calls.at(-1)?.[1] as {
        pollingInterval?: number
      }
      expect(last?.pollingInterval).toBe(0)
    })
  })

  it('offers no PDF download until the run has finished', () => {
    mockRun({ status: 'processing' })
    renderPage()
    expect(screen.queryByRole('button', { name: /download pdf/i })).toBeNull()
  })
})

describe('RunResults once finished', () => {
  it('summarises the outcome and shows the AI summary', () => {
    mockRun({ totalCvs: 12, cvs: [cv(), cv({ id: 'cv-2', rank: 2 })] })
    renderPage()

    expect(screen.getByText('Top 2 of 12 CVs reviewed')).toBeTruthy()
    expect(screen.getByText('Both finalists sell into banks.')).toBeTruthy()
  })

  it('shows the rank, the candidate and the plain-English reason', () => {
    mockRun()
    renderPage()

    expect(screen.getByText('Ada Obi')).toBeTruthy()
    expect(screen.getByText(/closed six-figure bank deals/i)).toBeTruthy()
    const row = screen.getByText('Ada Obi').closest('tr')!
    expect(within(row).getByText('1')).toBeTruthy()
  })

  it('keeps the AI rank when the table is re-sorted by score', () => {
    // Ranks deliberately disagree with score order so a render-index rank would show.
    mockRun({
      cvs: [
        cv({
          id: 'cv-1',
          candidateName: 'Ada Obi',
          rank: 1,
          evaluationScore: 88,
        }),
        cv({
          id: 'cv-2',
          candidateName: 'Ben Musa',
          rank: 2,
          evaluationScore: 74,
        }),
      ],
    })
    renderPage()

    const rankOf = (name: string) =>
      within(screen.getByText(name).closest('tr')!).getAllByRole('cell')[0]
        ?.textContent

    expect(rankOf('Ada Obi')).toBe('1')
    expect(rankOf('Ben Musa')).toBe('2')

    // Sort ascending by match: Ben (74) moves above Ada (88), ranks must not follow.
    useScoutStore.getState().setSort('score', 'asc')
    expect(rankOf('Ada Obi')).toBe('1')
    expect(rankOf('Ben Musa')).toBe('2')
  })

  it('opens the details drawer with the full reason and contact details', () => {
    mockRun()
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'View details' }))

    // Scoped to the drawer: the table has a column with the same heading.
    const drawer = within(screen.getByRole('dialog'))
    expect(drawer.getByText('Why the AI picked them')).toBeTruthy()
    expect(drawer.getByText('ada@example.com')).toBeTruthy()
    expect(drawer.getByText('Closed six-figure deals')).toBeTruthy()
    expect(drawer.getByText('No public-sector work')).toBeTruthy()
    expect(drawer.getByText('88% match')).toBeTruthy()
    expect(drawer.getByText('Ranked #1 in this run')).toBeTruthy()
  })

  it('opens the stored CV from the drawer', () => {
    mockRun()
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'View details' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open CV' }))

    expect(openCvMock).toHaveBeenCalledWith('cand-1')
  })

  it('downloads the shortlist as a PDF', async () => {
    mockRun()
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))

    await waitFor(() => {
      expect(downloadScoutReportMock).toHaveBeenCalledWith(
        'run-1',
        'Q1 Enterprise AE hiring',
      )
    })
  })

  it('reports a failed download instead of failing silently', async () => {
    downloadScoutReportMock.mockRejectedValue(new Error('boom'))
    mockRun()
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith('error', expect.any(String))
    })
  })
})

describe('RunResults unreadable CVs', () => {
  const failed = cv({
    id: 'cv-bad',
    cvName: 'scanned',
    status: 'failed',
    rank: null,
    shortlisted: false,
    evaluationScore: null,
    recommendation: null,
    lastError:
      "We couldn't read any text from this file — it may be a scanned image.",
    attempts: 5,
  })

  it('lists them with their reason on their own tab, never silently dropped', () => {
    mockRun({
      status: 'completed_with_errors',
      cvs: [cv(), failed],
      totalCvs: 2,
      progress: { queued: 0, processing: 0, scored: 1, failed: 1 },
    })
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: /couldn't read/i }))

    expect(screen.getByText('scanned')).toBeTruthy()
    expect(screen.getByText(/scanned image/i)).toBeTruthy()
  })

  it('retries one from that tab', async () => {
    mockRun({
      status: 'completed_with_errors',
      cvs: [cv(), failed],
      totalCvs: 2,
    })
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: /couldn't read/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => {
      expect(retryCvMock).toHaveBeenCalledWith({
        scoutId: 'cv-bad',
        runId: 'run-1',
      })
    })
  })

  it('says so when every CV was readable', () => {
    mockRun()
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: /couldn't read/i }))
    expect(screen.getByText('Every CV was readable')).toBeTruthy()
  })

  it('explains an empty shortlist when nothing could be scored', () => {
    mockRun({
      status: 'failed',
      cvs: [failed],
      totalCvs: 1,
      progress: { queued: 0, processing: 0, scored: 0, failed: 1 },
      shortlistSummary: null,
    })
    renderPage()

    expect(screen.getByText('No candidates were scored')).toBeTruthy()
  })
})

describe('RunResults errors', () => {
  it('shows an error state when the run cannot be loaded', () => {
    useGetScoutRunQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    renderPage()

    expect(screen.getByText("Couldn't load this run")).toBeTruthy()
  })
})
