import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Dropdown } from './Dropdown'

describe('Dropdown', () => {
  it('opens on trigger click, fires the item action, and closes by default', () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<span>Actions</span>}
        items={[{ label: 'Shortlist', onClick }]}
      />,
    )

    expect(screen.queryByText('Shortlist')).toBeNull()

    fireEvent.click(screen.getByText('Actions'))
    fireEvent.click(screen.getByText('Shortlist'))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Shortlist')).toBeNull()
  })

  it('keeps the menu open after a click when closeOnSelect is false', () => {
    render(
      <Dropdown
        trigger={<span>Columns</span>}
        items={[{ label: 'Stage', onClick: vi.fn() }]}
        closeOnSelect={false}
      />,
    )

    fireEvent.click(screen.getByText('Columns'))
    fireEvent.click(screen.getByText('Stage'))

    expect(screen.getByText('Stage')).toBeTruthy()
  })
})
