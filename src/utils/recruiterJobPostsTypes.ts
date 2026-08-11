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

type JobOrganizationSummary = {
  id: string
  name: string
  logoUrl?: string | null
}

export type recruiterJobPostsTypes = {
  location: JobLocation
  id: string
  role: JobRole
  postedBy: JobPostedBy
  organization?: JobOrganizationSummary | null
  description: string
  maxSalary?: number | null
  minSalary: number
  compensationPeriod?: string
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
  aiConfigId?: string | null
  status?: string
}

export type SingleJobDetails = {
  id: string
  jobId: string
  talent: {
    id: string
    email: string
    firstName: string
    lastName: string
    bio?: string | null
    experience?: string | null
    cvFileName?: string | null
    cvUploadedAt?: string | null
    prescreeningScore?: number | null
  }
  applicationType: string
  status: string
  createdAt: string
  updatedAt: string
  cvSimilarityScore: number
  personalizedScore?: number | null
  rank?: number | null
  averageScore?: number | null
  matchVerdict?: 'high' | 'medium' | 'low' | null
  matchVerdictReasoning?: string | null
  matchRecommendation?: 'hire' | 'interview_further' | 'no_hire' | null
  matchStrengths?: string[] | null
  matchWeaknesses?: string[] | null
  matchRisks?: string[] | null
}

export interface JobProfileProps {
  id?: string
  role?: {
    id: string
    name: string
  }
  title?: string
  postedBy?: {
    firstName?: string
    lastName?: string
  }
  requirements?: string
  jobBrief?: string
  workMode?: string[]
  skills?: string[]
  goals?: string[]
  locationCountry?: string
  locationState?: string | null
  locationCity?: string | null
  experienceLevel?: string
  currency?: string
  noOfApplicants?: number
}

export interface EditJobType extends JobProfileProps {
  aiConfig: string
  maxSalary?: number | null
  minSalary?: number
  compensationPeriod?: string
  status?: JobStatus
}

export type JobStatus = 'draft' | 'active' | 'suspended' | 'closed'

export interface JobAiConfig {
  name: string
  recruiter: string
  cvSimilarity: boolean
  minCvSimilarityScore: number
  minPrescreeningScore: number
  noPersonalizedQuestions: number
  personalityEvaluation: boolean
  noOfEIQuestions: number
  noOfSNQuestions: number
  noOfTFQuestions: number
  noOfJPQuestions: number
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
