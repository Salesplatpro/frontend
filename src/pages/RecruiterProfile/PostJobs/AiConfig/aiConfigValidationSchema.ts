import * as Yup from 'yup'

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
})
