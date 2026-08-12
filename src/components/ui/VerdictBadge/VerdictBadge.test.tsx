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

  it('shows a "Match failed" state when verdict generation has failed', () => {
    render(<VerdictBadge verdict={null} failed />)
    expect(screen.getByText(/Match failed/i)).toBeTruthy()
  })

  it('prioritizes the failed state over pending when both are somehow true', () => {
    render(<VerdictBadge verdict={null} pending failed />)
    expect(screen.getByText(/Match failed/i)).toBeTruthy()
    expect(screen.queryByText(/Analyzing match/i)).toBeNull()
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

  it('shows itemized strengths/weaknesses/risks and the recommendation instead of a single paragraph when evidence is available', () => {
    render(
      <VerdictBadge
        verdict="high"
        reasoning="Strong CV match and consistent scores."
        strengths={['Five years of TypeScript experience per the CV.']}
        weaknesses={['No leadership experience mentioned.']}
        risks={['May need ramp-up time on this stack.']}
        recommendation="hire"
      />,
    )

    fireEvent.click(screen.getByText('Why?'))

    expect(screen.getByText('Recommend: Hire')).toBeTruthy()
    expect(
      screen.getByText('Five years of TypeScript experience per the CV.'),
    ).toBeTruthy()
    expect(screen.getByText('No leadership experience mentioned.')).toBeTruthy()
    expect(
      screen.getByText('May need ramp-up time on this stack.'),
    ).toBeTruthy()
    // The old single-paragraph reasoning is superseded by the itemized lists.
    expect(
      screen.queryByText('Strong CV match and consistent scores.'),
    ).toBeNull()
  })

  it('falls back to the plain reasoning paragraph for older verdicts with no itemized evidence', () => {
    render(
      <VerdictBadge
        verdict="medium"
        reasoning="Decent match based on available scores."
      />,
    )

    fireEvent.click(screen.getByText('Why?'))

    expect(
      screen.getByText('Decent match based on available scores.'),
    ).toBeTruthy()
  })
})
