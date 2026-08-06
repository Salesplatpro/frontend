import './NavigationProgress.scss'

import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

const COMPLETE_MS = 220
const MIN_VISIBLE_MS = 280

export const NavigationProgress = () => {
  const location = useLocation()
  const navigation = useNavigation()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const startedAtRef = useRef(0)
  const timersRef = useRef<number[]>([])
  const locationKeyRef = useRef(`${location.pathname}${location.search}`)

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  const finish = () => {
    setProgress(100)
    schedule(() => {
      setActive(false)
      setProgress(0)
    }, COMPLETE_MS)
  }

  const start = () => {
    clearTimers()
    startedAtRef.current = Date.now()
    setActive(true)
    setProgress(12)
    schedule(() => setProgress(42), 80)
    schedule(() => setProgress(68), 180)
    schedule(() => setProgress(86), 360)
  }

  // Data-router navigations (loaders / pending transitions)
  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      start()
      return
    }

    if (!active) return

    const elapsed = Date.now() - startedAtRef.current
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
    schedule(finish, wait)
  }, [navigation.state])

  // Instant client navigations (no loaders) still get a brief top loader
  useEffect(() => {
    const nextKey = `${location.pathname}${location.search}`
    if (nextKey === locationKeyRef.current) return
    locationKeyRef.current = nextKey

    if (navigation.state !== 'idle') return

    start()
    schedule(finish, MIN_VISIBLE_MS)
  }, [location.pathname, location.search])

  useEffect(() => clearTimers, [])

  if (!active && progress === 0) return null

  return (
    <div
      className={`navigation-progress${active ? ' is-active' : ''}`}
      role="progressbar"
      aria-hidden={!active}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}>
      <div
        className="navigation-progress__bar"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  )
}
