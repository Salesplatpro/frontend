// Placeholder data — the talent dashboard has no backend endpoint yet.
// Shape mirrors the real Application entity/status vocabulary used
// elsewhere in the app (see getStatusBadge), so this is easy to swap
// for a real API response later.

export type MockApplicationStatus =
  | 'pending'
  | 'not-proceeding'
  | 'retake_assessment'
  | 'shortlisted'
  | 'rejected'

export interface MockApplication {
  id: string
  jobTitle: string
  status: MockApplicationStatus
  dateApplied: string
}

export const mockStats = {
  applicationsSubmitted: 12,
  profileCompleteness: 80,
  averageScore: 76,
  shortlisted: 3,
}

export const mockStatusBreakdown = [
  { label: 'Pending', value: 5 },
  { label: 'Shortlisted', value: 3 },
  { label: 'Retake Assessment', value: 2 },
  { label: 'Not Proceeding', value: 1 },
  { label: 'Rejected', value: 1 },
]

export const mockRecentApplications: MockApplication[] = [
  {
    id: '1',
    jobTitle: 'Frontend Developer',
    status: 'shortlisted',
    dateApplied: '2026-07-10',
  },
  {
    id: '2',
    jobTitle: 'Backend Engineer',
    status: 'pending',
    dateApplied: '2026-07-08',
  },
  {
    id: '3',
    jobTitle: 'Product Designer',
    status: 'retake_assessment',
    dateApplied: '2026-07-05',
  },
  {
    id: '4',
    jobTitle: 'Data Analyst',
    status: 'not-proceeding',
    dateApplied: '2026-07-01',
  },
  {
    id: '5',
    jobTitle: 'DevOps Engineer',
    status: 'rejected',
    dateApplied: '2026-06-28',
  },
]
