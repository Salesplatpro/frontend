export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#fff4e2', color: '#fbb241' }
    case 'not-proceeding':
      return { backgroundColor: '#fff0ef', color: '#ff6f6d' }
    case 'retake_assessment':
      return { backgroundColor: '#f1f6fe', color: '#5d93e3' }
    case 'shortlisted':
      return { backgroundColor: '#edfeee', color: '#7cc88f' }
    case 'rejected':
      return { backgroundColor: '#af0303', color: '#f1f1ec' }
    case 'draft':
      return { backgroundColor: '#fff8e1', color: '#c99a06' }
    case 'active':
      return { backgroundColor: '#edfeee', color: '#2e9e4f' }
    case 'closed':
      return { backgroundColor: '#fff0ef', color: '#d13438' }
    default:
      return { backgroundColor: '#edfeee', color: '#76c8bc' }
  }
}

export const JOB_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]
