import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { store } from '@/redux/store/store'

import { Chat } from './Chat'

const { useChatSessionsMock } = vi.hoisted(() => ({
  useChatSessionsMock: vi.fn(),
}))

vi.mock('@/features/messaging/hooks/useChatSessions', () => ({
  useChatSessions: useChatSessionsMock,
}))

const renderChat = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    </Provider>,
  )

describe('Chat (recruiter chat sessions list)', () => {
  it('shows an empty state when there are no conversations', () => {
    useChatSessionsMock.mockReturnValue({ sessions: [], isLoading: false })

    renderChat()

    expect(screen.getByText('No conversations yet')).toBeTruthy()
  })

  it('groups threads under their job title and shows unread counts', () => {
    useChatSessionsMock.mockReturnValue({
      isLoading: false,
      sessions: [
        {
          jobId: 'job-1',
          jobTitle: 'Senior Backend Engineer',
          threads: [
            {
              applicationId: 'app-1',
              talentId: 'talent-1',
              talentName: 'Ada Lovelace',
              lastMessageAt: new Date().toISOString(),
              unreadCount: 3,
            },
          ],
        },
      ],
    })

    renderChat()

    expect(screen.getByText('Senior Backend Engineer')).toBeTruthy()
    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('shows a spinner while loading', () => {
    useChatSessionsMock.mockReturnValue({ sessions: [], isLoading: true })

    renderChat()

    expect(screen.queryByText('No conversations yet')).toBeNull()
  })
})
