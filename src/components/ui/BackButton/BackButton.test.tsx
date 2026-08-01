import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BackButton } from './BackButton'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

describe('BackButton', () => {
  beforeEach(() => {
    navigateMock.mockClear()
  })

  it('navigates back in history by default when no onClick is provided', () => {
    render(<BackButton />, { wrapper: MemoryRouter })

    fireEvent.click(screen.getByText('Back'))

    expect(navigateMock).toHaveBeenCalledWith(-1)
  })

  it('calls the provided onClick instead of navigating back when one is given', () => {
    const onClick = vi.fn()
    render(<BackButton onClick={onClick} />, { wrapper: MemoryRouter })

    fireEvent.click(screen.getByText('Back'))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
