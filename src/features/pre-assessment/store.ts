import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Assessment } from './types'

interface PreAssessmentState {
  assessment: Assessment | null
  answers: Record<string, string>
  currentQuestionIndex: number
  startedAt: number | null
  remainingSeconds: number
  assessmentStarted: boolean
  countdownCompleted: boolean
  setAssessment: (assessment: Assessment | null) => void
  setAnswer: (questionId: string, answer: string) => void
  setCurrentQuestionIndex: (index: number) => void
  setStartedAt: (ts: number) => void
  setRemainingSeconds: (seconds: number) => void
  setAssessmentStarted: (value: boolean) => void
  setCountdownCompleted: (value: boolean) => void
  resetSession: () => void
  reset: () => void
}

const initialPersistedState = {
  answers: {} as Record<string, string>,
  currentQuestionIndex: 0,
  startedAt: null as number | null,
  remainingSeconds: 0,
  assessmentStarted: false,
  countdownCompleted: false,
}

export const usePreAssessmentStore = create<PreAssessmentState>()(
  persist(
    (set) => ({
      assessment: null,
      ...initialPersistedState,
      setAssessment: (assessment) => set({ assessment }),
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),
      setCurrentQuestionIndex: (currentQuestionIndex) =>
        set({ currentQuestionIndex }),
      setStartedAt: (startedAt) => set({ startedAt }),
      setRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),
      setAssessmentStarted: (assessmentStarted) => set({ assessmentStarted }),
      setCountdownCompleted: (countdownCompleted) =>
        set({ countdownCompleted }),
      resetSession: () => set({ ...initialPersistedState }),
      reset: () => set({ assessment: null, ...initialPersistedState }),
    }),
    {
      name: 'pre-assessment',
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        startedAt: state.startedAt,
        remainingSeconds: state.remainingSeconds,
        assessmentStarted: state.assessmentStarted,
        countdownCompleted: state.countdownCompleted,
      }),
    },
  ),
)
