export interface AllJobTypes {
  currentStage?: string
  status?: string
  applicationType?: string
  createdAt?: any
  job?: {
    role?: string
    id?: string
    location?: {
      country: string
    }
  }
  postedBy?: {
    firstName: string
  }
  role?: {
    name: string
  }
  id?: string
}

export interface Role {
  id?: string
  name?: string
}

export interface Question {
  question: string
  id: string
}
