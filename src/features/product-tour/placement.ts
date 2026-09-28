export interface Box {
  top: number
  left: number
  width: number
  height: number
}

export interface Viewport {
  width: number
  height: number
}

const GAP = 16
const EDGE = 16

/** A target is only worth pointing at when some of it is on screen. */
export const isOnScreen = (rect: Box, viewport: Viewport) =>
  rect.width > 0 &&
  rect.height > 0 &&
  rect.left + rect.width > 0 &&
  rect.top + rect.height > 0 &&
  rect.left < viewport.width &&
  rect.top < viewport.height

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Where to put the tour card: beside the target (sidebar items sit on the
 * left, so right is tried first), else below, else above, else centred.
 */
export const placeCard = (
  target: Box | null,
  card: { width: number; height: number },
  viewport: Viewport,
): {
  top: number
  left: number
  side: 'right' | 'bottom' | 'top' | 'center'
} => {
  const centred = {
    top: Math.max(EDGE, (viewport.height - card.height) / 2),
    left: Math.max(EDGE, (viewport.width - card.width) / 2),
    side: 'center' as const,
  }
  if (!target || !isOnScreen(target, viewport)) return centred

  const maxTop = viewport.height - card.height - EDGE
  const maxLeft = viewport.width - card.width - EDGE

  const rightLeft = target.left + target.width + GAP
  if (rightLeft + card.width <= viewport.width - EDGE) {
    return {
      top: clamp(target.top, EDGE, maxTop),
      left: rightLeft,
      side: 'right',
    }
  }

  const belowTop = target.top + target.height + GAP
  if (belowTop + card.height <= viewport.height - EDGE) {
    return {
      top: belowTop,
      left: clamp(target.left, EDGE, maxLeft),
      side: 'bottom',
    }
  }

  const aboveTop = target.top - GAP - card.height
  if (aboveTop >= EDGE) {
    return {
      top: aboveTop,
      left: clamp(target.left, EDGE, maxLeft),
      side: 'top',
    }
  }

  return centred
}
