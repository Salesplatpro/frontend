import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useScoutStore } from '@/features/scout/store/useScoutStore'

import { CampaignForm } from './CampaignForm'

const {
  navigateMock,
  createCampaignMock,
  updateCampaignMock,
  useGetScoutCampaignQueryMock,
  generateJobFieldMock,
  notifyMock,
} = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  createCampaignMock: vi.fn(),
  updateCampaignMock: vi.fn(),
  useGetScoutCampaignQueryMock: vi.fn(),
  generateJobFieldMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useCreateScoutCampaignMutation: () => [
    createCampaignMock,
    { isLoading: false },
  ],
  useUpdateScoutCampaignMutation: () => [
    updateCampaignMock,
    { isLoading: false },
  ],
  useGetScoutCampaignQuery: useGetScoutCampaignQueryMock,
  useGenerateJobFieldMutation: () => [
    generateJobFieldMock,
    { isLoading: false },
  ],
  useGetRoleQuery: () => ({
    data: { data: { roles: [{ id: 'r-1', name: 'Software Engineer' }] } },
    isLoading: false,
  }),
}))

vi.mock('@/utils/toastNotifications', () => ({
  notify: notifyMock,
  notifyPromise: vi.fn(),
}))

// RoleSelect fetches its own options; a stub keeps this test about the form.
vi.mock('@/components/forms/Roles/RoleSelect', () => ({
  RoleSelect: ({
    value,
    onChange,
    label,
    error,
  }: {
    value: string
    onChange: (v: string) => void
    label?: string
    error?: string
  }) => (
    <label>
      {label}
      <select
        data-testid="role-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}>
        <option value="">Select a role...</option>
        <option value="r-1">Software Engineer</option>
      </select>
      {error && <span role="alert">{error}</span>}
    </label>
  ),
}))

const BRIEF =
  'We need an enterprise account executive to sell our payments platform to Nigerian banks and close six-figure annual contracts.'
const GUIDE =
  'Prioritise people who have sold to banks. Skip anyone whose only experience is at an agency.'

const renderNew = () =>
  render(
    <MemoryRouter initialEntries={['/recruiterDashboard/scout/new']}>
      <Routes>
        <Route
          path="/recruiterDashboard/scout/new"
          element={<CampaignForm />}
        />
      </Routes>
    </MemoryRouter>,
  )

const renderEdit = () =>
  render(
    <MemoryRouter initialEntries={['/recruiterDashboard/scout/c-1/edit']}>
      <Routes>
        <Route
          path="/recruiterDashboard/scout/:campaignId/edit"
          element={<CampaignForm />}
        />
      </Routes>
    </MemoryRouter>,
  )

/** Drives the custom Select: click its trigger, then the option. */
const chooseFromSelect = (
  triggerText: RegExp | string,
  optionLabel: string,
) => {
  fireEvent.click(screen.getByRole('button', { name: triggerText }))
  fireEvent.click(screen.getByText(optionLabel))
}

const fillRequired = () => {
  fireEvent.change(screen.getByRole('textbox', { name: /campaign name/i }), {
    target: { value: 'Q1 Enterprise AE hiring' },
  })
  fireEvent.change(screen.getByTestId('role-select'), {
    target: { value: 'r-1' },
  })
  fireEvent.change(screen.getByLabelText(/job brief/i), {
    target: { value: BRIEF },
  })
  fireEvent.change(screen.getByLabelText(/how should the ai choose/i), {
    target: { value: GUIDE },
  })
}

const submit = () =>
  fireEvent.click(
    screen.getByRole('button', { name: /continue to upload cvs/i }),
  )

beforeEach(() => {
  vi.clearAllMocks()
  useScoutStore.getState().resetScout()
  useGetScoutCampaignQueryMock.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  })
})

