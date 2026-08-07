import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchAssessment } from './api'
import { PROFILE_INCOMPLETE_CODE } from './constants'
import { usePreAssessmentStore } from './store'
import { Assessment } from './types'

export function usePreAssessment() {
  const [assessment, setAssessmentLocal] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const setAssessment = usePreAssessmentStore((s) => s.setAssessment)

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setIsLoading(true)
      setFetchError(null)
      setIsProfileIncomplete(false)
      try {
        const res = await fetchAssessment()
        setAssessmentLocal(res.data.preScreening)
        setAssessment(res.data.preScreening)
      } catch (err: unknown) {
        const axiosError = err as {
          response?: {
            data?: {
              errorCode?: string
              message?: string
              error?: { code?: string; message?: string }
            }
          }
        }
        const errorCode =
          axiosError.response?.data?.error?.code ||
          axiosError.response?.data?.errorCode
        const message =
          axiosError.response?.data?.error?.message ||
          axiosError.response?.data?.message ||
          'Failed to load assessment'
        if (
          errorCode === PROFILE_INCOMPLETE_CODE ||
          message?.toLowerCase().includes('profile')
        ) {
          setIsProfileIncomplete(true)
        } else {
          setFetchError(message)
        }
      } finally {
        if (!opts?.silent) setIsLoading(false)
      }
    },
    [setAssessment],
  )

  useEffect(() => {
    const cached = usePreAssessmentStore.getState().assessment
    // Only reuse a cache that already has real questions. A generating stub
    // (or empty pending payload) must hit the network so we can poll until
    // generation finishes — otherwise the countdown never becomes eligible.
    const hasQuestions = (cached?.questions?.length ?? 0) > 0
    if (cached && hasQuestions && !cached.generating) {
      setAssessmentLocal(cached)
      setIsLoading(false)
      return
    }
    void load()
  }, [load])

  // Brand-new talents get a fire-and-forget stub (generating: true, no
  // questions). Also poll if we somehow have a pending assessment with an
  // empty question list and no generating flag, so the UI cannot stick on
  // "Generating..." forever without a network refresh.
  useEffect(() => {
    const needsPoll =
      assessment?.status === 'pending' &&
      (assessment.generating === true ||
        (assessment.questions?.length ?? 0) === 0)
    if (!needsPoll) return

    const POLL_INTERVAL_MS = 3000
    const MAX_WAIT_MS = 60000
    const startedAt = Date.now()

    const id = setInterval(() => {
      if (Date.now() - startedAt >= MAX_WAIT_MS) {
        clearInterval(id)
        setFetchError(
          'Your assessment is taking longer than expected to generate. Please refresh the page in a moment.',
        )
        return
      }
      void load({ silent: true })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(id)
  }, [
    assessment?.generating,
    assessment?.status,
    assessment?.questions?.length,
    load,
  ])

  return {
    assessment,
    isLoading,
    fetchError,
    isProfileIncomplete,
    refetch: load,
  }
}

export function useAssessmentTimer(
  totalSeconds: number,
  onExpire: () => void,
  isSubmitting: boolean,
) {
  const assessmentStarted = usePreAssessmentStore((s) => s.assessmentStarted)
  const startedAt = usePreAssessmentStore((s) => s.startedAt)
  const remainingSeconds = usePreAssessmentStore((s) => s.remainingSeconds)
  const setRemainingSeconds = usePreAssessmentStore(
    (s) => s.setRemainingSeconds,
  )

  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // Restore accurate remaining time from startedAt on mount
  useEffect(() => {
    if (!assessmentStarted || startedAt === null || totalSeconds <= 0) return
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    const restored = Math.max(0, totalSeconds - elapsed)
    setRemainingSeconds(restored)
  }, [assessmentStarted, startedAt, totalSeconds, setRemainingSeconds])

  useEffect(() => {
    if (!assessmentStarted || isSubmitting || totalSeconds <= 0) return

    const id = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - (startedAt ?? Date.now())) / 1000,
      )
      const next = Math.max(0, totalSeconds - elapsed)
      setRemainingSeconds(next)
      if (next <= 0) {
        clearInterval(id)
        onExpireRef.current()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [
    assessmentStarted,
    isSubmitting,
    startedAt,
    totalSeconds,
    setRemainingSeconds,
  ])

  return remainingSeconds
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
