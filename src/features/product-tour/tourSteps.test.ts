import { describe, expect, it } from 'vitest'

import {
  sidebarData as recruiterSidebar,
  sidebarFooterData,
} from '@/components/features/recruiter/SideBar/sidebarData'
import { sidebarData as talentSidebar } from '@/components/features/talent/SideBar/SideBarData'

import { RECRUITER_TOUR, TALENT_TOUR } from './tourSteps'

// Anchors outside the sidebar lists, set directly on their components.
const LAYOUT_ANCHORS = ['company-switcher', 'profile-menu']

const ids = (items: { tourId?: string }[]) =>
  items.map((item) => item.tourId).filter(Boolean)

describe('tour steps', () => {
  it('points every recruiter step at something on the page', () => {
    const available = [
      ...ids(recruiterSidebar),
      ...ids(sidebarFooterData),
      ...LAYOUT_ANCHORS,
    ]
    for (const step of RECRUITER_TOUR) {
      if (step.target) expect(available).toContain(step.target)
    }
  })

  it('points every talent step at something on the page', () => {
    const available = [...ids(talentSidebar), ...LAYOUT_ANCHORS]
    for (const step of TALENT_TOUR) {
      if (step.target) expect(available).toContain(step.target)
    }
  })

  it('starts each tour with a centred welcome and keeps copy short', () => {
    for (const tour of [RECRUITER_TOUR, TALENT_TOUR]) {
      expect(tour[0].target).toBeUndefined()
      for (const step of tour) {
        expect(step.body.length).toBeLessThanOrEqual(160)
      }
    }
  })
})
