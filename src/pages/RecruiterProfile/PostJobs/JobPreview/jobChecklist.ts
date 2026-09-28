import { workModeNeedsLocation } from '@/components/features/jobs/WorkTypeCheckboxes'
import { PostJobFormValues } from '@/utils/jobPostTypes'

import { htmlToPlainText } from '../utils/aiText'

export interface ChecklistItem {
  key: string
  label: string
  done: boolean
}

export const jobChecklist = (values: PostJobFormValues): ChecklistItem[] => [
  { key: 'role', label: 'Role', done: !!values.role },
  {
    key: 'jobBrief',
    label: 'Job brief',
    done: !!htmlToPlainText(values.jobBrief ?? ''),
  },
  {
    key: 'requirements',
    label: 'Requirements',
    done: !!htmlToPlainText(values.requirements ?? ''),
  },
  {
    key: 'experienceLevel',
    label: 'Experience level',
    done: !!values.experienceLevel,
  },
  {
    key: 'workMode',
    label: workModeNeedsLocation(values.workMode)
      ? 'Work mode and country'
      : 'Work mode',
    done:
      values.workMode.length > 0 &&
      (!workModeNeedsLocation(values.workMode) ||
        !!values.location.country.name),
  },
  {
    key: 'pay',
    label: 'Pay',
    done:
      !!values.currency && !!values.minSalary && !!values.compensationPeriod,
  },
  { key: 'skills', label: 'Skills', done: values.skills.length > 0 },
  { key: 'goals', label: 'Goals', done: values.goals.length > 0 },
]
