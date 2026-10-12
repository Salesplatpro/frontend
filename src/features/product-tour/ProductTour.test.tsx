import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

  describe('when forced', () => {
    it('can only be paused, not skipped', () => {
      const onClose = vi.fn()
      render(<ProductTour steps={steps} forced onClose={onClose} />)
      expect(screen.queryByRole('button', { name: /skip tour/i })).toBeNull()
      fireEvent.click(screen.getByRole('button', { name: /pause/i }))
      expect(onClose).toHaveBeenLastCalledWith('paused')
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      expect(onClose).toHaveBeenLastCalledWith('paused')
    })
  })

  describe('gated steps', () => {
    const gatedSteps = [
      {
        target: 'nav-jobs',
        title: 'Open jobs',
        body: 'Click Jobs',
        why: 'That is where jobs live',
        advanceOn: 'click' as const,
        to: '/jobs',
      },
      { title: 'Done', body: 'All set' },
    ]
    const blocker = () =>
      document.querySelector<HTMLElement>('[class*="blocker"]')

    it('shows what to do and why, with no Next button', () => {
      addTarget()
      render(<ProductTour steps={gatedSteps} onClose={vi.fn()} />)
      expect(screen.getByText('Your turn')).toBeTruthy()
      expect(screen.getByText(/that is where jobs live/i)).toBeTruthy()
      expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    })

    it('opens a hole over the target only while gated', () => {
      const target = addTarget()
      render(<ProductTour steps={gatedSteps} onClose={vi.fn()} />)
      expect(blocker()?.style.clipPath).toContain('evenodd')
      fireEvent.click(target)
      expect(screen.getByRole('dialog', { name: 'Done' })).toBeTruthy()
      expect(blocker()?.style.clipPath).toBeFalsy()
    })

    it('moves on only when the target itself is clicked', () => {
      const target = addTarget()
      render(<ProductTour steps={gatedSteps} onClose={vi.fn()} />)
      fireEvent.click(document.body)
      expect(screen.getByRole('dialog', { name: 'Open jobs' })).toBeTruthy()
      fireEvent.click(target)
      expect(screen.getByRole('dialog', { name: 'Done' })).toBeTruthy()
    })

    it('closes as finished when the last step is clicked', () => {
      const onClose = vi.fn()
      const target = addTarget()
      render(<ProductTour steps={gatedSteps.slice(0, 1)} onClose={onClose} />)
      fireEvent.click(target)
      expect(onClose).toHaveBeenCalledWith('finished')
    })

    it('waits on a stage step until the page moves on', () => {
      addTarget()
      const stageStep = [{ ...gatedSteps[0], advanceOn: 'stage' as const }]
      render(<ProductTour steps={stageStep} onClose={vi.fn()} />)
      expect(screen.queryByRole('button', { name: /next|finish/i })).toBeNull()
      expect(blocker()?.style.clipPath).toContain('evenodd')
    })

    it('does not trap Tab, so the page stays usable', () => {
      addTarget()
      render(<ProductTour steps={gatedSteps} onClose={vi.fn()} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog.getAttribute('aria-modal')).toBe('false')
      expect(document.activeElement).not.toBe(dialog)
    })
  })

  describe('finding the target', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    const gatedSteps = [
      {
        target: 'nav-jobs',
        title: 'Open jobs',
        body: 'Click Jobs',
        advanceOn: 'click' as const,
        to: '/jobs',
      },
      { title: 'Done', body: 'All set' },
    ]

    it('picks up a target that mounts late', () => {
      render(<ProductTour steps={gatedSteps} onClose={vi.fn()} />)
      const blocker = document.querySelector<HTMLElement>('[class*="blocker"]')
      expect(blocker?.style.clipPath).toBeFalsy()
      addTarget()
      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(blocker?.style.clipPath).toContain('evenodd')
    })

    it('lets the user continue or jump ahead when the target never shows', () => {
      const onNavigate = vi.fn()
      render(
        <ProductTour
          steps={gatedSteps}
          pathname="/home"
          onNavigate={onNavigate}
          onClose={vi.fn()}
        />,
      )
      expect(
        screen.queryByRole('button', { name: /continue anyway/i }),
      ).toBeNull()
      act(() => {
        vi.advanceTimersByTime(6100)
      })
      fireEvent.click(screen.getByRole('button', { name: /take me there/i }))
      expect(onNavigate).toHaveBeenCalledWith('/jobs')
      fireEvent.click(screen.getByRole('button', { name: /continue anyway/i }))
      expect(screen.getByRole('dialog', { name: 'Done' })).toBeTruthy()
    })
  })

  describe('step pages', () => {
    const routed = [{ title: 'Profile', body: 'Fill it in', route: '/profile' }]

    it('goes to the step page when it is elsewhere', () => {
      const onNavigate = vi.fn()
      render(
        <ProductTour
          steps={routed}
          pathname="/home"
          onNavigate={onNavigate}
          onClose={vi.fn()}
        />,
      )
      expect(onNavigate).toHaveBeenCalledWith('/profile')
    })

    it('stays put when already on the step page', () => {
      const onNavigate = vi.fn()
      render(
        <ProductTour
          steps={routed}
          pathname="/profile/"
          onNavigate={onNavigate}
          onClose={vi.fn()}
        />,
      )
      expect(onNavigate).not.toHaveBeenCalled()
    })
  })
})
