import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserOnboarding } from '@/features/admin/types'

import { OnboardingDrawer } from './OnboardingDrawer'

const { fetchMock, draftMock, sendMock, notifyMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  draftMock: vi.fn(),
  sendMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('@/features/admin/services/adminService', () => ({
  fetchUserOnboarding: fetchMock,
  draftOnboardingEmail: draftMock,
  sendOnboardingEmail: sendMock,
}))
vi.mock('@/utils/toastNotifications', () => ({ notify: notifyMock }))

const stuck: UserOnboarding = {
  userId: 'u1',
  role: 'talent',
  stage: 'take_assessment',
  followUp: 'none',
  steps: [
    { key: 'verify_email', label: 'Verify email', done: true },
    { key: 'complete_profile', label: 'Add roles and upload a CV', done: true },
    { key: 'take_assessment', label: 'Take the pre-assessment', done: false },
    { key: 'apply_to_job', label: 'Apply to a job', done: false },
  ],
  nextSteps: {
    steps: ['Take it once.'],
    ctaLabel: 'Take the pre-assessment',
    ctaPath: '/talentDashboard/talentQuiz',
  },
  emails: [],
}

const sentEmail = {
  id: 'e1',
  userId: 'u1',
  sentById: 'a1',
  stage: 'take_assessment' as const,
  subject: 'Your next step',
  body: 'Hi Ada',
  status: 'sent' as const,
  error: null,
  createdAt: '2026-09-27T10:00:00.000Z',
}

const httpError = (status: number, message: string) => ({
  response: { status, data: { error: { message } } },
})

const renderDrawer = (
  props: Partial<React.ComponentProps<typeof OnboardingDrawer>> = {},
) => {
  const onClose = vi.fn()
  const onSent = vi.fn()
  render(
    <OnboardingDrawer
      userId="u1"
      userName="Ada Lovelace"
      onClose={onClose}
      onSent={onSent}
      {...props}
    />,
  )
  return { onClose, onSent }
}

const subjectInput = () => screen.getByLabelText('Subject') as HTMLInputElement
const bodyInput = () => screen.getByLabelText('Message') as HTMLTextAreaElement
const sendButton = () => screen.getByRole('button', { name: 'Send email' })

describe('OnboardingDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock.mockResolvedValue(stuck)
  })

  it('renders nothing while closed', () => {
    renderDrawer({ userId: null })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows where the user is stuck', async () => {
    renderDrawer()
    expect(await screen.findByText('Stuck at: Take assessment')).toBeTruthy()
    expect(screen.getByText(/verify email/i).textContent).toContain('(done)')
    expect(
      screen.getByText(/take the pre-assessment/i, { selector: 'li span' })
        .textContent,
    ).toContain('(stuck here)')
    expect(screen.getByText(/apply to a job/i).textContent).toContain(
      '(not yet)',
    )
    expect(screen.getByText('No emails sent yet.')).toBeTruthy()
  })

  it('shows an error with a retry when loading fails', async () => {
    fetchMock.mockRejectedValueOnce(httpError(500, 'Server down'))
    renderDrawer()

    expect(await screen.findByText('Server down')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(await screen.findByText('Stuck at: Take assessment')).toBeTruthy()
  })

  it('lists sent and failed emails with their time and body', async () => {
    fetchMock.mockResolvedValue({
      ...stuck,
      emails: [
        {
          ...sentEmail,
          id: 'e2',
          status: 'failed',
          error: 'bounced',
          subject: 'Retry',
          body: 'Second try',
        },
        sentEmail,
      ],
    })
    renderDrawer()

    expect(await screen.findByText('Retry')).toBeTruthy()
    expect(screen.getByText('Failed')).toBeTruthy()
    expect(screen.getByText('Sent')).toBeTruthy()
    expect(screen.getByText('Error: bounced')).toBeTruthy()
    expect(screen.getByText('Hi Ada')).toBeTruthy()
    const times = screen.getAllByText((_, el) => el?.tagName === 'TIME')
    expect(times[1].getAttribute('datetime')).toBe(sentEmail.createdAt)
    expect(screen.getByText('Send a follow-up')).toBeTruthy()
  })

  it('fills the email with an AI draft and can regenerate it', async () => {
    draftMock
      .mockResolvedValueOnce({ subject: 'First', body: 'Draft one' })
      .mockResolvedValueOnce({ subject: 'Second', body: 'Draft two' })
    renderDrawer()

    fireEvent.click(
      await screen.findByRole('button', { name: /write email with ai/i }),
    )
    await waitFor(() => expect(subjectInput().value).toBe('First'))
    expect(bodyInput().value).toBe('Draft one')

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }))
    await waitFor(() => expect(subjectInput().value).toBe('Second'))
  })

  it('keeps the recruiter’s edits when drafting fails', async () => {
    draftMock.mockRejectedValue(httpError(502, 'AI is down'))
    renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    fireEvent.change(subjectInput(), { target: { value: 'My subject' } })

    fireEvent.click(screen.getByRole('button', { name: /regenerate/i }))

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith('error', 'AI is down'),
    )
    expect(subjectInput().value).toBe('My subject')
  })

  it('only enables Send once there is a subject and a message', async () => {
    renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    expect(sendButton().hasAttribute('disabled')).toBe(true)
    fireEvent.change(subjectInput(), { target: { value: 'Hi' } })
    expect(sendButton().hasAttribute('disabled')).toBe(true)
    fireEvent.change(bodyInput(), { target: { value: '   ' } })
    expect(sendButton().hasAttribute('disabled')).toBe(true)
    fireEvent.change(bodyInput(), { target: { value: 'Come back' } })
    expect(sendButton().hasAttribute('disabled')).toBe(false)
  })

  it('sends, adds the email to the top of the history, clears the form and tells the list', async () => {
    sendMock.mockResolvedValue(sentEmail)
    const { onSent } = renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    fireEvent.change(subjectInput(), { target: { value: ' Your next step ' } })
    fireEvent.change(bodyInput(), { target: { value: 'Hi Ada' } })

    fireEvent.click(sendButton())

    await waitFor(() => expect(onSent).toHaveBeenCalled())
    expect(sendMock).toHaveBeenCalledWith('u1', {
      subject: 'Your next step',
      body: 'Hi Ada',
    })
    expect(screen.getByText('Your next step')).toBeTruthy()
    expect(subjectInput().value).toBe('')
    expect(notifyMock).toHaveBeenCalledWith(
      'success',
      'Email sent to Ada Lovelace.',
    )
    expect(
      screen.getByRole('button', { name: /write email with ai/i }),
    ).toBeTruthy()
  })

  it('asks before sending again within 24 hours, then sends with confirm', async () => {
    sendMock
      .mockRejectedValueOnce(httpError(409, 'Emailed less than 24 hours ago'))
      .mockResolvedValueOnce(sentEmail)
    const { onSent } = renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    fireEvent.change(subjectInput(), { target: { value: 'Again' } })
    fireEvent.change(bodyInput(), { target: { value: 'Hello again' } })

    fireEvent.click(sendButton())
    fireEvent.click(await screen.findByRole('button', { name: 'Send anyway' }))

    await waitFor(() => expect(onSent).toHaveBeenCalled())
    expect(sendMock).toHaveBeenLastCalledWith('u1', {
      subject: 'Again',
      body: 'Hello again',
      confirm: true,
    })
  })

  it('can back out of a repeat email', async () => {
    sendMock.mockRejectedValueOnce(httpError(409, 'Emailed recently'))
    renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    fireEvent.change(subjectInput(), { target: { value: 'Again' } })
    fireEvent.change(bodyInput(), { target: { value: 'Hello' } })

    fireEvent.click(sendButton())
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(subjectInput().value).toBe('Again')
  })

  it('keeps the draft and reloads history when sending fails', async () => {
    sendMock.mockRejectedValue(httpError(502, "The email couldn't be sent."))
    const { onSent } = renderDrawer()
    await screen.findByText('Stuck at: Take assessment')
    fireEvent.change(subjectInput(), { target: { value: 'Hi' } })
    fireEvent.change(bodyInput(), { target: { value: 'Come back' } })

    fireEvent.click(sendButton())

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith(
        'error',
        "The email couldn't be sent.",
      ),
    )
    expect(subjectInput().value).toBe('Hi')
    expect(onSent).not.toHaveBeenCalled()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })

  it('has nothing to send for an active user', async () => {
    fetchMock.mockResolvedValue({
      ...stuck,
      stage: 'active',
      nextSteps: null,
      steps: stuck.steps.map((step) => ({ ...step, done: true })),
    })
    renderDrawer()

    expect(await screen.findByText('Finished onboarding')).toBeTruthy()
    expect(screen.queryByLabelText('Subject')).toBeNull()
    expect(
      screen.queryByRole('button', { name: /write email with ai/i }),
    ).toBeNull()
  })
})
