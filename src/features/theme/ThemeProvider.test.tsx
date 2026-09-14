import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { THEME_STORAGE_KEY, ThemeProvider, useTheme } from './ThemeProvider'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('ThemeProvider', () => {
  it('defaults to system and can be set to dark', () => {
    localStorage.removeItem(THEME_STORAGE_KEY)
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.mode).toBe('system')

    act(() => {
      result.current.setMode('dark')
    })

    expect(result.current.mode).toBe('dark')
    expect(result.current.resolved).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })
})
