export interface FormTalentReg {
  email?: any
  firstName?: string
  lastName?: string
  middleName?: string
  password?: any
  phone?: any
}

export interface FormCreateTalentProfile {
  bio?: string
  role?: string | string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: string
}

export interface FormTalentLogin {
  email?: any
  password?: any
}

export interface LocationValues {
  name: string
  geoId?: number | null
}
export interface TalentProfileProps {
  bio?: string
  role?: string[]
  location: {
    country: LocationValues
    state: LocationValues
    city: LocationValues
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

export interface FormPostJob {
  role?: string
  description?: string
  maxSalary?: string
  minSalary?: string
  experienceLevel?: string
  city?: string
  state?: string
  country?: string
  // location?: locationType
  address?: string
  remote?: boolean
  responsibilities?: string[]
  skills?: string[]
  goals?: string[]
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

export interface QuestionForm {
  answers: { questionId: string; answer: string }[]
}

export interface Question {
  question: string
  _id: string
}
