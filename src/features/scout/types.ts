import type { LocationFormValue } from '@/components/forms/LocationSelect/types'

/**
 * One home for the scout types that used to be redeclared in the files slice,
 * ScoutJobHistory and MyScoutJobs. Mirrors the backend's scout entities.
 */

export const MIN_SHORTLIST_SIZE = 2
export const MAX_SHORTLIST_SIZE = 10
export const DEFAULT_SHORTLIST_SIZE = 5
export const MAX_BATCH_SIZE = 50
export const MAX_CV_BYTES = 5 * 1024 * 1024

export const ALLOWED_CV_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export type ExperienceLevel =
  | '1-3 years'
  | '4-6 years'
  | '7-10 years'
  | '11-15 years'
  | '16 years and above'

export type WorkMode = 'remote' | 'onSite' | 'hybrid'

export type ScoutRunStatus =
  | 'processing'
  | 'completed'
  | 'completed_with_errors'
  | 'failed'

export type ScoutCvStatus = 'queued' | 'processing' | 'scored' | 'failed'

export const TERMINAL_RUN_STATUSES: ScoutRunStatus[] = [
  'completed',
  'completed_with_errors',
  'failed',
]

export const isRunFinished = (status?: ScoutRunStatus): boolean =>
  !!status && TERMINAL_RUN_STATUSES.includes(status)

export type ScoutRole = {
  id: string
  name: string
}

/** A scouting campaign. */
export type ScoutCampaign = {
  id: string
  name: string
  jobBrief: string
  recruiterGuide: string
  roleId: string
  role?: ScoutRole | null
  shortlistSize: number
  experienceLevel?: ExperienceLevel | null
  mustHaveSkills?: string[] | null
  niceToHaveSkills?: string[] | null
  workMode?: WorkMode | null
  locationCountry?: string | null
  locationState?: string | null
  locationCity?: string | null
  createdAt: string
  updatedAt?: string
}

/** A campaign row on the list screen, with its rollups. */
export type ScoutCampaignRow = ScoutCampaign & {
  runCount: number
  cvsScanned: number
  bestScore: number | null
  lastActivityAt: string | null
}

/** One upload of CVs against a campaign. */
export type ScoutRun = {
  id: string
  scoutJobId: string
  status: ScoutRunStatus
  totalCvs: number
  shortlistSize: number
  shortlistSummary?: string | null
  completedAt?: string | null
  createdAt: string
  scoutJob?: ScoutCampaign | null
}

export type ScoutCandidateRecord = {
  id: string
  fullName?: string | null
  headline?: string | null
  skills?: string[] | null
  yearsExperience?: number | null
}

/** One CV within a run. */
export type ScoutCv = {
  id: string
  scoutRunId: string | null
  cvName: string | null
  status: ScoutCvStatus
  position: number | null
  rank: number | null
  shortlisted: boolean
  evaluationScore: number | null
  cvScore: number | null
  /** Plain-English reason the AI gave for its view. */
  recommendation: string | null
  insights: string | null
  candidateName: string | null
  candidateEmail: string | null
  candidatePhone: string | null
  candidateAddress: string | null
  candidateId: string | null
  candidate?: ScoutCandidateRecord | null
  attempts: number
  lastError: string | null
  createdAt: string
}

export type ScoutRunProgress = {
  queued: number
  processing: number
  scored: number
  failed: number
}

export type TalentSearchSource = 'registered' | 'sourced'

export type TalentSearchResult = {
  id: string
  source: TalentSearchSource
  name: string
  headline: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  country: string | null
  skills: string[]
  yearsExperience: number | null
  experienceLevel: string | null
  matchScore: number
  strengths?: string[]
  weaknesses?: string[]
  canMessage: boolean
}

/** The API's success envelope: `{ status, message, data }`. */
export type ApiEnvelope<T> = {
  status: boolean
  message: string
  data: T
}

export type CampaignListResponse = ApiEnvelope<{
  scoutJobs: ScoutCampaignRow[]
  total: number
}>

export type CampaignResponse = ApiEnvelope<{ scoutJob: ScoutCampaign }>

export type RunResponse = ApiEnvelope<{ run: ScoutRun }>

export type RunDetailResponse = ApiEnvelope<{
  run: ScoutRun
  progress: ScoutRunProgress
  cvs: ScoutCv[]
}>

export type ShortlistResponse = ApiEnvelope<{
  run: ScoutRun
  shortlist: ScoutCv[]
}>

export type RunListResponse = ApiEnvelope<{ runs: ScoutRun[]; total: number }>

export type TalentSearchResponse = ApiEnvelope<{
  results: TalentSearchResult[]
  total: number
}>

/** Values the campaign form collects. */
export type ScoutCampaignFormValues = {
  name: string
  role: string
  experienceLevel: string
  jobBrief: string
  recruiterGuide: string
  mustHaveSkills: string[]
  niceToHaveSkills: string[]
  workMode: string
  location: LocationFormValue
  shortlistSize: number
}

/** Values the talent search form collects. */
export type TalentSearchFormValues = {
  description: string
  role: string
  experienceLevel: string
  workMode: string
  location: LocationFormValue
}
