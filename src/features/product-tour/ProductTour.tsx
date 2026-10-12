import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/Button'

import { Box, isOnScreen, placeCard } from './placement'
import styles from './ProductTour.module.scss'
import { TourStep } from './tourSteps'

const CARD_FALLBACK = { width: 320, height: 200 }
const SPOTLIGHT_PADDING = 6
const RETRY_MS = 250
const TARGET_WAIT_MS = 6000

const findTarget = (target?: string): HTMLElement | null =>
  target ? document.querySelector<HTMLElement>(`[data-tour="${target}"]`) : null

const toBox = (rect: DOMRect): Box => ({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
})

const trimPath = (path: string) => path.replace(/\/+$/, '')

const onPage = (pathname: string, route: string) => {
  const current = trimPath(pathname)
  const wanted = trimPath(route)
  return current === wanted || current.startsWith(`${wanted}/`)
}

// A full-screen shape with the target cut out, so only the target stays clickable.
const holeShape = (box: Box) => {
  const left = box.left - SPOTLIGHT_PADDING
  const top = box.top - SPOTLIGHT_PADDING
  const right = box.left + box.width + SPOTLIGHT_PADDING
  const bottom = box.top + box.height + SPOTLIGHT_PADDING
  return `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${left}px ${top}px, ${left}px ${bottom}px, ${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px)`
}

export type TourCloseReason = 'finished' | 'skipped' | 'paused'

type ProductTourProps = {
  steps: TourStep[]
  /** A forced tour can only be paused, not skipped. */
  forced?: boolean
  pathname?: string
  onNavigate?: (path: string) => void
  onClose: (reason: TourCloseReason) => void
}

export const ProductTour = ({
  steps,
  forced = false,
  pathname = '',
  onNavigate,
  onClose,
}: ProductTourProps) => {
  const [index, setIndex] = useState(0)
  const [targetBox, setTargetBox] = useState<Box | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const cardRef = useRef<HTMLDivElement>(null)
  const pathnameRef = useRef(pathname)
  const onNavigateRef = useRef(onNavigate)
  const advanceRef = useRef<() => void>(() => undefined)
  const titleId = useId()
  const bodyId = useId()
  const step = steps[index]
  const isLast = index === steps.length - 1
  const gated = !!step?.advanceOn
  const lost = timedOut && !targetBox
  const destination = step?.to ?? step?.route
  const awayFromDestination = !!destination && !onPage(pathname, destination)

  pathnameRef.current = pathname
  onNavigateRef.current = onNavigate

  const advance = useCallback(() => {
    if (isLast) {
      onClose('finished')
      return
    }
    setIndex((current) => current + 1)
  }, [isLast, onClose])

  advanceRef.current = advance

  const measure = useCallback(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const element = findTarget(step?.target)
    const box = element ? toBox(element.getBoundingClientRect()) : null
    const visible = box && isOnScreen(box, viewport) ? box : null
    const card = cardRef.current
    const size =
      card && card.offsetWidth > 0
        ? { width: card.offsetWidth, height: card.offsetHeight }
        : CARD_FALLBACK
    setTargetBox(visible)
    const placed = placeCard(visible, size, viewport)
    setCardPos({ top: placed.top, left: placed.left })
  }, [step?.target])

  useEffect(() => {
    setTimedOut(false)
    if (step?.skipWhen?.(pathnameRef.current)) {
      advanceRef.current()
      return
    }
    const route = step?.route
    if (route && !onPage(pathnameRef.current, route)) {
      onNavigateRef.current?.(route)
    }
  }, [index, step?.route, step?.skipWhen])

  useLayoutEffect(() => {
    findTarget(step?.target)?.scrollIntoView?.({ block: 'nearest' })
    measure()
  }, [measure, step?.target])

  useEffect(() => {
    if (!step?.target || targetBox) return
    const retry = window.setInterval(measure, RETRY_MS)
    const giveUp = window.setTimeout(() => setTimedOut(true), TARGET_WAIT_MS)
    return () => {
      window.clearInterval(retry)
      window.clearTimeout(giveUp)
    }
  }, [step?.target, targetBox, measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [measure])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    return () => previouslyFocused?.focus?.()
  }, [])

  useEffect(() => {
    if (!gated) cardRef.current?.focus()
  }, [index, gated])

  useEffect(() => {
    if (step?.advanceOn !== 'click') return
    const handleClick = (event: MouseEvent) => {
      const element = findTarget(step.target)
      if (
        element &&
        event.target instanceof Node &&
        element.contains(event.target)
      ) {
        advance()
      }
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [step?.advanceOn, step?.target, advance])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose(forced ? 'paused' : 'skipped')
        return
      }
      if (gated || event.key !== 'Tab' || !cardRef.current) return
      const focusable = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const inside = cardRef.current.contains(document.activeElement)
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (!inside || document.activeElement === last)
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, forced, gated])

  if (!step) return null

  return createPortal(
    <div className={styles.root}>
      <div
        className={styles.blocker}
        aria-hidden
        style={
          gated && targetBox ? { clipPath: holeShape(targetBox) } : undefined
        }
      />
      {targetBox ? (
        <div
          className={styles.spotlight}
          aria-hidden
          style={{
            top: targetBox.top - SPOTLIGHT_PADDING,
            left: targetBox.left - SPOTLIGHT_PADDING,
            width: targetBox.width + SPOTLIGHT_PADDING * 2,
            height: targetBox.height + SPOTLIGHT_PADDING * 2,
          }}
        />
      ) : (
        <div className={styles.backdrop} aria-hidden />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal={!gated}
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className={styles.card}
        style={{ top: cardPos.top, left: cardPos.left }}>
        <p className={styles.counter}>
          {index + 1} of {steps.length}
        </p>
        <h2 id={titleId} className={styles.title}>
          {step.title}
        </h2>
        {gated && <p className={styles.task}>Your turn</p>}
        <p id={bodyId} className={styles.body}>
          {step.body}
        </p>
        {step.why && <p className={styles.why}>Why: {step.why}</p>}
        <div className={styles.actions}>
          {forced ? (
            <button
              type="button"
              className={styles.skip}
              onClick={() => onClose('paused')}>
              Pause, finish later
            </button>
          ) : (
            !isLast && (
              <button
                type="button"
                className={styles.skip}
                onClick={() => onClose('skipped')}>
                Skip tour
              </button>
            )
          )}
          <div className={styles.navButtons}>
            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIndex((current) => current - 1)}>
                Back
              </Button>
            )}
            {gated && lost && awayFromDestination && destination && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.(destination)}>
                Take me there
              </Button>
            )}
            {gated && lost && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={advance}>
                Continue anyway
              </Button>
            )}
            {!gated && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={advance}>
                {isLast ? 'Finish' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
