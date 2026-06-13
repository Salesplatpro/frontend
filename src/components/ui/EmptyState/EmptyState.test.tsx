import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No applications yet" />)

    expect(screen.getByText('No applications yet')).toBeTruthy()
  })

  it('renders the description when provided', () => {
    render(
      <EmptyState title="No applications yet" description="Check back later" />,
    )

    expect(screen.getByText('Check back later')).toBeTruthy()
  })

  it('does not render a description when none is provided', () => {
    const { container } = render(<EmptyState title="No applications yet" />)

    expect(container.querySelectorAll('div').length).toBeGreaterThan(0)
    expect(screen.queryByText('Check back later')).toBeNull()
  })

  it('renders the icon and action when provided', () => {
    render(
      <EmptyState
        title="No applications yet"
        icon={<span data-testid="icon" />}
        action={<button>Refresh</button>}
      />,
    )

    expect(screen.getByTestId('icon')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeTruthy()
  })
})
