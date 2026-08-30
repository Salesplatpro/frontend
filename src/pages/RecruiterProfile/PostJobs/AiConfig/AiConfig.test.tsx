import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAiConfigDraftStore } from '@/features/jobs/store/useAiConfigDraftStore'

import AiConfig from './AiConfig'

const {
  aiConfigMutationMock,
  patchAiConfigMock,
  updateJobMock,
  navigateMock,
  notifyMock,
} = vi.hoisted(() => ({
  aiConfigMutationMock: vi.fn(),
  patchAiConfigMock: vi.fn(),
  updateJobMock: vi.fn(),
  navigateMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ jobId: 'job-1' }),
  }
})

vi.mock('@/redux/api/recruiter', () => ({
  useAiConfigMutation: () => [aiConfigMutationMock, { isLoading: false }],
  usePatchAiConfigMutation: () => [patchAiConfigMock, { isLoading: false }],
  useUpdateJobMutation: () => [updateJobMock, { isLoading: false }],
  useGetAiConfigQuery: () => ({ data: undefined, isLoading: false }),
  useGenJpPersonalityMutation: () => [vi.fn(), { isLoading: false }],
  useDeletePersonalityQuestionMutation: () => [vi.fn(), { isLoading: false }],
  useFetchPersonalityQuestionsQuery: () => ({
    data: undefined,
    isLoading: false,
  }),
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: notifyMock,
}))

const renderAiConfig = () =>
  render(
    <MemoryRouter>
      <AiConfig />
    </MemoryRouter>,
  )

/** Fills the minimum fields required to pass validation with every optional
 * section (CV Similarity, Personalized Assessment, Personality Evaluation)
 * explicitly turned off — each toggle starts blank and must be clicked twice
 * to land on an explicit "false" (Yup requires a defined 'true'/'false', not blank). */
const fillMinimumValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Name of Job'), {
    target: { value: 'Software Engineer Screening' },
  })
  fireEvent.change(screen.getByPlaceholderText('Enter score (%)'), {
    target: { value: '60' },
  })
  const switches = screen.getAllByRole('switch')
  switches.forEach((toggle) => {
    fireEvent.click(toggle) // -> true
    fireEvent.click(toggle) // -> false
  })
}

describe('AiConfig', () => {
  beforeEach(() => {
    useAiConfigDraftStore.getState().clearAllDrafts()
    vi.clearAllMocks()
    updateJobMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { job: { status: 'active' } } }),
    })
  })

  it('blocks submission when required fields are empty', async () => {
    renderAiConfig()

    fireEvent.click(screen.getByRole('button', { name: /save ai config/i }))

    await waitFor(() => {
      expect(aiConfigMutationMock).not.toHaveBeenCalled()
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('does not render "Number of Similar CV Candidates" anywhere in the form', () => {
    renderAiConfig()

    const cvSimilarityToggle = screen.getAllByRole('switch')[0]
    fireEvent.click(cvSimilarityToggle)

    expect(screen.queryByText('Number of Similar CV Candidates')).toBeNull()
  })

  it('has no toggle for Pre-screening Assessment — its score is always visible and required', () => {
    renderAiConfig()

    expect(screen.queryByText('Enable Pre-screening Assessment')).toBeNull()
    expect(screen.getByPlaceholderText('Enter score (%)')).toBeTruthy()
  })

  it('requires at least one dichotomy pair count when Personality Evaluation is enabled, and clears once one is filled', async () => {
    const { container } = renderAiConfig()

    // Personality Evaluation is the third switch (CV Similarity, Personalized
    // Assessment, Personality Evaluation) — a single click turns it on.
    const personalityToggle = screen.getAllByRole('switch')[2]
    fireEvent.click(personalityToggle)

    fireEvent.click(screen.getByRole('button', { name: /save ai config/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least one dichotomy pair/i)).toBeTruthy()
    })
    expect(aiConfigMutationMock).not.toHaveBeenCalled()

    const eiCountInput = container.querySelector(
      '#count-EI',
    ) as HTMLInputElement
    fireEvent.change(eiCountInput, { target: { value: '3' } })

    await waitFor(() => {
      expect(screen.queryByText(/at least one dichotomy pair/i)).toBeNull()
    })
  })

  it('disables the Save button while the create mutation is in flight, before it resolves', async () => {
    let resolveSubmit: (value: unknown) => void = () => {}
    const pending = new Promise((resolve) => {
      resolveSubmit = resolve
    })
    aiConfigMutationMock.mockReturnValue({ unwrap: () => pending })

    renderAiConfig()
    fillMinimumValidForm()

    const submitButton = screen.getByRole('button', {
      name: /save ai config/i,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton.hasAttribute('disabled')).toBe(true)
    })
    expect(navigateMock).not.toHaveBeenCalled()

    resolveSubmit!({ data: { aiConfig: { id: 'cfg-1' } } })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        '/recruiterDashboard/myjobposts',
      )
    })
  })

  it('submits successfully, clears the draft, notifies, and navigates', async () => {
    aiConfigMutationMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { aiConfig: { id: 'cfg-1' } } }),
    })
    const clearDraftSpy = vi.spyOn(
      useAiConfigDraftStore.getState(),
      'clearDraft',
    )

    renderAiConfig()
    fillMinimumValidForm()

    fireEvent.click(screen.getByRole('button', { name: /save ai config/i }))

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith(
        'success',
        expect.stringContaining('job published'),
      )
      expect(updateJobMock).toHaveBeenCalledWith({
        jobId: 'job-1',
        data: { status: 'active' },
      })
      expect(navigateMock).toHaveBeenCalledWith(
        '/recruiterDashboard/myjobposts',
      )
    })
    expect(clearDraftSpy).toHaveBeenCalledWith('job-1')
  })

  it('shows a toast with the backend error message on failure and does not navigate', async () => {
    aiConfigMutationMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: { error: { message: 'Failed to save AI config' } },
        }),
    })

    renderAiConfig()
    fillMinimumValidForm()

    const submitButton = screen.getByRole('button', {
      name: /save ai config/i,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith(
        'error',
        'Failed to save AI config',
      )
    })
    expect(navigateMock).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(submitButton.hasAttribute('disabled')).toBe(false)
    })
  })
})
