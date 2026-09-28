import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import Guide from './Guide'

const renderGuide = (path = '/recruiterDashboard/guide') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Guide />
    </MemoryRouter>,
  )

describe('Guide', () => {
  it('lists every section with a jump link', () => {
    renderGuide()
    for (const title of [
      'Getting started',
      'Pages',
      'Job fields',
      'Screening settings',
      'Publishing and job status',
    ]) {
      expect(screen.getByRole('heading', { name: title })).toBeTruthy()
      expect(screen.getByRole('link', { name: title })).toBeTruthy()
    }
  })

  it('filters entries as you search', () => {
    renderGuide()
    fireEvent.change(screen.getByLabelText(/search the guide/i), {
      target: { value: 'sensible bar' },
    })
    expect(screen.getByText('CV match')).toBeTruthy()
    expect(screen.queryByText('Talent Search')).toBeNull()
  })

  it('says when nothing matches', () => {
    renderGuide()
    fireEvent.change(screen.getByLabelText(/search the guide/i), {
      target: { value: 'quantum' },
    })
    expect(screen.getByRole('status').textContent).toMatch(/nothing matches/i)
  })

  it('jumps to the entry named in the link', () => {
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')
    renderGuide('/recruiterDashboard/guide#cv-match')
    const entry = document.getElementById('cv-match')
    expect(scrollSpy).toHaveBeenCalled()
    expect(document.activeElement).toBe(entry)
    scrollSpy.mockRestore()
  })

  it('ignores a link to an entry that does not exist', () => {
    expect(() => renderGuide('/recruiterDashboard/guide#nope')).not.toThrow()
  })
})
