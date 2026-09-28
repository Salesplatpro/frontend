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

const findTarget = (target?: string): HTMLElement | null =>
  target ? document.querySelector<HTMLElement>(`[data-tour="${target}"]`) : null

const toBox = (rect: DOMRect): Box => ({
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
})

type ProductTourProps = {
  steps: TourStep[]
  onClose: (reason: 'finished' | 'skipped') => void
}

export const ProductTour = ({ steps, onClose }: ProductTourProps) => {
  const [index, setIndex] = useState(0)
  const [targetBox, setTargetBox] = useState<Box | null>(null)
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const cardRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const bodyId = useId()
  const step = steps[index]
  const isLast = index === steps.length - 1

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

  useLayoutEffect(() => {
    findTarget(step?.target)?.scrollIntoView?.({ block: 'nearest' })
    measure()
  }, [measure, step?.target])

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
    cardRef.current?.focus()
  }, [index])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose('skipped')
        return
      }
      if (event.key !== 'Tab' || !cardRef.current) return
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
  }, [onClose])

  if (!step) return null

  return createPortal(
    <div className={styles.root}>
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
        aria-modal="true"
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
        <p id={bodyId} className={styles.body}>
          {step.body}
        </p>
        <div className={styles.actions}>
          {!isLast && (
            <button
              type="button"
              className={styles.skip}
              onClick={() => onClose('skipped')}>
              Skip tour
            </button>
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
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() =>
                isLast
                  ? onClose('finished')
                  : setIndex((current) => current + 1)
              }>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
