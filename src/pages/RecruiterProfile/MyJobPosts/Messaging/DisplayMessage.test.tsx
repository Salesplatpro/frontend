import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { DisplayMessage } from './DisplayMessage'

describe('DisplayMessage', () => {
  it('shows a placeholder when there are no messages', () => {
    render(<DisplayMessage messages={[]} />)
    expect(screen.getByText('No messages yet.')).toBeTruthy()
  })

  it('renders one bubble per message, keyed by message id (not array index)', () => {
    render(
      <DisplayMessage
        messages={[
          {
            id: 'm1',
            content: 'Hi there',
            createdAt: '2026-01-01T10:00:00Z',
            senderId: 'recruiter-1',
            sender: {
              firstName: 'Jane',
              lastName: 'R',
              userRole: 'recruiter',
            },
          },
          {
            id: 'm2',
            content: 'Thanks!',
            createdAt: '2026-01-01T10:05:00Z',
            senderId: 'talent-1',
            sender: { firstName: 'Alex', lastName: 'T', userRole: 'talent' },
          },
        ]}
      />,
    )

    expect(screen.getByText('Hi there')).toBeTruthy()
    expect(screen.getByText('Thanks!')).toBeTruthy()
  })
})
