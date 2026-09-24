import { DEFAULT_BILLING_PLAN_KEY, isPayPerUsePlan } from '../types'

const TITLE_CASE = (value: string) =>
  value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export const getBillingPlanBadge = (billingPlan?: string | null) => {
  // Pay per Use is the default for every company — there is no "Free" tier to show.
  if (isPayPerUsePlan(billingPlan)) {
    return {
      status: 'Pay per Use',
      backgroundColor: '#f1f6fd',
      color: '#4279cb',
    }
  }

  return {
    status: TITLE_CASE(billingPlan ?? DEFAULT_BILLING_PLAN_KEY),
    backgroundColor: '#e8f1fc',
    color: '#2441ab',
  }
}
