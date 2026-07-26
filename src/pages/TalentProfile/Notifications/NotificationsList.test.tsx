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
