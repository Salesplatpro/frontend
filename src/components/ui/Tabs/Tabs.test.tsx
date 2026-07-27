import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Tabs } from './Tabs'

describe('Tabs', () => {
  it('marks the active tab and shows counts, including zero', () => {
    render(
      <Tabs
        tabs={[
          { key: 'all', label: 'All', count: 5 },
          { key: 'rejected', label: 'Rejected', count: 0 },
        ]}
        activeKey="all"
        onChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('tab', { name: /all/i }).getAttribute('aria-selected'),
    ).toBe('true')
    expect(
      screen
        .getByRole('tab', { name: /rejected/i })
        .getAttribute('aria-selected'),
    ).toBe('false')
    expect(screen.getByText('0')).toBeTruthy()
  })

  it('calls onChange with the clicked tab key', () => {
    const onChange = vi.fn()
    render(
      <Tabs
        tabs={[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
        ]}
        activeKey="all"
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('tab', { name: /pending/i }))
    expect(onChange).toHaveBeenCalledWith('pending')
  })
})
