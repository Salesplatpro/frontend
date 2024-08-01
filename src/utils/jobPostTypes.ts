export interface LocationOption {
  name: string
  geoId: number
  countryName?: string;
}

export interface LocationProps {
  locationTitle?: string
  geoId?: number | null
  isCountry?: boolean
  onChange: (geoId: number) => void
}

export interface LocationValues {
  name: string
  geoId: number | null
}

export interface FormValues {
  description: string
  aiConfig: string
  role: string
  minSalary: string
  maxSalary: string
  experienceLevel: string
  location: {
    country: LocationValues
    state: LocationValues
    city: LocationValues
  }
  address: string
  remote: string
  responsibilities: string[]
  skills: string[]
  goals: string[]
}

export interface configProps {
  name: string
  prescreeningAssessment: string
  minPrescreeningScore: string
  cvSimilarity: string
  minCvSimilarityScore: string
  noOfCvSimilarCandidates: string
  personalizedAssessment: string
  noPersonalizedQuestions: string
  personalityEvaluation: string
  uploadedQuestions: string[]
  recruiterGuide: string
}

export interface JobFiltersTypes {
  role?: string[]
  experienceLevel?: string
  remote?: ''
  location?: {
    country: LocationValues
    state: LocationValues
    city: LocationValues
  }
}
