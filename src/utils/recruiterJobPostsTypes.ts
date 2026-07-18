type JobLocation = {
  city: string
  state: string
  country: string
}

type JobRole = {
  id: string
  name: string
  description: string
}

type JobPostedBy = {
  id: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  userRole: string
  phone: string
  emailVerified: boolean
  active: boolean
  onboarded: boolean
}

export type recruiterJobPostsTypes = {
  location: JobLocation
  id: string
  role: JobRole
  postedBy: JobPostedBy
  description: string
  maxSalary: number
  minSalary: number
  experienceLevel: string
  address: string
  remote: boolean
  responsibilities: string[]
  skills: string[]
  goals: string[]
  noOfApplicants: number
  createdAt: string
  updatedAt: string
  __v: number
  aiConfig: string
  status?: string
}

export type SingleJobDetails = {
  id: string
  job: string
  talent: {
    profile: {
      id: string
      bio: string
      experience: string
      maxSalary: number
      minSalary: number
    }
    id: string
    email: string
    firstName: string
    lastName: string
  }
  applicationType: string
  status: string
  createdAt: string
  updatedAt: string
  cvSimilarityScore: number
}

export interface JobProfileProps {
  role?: {
    id: string
    name: string
  }
  title?: string
  description?: string
  postedBy?: {
    firstName?: string
    lastName?: string
  }
  responsibilities?: string[]
  requirements?: string
  jobBrief?: string
  workMode?: 'remote' | 'onsite' | 'hybrid'
  skills?: string[]
  goals?: string[]
  remote?: boolean
  location?: {
    country?: string
    city?: string
    state?: string
  }
  experienceLevel?: string
  currency?: string
}

export interface EditJobType extends JobProfileProps {
  aiConfig: string
  maxSalary?: number
  minSalary?: number
}

export interface JobAiConfig {
  name: string
  recruiter: string
  cvSimilarity: boolean
  minCvSimilarityScore: number
  minPrescreeningScore: number
  noOfCvSimilarCandidates: number
  noPersonalizedQuestions: number
  personalityEvaluation: boolean
  personalizedAssessment: boolean
  prescreeningAssessment: boolean
  uploadedQuestions: string[]
  recruiterGuide?: string
  stages: {
    cv_similarity: string
    personality: string
    personalized: string
    prescreening: string
  }
}
