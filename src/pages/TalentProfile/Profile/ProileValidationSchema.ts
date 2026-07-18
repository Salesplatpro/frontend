import * as Yup from 'yup'

export const validationSchema = Yup.object({
  bio: Yup.string().max(1000, 'Bio must be 1000 characters or fewer.'),

  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
    }),
    state: Yup.object({ name: Yup.string() }),
    city: Yup.object({ name: Yup.string() }),
  }),

  currency: Yup.string(),

  minSalary: Yup.string().test(
    'is-positive-number',
    'Minimum salary must be a positive number.',
    (value) => !value || Number(value) > 0,
  ),

  maxSalary: Yup.string()
    .test(
      'is-positive-number',
      'Maximum salary must be a positive number.',
      (value) => !value || Number(value) > 0,
    )
    .test(
      'max-greater-than-min',
      'Maximum salary must be greater than minimum salary.',
      function (value) {
        if (!value || !this.parent.minSalary) return true
        return Number(value) > Number(this.parent.minSalary)
      },
    ),
})
