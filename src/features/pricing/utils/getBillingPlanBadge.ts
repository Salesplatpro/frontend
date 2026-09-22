import { isFreePlan } from '../types'

const TITLE_CASE = (value: string) =>
  value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export const getBillingPlanBadge = (billingPlan?: string | null) => {
  if (isFreePlan(billingPlan)) {
    return { status: 'Free plan', backgroundColor: '#f1f6fd', color: '#4279cb' }
  }

  const label =
    billingPlan === 'paid'
      ? 'Paid'
      : billingPlan === 'pay_per_use'
      ? 'Pay per Use'
      : TITLE_CASE(billingPlan!)

  return { status: label, backgroundColor: '#e8f1fc', color: '#2441ab' }
}
