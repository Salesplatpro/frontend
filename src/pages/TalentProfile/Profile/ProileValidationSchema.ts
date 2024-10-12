import * as Yup from 'yup'

export const validationSchema = Yup.object({
  bio: Yup.string().required(
    'Please provide a short bio to tell us about yourself.',
  ),

  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Please select your country.'),
    }),
    state: Yup.object({
      name: Yup.string().required('Please select your state.'),
    }),
    city: Yup.object({
      name: Yup.string().required('Please select your city.'),
    }),
  }),

  minSalary: Yup.number()
    .required('Minimum salary is required. Please enter a positive number.')
    .positive('Minimum salary must be a positive number.'),

  maxSalary: Yup.number()
    .required('Maximum salary is required. Please enter a positive number.')
    .positive('Maximum salary must be a positive number.')
    .test(
      'max-greater-than-min',
      'Maximum salary must be greater than minimum salary.',
      function (value) {
        return value && this.parent.minSalary
          ? value > this.parent.minSalary
          : true
      },
    ),

  experience: Yup.string().required('Please select your experience level.'),

  cv: Yup.mixed()
    .required('Please upload your CV in PDF or Word format.')
    .test(
      'fileSize',
      'The file is too large. Maximum allowed size is 5MB.',
      (value) => value && (value as File).size <= 5 * 1024 * 1024, // 5MB
    )
    .test(
      'fileType',
      'Only PDF, DOC, and DOCX files are allowed.',
      (value) =>
        value &&
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes((value as File).type),
    ),
})
