import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { MessageBubble } from './MessageBubble'

const baseMessage = {
  id: 'msg-1',
  content: 'Hello there',
  createdAt: '2026-01-15T10:30:00.000Z',
  senderId: 'user-a',
}

describe('MessageBubble', () => {
  it('renders the message content', () => {
    render(<MessageBubble message={baseMessage} currentUserId="user-b" />)
    expect(screen.getByText('Hello there')).toBeTruthy()
  })

  it('aligns to the "own" side when the sender is the current user', () => {
    const { container } = render(
      <MessageBubble message={baseMessage} currentUserId="user-a" />,
    )
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('own')
    expect(row.className).not.toContain('received')
  })

  it('aligns to the "received" side when the sender is not the current user', () => {
    const { container } = render(
      <MessageBubble message={baseMessage} currentUserId="user-b" />,
    )
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('received')
    expect(row.className).not.toContain('own')
  })

  it('treats a missing currentUserId as "received" rather than throwing', () => {
    const { container } = render(<MessageBubble message={baseMessage} />)
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('received')
  })
})