describe('CampaignForm validation', () => {
  it('asks for every required field when submitted blank', async () => {
    renderNew()
    submit()

    expect(
      await screen.findByText(
        'Give this campaign a name so you can find it later',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Pick the role you are hiring for')).toBeTruthy()
    expect(
      screen.getByText('Choose the seniority this role needs'),
    ).toBeTruthy()
    expect(
      screen.getByText('Describe the role so the AI knows what to look for'),
    ).toBeTruthy()
    expect(
      screen.getByText('Tell the AI what matters most when choosing'),
    ).toBeTruthy()
    expect(createCampaignMock).not.toHaveBeenCalled()
  })

  it('rejects a job brief that is too thin to match against', async () => {
    renderNew()
    fillRequired()
    fireEvent.change(screen.getByLabelText(/job brief/i), {
      target: { value: 'Need a salesperson' },
    })
    submit()

    expect(
      await screen.findByText('Add a bit more detail — at least 50 characters'),
    ).toBeTruthy()
    expect(createCampaignMock).not.toHaveBeenCalled()
  })

  it('rejects AI instructions that are too thin', async () => {
    renderNew()
    fillRequired()
    fireEvent.change(screen.getByLabelText(/how should the ai choose/i), {
      target: { value: 'Pick good ones' },
    })
    submit()

    expect(
      await screen.findByText('Add a bit more detail — at least 30 characters'),
    ).toBeTruthy()
  })

  it('offers only shortlist sizes between 2 and 10', () => {
    renderNew()
    // The default is shown on the trigger; open it to see what may be chosen.
    fireEvent.click(screen.getByRole('button', { name: /5 candidates/i }))

    // A free number input would let 1 or 11 through; a bounded list cannot.
    expect(screen.getByText('2 candidates')).toBeTruthy()
    expect(screen.getByText('10 candidates')).toBeTruthy()
    expect(screen.queryByText('1 candidates')).toBeNull()
    expect(screen.queryByText('11 candidates')).toBeNull()
  })
})

describe('CampaignForm submission', () => {
  it('sends the whole campaign and moves on to the upload step', async () => {
    createCampaignMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { scoutJob: { id: 'c-9' } } }),
    })
    renderNew()
    fillRequired()
    chooseFromSelect(/choose a level/i, '4-6 years')
    submit()

    await waitFor(() => {
      expect(createCampaignMock).toHaveBeenCalled()
    })
    const payload = createCampaignMock.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >
    expect(payload.name).toBe('Q1 Enterprise AE hiring')
    expect(payload.role).toBe('r-1')
    expect(payload.jobBrief).toBe(BRIEF)
    expect(payload.recruiterGuide).toBe(GUIDE)
    expect(payload.shortlistSize).toBe(5)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        '/recruiterDashboard/scout/c-9/upload',
      )
    })
  })

  it('surfaces a backend rejection as a toast and stays on the form', async () => {
    createCampaignMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({ data: { error: { message: 'Campaign name taken' } } }),
    })
    renderNew()
    fillRequired()
    chooseFromSelect(/choose a level/i, '4-6 years')
    submit()

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith('error', expect.any(String))
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('keeps a draft of a new campaign so a refresh does not lose it', async () => {
    renderNew()
    fireEvent.change(screen.getByRole('textbox', { name: /campaign name/i }), {
      target: { value: 'Draft campaign' },
    })

    await waitFor(() => {
      expect(useScoutStore.getState().draft?.name).toBe('Draft campaign')
    })
  })
})

describe('CampaignForm editing', () => {
  const existing = {
    id: 'c-1',
    name: 'Existing campaign',
    jobBrief: BRIEF,
    recruiterGuide: GUIDE,
    roleId: 'r-1',
    role: { id: 'r-1', name: 'Software Engineer' },
    shortlistSize: 8,
    experienceLevel: '4-6 years',
    mustHaveSkills: ['negotiation'],
    niceToHaveSkills: [],
    workMode: 'remote',
    locationCountry: 'Nigeria',
    locationState: null,
    locationCity: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  }

  it('prefills from the saved campaign', () => {
    useGetScoutCampaignQueryMock.mockReturnValue({
      data: { data: { scoutJob: existing } },
      isLoading: false,
      isError: false,
    })
    renderEdit()

    expect(
      (
        screen.getByRole('textbox', {
          name: /campaign name/i,
        }) as HTMLInputElement
      ).value,
    ).toBe('Existing campaign')
    expect(
      (screen.getByLabelText(/job brief/i) as HTMLTextAreaElement).value,
    ).toBe(BRIEF)
    expect(screen.getByText('negotiation')).toBeTruthy()
  })

  it('does not restore an unrelated new-campaign draft over a live campaign', () => {
    useScoutStore.getState().saveDraft({
      name: 'Someone else’s draft',
      role: '',
      experienceLevel: '',
      jobBrief: '',
      recruiterGuide: '',
      mustHaveSkills: [],
      niceToHaveSkills: [],
      workMode: '',
      location: {
        country: { name: '', isoCode: '' },
        state: { name: '', isoCode: '' },
        city: { name: '', isoCode: '' },
      },
      shortlistSize: 5,
    })
    useGetScoutCampaignQueryMock.mockReturnValue({
      data: { data: { scoutJob: existing } },
      isLoading: false,
      isError: false,
    })
    renderEdit()

    expect(
      (
        screen.getByRole('textbox', {
          name: /campaign name/i,
        }) as HTMLInputElement
      ).value,
    ).toBe('Existing campaign')
  })

  it('saves changes back to the same campaign', async () => {
    useGetScoutCampaignQueryMock.mockReturnValue({
      data: { data: { scoutJob: existing } },
      isLoading: false,
      isError: false,
    })
    updateCampaignMock.mockReturnValue({ unwrap: () => Promise.resolve({}) })
    renderEdit()

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(updateCampaignMock).toHaveBeenCalled()
    })
    const args = updateCampaignMock.mock.calls[0]?.[0] as { campaignId: string }
    expect(args.campaignId).toBe('c-1')
  })

  it('shows an error state when the campaign cannot be loaded', () => {
    useGetScoutCampaignQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })
    renderEdit()

    expect(screen.getByText("Couldn't load this campaign")).toBeTruthy()
  })
})
