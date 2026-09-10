const PUBLIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'mail.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'gmx.com',
  'yandex.com',
  'msn.com',
])

export const extractEmailDomain = (email: string): string =>
  email.trim().toLowerCase().split('@')[1] ?? ''

export const isPublicEmailDomain = (email: string): boolean => {
  const domain = extractEmailDomain(email)
  return domain ? PUBLIC_EMAIL_DOMAINS.has(domain) : true
}

export const extractWebsiteDomain = (url: string): string => {
  try {
    const normalized = url.trim()
    if (!normalized) return ''
    const withProtocol = /^https?:\/\//i.test(normalized)
      ? normalized
      : `https://${normalized}`
    const hostname = new URL(withProtocol).hostname.toLowerCase()
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname
  } catch {
    return ''
  }
}

export const emailDomainMatchesWebsite = (
  email: string,
  website: string,
): boolean => {
  const emailDomain = extractEmailDomain(email)
  const websiteDomain = extractWebsiteDomain(website)
  return !!emailDomain && !!websiteDomain && emailDomain === websiteDomain
}

const COMPANY_DOMAIN_PATTERN = /^@[^\s@]+\.[^\s@]+$/

export const isValidCompanyDomainInput = (value: string): boolean =>
  COMPANY_DOMAIN_PATTERN.test(value.trim())

export const normalizeCompanyDomainInput = (value: string): string => {
  const trimmed = value.trim()
  const withAt = trimmed.startsWith('@') ? trimmed : `@${trimmed}`
  return withAt.toLowerCase()
}

export const emailMatchesCompanyDomain = (
  email: string,
  companyDomain: string,
): boolean => {
  const normalized = companyDomain.startsWith('@')
    ? companyDomain.slice(1).toLowerCase()
    : companyDomain.toLowerCase()
  return extractEmailDomain(email) === normalized
}
