import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationFormValue } from '@/components/forms/LocationSelect'

export interface ProfileRole {
  _id: string
  name?: string
}

export interface ProfileUser {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string | null
  profileImageUrl?: string | null
  profileImagePublicId?: string | null
  userRole?: string
  phone?: string
  country?: string | null
  organizationId?: string | null
  emailVerified?: boolean
  active?: boolean
  bio?: string
  cvUrl?: string | null
  cvPublicId?: string | null
  cvUploadedAt?: string | null
  workType?: WorkType[] | null
  locationCity?: string | null
  locationState?: string | null
  locationCountry?: string | null
  experience?: string
  currency?: string
  maxSalary?: number | string
  minSalary?: number | string
  prescreeningScore?: number | null
  assessmentRetryDate?: string | null
  roleChangeCount?: number
  activePreScreeningId?: string | null
  createdAt?: string
  updatedAt?: string
  userRoles?: ProfileRole[]
}

export interface ProfileApiResponse {
  status?: boolean
  message?: string
  data: { user: ProfileUser }
}

export interface UploadResponse {
  status?: boolean
  message?: string
  data: { fileUrl: string }
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
  workType?: WorkType[]
  cv?: string
  picture?: string
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
  workType: WorkType[]
}
