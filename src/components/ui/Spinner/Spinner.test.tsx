import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders', () => {
    const { container } = render(<Spinner />)

    expect(container.firstChild).toBeTruthy()
  })

  it('applies the size class', () => {
    const { container } = render(<Spinner size="sm" />)

    const spinner = container.firstElementChild?.firstElementChild
    expect(spinner?.className).toContain('sm')
  })

  it('applies the fullPage class when requested', () => {
    const { container } = render(<Spinner fullPage />)

    expect(container.firstChild).toHaveProperty(
      'className',
      expect.stringContaining('fullPage'),
    )
  })

  it('merges a custom className', () => {
    const { container } = render(<Spinner className="custom-class" />)

    expect(container.firstChild).toHaveProperty(
      'className',
      expect.stringContaining('custom-class'),
    )
  })
})
