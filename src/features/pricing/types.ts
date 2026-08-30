export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingPlan {
  key: 'free' | 'paid'
  name: string
  description: string
  priceCaption?: string
  badge?: string
  cta: string
  highlighted: boolean
  monthlyAmountNgn: number
  yearlyAmountNgn: number
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
  comparison: { columns: string[]; rows: ComparisonRow[] }
  valueProps: {
    badge: string
    title: string
    body: string
    items: Array<{ title: string; body: string; icon: string }>
  }
  contact: { prompt: string; cta: string; href: string }
  dummyUsage: Array<{ id: string; label: string; used: number; limit: string }>
}

export interface PricingApiResponse {
  status: boolean
  message: string
  data: PricingCatalog
}

export type BillingInterval = 'monthly' | 'annually'
export type BillingPlan = 'free' | 'paid'
export type BillingStatus = 'active' | 'past_due' | 'cancelled'
