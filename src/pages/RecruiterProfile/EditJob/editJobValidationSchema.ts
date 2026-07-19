import * as Yup from 'yup'

import { aiConfigValidationSchema } from '../PostJobs/AiConfig/aiConfigValidationSchema'
import { validationSchema as jobDetailsValidationSchema } from '../PostJobs/validationSchema'

export const editJobValidationSchema = jobDetailsValidationSchema.shape({
  status: Yup.string().oneOf(['draft', 'active', 'closed']),
  aiConfig: aiConfigValidationSchema,
})
