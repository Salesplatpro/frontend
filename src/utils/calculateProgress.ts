import { TalentProfileProps } from './types'

export const calculateProgress = (values: TalentProfileProps): number => {
  const fields = ['bio', 'role', 'maxSalary', 'minSalary', 'experience', 'cv']
  const filledFields = fields.filter(
    (field) =>
      values[field as keyof TalentProfileProps] !== undefined &&
      values[field as keyof TalentProfileProps] !== '',
  )
  return (filledFields.length / fields.length) * 100
}
