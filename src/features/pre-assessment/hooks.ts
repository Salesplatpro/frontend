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

  const load = useCallback(async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }, [setAssessment])

  useEffect(() => {
    const cached = usePreAssessmentStore.getState().assessment
    if (cached) {
      setAssessmentLocal(cached)
      setIsLoading(false)
      return
    }
    void load()
  }, [load])

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
    if (!assessmentStarted || startedAt === null) return
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    const restored = Math.max(0, totalSeconds - elapsed)
    setRemainingSeconds(restored)
  }, [assessmentStarted, startedAt, totalSeconds, setRemainingSeconds])

  useEffect(() => {
    if (!assessmentStarted || isSubmitting) return

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
