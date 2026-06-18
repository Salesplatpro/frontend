import * as Yup from 'yup'

export const validationSchema = Yup.object({
  role: Yup.string().required('Role is required'),
  jobBrief: Yup.string().required('Job Brief is required'),
  requirements: Yup.string().required('Requirements is required'),
  experienceLevel: Yup.string().required('Experience level is required'),
  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
    }),
    state: Yup.object({
      name: Yup.string().required('State is required'),
    }),
  }),
  workMode: Yup.array()
    .of(Yup.string().oneOf(['remote', 'hybrid', 'onSite']))
    .min(1, 'Work mode is required'),
  currency: Yup.string().required('Currency is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive')
    .test(
      'max-greater-than-min',
      'Maximum salary must be greater than minimum salary',
      function (value) {
        const { minSalary } = this.parent
        if (!value || !minSalary) return true
        return Number(value) > Number(minSalary)
      },
    ),
  skills: Yup.array()
    .of(
      Yup.string()
        .required('Skill cannot be empty')
        .max(250, 'Skill cannot exceed 250 characters'),
    )
    .min(1, 'At least one skill is required'),
  goals: Yup.array()
    .of(
      Yup.string()
        .required('Goal cannot be empty')
        .max(250, 'Goal cannot exceed 250 characters'),
    )
    .min(1, 'At least one goal is required'),
})
