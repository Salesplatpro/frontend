import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import CreateJD from './CreateJD'

const { createJDMock, navigateMock, notifyMock } = vi.hoisted(() => ({
  createJDMock: vi.fn(),
  navigateMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', () => ({
  useCreateJDMutation: () => [createJDMock, { isLoading: false }],
  useGetCampaignNameQuery: () => ({ data: undefined, isLoading: false }),
}))

vi.mock('@/redux/api/talent', () => ({
  useGetRoleQuery: () => ({
    data: {
      data: [{ id: 'role-1', name: 'Software Engineer', description: '' }],
    },
    isLoading: false,
  }),
}))

vi.mock('../../../utils/toastNotifications', () => ({
  notify: notifyMock,
}))

const renderCreateJD = () =>
  render(
    <MemoryRouter>
      <CreateJD />
    </MemoryRouter>,
  )

describe('CreateJD (scout job creation form)', () => {
  it('blocks submission and shows field-level errors when required fields are empty', async () => {
    renderCreateJD()

    fireEvent.click(screen.getByRole('button', { name: /create scout job/i }))

    await waitFor(() => {
      expect(screen.getByText(/campaign name is required/i)).toBeTruthy()
      expect(screen.getByText(/role is required/i)).toBeTruthy()
      expect(screen.getByText(/job brief is required/i)).toBeTruthy()
      expect(screen.getByText(/recruiter guide is required/i)).toBeTruthy()
    })

    expect(createJDMock).not.toHaveBeenCalled()
  })

  it('submits the form and navigates to the new scout job on success', async () => {
    createJDMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          message: 'Scout job created',
          data: { scoutJob: { id: 'sj-1' } },
        }),
    })
    renderCreateJD()

    fireEvent.change(screen.getByPlaceholderText('Campaign name'), {
      target: { value: 'Q1 Engineering Scout' },
    })
    fireEvent.click(screen.getByText('Select a role...'))
    fireEvent.click(screen.getByText('Software Engineer'))
    fireEvent.change(screen.getByPlaceholderText(/describe the role/i), {
      target: {
        value:
          'Looking for a senior backend engineer with distributed systems experience',
      },
    })
    fireEvent.change(
      screen.getByPlaceholderText(/how should cvs be assessed/i),
      {
        target: { value: 'Prioritize distributed systems experience' },
      },
    )

    fireEvent.click(screen.getByRole('button', { name: /create scout job/i }))

    await waitFor(() => {
      expect(createJDMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Q1 Engineering Scout',
          role: 'role-1',
        }),
      )
      expect(navigateMock).toHaveBeenCalledWith(
        '/recruiterDashboard/scout/sj-1',
      )
    })
  })

  it('shows a toast with the real backend error message on failure', async () => {
    createJDMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({ data: { error: { message: 'Role does not exist' } } }),
    })
    renderCreateJD()

    fireEvent.change(screen.getByPlaceholderText('Campaign name'), {
      target: { value: 'Q1 Engineering Scout' },
    })
    fireEvent.click(screen.getByText('Select a role...'))
    fireEvent.click(screen.getByText('Software Engineer'))
    fireEvent.change(screen.getByPlaceholderText(/describe the role/i), {
      target: {
        value: 'Looking for a senior backend engineer with lots of experience',
      },
    })
    fireEvent.change(
      screen.getByPlaceholderText(/how should cvs be assessed/i),
      {
        target: { value: 'Prioritize distributed systems experience' },
      },
    )

    fireEvent.click(screen.getByRole('button', { name: /create scout job/i }))

    await waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith('error', 'Role does not exist')
    })
  })
})
