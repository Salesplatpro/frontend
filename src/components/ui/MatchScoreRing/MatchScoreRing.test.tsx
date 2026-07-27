import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { MatchScoreRing } from './MatchScoreRing'

describe('MatchScoreRing', () => {
  it('renders the score and a qualitative label for a high verdict', () => {
    render(<MatchScoreRing verdict="high" averageScore={82} />)
    expect(screen.getByText('82%')).toBeTruthy()
    expect(screen.getByText('Strong Match')).toBeTruthy()
  })

  it('renders a "Not Available" state when there is no verdict yet', () => {
    render(<MatchScoreRing verdict={null} averageScore={null} />)
    expect(screen.getByText('-%')).toBeTruthy()
    expect(screen.getByText('Not Available')).toBeTruthy()
  })
})
