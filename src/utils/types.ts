export interface TalentProfileProps {
  bio?: string
  role?: string[]
  location: {
    country: any
    state: any
    city: any
    // country: LocationValues
    // state: LocationValues
    // city: LocationValues
  }
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: File | null
  remote: boolean
  onSite: boolean
  hybrid: boolean
  cvUrl?: string
}

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
