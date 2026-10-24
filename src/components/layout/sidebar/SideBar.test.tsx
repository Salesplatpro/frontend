import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { SideBar } from './SideBar'

vi.mock('@/features/auth/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({ user: { userRole: 'recruiter' } }),
}))

describe('SideBar', () => {
  it('renders footer links above the feedback link', () => {
    render(
      <MemoryRouter>
        <SideBar
          sideBarData={[{ name: 'Dashboard', icon: null, link: '/a' }]}
          footerItems={[{ name: 'Guide', icon: null, link: '/guide' }]}
        />
      </MemoryRouter>,
    )
    const links = screen.getAllByRole('link').map((link) => link.textContent)
    expect(links.indexOf('Guide')).toBeGreaterThan(links.indexOf('Dashboard'))
    expect(links.indexOf('Guide')).toBeLessThan(
      links.findIndex((text) => text?.includes('Leave us feedback')),
    )
  })

  it('works without footer links', () => {
    render(
      <MemoryRouter>
        <SideBar sideBarData={[]} />
      </MemoryRouter>,
    )
    expect(screen.queryByText('Guide')).toBeNull()
    expect(screen.getByText('Leave us feedback')).toBeTruthy()
  })
})
