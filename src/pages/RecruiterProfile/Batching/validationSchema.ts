import * as Yup from 'yup'

export const scoutJobValidationSchema = Yup.object({
  name: Yup.string()
    .required('Campaign name is required')
    .max(150, 'Campaign name is too long'),
  role: Yup.string().required('Role is required'),
  jobBrief: Yup.string()
    .required('Job brief is required')
    .min(20, 'Job brief should be more descriptive (at least 20 characters)'),
  recruiterGuide: Yup.string()
    .required('Recruiter guide is required')
    .min(
      10,
      'Recruiter guide should be more descriptive (at least 10 characters)',
    ),
})
