export const dashboardPathForRole = (userRole?: string | null): string => {
  if (userRole === 'recruiter') return '/recruiterDashboard/dashboard'
  if (userRole === 'talent') return '/talentDashboard'
  if (userRole === 'admin') return '/adminDashboard/viewcandidates'
  return '/'
}

export const safeInternalPath = (value: string | null): string | null => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null
  return value
}

const isAllowedResumePath = (
  userRole: string | null | undefined,
  path: string,
): boolean => {
  if (userRole === 'talent') {
    return path.startsWith('/apply/') || path.startsWith('/talentDashboard')
  }
  if (userRole === 'recruiter') {
    return (
      path.startsWith('/recruiterDashboard') || path.startsWith('/payment/')
    )
  }
  if (userRole === 'admin') {
    return path.startsWith('/adminDashboard')
  }
  return false
}

/** Post-login / already-logged-in destination. Honors `next` only when it is a safe path for that role. */
export const destinationAfterAuth = (
  userRole: string | null | undefined,
  nextPath: string | null,
): string => {
  const next = safeInternalPath(nextPath)
  if (next && isAllowedResumePath(userRole, next)) return next
  return dashboardPathForRole(userRole)
}

export const loginPathWithNext = (next?: string | null): string => {
  const safe = safeInternalPath(next ?? null)
  if (!safe) return '/login'
  return `/login?next=${encodeURIComponent(safe)}`
}
