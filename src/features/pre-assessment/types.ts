export interface AssessmentQuestion {
  questionId: string
  question: string
  category: string
  options: string[]
}

export interface Assessment {
  id: string
  status: 'pending' | 'completed'
  score: number | null
  attemptCount: number
  maxAttempts: number
  questions: AssessmentQuestion[]
  generatedAt: string
  roles: string[]
  /** True while questions are still being generated server-side (fire-and-forget). */
  generating?: boolean
}

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
}

export interface SubmitPayload {
  answers: { questionId: string; selectedOption: number }[]
}
