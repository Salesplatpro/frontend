import { describe, expect, it } from 'vitest'

import {
  changePasswordPathForRole,
  dashboardPathForRole,
  destinationAfterAuth,
  loginPathWithNext,
} from './dashboardPath'

describe('destinationAfterAuth', () => {
  it('resumes an apply-wizard next path for talent (not the dashboard)', () => {
    expect(
      destinationAfterAuth(
        'talent',
        '/apply/11111111-1111-1111-1111-111111111111',
      ),
    ).toBe('/apply/11111111-1111-1111-1111-111111111111')
  })

  it('resumes nested apply-wizard steps for talent', () => {
    expect(
      destinationAfterAuth(
        'talent',
        '/apply/11111111-1111-1111-1111-111111111111/profile',
      ),
    ).toBe('/apply/11111111-1111-1111-1111-111111111111/profile')
  })

  it('does not send talent to a recruiter next path', () => {
    expect(
      destinationAfterAuth('talent', '/recruiterDashboard/plan?checkout=paid'),
    ).toBe('/talentDashboard')
  })

  it('still honors recruiter billing next paths', () => {
    expect(
      destinationAfterAuth(
        'recruiter',
        '/recruiterDashboard/plan?checkout=paid&interval=monthly',
      ),
    ).toBe('/recruiterDashboard/plan?checkout=paid&interval=monthly')
  })

  it('falls back to the role dashboard when next is missing', () => {
    expect(destinationAfterAuth('talent', null)).toBe(
      dashboardPathForRole('talent'),
    )
  })

  it('rejects open redirects', () => {
    expect(destinationAfterAuth('talent', 'https://evil.com')).toBe(
      '/talentDashboard',
    )
    expect(destinationAfterAuth('talent', '//evil.com')).toBe(
      '/talentDashboard',
    )
  })
})

describe('loginPathWithNext', () => {
  it('encodes an apply path as the login next param', () => {
    expect(loginPathWithNext('/apply/abc-123')).toBe(
      '/login?next=%2Fapply%2Fabc-123',
    )
  })

  it('returns /login when next is absent', () => {
    expect(loginPathWithNext()).toBe('/login')
  })
})

describe('changePasswordPathForRole', () => {
  it('returns the dashboard change-password route for talent and recruiter', () => {
    expect(changePasswordPathForRole('talent')).toBe(
      '/talentDashboard/change-password',
    )
    expect(changePasswordPathForRole('recruiter')).toBe(
      '/recruiterDashboard/change-password',
    )
  })

  it('returns undefined for admin and when the role is missing', () => {
    expect(changePasswordPathForRole('admin')).toBeUndefined()
    expect(changePasswordPathForRole()).toBeUndefined()
    expect(changePasswordPathForRole(null)).toBeUndefined()
  })
})
