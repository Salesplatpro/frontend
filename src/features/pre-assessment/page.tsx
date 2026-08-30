import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  MdAccessTime,
  MdCheckCircle,
  MdInfo,
  MdOutlineAssessment,
  MdRefresh,
} from 'react-icons/md'

import { Spinner } from '@/components/ui/Spinner'
import { notify } from '@/utils/toastNotifications'

import { retakeAssessment, submitAssessment } from './api'
import Questions from './components/Questions'
import ResultCard from './components/ResultCard'
import { COUNTDOWN_FROM, SECONDS_PER_QUESTION } from './constants'
import { formatTime, useAssessmentTimer, usePreAssessment } from './hooks'
import { useAssessmentLockStore } from './lockStore'
import { usePreAssessmentStore } from './store'

const PreAssessmentPage: React.FC = () => {
  const { assessment, isLoading, fetchError, isProfileIncomplete, refetch } =
    usePreAssessment()

  const assessmentStarted = usePreAssessmentStore((s) => s.assessmentStarted)
  const countdownCompleted = usePreAssessmentStore((s) => s.countdownCompleted)
  const answers = usePreAssessmentStore((s) => s.answers)
  const currentQuestionIndex = usePreAssessmentStore(
    (s) => s.currentQuestionIndex,
  )
  const setCurrentQuestionIndex = usePreAssessmentStore(
    (s) => s.setCurrentQuestionIndex,
  )
  const setAssessmentStarted = usePreAssessmentStore(
    (s) => s.setAssessmentStarted,
  )
  const setCountdownCompleted = usePreAssessmentStore(
    (s) => s.setCountdownCompleted,
  )
  const setStartedAt = usePreAssessmentStore((s) => s.setStartedAt)
  const reset = usePreAssessmentStore((s) => s.reset)

  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRetaking, setIsRetaking] = useState(false)
  const [autoSubmitMessage, setAutoSubmitMessage] = useState('')

  const submittingRef = useRef(false)

  // Runtime-only. Never persisted. True from countdown through answering.
  // This is the single source of truth for the navigation lock — not the persisted store.
  const assessmentActiveRef = useRef(false)

  const { lock, unlock } = useAssessmentLockStore()

  const questions = assessment?.questions ?? []
  // Real questions may not exist yet for a brand-new talent — the initial
  // response is a stub while generation runs server-side (fire-and-forget).
  const isReadyToStart = questions.length > 0 && !assessment?.generating
  const totalSeconds = questions.length * SECONDS_PER_QUESTION
  const isFirst = currentQuestionIndex === 0
  const isLast = currentQuestionIndex === questions.length - 1
  const allAnswered =
    questions.length > 0 && questions.every((q) => !!answers[q.questionId])

  // Sync the sidebar lock with the current assessment state.
  // Lock from countdown through answering; unlock on complete/error/loading/submit.
  // Also restores the lock after a refresh when the session was already in progress.
  useEffect(() => {
    const sessionInProgress =
      assessment?.status === 'pending' &&
      questions.length > 0 &&
      (isCountingDown || (assessmentStarted && countdownCompleted))

    const isActive =
      !isLoading && !fetchError && !isProfileIncomplete && sessionInProgress

    if (isActive && !assessmentActiveRef.current) {
      assessmentActiveRef.current = true
      lock()
    } else if (!isActive && assessmentActiveRef.current) {
      assessmentActiveRef.current = false
      unlock()
    }
  }, [
    isLoading,
    fetchError,
    isProfileIncomplete,
    assessment?.status,
    isCountingDown,
    assessmentStarted,
    countdownCompleted,
    questions.length,
    lock,
    unlock,
  ])

  // Safety: always release the lock when the page unmounts regardless of any other state.
  useEffect(() => {
    return () => {
      assessmentActiveRef.current = false
      unlock()
    }
  }, [unlock])

  useEffect(() => {
    if (
      assessment?.status === 'pending' &&
      isReadyToStart &&
      !assessmentStarted &&
      !countdownCompleted &&
      !isCountingDown
    ) {
      setIsCountingDown(true)
    }
  }, [
    assessment,
    isReadyToStart,
    assessmentStarted,
    countdownCompleted,
    isCountingDown,
  ])

  useEffect(() => {
    if (!isCountingDown) return

    if (countdown <= 0) {
      setIsCountingDown(false)
      setStartedAt(Date.now())
      setCountdownCompleted(true)
      setAssessmentStarted(true)
      return
    }

    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [
    isCountingDown,
    countdown,
    setStartedAt,
    setCountdownCompleted,
    setAssessmentStarted,
  ])

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittingRef.current) return
      // Allow submit while the session is locked OR while questions are on
      // screen (covers the brief window before the lock effect commits).
      const canSubmit =
        assessmentActiveRef.current ||
        (assessmentStarted && countdownCompleted && questions.length > 0)
      if (!canSubmit) return
      submittingRef.current = true
      setIsSubmitting(true)

      if (auto) {
        setAutoSubmitMessage('Time expired. Submitting assessment...')
      }

      try {
        const payloadAnswers = questions.map((q) => ({
          questionId: q.questionId,
          selectedOption: q.options.indexOf(answers[q.questionId] ?? ''),
        }))
        await submitAssessment({ answers: payloadAnswers })
        // Release immediately on success — do not wait for the sync effect.
        assessmentActiveRef.current = false
        unlock()
        setAssessmentStarted(false)
        setCountdownCompleted(false)
        setIsCountingDown(false)
        await refetch()
        reset()
      } catch {
        notify('error', 'Failed to submit assessment. Please try again.', {
          autoClose: 2000,
        })
        setAutoSubmitMessage('')
        // Transient error — assessment is still active, keep the lock.
      } finally {
        submittingRef.current = false
        setIsSubmitting(false)
      }
    },
    [
      answers,
      questions,
      refetch,
      reset,
      assessmentStarted,
      countdownCompleted,
      setAssessmentStarted,
      setCountdownCompleted,
      unlock,
    ],
  )

  const handleAutoSubmit = useCallback(() => {
    void handleSubmit(true)
  }, [handleSubmit])

  const remainingSeconds = useAssessmentTimer(
    totalSeconds,
    handleAutoSubmit,
    isSubmitting,
  )

  const handleRetake = async () => {
    setIsRetaking(true)
    try {
      await retakeAssessment()
      reset()
      await refetch()
    } catch {
      notify('error', 'Failed to start retake. Please try again.', {
        autoClose: 2000,
      })
    } finally {
      setIsRetaking(false)
    }
  }

  if (isLoading) return <Spinner fullPage />

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500 font-raleway">{fetchError}</p>
      </div>
    )
  }

  if (isProfileIncomplete) {
    return (
      <div className="w-full max-w-full px-4 lg:w-[60%] md:w-[75%] mx-auto mt-10 box-border">
        <ResultCard variant="profileIncomplete" />
      </div>
    )
  }

  if (assessment?.status === 'completed') {
    return (
      <div className="w-full max-w-full px-4 lg:w-[60%] md:w-[75%] mx-auto mt-10 box-border">
        <ResultCard
          variant="completed"
          score={assessment.score ?? undefined}
          attemptsUsed={assessment.attemptCount}
          attemptsRemaining={assessment.maxAttempts - assessment.attemptCount}
          onRetake={() => void handleRetake()}
          isRetaking={isRetaking}
        />
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner />
        <p className="text-grey-700 font-raleway font-medium">
          {autoSubmitMessage || 'Submitting assessment...'}
        </p>
      </div>
    )
  }

  if (assessment?.status === 'pending' && !isReadyToStart) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner />
        <p className="text-grey-700 font-raleway font-medium">
          Generating your assessment questions...
        </p>
      </div>
    )
  }

  if (isCountingDown) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white">
        <p className="text-xl font-raleway font-medium text-grey-600 mb-8">
          You are about to start your assessment
        </p>
        <span className="text-8xl font-bold text-blue-500 leading-none font-raleway">
          {countdown}
        </span>
      </div>
    )
  }

  if (assessmentStarted && questions.length > 0) {
    const progressPct = Math.round(
      ((currentQuestionIndex + 1) / questions.length) * 100,
    )

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-4 sm:px-6 py-4 border-b border-grey-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <MdOutlineAssessment className="text-blue-500 text-2xl" />
            <h1 className="text-xl font-bold text-grey-900 font-raleway">
              Pre-Assessment
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-grey-50 rounded-xl px-4 py-2 border border-grey-200">
            <MdAccessTime className="text-grey-500 text-xl" />
            <div className="text-right">
              <p className="text-xs text-grey-500 font-raleway leading-tight">
                Time Remaining
              </p>
              <p className="text-xl font-bold text-grey-900 font-raleway tabular-nums leading-tight">
                {formatTime(remainingSeconds)}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-raleway text-grey-600 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{progressPct}% Completed</span>
            </div>
            <div className="w-full h-2 bg-grey-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: question */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <Questions questions={questions} />

              {/* Navigation */}
              <div className="flex justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                  className={`px-5 py-2 rounded-lg border font-raleway font-medium text-sm transition-colors ${
                    isFirst
                      ? 'border-grey-200 text-grey-300 cursor-not-allowed'
                      : 'border-grey-300 text-grey-700 hover:bg-grey-50'
                  }`}>
                  ‹ Previous
                </button>

                {!isLast ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }
                    className="px-5 py-2 rounded-lg bg-blue-500 text-white font-raleway font-medium text-sm hover:bg-blue-600 transition-colors">
                    Next ›
                  </button>
                ) : allAnswered ? (
                  <button
                    type="button"
                    onClick={() => void handleSubmit(false)}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-blue-500 text-white font-raleway font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    Submit Assessment
                  </button>
                ) : (
                  <span className="text-sm text-grey-500 font-raleway italic">
                    Answer all questions to submit
                  </span>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
              {/* Guidelines */}
              <div className="bg-white rounded-2xl border border-grey-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdInfo className="text-grey-400 text-lg" />
                  <h3 className="font-bold text-grey-900 text-sm font-raleway">
                    Assessment Guidelines
                  </h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {[
                    {
                      icon: (
                        <MdOutlineAssessment className="text-grey-400 text-base flex-shrink-0" />
                      ),
                      text: `${questions.length} multiple choice questions`,
                    },
                    {
                      icon: (
                        <MdAccessTime className="text-grey-400 text-base flex-shrink-0" />
                      ),
                      text: '30 seconds per question (approx.)',
                    },
                    {
                      icon: (
                        <MdRefresh className="text-grey-400 text-base flex-shrink-0" />
                      ),
                      text: 'Do not refresh or close the browser',
                    },
                    {
                      icon: (
                        <MdCheckCircle className="text-grey-400 text-base flex-shrink-0" />
                      ),
                      text: 'Your progress is saved automatically',
                    },
                  ].map(({ icon, text }, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-grey-600 font-raleway">
                      {icon}
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Question Navigator */}
              <div className="bg-white rounded-2xl border border-grey-200 p-4">
                <h3 className="font-bold text-grey-900 text-sm font-raleway mb-3">
                  Question Navigator
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, i) => {
                    const isAnswered = !!answers[q.questionId]
                    const isCurrent = i === currentQuestionIndex
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(i)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold font-raleway transition-colors ${
                          isCurrent
                            ? 'bg-blue-500 text-white'
                            : isAnswered
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-grey-100 text-grey-500'
                        }`}>
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    {
                      cls: 'bg-green-100 border border-green-200',
                      label: 'Answered',
                    },
                    { cls: 'bg-blue-500', label: 'Current' },
                    { cls: 'bg-grey-100', label: 'Unanswered' },
                  ].map(({ cls, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1 text-xs text-grey-600 font-raleway">
                      <span className={`w-3 h-3 rounded-sm ${cls}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Spinner fullPage />
}

export default PreAssessmentPage
