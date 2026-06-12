import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByText('Click me')).toBeTruthy()
  })

  it('applies the variant and size classes', () => {
    render(
      <Button variant="outline" size="wide">
        Outline
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button.className).toContain('outline')
    expect(button.className).toContain('wide')
  })

  it('merges a custom className with its own', () => {
    render(<Button className="custom-class">Click me</Button>)

    expect(screen.getByRole('button').className).toContain('custom-class')
  })

  it('forwards refs to the underlying button element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Click me</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('fires native click events', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button and shows a spinner while loading', () => {
    render(<Button loading>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(screen.queryByText('Click me')).toBeNull()
  })
})
