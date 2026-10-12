import { describe, expect, it } from 'vitest'

import {
  sidebarData as recruiterSidebar,
  sidebarFooterData,
} from '@/components/features/recruiter/SideBar/sidebarData'
import { sidebarData as talentSidebar } from '@/components/features/talent/SideBar/SideBarData'

import { RECRUITER_TOUR, STAGE_TOURS, TALENT_TOUR } from './tourSteps'

const sources = import.meta.glob('/src/**/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const anchorExists = (id: string) =>
  Object.entries(sources).some(
    ([path, source]) =>
      !path.endsWith('.test.tsx') &&
      new RegExp(`(data-tour|tourId)[^\\n]{0,40}['"]${id}['"]`).test(source),
  )

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

  describe('stage tours', () => {
    const allSteps = Object.entries(STAGE_TOURS).flatMap(([stage, steps]) =>
      (steps ?? []).map((step) => ({ stage, step })),
    )

    it('points every step at an anchor that exists in the app', () => {
      for (const { step } of allSteps) {
        if (step.target) expect(anchorExists(step.target)).toBe(true)
      }
    })

    it('gives every step a target, a reason and short copy', () => {
      for (const { step } of allSteps) {
        expect(step.target).toBeTruthy()
        expect(step.why).toBeTruthy()
        expect(step.body.length).toBeLessThanOrEqual(160)
        expect(step.why!.length).toBeLessThanOrEqual(120)
      }
    })

    it('only ends a tour on a step that waits for the stage to change', () => {
      for (const steps of Object.values(STAGE_TOURS)) {
        const waiting = (steps ?? []).filter((s) => s.advanceOn === 'stage')
        expect(waiting.length).toBeLessThanOrEqual(1)
        if (waiting.length) expect(steps?.at(-1)?.advanceOn).toBe('stage')
      }
    })

    it('tells click steps where the click leads, for phones', () => {
      for (const { step } of allSteps) {
        if (step.advanceOn === 'click' && step.target?.startsWith('nav-')) {
          expect(step.to).toBeTruthy()
        }
      }
    })
  })
})
