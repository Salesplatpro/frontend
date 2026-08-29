export const getEmailVerificationBadge = (emailVerifiedAt?: string | null) =>
  emailVerifiedAt
    ? { status: 'Verified', backgroundColor: '#edfeee', color: '#2e9e4f' }
    : { status: 'Unverified', backgroundColor: '#fff4e2', color: '#fbb241' }
