export interface PricingFeature {
  text?: string
  label?: string
  included?: boolean
  key?: string
  kind?: 'metered' | 'flag'
  limit?: number | null
  period?: 'concurrent' | 'monthly'
}

export type SubscriptionPlanKey = 'sme_basic' | 'pro' | 'advance' | 'enterprise'

export type PricingPlanKey =
  | 'free'
  | 'paid'
  | 'pay_per_use'
  | SubscriptionPlanKey
  | string

export interface PricingPlan {
  key: PricingPlanKey
  name: string
  description: string
  priceCaption?: string
  badge?: string
  cta: string
  secondaryCta?: string
  highlighted: boolean
  visible?: boolean
  purchasable?: boolean
  monthlyAmountNgn: number
  /** Null when the plan has no annual price (e.g. pay_per_use). */
  yearlyAmountNgn: number | null
  featuresIntro?: string | null
  features: PricingFeature[]
}

export interface ComparisonRow {
  id: string
  label: string
  hint: string | null
  free: string | boolean
  paid: string | boolean
}

export interface PricingCatalog {
  currency: string
  currencySymbol: string
  yearlyDiscountPercent: number
  guarantee: string
  cancelAnytime: string
  hero: { kicker: string; title: string; subtitle: string }
  plans: PricingPlan[]
  comparison?: { columns: string[]; rows: ComparisonRow[] }
  valueProps: {
    badge: string
    title: string
    body: string
    items: Array<{ title: string; body: string; icon: string }>
  }
  contact: { prompt: string; cta: string; href: string }
  dummyUsage?: Array<{ id: string; label: string; used: number; limit: string }>
}

export interface PricingApiResponse {
  status: boolean
  message: string
  data: PricingCatalog
}

export type BillingInterval = 'monthly' | 'annually'
export type BillingPlan = PricingPlanKey
export type BillingStatus = 'active' | 'past_due' | 'cancelled'

export const isFreePlan = (billingPlan?: string | null): boolean =>
  !billingPlan || billingPlan === 'free'

/** Subscription checkout via `/payments` — excludes free, pay_per_use, and hidden/legacy. */
export const isSubscriptionPlan = (plan: PricingPlan): boolean =>
  plan.key !== 'free' &&
  plan.key !== 'pay_per_use' &&
  plan.visible !== false &&
  plan.purchasable !== false

export const isSubscriptionPlanKey = (
  key: string,
  plans?: PricingPlan[],
): boolean => {
  if (plans?.length) {
    const plan = plans.find((p) => p.key === key)
    return plan ? isSubscriptionPlan(plan) : false
  }
  return (
    key !== 'free' && key !== 'pay_per_use' && key !== 'paid' && Boolean(key)
  )
}
