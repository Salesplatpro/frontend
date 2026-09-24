import { ProfileUser } from '@/features/profile/types'

import { DEFAULT_BILLING_PLAN_KEY } from '../types'

export type OrganizationBilling = {
  billingPlan: string
  billingInterval?: string | null
  billingStatus?: string | null
  billingPeriodEnd?: string | null
}

/**
 * Billing is company-wide, so the active organization is the only source of truth.
 * A company with no plan written yet is on Pay per Use, never Free.
 */
export const getActiveOrganizationBilling = (
  profile?: ProfileUser | null,
): OrganizationBilling => {
  const org = profile?.activeOrganization

  return {
    billingPlan: org?.billingPlan ?? DEFAULT_BILLING_PLAN_KEY,
    billingInterval: org?.billingInterval ?? null,
    billingStatus: org?.billingStatus ?? null,
    billingPeriodEnd: org?.billingPeriodEnd ?? null,
  }
}
