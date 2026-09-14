import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { Chat } from './Chat'

const { useChatSessionsMock } = vi.hoisted(() => ({
  useChatSessionsMock: vi.fn(),
}))

vi.mock('@/features/messaging/hooks/useChatSessions', () => ({
  useChatSessions: useChatSessionsMock,
}))

vi.mock('@/features/messaging/hooks/useMessages', () => ({
  useMessages: () => ({ messages: [], isLoading: false, mutate: vi.fn() }),
}))

vi.mock('@/features/messaging/hooks/useSendMessage', () => ({
  useSendMessage: () => ({ send: vi.fn(), isSending: false }),
}))

const renderChat = () =>
  render(
    <MemoryRouter>
      <Chat />
    </MemoryRouter>,
  )

describe('Chat (recruiter chat sessions list)', () => {
  it('shows an empty state when there are no conversations', () => {
    useChatSessionsMock.mockReturnValue({
      sessions: [],
      isLoading: false,
      mutate: vi.fn(),
    })

    renderChat()

    expect(screen.getByText('No conversations yet')).toBeTruthy()
  })

  it('groups threads under their job title', () => {
    useChatSessionsMock.mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      sessions: [
        {
          jobId: 'job-1',
          jobTitle: 'Senior Backend Engineer',
          threads: [
            {
              applicationId: 'app-1',
              talentId: 'talent-1',
              talentName: 'Ada Lovelace',
              lastMessagePreview: 'Hi Ada',
              lastMessageAt: new Date().toISOString(),
              unreadCount: 3,
            },
          ],
        },
      ],
    })

    renderChat()

    expect(
      screen.getAllByText('Senior Backend Engineer').length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getByLabelText('Unread')).toBeTruthy()
  })

  it('shows a spinner while loading', () => {
    useChatSessionsMock.mockReturnValue({
      sessions: [],
      isLoading: true,
      mutate: vi.fn(),
    })

    renderChat()

    expect(screen.queryByText('No conversations yet')).toBeNull()
  })
})
