import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import NotificationsList from './NotificationsList'

const { useNotificationsMock, useMarkNotificationReadMock, markAsReadFn } =
  vi.hoisted(() => ({
    useNotificationsMock: vi.fn(),
    useMarkNotificationReadMock: vi.fn(),
    markAsReadFn: vi.fn(),
  }))

vi.mock('@/features/notifications/hooks/useNotifications', () => ({
  useNotifications: useNotificationsMock,
}))
vi.mock('@/features/notifications/hooks/useMarkNotificationRead', () => ({
  useMarkNotificationRead: useMarkNotificationReadMock,
}))

describe('NotificationsList', () => {
  it('shows an empty state when there are no notifications', () => {
    useNotificationsMock.mockReturnValue({
      notifications: [],
      isLoading: false,
      mutate: vi.fn(),
    })
    useMarkNotificationReadMock.mockReturnValue({ markAsRead: markAsReadFn })

    render(<NotificationsList />)

    expect(screen.getByText(/do not have any notifications/i)).toBeTruthy()
  })

  it('renders each notification message read-only, with no acknowledge/reject actions', () => {
    useNotificationsMock.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      notifications: [
        {
          id: 'n1',
          userId: 'talent-1',
          message: "Congratulations, you've been shortlisted!",
          isRead: false,
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useMarkNotificationReadMock.mockReturnValue({ markAsRead: markAsReadFn })

    render(<NotificationsList />)

    expect(screen.getByText(/shortlisted/)).toBeTruthy()
    expect(screen.queryByText('Acknowledge')).toBeNull()
    expect(screen.queryByText('Reject')).toBeNull()
  })

  it('renders a concise title prominently above the longer message body', () => {
    useNotificationsMock.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      notifications: [
        {
          id: 'n1',
          userId: 'talent-1',
          title: 'Shortlisted for Backend Developer',
          message:
            "Great news! You've been shortlisted for Backend Developer. Watch your inbox — the recruiter will be in touch soon.",
          isRead: false,
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useMarkNotificationReadMock.mockReturnValue({ markAsRead: markAsReadFn })

    render(<NotificationsList />)

    expect(screen.getByText('Shortlisted for Backend Developer')).toBeTruthy()
  })

  it('renders decision notifications as title-only, with no duplicate message line', () => {
    useNotificationsMock.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      notifications: [
        {
          id: 'n1',
          userId: 'talent-1',
          title:
            "Congratulations, you've been shortlisted for Backend Developer at TechCorp",
          message:
            "Congratulations, you've been shortlisted for Backend Developer at TechCorp",
          isRead: false,
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useMarkNotificationReadMock.mockReturnValue({ markAsRead: markAsReadFn })

    render(<NotificationsList />)

    expect(
      screen.getAllByText(
        "Congratulations, you've been shortlisted for Backend Developer at TechCorp",
      ),
    ).toHaveLength(1)
  })

  it('marks an unread notification as read when clicked', () => {
    const mutate = vi.fn()
    useNotificationsMock.mockReturnValue({
      isLoading: false,
      mutate,
      notifications: [
        {
          id: 'n1',
          userId: 'talent-1',
          message: 'Your dream job is still out there.',
          isRead: false,
          deleted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })
    useMarkNotificationReadMock.mockReturnValue({ markAsRead: markAsReadFn })

    render(<NotificationsList />)
    fireEvent.click(screen.getByText(/dream job/))

    expect(markAsReadFn).toHaveBeenCalledWith('n1')
  })
})
