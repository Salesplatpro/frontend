import { ColumnDef } from '@/components/ui/DataTable'

import { calculateDaysFromCreation } from '../../../utils'

export interface ApplicationColumnRow {
  applicantName: string
  prescreeningScore?: number
  cvSimilarityScore?: number
  dateApplied: string
}

export const buildApplicationColumns =
  (): ColumnDef<ApplicationColumnRow>[] => [
    {
      key: 'name',
      header: 'Applicant name',
      align: 'left',
      sortLabel: 'Applicant name',
      render: (row) => row.applicantName,
      sortAccessor: (row) => row.applicantName,
    },
    {
      key: 'prescreening',
      header: 'Pre screening',
      align: 'center',
      sortLabel: 'Pre screening',
      render: (row) => `${row.prescreeningScore ?? 'nill'}%`,
      sortAccessor: (row) => row.prescreeningScore ?? -1,
    },
    {
      key: 'cvMatch',
      header: 'CV match',
      align: 'center',
      sortLabel: 'CV match',
      render: (row) => `${row.cvSimilarityScore ?? 'nill'}%`,
      sortAccessor: (row) => row.cvSimilarityScore ?? -1,
    },
    {
      key: 'dateApplied',
      header: 'Date Applied',
      align: 'center',
      sortLabel: 'Date Applied',
      render: (row) => `${calculateDaysFromCreation(row.dateApplied)} days ago`,
      sortAccessor: (row) => new Date(row.dateApplied).getTime(),
    },
  ]
