import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { MessageBubble } from './MessageBubble'

const recruiterMessage = {
  id: 'msg-1',
  content: 'Hello there',
  createdAt: '2026-01-15T10:30:00.000Z',
  senderId: 'recruiter-1',
  sender: { firstName: 'Jane', lastName: 'Recruiter', userRole: 'recruiter' },
}

const talentMessage = {
  id: 'msg-2',
  content: 'Thanks!',
  createdAt: '2026-01-15T10:31:00.000Z',
  senderId: 'talent-1',
  sender: { firstName: 'Alex', lastName: 'Talent', userRole: 'talent' },
}

describe('MessageBubble', () => {
  it('renders the message content', () => {
    render(<MessageBubble message={recruiterMessage} />)
    expect(screen.getByText('Hello there')).toBeTruthy()
  })

  it('aligns recruiter messages to the right', () => {
    const { container } = render(<MessageBubble message={recruiterMessage} />)
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('own')
    expect(row.className).not.toContain('received')
  })

  it('aligns talent replies to the left', () => {
    const { container } = render(<MessageBubble message={talentMessage} />)
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('received')
    expect(row.className).not.toContain('own')
  })

  it('treats a missing sender role as a talent (left) bubble', () => {
    const { container } = render(
      <MessageBubble
        message={{
          id: 'msg-3',
          content: 'Orphan',
          createdAt: '2026-01-15T10:32:00.000Z',
          senderId: 'unknown',
        }}
      />,
    )
    const row = container.firstElementChild as HTMLElement
    expect(row.className).toContain('received')
  })
})
