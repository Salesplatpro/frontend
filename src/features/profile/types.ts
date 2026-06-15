import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationFormValue } from '@/components/forms/LocationSelect'

export interface ProfileLocation {
  country?: string
  state?: string
  city?: string
}

export interface ProfileRole {
  _id: string
  name?: string
}

export interface UserProfile {
  bio?: string
  role?: ProfileRole[]
  location?: ProfileLocation
  experience?: string
  minSalary?: number | string
  maxSalary?: number | string
  currency?: string
  workType?: WorkType[] | null
  cv?: { url?: string }
}

export interface ProfileUser {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  profileImage?: { url?: string }
  userRole?: string
  profile?: UserProfile
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
  role?: string[]
  phone?: string
  location?: ProfileLocation
  experience?: string
  minSalary?: string
  maxSalary?: string
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
