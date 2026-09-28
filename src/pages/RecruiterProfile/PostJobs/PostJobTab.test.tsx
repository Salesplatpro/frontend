import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useJobDraftStore } from '@/features/jobs/store/useJobDraftStore'

import PostJobTab from './PostJobTab'
import { EMPTY_JOB_FORM } from './utils/generatedJobToForm'

const { generateMock } = vi.hoisted(() => ({ generateMock: vi.fn() }))

vi.mock('@/redux/api/recruiter', () => ({
  useGenerateJobContentMutation: () => [generateMock, { isLoading: false }],
  useGenerateJobContentFromFileMutation: () => [vi.fn(), { isLoading: false }],
}))

vi.mock('@/redux/api/talent', () => ({
  useGetRoleQuery: () => ({ data: { data: [] } }),
}))

vi.mock('@/utils/toastNotifications', () => ({ notify: vi.fn() }))

vi.mock('./PostJob', () => ({
  default: ({
    jobId,
    aiFilledCount,
    onBackToStart,
  }: {
    jobId?: string
    aiFilledCount?: number | null
    onBackToStart?: () => void
  }) => (
    <div>
      <p>Details step</p>
      <p>Job: {jobId ?? 'new'}</p>
      <p>AI filled: {String(aiFilledCount)}</p>
      <button type="button" onClick={onBackToStart}>
        Back to start options
      </button>
    </div>
  ),
}))

vi.mock('./AiConfig/AiConfig', () => ({
  default: () => <p>Screening step</p>,
}))

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/recruiterDashboard/postjob" element={<PostJobTab />} />
        <Route
          path="/recruiterDashboard/postjob/:jobId"
          element={<PostJobTab step="screening" />}
        />
        <Route
          path="/recruiterDashboard/postjob/:jobId/details"
          element={<PostJobTab step="details" />}
        />
      </Routes>
    </MemoryRouter>,
  )

describe('PostJobTab', () => {
  beforeEach(() => {
    useJobDraftStore.getState().clearDraft()
    vi.clearAllMocks()
  })

  it('opens on the start options when there is no draft', () => {
    renderAt('/recruiterDashboard/postjob')
    expect(screen.getByText(/how would you like to start/i)).toBeTruthy()
    expect(
      screen.getByText('Start').closest('li')?.getAttribute('aria-current'),
    ).toBe('step')
  })

  it('skips straight to details when a draft exists', () => {
    useJobDraftStore.getState().saveDraft({ ...EMPTY_JOB_FORM, role: 'x' })
    renderAt('/recruiterDashboard/postjob')
    expect(screen.getByText('Details step')).toBeTruthy()
  })

  it('saves the AI draft and moves to details with the filled count', async () => {
    generateMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          data: { content: { role: 'Backend Engineer', skills: ['Go'] } },
        }),
    })
    renderAt('/recruiterDashboard/postjob')

    fireEvent.click(screen.getByRole('button', { name: /describe it/i }))
    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: 'Backend engineer in Lagos with Go and Postgres' },
    })
    fireEvent.click(screen.getByRole('button', { name: /write my job post/i }))

    await waitFor(() => expect(screen.getByText('Details step')).toBeTruthy())
    expect(screen.getByText('AI filled: 2')).toBeTruthy()
    expect(useJobDraftStore.getState().draft?.role).toBe('Backend Engineer')
  })

  it('goes back to start without losing the draft', () => {
    useJobDraftStore.getState().saveDraft({ ...EMPTY_JOB_FORM, role: 'x' })
    renderAt('/recruiterDashboard/postjob')

    fireEvent.click(
      screen.getByRole('button', { name: /back to start options/i }),
    )

    expect(screen.getByText(/how would you like to start/i)).toBeTruthy()
    expect(useJobDraftStore.getState().draft?.role).toBe('x')
    fireEvent.click(
      screen.getByRole('button', { name: /continue your draft/i }),
    )
    expect(screen.getByText('Details step')).toBeTruthy()
  })

  it('lets the stepper return to Start from details', () => {
    useJobDraftStore.getState().saveDraft({ ...EMPTY_JOB_FORM, role: 'x' })
    renderAt('/recruiterDashboard/postjob')

    fireEvent.click(
      screen.getByRole('button', { name: /start pick how to begin/i }),
    )
    expect(screen.getByText(/how would you like to start/i)).toBeTruthy()
  })

  it('clears the draft when starting from scratch', () => {
    useJobDraftStore.getState().saveDraft({ ...EMPTY_JOB_FORM, role: 'x' })
    renderAt('/recruiterDashboard/postjob')
    fireEvent.click(
      screen.getByRole('button', { name: /back to start options/i }),
    )

    fireEvent.click(screen.getByRole('button', { name: /start from scratch/i }))

    expect(screen.getByText('Details step')).toBeTruthy()
    expect(screen.getByText('AI filled: null')).toBeTruthy()
    expect(useJobDraftStore.getState().draft).toBeNull()
  })

  it('shows the screening step for an existing job', () => {
    renderAt('/recruiterDashboard/postjob/job-1')
    expect(screen.getByText('Screening step')).toBeTruthy()
    expect(
      screen.getByText('Screening').closest('li')?.getAttribute('aria-current'),
    ).toBe('step')
  })

  it('edits the details of a saved job', () => {
    renderAt('/recruiterDashboard/postjob/job-1/details')
    expect(screen.getByText('Job: job-1')).toBeTruthy()
    expect(
      screen.getByText('Details').closest('li')?.getAttribute('aria-current'),
    ).toBe('step')
  })

  it('moves between details and screening of a saved job from the stepper', () => {
    renderAt('/recruiterDashboard/postjob/job-1/details')
    fireEvent.click(
      screen.getByRole('button', { name: /screening choose how to screen/i }),
    )
    expect(screen.getByText('Screening step')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: /details describe the role/i }),
    )
    expect(screen.getByText('Job: job-1')).toBeTruthy()
  })

  it('does not let a saved job go back to the start options', () => {
    renderAt('/recruiterDashboard/postjob/job-1')
    expect(
      screen.queryByRole('button', { name: /start pick how to begin/i }),
    ).toBeNull()
  })
})
