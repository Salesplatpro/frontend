import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { CvFile } from './CvFile'

describe('CvFile', () => {
  it('renders a link to the CV with the correct href and file name', () => {
    render(
      <CvFile
        fileName="resume.pdf"
        url="https://res.cloudinary.com/test/resume.pdf"
      />,
    )

    const link = screen.getByText('resume.pdf') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe(
      'https://res.cloudinary.com/test/resume.pdf',
    )
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('does not render a "Replace" label when replaceInputId is omitted (read-only view)', () => {
    render(
      <CvFile fileName="resume.pdf" url="https://example.com/resume.pdf" />,
    )
    expect(screen.queryByText('Replace')).toBeNull()
  })

  it('renders a "Replace" label wired to the given input id when replaceInputId is provided', () => {
    render(
      <CvFile
        fileName="resume.pdf"
        url="https://example.com/resume.pdf"
        replaceInputId="cv"
      />,
    )

    const replaceLabel = screen.getByText('Replace')
    expect(replaceLabel.getAttribute('for')).toBe('cv')
  })
})
