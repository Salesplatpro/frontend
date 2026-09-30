/**
 * Every scout URL in one place. Previously these were ~13 hand-written string
 * literals spread across the feature, so renaming a route meant grepping for it.
 */

const RECRUITER_ROOT = '/recruiterDashboard'

export const scoutPaths = {
  root: `${RECRUITER_ROOT}/scout`,
  newCampaign: `${RECRUITER_ROOT}/scout/new`,
  campaign: (campaignId: string) => `${RECRUITER_ROOT}/scout/${campaignId}`,
  editCampaign: (campaignId: string) =>
    `${RECRUITER_ROOT}/scout/${campaignId}/edit`,
  upload: (campaignId: string) =>
    `${RECRUITER_ROOT}/scout/${campaignId}/upload`,
  run: (campaignId: string, runId: string) =>
    `${RECRUITER_ROOT}/scout/${campaignId}/runs/${runId}`,
  talentSearch: `${RECRUITER_ROOT}/talent-search`,
  shortlist: `${RECRUITER_ROOT}/shortlist`,
  chat: `${RECRUITER_ROOT}/chat`,
} as const
