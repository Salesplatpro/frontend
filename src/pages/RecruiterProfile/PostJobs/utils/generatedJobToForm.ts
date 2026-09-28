import type { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { PostJobFormValues } from '@/utils/jobPostTypes'

import { plainTextToHtml } from './aiText'

export interface GeneratedJobContent {
  role?: string
  experienceLevel?: string | null
  workMode?: string[]
  locationCountry?: string | null
  locationState?: string | null
  locationCity?: string | null
  currency?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  compensationPeriod?: string | null
  jobBrief?: string
  requirements?: string
  skills?: string[]
  goals?: string[]
}

type RoleOption = { id: string; name?: string | null }

export const EMPTY_JOB_FORM: PostJobFormValues = {
  jobBrief: '',
  role: '',
  requirements: '',
  minSalary: '',
  maxSalary: '',
  compensationPeriod: '',
  currency: '',
  workMode: [],
  experienceLevel: '',
  location: { ...EMPTY_LOCATION },
  skills: [],
  goals: [],
}

const WORK_MODES: WorkType[] = ['remote', 'hybrid', 'onSite']

export const matchRoleId = (name: string, roles: RoleOption[]): string => {
  const wanted = name.trim().toLowerCase()
  const match = roles.find((role) => role.name?.trim().toLowerCase() === wanted)
  return match ? String(match.id) : name.trim()
}

/** Maps an AI job draft onto the job form and counts how many fields it filled. */
export const generatedJobToForm = (
  content: GeneratedJobContent,
  roles: RoleOption[],
): { values: PostJobFormValues; filledCount: number } => {
  const workMode = (content.workMode ?? []).filter((mode): mode is WorkType =>
    WORK_MODES.includes(mode as WorkType),
  )
  const location = content.locationCountry
    ? resolveLocationFromNames(
        content.locationCountry,
        content.locationState ?? undefined,
        content.locationCity ?? undefined,
      )
    : { ...EMPTY_LOCATION }

  const values: PostJobFormValues = {
    ...EMPTY_JOB_FORM,
    role: content.role ? matchRoleId(content.role, roles) : '',
    experienceLevel: content.experienceLevel ?? '',
    workMode,
    location,
    currency: content.currency ?? '',
    minSalary: content.minSalary ? String(content.minSalary) : '',
    maxSalary: content.maxSalary ? String(content.maxSalary) : '',
    compensationPeriod: content.compensationPeriod ?? '',
    jobBrief: content.jobBrief ? plainTextToHtml(content.jobBrief) : '',
    requirements: content.requirements
      ? plainTextToHtml(content.requirements)
      : '',
    skills: content.skills ?? [],
    goals: content.goals ?? [],
  }

  const filled = [
    values.role,
    values.experienceLevel,
    values.workMode.length,
    values.location.country.name,
    values.currency,
    values.minSalary,
    values.maxSalary,
    values.compensationPeriod,
    values.jobBrief,
    values.requirements,
    values.skills.length,
    values.goals.length,
  ]

  return { values, filledCount: filled.filter(Boolean).length }
}
