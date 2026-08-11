import { OrganizationStatus } from '../types'

export const getOrganizationStatusBadge = (status: OrganizationStatus) => {
  switch (status) {
    case 'verified':
      return { backgroundColor: '#edfeee', color: '#2e9e4f' }
    case 'rejected':
      return { backgroundColor: '#fff0ef', color: '#ff6f6d' }
    case 'pending':
    default:
      return { backgroundColor: '#fff4e2', color: '#fbb241' }
  }
}
