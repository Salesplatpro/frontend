export interface AllJobTypes {
  currentStage?: string
  status?: string
  applicationType?: string
  createdAt?: any
  job?: {
    role?: string
    _id?: string
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
  _id?: string
}

export interface Role {
  _id?: number
  name?: string
}

export interface Question {
  question: string
  _id: string
}
