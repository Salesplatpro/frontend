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
}

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
}

export interface SubmitPayload {
  answers: Record<string, string>
}
