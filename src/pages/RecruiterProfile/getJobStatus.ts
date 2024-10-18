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
    default:
      return { backgroundColor: '#edfeee', color: '#76c8bc' }
  }
}
