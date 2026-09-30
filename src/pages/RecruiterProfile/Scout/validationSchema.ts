import * as Yup from 'yup'

import { MAX_SHORTLIST_SIZE, MIN_SHORTLIST_SIZE } from '@/features/scout/types'

const MAX_SKILLS = 15

/**
 * Mirrors the backend validators in `src/validators/scoutJob.ts`. The messages are
 * written for a recruiter, not a developer — they say what to do, not what failed.
 */
export const scoutCampaignValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Give this campaign a name so you can find it later')
    .max(150, 'Keep the name under 150 characters'),
  role: Yup.string().required('Pick the role you are hiring for'),
  experienceLevel: Yup.string().required(
    'Choose the seniority this role needs',
  ),
  jobBrief: Yup.string()
    .trim()
    .required('Describe the role so the AI knows what to look for')
    .min(50, 'Add a bit more detail — at least 50 characters')
    .max(5000, 'Keep the brief under 5000 characters'),
  recruiterGuide: Yup.string()
    .trim()
    .required('Tell the AI what matters most when choosing')
    .min(30, 'Add a bit more detail — at least 30 characters')
    .max(2000, 'Keep your instructions under 2000 characters'),
  mustHaveSkills: Yup.array()
    .of(Yup.string())
    .max(MAX_SKILLS, `List at most ${MAX_SKILLS} must-have skills`),
  niceToHaveSkills: Yup.array()
    .of(Yup.string())
    .max(MAX_SKILLS, `List at most ${MAX_SKILLS} nice-to-have skills`),
  workMode: Yup.string(),
  shortlistSize: Yup.number()
    .required('Choose how many candidates to shortlist')
    .integer('Choose a whole number')
    .min(
      MIN_SHORTLIST_SIZE,
      `Shortlist at least ${MIN_SHORTLIST_SIZE} candidates`,
    )
    .max(
      MAX_SHORTLIST_SIZE,
      `Shortlist at most ${MAX_SHORTLIST_SIZE} candidates`,
    ),
})

export const talentSearchValidationSchema = Yup.object({
  description: Yup.string()
    .trim()
    .required('Describe the person you are looking for')
    .min(20, 'Add a bit more detail — at least 20 characters')
    .max(2000, 'Keep your description under 2000 characters'),
})
