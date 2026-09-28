import type { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { locationFieldsFromWorkMode } from '@/utils/jobLocationPayload'
import { PostJobFormValues } from '@/utils/jobPostTypes'

export interface JobApiRecord {
  jobBrief?: string | null
  role?: { id?: string; name?: string } | null
  requirements?: string | null
  minSalary?: number | string | null
  maxSalary?: number | string | null
  compensationPeriod?: string | null
  currency?: string | null
  workMode?: string[] | string | null
  experienceLevel?: string | null
  locationCountry?: string | null
  locationState?: string | null
  locationCity?: string | null
  skills?: string[] | null
  goals?: string[] | null
}

export const jobToFormValues = (job: JobApiRecord): PostJobFormValues => {
  const workMode: WorkType[] = Array.isArray(job.workMode)
    ? (job.workMode as WorkType[])
    : job.workMode
    ? [job.workMode as WorkType]
    : []

  return {
    jobBrief: job.jobBrief || '',
    role: job.role?.id || '',
    requirements: job.requirements || '',
    minSalary: String(job.minSalary ?? ''),
    maxSalary: String(job.maxSalary ?? ''),
    compensationPeriod: job.compensationPeriod || 'yearly',
    currency: job.currency || '',
    workMode,
    experienceLevel: job.experienceLevel || '',
    location: resolveLocationFromNames(
      job.locationCountry ?? undefined,
      job.locationState ?? undefined,
      job.locationCity ?? undefined,
    ) ?? { ...EMPTY_LOCATION },
    skills: job.skills || [],
    goals: job.goals || [],
  }
}

export const jobFormToPayload = (values: PostJobFormValues) => {
  const { location, maxSalary, workMode, ...rest } = values
  return {
    ...rest,
    workMode,
    ...(maxSalary ? { maxSalary } : {}),
    ...locationFieldsFromWorkMode(location, workMode),
  }
}
