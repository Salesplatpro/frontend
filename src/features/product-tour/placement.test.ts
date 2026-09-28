import { describe, expect, it } from 'vitest'

import { isOnScreen, placeCard } from './placement'

const viewport = { width: 1280, height: 800 }
const card = { width: 320, height: 200 }

describe('isOnScreen', () => {
  it('is false for hidden or off-screen elements', () => {
    expect(isOnScreen({ top: 0, left: 0, width: 0, height: 0 }, viewport)).toBe(
      false,
    )
    expect(
      isOnScreen({ top: 100, left: -300, width: 280, height: 40 }, viewport),
    ).toBe(false)
    expect(
      isOnScreen({ top: 900, left: 10, width: 100, height: 40 }, viewport),
    ).toBe(false)
  })

  it('is true when any part is visible', () => {
    expect(
      isOnScreen({ top: 100, left: -100, width: 280, height: 40 }, viewport),
    ).toBe(true)
  })
})

describe('placeCard', () => {
  it('centres the card when there is no target', () => {
    expect(placeCard(null, card, viewport)).toEqual({
      top: 300,
      left: 480,
      side: 'center',
    })
  })

  it('centres the card when the target is off screen (closed mobile menu)', () => {
    expect(
      placeCard(
        { top: 100, left: -300, width: 280, height: 40 },
        card,
        viewport,
      ).side,
    ).toBe('center')
  })

  it('puts the card to the right of a sidebar item', () => {
    expect(
      placeCard({ top: 200, left: 12, width: 270, height: 44 }, card, viewport),
    ).toEqual({ top: 200, left: 298, side: 'right' })
  })

  it('keeps the card inside the screen vertically', () => {
    expect(
      placeCard({ top: 760, left: 12, width: 270, height: 30 }, card, viewport)
        .top,
    ).toBe(800 - 200 - 16)
  })

  it('goes below a target near the right edge', () => {
    expect(
      placeCard(
        { top: 10, left: 1100, width: 160, height: 40 },
        card,
        viewport,
      ),
    ).toEqual({ top: 66, left: 1280 - 320 - 16, side: 'bottom' })
  })

  it('goes above when there is no room below', () => {
    expect(
      placeCard(
        { top: 700, left: 1100, width: 160, height: 60 },
        card,
        viewport,
      ),
    ).toEqual({ top: 484, left: 944, side: 'top' })
  })

  it('never places the card off a tiny screen', () => {
    const phone = { width: 360, height: 640 }
    const placed = placeCard(
      { top: 20, left: 200, width: 150, height: 40 },
      { width: 328, height: 220 },
      phone,
    )
    expect(placed.left).toBeGreaterThanOrEqual(16)
    expect(placed.top).toBeGreaterThanOrEqual(16)
  })
})
