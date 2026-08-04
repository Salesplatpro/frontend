import * as Yup from 'yup'

import { emptyToUndefined } from '@/utils/yupHelpers'

import { DICHOTOMY_ERROR_KEY } from './AiConfigFields'

const DICHOTOMY_MESSAGE =
  'At least one dichotomy pair (EI, SN, TF, JP) question count is required when Personality Evaluation is enabled'

export const aiConfigValidationSchema = Yup.object({
  name: Yup.string().required('Required'),

  // Pre-screening is always on — no toggle, so the score is always required.
  prescreeningAssessment: Yup.string().required('Required'),
  minPrescreeningScore: Yup.number()
    .min(0, 'Min score must be at least 0')
    .required('Required'),

  cvSimilarity: Yup.string().required('Required'),
  minCvSimilarityScore: Yup.number()
    .min(0, 'Min score must be at least 0')
    .when('cvSimilarity', {
      is: 'true',
      then: (schema) => schema.required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  personalizedAssessment: Yup.string().required('Required'),
  noPersonalizedQuestions: Yup.number()
    .min(0, 'Min number must be at least 0')
    .when('personalizedAssessment', {
      is: 'true',
      then: (schema) => schema.required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  personalityEvaluation: Yup.string().required('Required'),
  // None of the four MBTI dichotomy pairs is individually required — each is
  // just format-validated when present. The "at least one of four, only when
  // enabled" rule is enforced by the object-level test below, matching the
  // backend's atLeastOneDichotomyPairValidator.
  noOfEIQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .notRequired(),
  noOfSNQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .notRequired(),
  noOfTFQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .notRequired(),
  noOfJPQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .notRequired(),
}).test('at-least-one-dichotomy', DICHOTOMY_MESSAGE, function (values) {
  if (values?.personalityEvaluation !== 'true') return true

  const hasAtLeastOne = [
    values.noOfEIQuestions,
    values.noOfSNQuestions,
    values.noOfTFQuestions,
    values.noOfJPQuestions,
  ].some((value) => value != null)

  if (hasAtLeastOne) return true

  return this.createError({
    path: DICHOTOMY_ERROR_KEY,
    message: DICHOTOMY_MESSAGE,
  })
})
