import * as Yup from 'yup'

export const validationSchema = Yup.object({
  jobBrief: Yup.string().required('Job Brief is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive'),
  currency: Yup.string().required('Currency is required'),
  experienceLevel: Yup.string().required('Experience level is required'),
  workMode: Yup.string().required('Work Mode is required'),
  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
    }),
    state: Yup.object({
      name: Yup.string().required('State is required'),
    }),
  }),
  requirements: Yup.string().required('Requirements is required'),
  role: Yup.string().required('Role is required'),
  skills: Yup.array().of(
    Yup.string()
      .required('Skill is required')
      .max(250, 'Skill cannot be longer than 150 characters'),
  ),
  goals: Yup.array().of(
    Yup.string()
      .required('Goal is required')
      .max(250, 'Goal cannot be longer than 150 characters'),
  ),
})
