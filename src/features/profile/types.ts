import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationFormValue } from '@/components/forms/LocationSelect'

export interface ProfileRole {
  id: string
  name?: string
}

export interface ProfileOrganization {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  industry?: string | null
  website?: string | null
}

export interface ProfileCompletion {
  percentage: number
  isProfileComplete: boolean
  canProceedToPlatform: boolean
}

export interface ProfileUser {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string | null
  userRole?: string
  phone?: string
  country?: string | null
  organizationId?: string | null
  emailVerified?: boolean
  active?: boolean
  bio?: string
  cvFileName?: string | null
  cvUploadedAt?: string | null
  workType?: WorkType[] | null
  locationCity?: string | null
  locationState?: string | null
  locationCountry?: string | null
  experience?: string
  currency?: string
  maxSalary?: number | string
  minSalary?: number | string
  compensationPeriod?: string
  prescreeningScore?: number | null
  assessmentRetryDate?: string | null
  roleChangeCount?: number
  activePreScreeningId?: string | null
  createdAt?: string
  updatedAt?: string
  userRoles?: ProfileRole[]
  organization?: ProfileOrganization | null
  profileCompletion?: ProfileCompletion
}

export interface ProfileApiResponse {
  status?: boolean
  message?: string
  data: { user: ProfileUser }
}

export interface ProfilePatchPayload {
  bio?: string
  roleIds?: string[]
  phone?: string
  locationCity?: string
  locationState?: string
  locationCountry?: string
  experience?: string
  minSalary?: number
  maxSalary?: number
  currency?: string
  compensationPeriod?: string
  workType?: WorkType[]
}

export interface ProfileFormValues {
  bio: string
  role: string[]
  phone: string
  location: LocationFormValue
  experience: string
  minSalary: string
  maxSalary: string
  currency: string
  compensationPeriod: string
  workType: WorkType[]
}
