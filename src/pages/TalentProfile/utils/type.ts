export interface Application {
  currentStage: string
  status?: string
  stages: Partial<
    Record<
      'prescreening' | 'cv_similarity' | 'personalized' | 'personality',
      string
    >
  >
  cvSimilarityScore: number | null
  personalizedScore: number | null
  mbtiType: string | null
}

export interface Progress {
  icon: string
  title: string
  status: string
  result?: string | null
}
export interface ErrorResponse {
  message?: string
}
