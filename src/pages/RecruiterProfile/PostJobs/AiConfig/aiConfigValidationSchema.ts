import * as Yup from 'yup'

// A blank input means "skip this pair" rather than 0/NaN, so it must bypass
// min/max checks entirely instead of being coerced into a failing number.
const emptyToUndefined = (value: number, originalValue: unknown) =>
  typeof originalValue === 'string' && originalValue.trim() === ''
    ? undefined
    : value

export const aiConfigValidationSchema = Yup.object({
  name: Yup.string().required('Required'),

  prescreeningAssessment: Yup.string().required('Required'),
  minPrescreeningScore: Yup.number()
    .min(0, 'Min score must be at least 0')
    .when('prescreeningAssessment', {
      is: 'true',
      then: (schema) => schema.required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  cvSimilarity: Yup.string().required('Required'),
  minCvSimilarityScore: Yup.number()
    .min(0, 'Min score must be at least 0')
    .when('cvSimilarity', {
      is: 'true',
      then: (schema) => schema.required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  noOfCvSimilarCandidates: Yup.number()
    .min(0, 'Min number must be at least 0')
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
  // All four MBTI dichotomy pairs are optional, even when personality
  // evaluation is enabled — a recruiter may only care about some pairs.
  noOfEIQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(20, 'Must be at most 20')
    .notRequired(),
  noOfSNQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(20, 'Must be at most 20')
    .notRequired(),
  noOfTFQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(20, 'Must be at most 20')
    .notRequired(),
  noOfJPQuestions: Yup.number()
    .transform(emptyToUndefined)
    .integer('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(20, 'Must be at most 20')
    .notRequired(),
})
