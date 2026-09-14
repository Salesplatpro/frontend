import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'auxhr-theme'

type ThemeContextValue = {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const readStoredThemeMode = (): ThemeMode => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value
    }
  } catch {
    // private mode / blocked storage
  }
  return 'system'
}

export const resolveThemeMode = (mode: ThemeMode): ResolvedTheme => {
  if (mode === 'light' || mode === 'dark') return mode
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyResolvedTheme = (resolved: ResolvedTheme) => {
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.style.colorScheme = resolved
}

const clearTheme = () => {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.colorScheme = 'light'
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(readStoredThemeMode)
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveThemeMode(readStoredThemeMode()),
  )

  useEffect(() => {
    const apply = () => {
      const next = resolveThemeMode(mode)
      setResolved(next)
      applyResolvedTheme(next)
    }
    apply()
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // ignore
    }
    if (mode !== 'system') return undefined
    if (typeof window.matchMedia !== 'function') return undefined
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode])

  useEffect(() => () => clearTheme(), [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
  }, [])

  const value = useMemo(
    () => ({ mode, resolved, setMode }),
    [mode, resolved, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      mode: 'system',
      resolved: 'light',
      setMode: () => undefined,
    }
  }
  return context
}
