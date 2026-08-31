import { describe, expect, it, vi } from 'vitest'

import {
  focusFieldByName,
  focusFirstEmptyField,
  focusFirstInvalidField,
  getFirstErrorPath,
  isEmptyValue,
} from './focusField'

describe('focusField helpers', () => {
  it('treats blank strings, empty arrays, and empty objects as empty', () => {
    expect(isEmptyValue('')).toBe(true)
    expect(isEmptyValue('  ')).toBe(true)
    expect(isEmptyValue([])).toBe(true)
    expect(isEmptyValue({ name: '' })).toBe(true)
    expect(isEmptyValue('hello')).toBe(false)
    expect(isEmptyValue(['a'])).toBe(false)
  })

  it('returns the first nested Formik error path', () => {
    expect(
      getFirstErrorPath({
        bio: 'Add a short bio so recruiters know who you are.',
        location: { country: { name: 'Country is required.' } },
      }),
    ).toBe('bio')

    expect(
      getFirstErrorPath({
        location: { country: { name: 'Country is required.' } },
      }),
    ).toBe('location.country.name')
  })

  it('focuses the first field with an error', () => {
    document.body.innerHTML = `
      <input id="email" name="email" />
      <input id="password" name="password" />
    `
    const password = document.getElementById('password') as HTMLInputElement
    const focus = vi.spyOn(password, 'focus')
    password.scrollIntoView = vi.fn()

    expect(focusFirstInvalidField({ password: 'Password is required' })).toBe(
      true,
    )
    expect(focus).toHaveBeenCalled()
  })

  it('falls back to a parent path when the nested control is missing', () => {
    document.body.innerHTML = `<button type="button" data-field="location.country" id="location.country"></button>`
    const trigger = document.getElementById(
      'location.country',
    ) as HTMLButtonElement
    const focus = vi.spyOn(trigger, 'focus')
    trigger.scrollIntoView = vi.fn()

    expect(focusFieldByName('location.country.name')).toBe(true)
    expect(focus).toHaveBeenCalled()
  })

  it('focuses the first empty named field', () => {
    document.body.innerHTML = `
      <input id="firstName" name="firstName" />
      <input id="lastName" name="lastName" />
    `
    const lastName = document.getElementById('lastName') as HTMLInputElement
    const focus = vi.spyOn(lastName, 'focus')
    lastName.scrollIntoView = vi.fn()

    expect(
      focusFirstEmptyField(['firstName', 'lastName'], {
        firstName: 'Ada',
        lastName: '',
      }),
    ).toBe(true)
    expect(focus).toHaveBeenCalled()
  })
})
