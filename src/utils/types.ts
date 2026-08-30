export interface AllJobTypes {
  currentStage?: string
  status?: string
  applicationType?: string
  createdAt?: any
  job?: {
    id?: string
    role?: {
      name: string
    }
    organization?: {
      name?: string | null
    } | null
    postedBy?: {
      firstName: string
    }
    location?: {
      country: string
    }
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
