import { DEFAULT_BILLING_PLAN_KEY, PricingCatalog } from '../types'

export const getPlanDisplayName = (
  planKey?: string | null,
  catalog?: PricingCatalog,
) => {
  const catalogName = catalog?.plans.find((plan) => plan.key === planKey)?.name
  if (catalogName) return catalogName
  if (!planKey || planKey === DEFAULT_BILLING_PLAN_KEY) return 'Pay per Use'
  return planKey
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
