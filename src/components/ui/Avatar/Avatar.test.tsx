import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders the initials of the given name', () => {
    render(<Avatar firstName="Jane" lastName="Doe" />)
    expect(screen.getByText('JD')).toBeTruthy()
  })

  it('assigns the same color class for the same name on repeat renders', () => {
    const { container: first } = render(
      <Avatar firstName="Jane" lastName="Doe" />,
    )
    const { container: second } = render(
      <Avatar firstName="Jane" lastName="Doe" />,
    )
    expect(first.firstElementChild?.className).toBe(
      second.firstElementChild?.className,
    )
  })
})
