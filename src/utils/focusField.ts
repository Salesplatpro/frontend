const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'button:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const attrEscape = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

export const isEmptyValue = (value: unknown): boolean => {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (typeof value === 'number') return Number.isNaN(value)
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every(isEmptyValue)
  }
  return false
}

export const getFirstErrorPath = (
  errors: unknown,
  prefix = '',
): string | null => {
  if (errors == null || errors === false) return null
  if (typeof errors === 'string') return prefix || null
  if (Array.isArray(errors)) {
    for (let index = 0; index < errors.length; index += 1) {
      const path = getFirstErrorPath(
        errors[index],
        prefix ? `${prefix}[${index}]` : String(index),
      )
      if (path) return path
    }
    return null
  }
  if (typeof errors === 'object') {
    for (const [key, value] of Object.entries(
      errors as Record<string, unknown>,
    )) {
      const path = getFirstErrorPath(value, prefix ? `${prefix}.${key}` : key)
      if (path) return path
    }
  }
  return null
}

const ancestorPaths = (path: string): string[] => {
  const paths = [path]
  let current = path
  while (current.includes('.')) {
    current = current.slice(0, current.lastIndexOf('.'))
    paths.push(current)
  }
  return paths
}

type FieldRoot = Document | HTMLElement

const queryField = (root: FieldRoot, name: string): HTMLElement | null => {
  const escaped = attrEscape(name)
  const selectors = [
    `[data-field="${escaped}"]`,
    `[name="${escaped}"]`,
    `[id="${escaped}"]`,
    `label[for="${escaped}"]`,
  ]

  for (const selector of selectors) {
    try {
      const match = root.querySelector<HTMLElement>(selector)
      if (match) return match
    } catch {
      // Ignore selectors the browser cannot parse.
    }
  }

  return null
}

const isDisplayed = (element: HTMLElement): boolean => {
  if (typeof window === 'undefined') return true
  return window.getComputedStyle(element).display !== 'none'
}

const resolveFocusTarget = (element: HTMLElement): HTMLElement => {
  if (element.matches(FOCUSABLE_SELECTOR) && isDisplayed(element)) {
    return element
  }

  const candidates = element.querySelectorAll<HTMLElement>(
    `${FOCUSABLE_SELECTOR}, .ql-editor`,
  )
  for (const candidate of Array.from(candidates)) {
    if (isDisplayed(candidate)) return candidate
  }

  if (element.tabIndex < 0) {
    element.tabIndex = -1
  }

  return element
}

export const focusFieldByName = (
  name: string,
  root?: FieldRoot | null,
): boolean => {
  if (typeof document === 'undefined' || !name) return false

  const scope = root ?? document
  let element: HTMLElement | null = null

  for (const path of ancestorPaths(name)) {
    element = queryField(scope, path)
    if (element) break
  }

  if (!element) return false

  const target = resolveFocusTarget(element)
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  target.focus({ preventScroll: true })
  return true
}

export const focusFirstInvalidField = (
  errors: unknown,
  root?: FieldRoot | null,
): boolean => {
  const path = getFirstErrorPath(errors)
  if (!path) return false
  return focusFieldByName(path, root)
}

export const focusFirstEmptyField = (
  names: string[],
  values: Record<string, unknown>,
  root?: FieldRoot | null,
): boolean => {
  const empty = names.find((name) => {
    const parts = name.split('.')
    let current: unknown = values
    for (const part of parts) {
      if (current == null || typeof current !== 'object') {
        current = undefined
        break
      }
      current = (current as Record<string, unknown>)[part]
    }
    return isEmptyValue(current)
  })

  if (!empty) return false
  return focusFieldByName(empty, root)
}
