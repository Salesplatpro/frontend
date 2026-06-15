import { experienceLevel } from '@/utils/experienceLevel'

import { SelectOption } from './types'

export const WORK_MODE_OPTIONS: SelectOption[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'onSite', label: 'On Site' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const EXPERIENCE_LEVEL_OPTIONS: SelectOption[] = Object.values(
  experienceLevel,
).map((label) => ({ value: label, label }))

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'NGN', label: 'NGN' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'EUR', label: 'EUR' },
]
