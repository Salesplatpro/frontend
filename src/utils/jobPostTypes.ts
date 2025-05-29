export interface LocationOption {
  name: string
  geoId: number
  countryName?: string
}

export interface LocationProps {
  locationTitle?: string
  locationLabel: string
  geoId?: any
  selectedName?: any
  isCountry?: boolean
  onChange: (geoId: number) => void
  height?: string
  customHeight: string
  bold?: string
  asterick?: boolean
  value?: string
}

export interface LocationValues {
  name?: string
  geoId?: number | null
}

export interface FormValues {
  jobBrief: string
  // aiConfig: string
  role: string
  name?: string
  minSalary: string
  maxSalary: string
  experienceLevel: string
  workMode: string
  location: {
    country: LocationValues
    state: LocationValues
    city?: LocationValues
  }
  requirements: string
  skills: string[]
  goals: string[]
}

export interface configProps {
  name: string
  jobId: string
  prescreeningAssessment: string
  minPrescreeningScore?: string
  cvSimilarity: string
  minCvSimilarityScore?: string
  noOfCvSimilarCandidates?: string
  personalizedAssessment: string
  noPersonalizedQuestions?: string
  personalityEvaluation: string
  uploadedQuestions?: string[]
  recruiterGuide: string
}

export interface JobFiltersTypes {
  role?: string
  experienceLevel?: string
  remote?: ''
  location?: {
    country: LocationValues
    state: LocationValues
    city: LocationValues
  }
}
