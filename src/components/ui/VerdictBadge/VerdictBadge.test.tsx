import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { VerdictBadge } from './VerdictBadge'

describe('VerdictBadge', () => {
  it('renders nothing when there is no verdict and nothing is pending', () => {
    const { container } = render(<VerdictBadge verdict={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows an "Analyzing match…" state while the verdict is pending', () => {
    render(<VerdictBadge verdict={null} pending />)
    expect(screen.getByText(/Analyzing match/i)).toBeTruthy()
  })

  it('renders the label for each verdict', () => {
    const { rerender } = render(<VerdictBadge verdict="high" />)
    expect(screen.getByText('High Match')).toBeTruthy()

    rerender(<VerdictBadge verdict="medium" />)
    expect(screen.getByText('Medium Match')).toBeTruthy()

    rerender(<VerdictBadge verdict="low" />)
    expect(screen.getByText('Low Match')).toBeTruthy()
  })

  it('does not show a reasoning toggle in compact mode, even with reasoning provided', () => {
    render(<VerdictBadge verdict="high" reasoning="Strong CV match." compact />)
    expect(screen.queryByText('Why?')).toBeNull()
  })

  it('reveals the reasoning text when the toggle is clicked', () => {
    render(
      <VerdictBadge
        verdict="high"
        reasoning="Strong CV match and consistent scores."
      />,
    )

    expect(screen.queryByText(/Strong CV match/)).toBeNull()

    fireEvent.click(screen.getByText('Why?'))

    expect(screen.getByText(/Strong CV match/)).toBeTruthy()
    expect(screen.getByText('Hide reasoning')).toBeTruthy()
  })
})
