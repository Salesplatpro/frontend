interface CompensationFields {
  currency?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  compensationPeriod?: string | null
}

const PERIOD_LABEL: Record<string, string> = {
  monthly: 'Month',
  yearly: 'Year',
}

export const formatCompensation = ({
  currency,
  minSalary,
  maxSalary,
  compensationPeriod,
}: CompensationFields): string => {
  if (minSalary == null && maxSalary == null) return 'Not specified'

  const prefix = currency ? `${currency} ` : ''
  const range =
    minSalary != null && maxSalary != null && maxSalary !== minSalary
      ? `${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`
      : (minSalary ?? maxSalary)!.toLocaleString()

  const period = compensationPeriod
    ? PERIOD_LABEL[compensationPeriod]
    : undefined
  return period ? `${prefix}${range} / ${period}` : `${prefix}${range}`
}
