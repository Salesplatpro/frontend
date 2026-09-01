import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { MatchScoreRing } from './MatchScoreRing'

describe('MatchScoreRing', () => {
  it('renders the CV match percentage instead of a qualitative verdict label', () => {
    render(
      <MatchScoreRing
        verdict="high"
        averageScore={82}
        cvSimilarityScore={74}
      />,
    )
    expect(screen.getByText('74%')).toBeTruthy()
    expect(screen.getByText('CV match')).toBeTruthy()
    expect(screen.queryByText('Strong Match')).toBeNull()
  })

  it('still shows the CV match percentage while the rest of screening is in progress', () => {
    render(
      <MatchScoreRing
        verdict={null}
        averageScore={null}
        cvSimilarityScore={61}
        currentStage="personality"
      />,
    )
    expect(screen.getByText('61%')).toBeTruthy()
    expect(screen.getByText('CV match')).toBeTruthy()
    expect(screen.queryByText('Screening')).toBeNull()
  })

  it('renders a "Not Available" state when there is no score yet', () => {
    render(<MatchScoreRing verdict={null} averageScore={null} />)
    expect(screen.getByText('-%')).toBeTruthy()
    expect(screen.getByText('Not Available')).toBeTruthy()
  })
})
