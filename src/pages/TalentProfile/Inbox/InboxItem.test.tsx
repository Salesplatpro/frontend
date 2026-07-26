import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { InboxItem } from './InboxItem'

const baseMessage = {
  id: 'msg-1',
  content: 'You are invited to interview for the Senior Engineer role.',
  createdAt: new Date().toISOString(),
  sender: { firstName: 'Jane', lastName: 'Recruiter' },
  acknowledged: false,
  isRead: false,
}

describe('InboxItem', () => {
  it('shows Acknowledge/Reject actions for an unread message', () => {
    render(
      <InboxItem
        message={baseMessage}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        onAcknowledge={vi.fn()}
        onReject={vi.fn()}
        truncateLimit={120}
        displayMessage={baseMessage.content}
      />,
    )

    expect(screen.getByText('Acknowledge')).toBeTruthy()
    expect(screen.getByText('Reject')).toBeTruthy()
  })

  it('hides the action buttons and shows the resulting status once read', () => {
    render(
      <InboxItem
        message={{ ...baseMessage, isRead: true, acknowledged: true }}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        onAcknowledge={vi.fn()}
        onReject={vi.fn()}
        truncateLimit={120}
        displayMessage={baseMessage.content}
      />,
    )

    expect(screen.queryByText('Acknowledge')).toBeNull()
    expect(screen.queryByText('Reject')).toBeNull()
    expect(screen.getByText('Acknowledged')).toBeTruthy()
  })

  it('calls onAcknowledge/onReject when their buttons are clicked', () => {
    const onAcknowledge = vi.fn()
    const onReject = vi.fn()
    render(
      <InboxItem
        message={baseMessage}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        onAcknowledge={onAcknowledge}
        onReject={onReject}
        truncateLimit={120}
        displayMessage={baseMessage.content}
      />,
    )

    fireEvent.click(screen.getByText('Acknowledge'))
    fireEvent.click(screen.getByText('Reject'))

    expect(onAcknowledge).toHaveBeenCalledTimes(1)
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it('shows a Read More toggle only when the content exceeds the truncate limit', () => {
    const { rerender } = render(
      <InboxItem
        message={{ ...baseMessage, content: 'short' }}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        onAcknowledge={vi.fn()}
        onReject={vi.fn()}
        truncateLimit={120}
        displayMessage="short"
      />,
    )
    expect(screen.queryByText('Read More')).toBeNull()

    rerender(
      <InboxItem
        message={{ ...baseMessage, content: 'x'.repeat(200) }}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        onAcknowledge={vi.fn()}
        onReject={vi.fn()}
        truncateLimit={120}
        displayMessage={'x'.repeat(120)}
      />,
    )
    expect(screen.getByText('Read More')).toBeTruthy()
  })
})
