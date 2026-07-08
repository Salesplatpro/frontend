import { LocationFormValue } from '@/components/forms/LocationSelect'

export interface FormValues {
  jobBrief: string
  // aiConfig: string
  role: string
  name?: string
  minSalary: string
  maxSalary: string
  currency: string
  experienceLevel: string
  workMode: string
  location: LocationFormValue
  requirements: string
  skills: string[]
  goals: string[]
}

export interface JobFiltersTypes {
  role?: string
  experienceLevel?: string
  remote: boolean
  onSite: boolean
  hybrid: boolean
  location: LocationFormValue
}
