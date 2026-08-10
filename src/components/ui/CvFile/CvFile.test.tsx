import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CvFile } from './CvFile'

describe('CvFile', () => {
  it('renders a link to the CV with the correct href and file name', () => {
    render(
      <CvFile fileName="resume.pdf" url="https://example.com/resume.pdf" />,
    )

    const link = screen.getByText('resume.pdf') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('https://example.com/resume.pdf')
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('renders a button that calls onOpen when no url is provided', () => {
    const onOpen = vi.fn()
    render(<CvFile fileName="resume.pdf" onOpen={onOpen} />)

    screen.getByText('resume.pdf').click()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('renders a non-clickable file name when neither url nor onOpen is provided', () => {
    render(<CvFile fileName="resume.pdf" replaceInputId="cv" />)

    expect(screen.getByText('resume.pdf').tagName).toBe('SPAN')
    expect(screen.getByText('Replace').getAttribute('for')).toBe('cv')
  })

  it('does not render a "Replace" label when replaceInputId is omitted', () => {
    render(
      <CvFile fileName="resume.pdf" url="https://example.com/resume.pdf" />,
    )
    expect(screen.queryByText('Replace')).toBeNull()
  })
})
