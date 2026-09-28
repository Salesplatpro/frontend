import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProductTour } from './ProductTour'

const steps = [
  { title: 'Welcome', body: 'Hello' },
  { target: 'nav-jobs', title: 'Jobs', body: 'Find jobs' },
  { target: 'missing', title: 'Gone', body: 'Not on screen' },
]

const addTarget = () => {
  const el = document.createElement('a')
  el.setAttribute('data-tour', 'nav-jobs')
  el.getBoundingClientRect = () =>
    ({
      top: 100,
      left: 10,
      width: 200,
      height: 40,
      right: 210,
      bottom: 140,
    } as DOMRect)
  document.body.appendChild(el)
  return el
}

afterEach(() => {
  document.querySelectorAll('[data-tour]').forEach((el) => el.remove())
})

describe('ProductTour', () => {
  it('opens as a dialog on the first step with no spotlight', () => {
    render(<ProductTour steps={steps} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog', { name: 'Welcome' })
    expect(dialog.textContent).toContain('1 of 3')
    expect(document.activeElement).toBe(dialog)
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('moves forward and back', () => {
    addTarget()
    render(<ProductTour steps={steps} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('dialog', { name: 'Jobs' })).toBeTruthy()
    expect(screen.getByText('2 of 3')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeTruthy()
  })

  it('places the card beside a visible target', () => {
    addTarget()
    render(<ProductTour steps={steps} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    const dialog = screen.getByRole('dialog') as HTMLElement
    expect(dialog.style.left).toBe('226px')
    expect(dialog.style.top).toBe('100px')
  })

  it('still shows a step whose target is missing, in the middle', () => {
    render(<ProductTour steps={steps} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('dialog', { name: 'Gone' })).toBeTruthy()
  })

  it('finishes on the last step', () => {
    const onClose = vi.fn()
    render(<ProductTour steps={steps.slice(0, 1)} onClose={onClose} />)
    expect(screen.queryByRole('button', { name: /skip tour/i })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(onClose).toHaveBeenCalledWith('finished')
  })

  it('can be skipped with the button or Escape', () => {
    const onClose = vi.fn()
    render(<ProductTour steps={steps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /skip tour/i }))
    expect(onClose).toHaveBeenLastCalledWith('skipped')

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('keeps keyboard focus inside the card', () => {
    render(<ProductTour steps={steps} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    const next = screen.getByRole('button', { name: 'Next' })
    const skip = screen.getByRole('button', { name: /skip tour/i })
    next.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(document.activeElement).toBe(skip)
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(next)
  })

  it('gives focus back to where it was when closed', () => {
    const before = document.createElement('button')
    document.body.appendChild(before)
    before.focus()
    const { unmount } = render(<ProductTour steps={steps} onClose={vi.fn()} />)
    unmount()
    expect(document.activeElement).toBe(before)
    before.remove()
  })
})
