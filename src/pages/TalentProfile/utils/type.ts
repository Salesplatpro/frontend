export interface Application {
  currentStage: string
  stages: Record<
    'prescreening' | 'cv_similarity' | 'personalized' | 'personality',
    string
  >
}

export interface Progress {
  icon: string
  title: string
  status: string
}
export interface ErrorResponse {
  message?: string
}
