import { SingleJobDetails } from './recruiterJobPostsTypes'

const escapeCsvValue = (value: string) => {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export const exportApplicantsCsv = (
  applications: SingleJobDetails[],
  filename = 'applicants.csv',
) => {
  const headers = [
    'Name',
    'Email',
    'Job Status',
    'CV Ranking',
    'AI Match',
    'Date Applied',
  ]
  const rows = applications.map((item) => [
    `${item.talent.firstName} ${item.talent.lastName}`,
    item.talent.email,
    item.status,
    item.rank ? `#${item.rank}` : '',
    item.matchVerdict ?? '',
    new Date(item.createdAt).toISOString(),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
