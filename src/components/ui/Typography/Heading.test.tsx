import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { Heading } from './Heading'

describe('Heading', () => {
  it('renders an h1 by default', () => {
    render(<Heading>Title</Heading>)

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Title')
  })

  it('renders the element matching the level prop', () => {
    render(<Heading level={3}>Title</Heading>)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading.tagName).toBe('H3')
    expect(heading.className).toContain('h3')
  })

  it('merges a custom className with its own', () => {
    render(<Heading className="custom-class">Title</Heading>)

    expect(screen.getByRole('heading').className).toContain('custom-class')
  })
})
