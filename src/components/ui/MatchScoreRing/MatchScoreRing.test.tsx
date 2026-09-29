import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { MatchScoreRing } from './MatchScoreRing'

describe('MatchScoreRing', () => {
  it('renders the AI overall fit score, not the earlier CV similarity score, once it exists', () => {
    render(
      <MatchScoreRing
        verdict="high"
        overallFitScore={88}
        averageScore={82}
        cvSimilarityScore={74}
      />,
    )
    expect(screen.getByText('88%')).toBeTruthy()
    expect(screen.getByText('AI match')).toBeTruthy()
    expect(screen.queryByText('74%')).toBeNull()
  })

  it('falls back to the CV match percentage, clearly labeled as screening-stage, before the AI verdict exists', () => {
    render(
      <MatchScoreRing
        verdict={null}
        averageScore={null}
        cvSimilarityScore={61}
        currentStage="personality"
      />,
    )
    expect(screen.getByText('61%')).toBeTruthy()
    expect(screen.getByText('CV match (screening)')).toBeTruthy()
    expect(screen.queryByText('Screening')).toBeNull()
  })

  it('renders a "Not Available" state when there is no score yet', () => {
    render(<MatchScoreRing verdict={null} averageScore={null} />)
    expect(screen.getByText('-%')).toBeTruthy()
    expect(screen.getByText('Not Available')).toBeTruthy()
  })
})
