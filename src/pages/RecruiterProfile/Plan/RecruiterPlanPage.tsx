import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Spinner } from '@/components/ui/Spinner'
import { PlanUsage } from '@/features/pricing/components/PlanUsage'
import { PricingContent } from '@/features/pricing/components/PricingContent'
import { usePaidCheckout } from '@/features/pricing/hooks/usePaidCheckout'
import {
  BillingInterval,
  isSubscriptionPlanKey,
} from '@/features/pricing/types'
import { getActiveOrganizationBilling } from '@/features/pricing/utils/getActiveOrganizationBilling'
import { useProfile } from '@/features/profile/hooks/useProfile'

const RecruiterPlanPage: React.FC = () => {
  const { profile, isLoading } = useProfile()
  const [params] = useSearchParams()
  const { startCheckout, checkingOutPlanKey } = usePaidCheckout()
  const startedRef = useRef(false)

  const checkout = params.get('checkout')
  const interval = (
    params.get('interval') === 'annually' ? 'annually' : 'monthly'
  ) as BillingInterval

  const billing = getActiveOrganizationBilling(profile)
  const currentPlan = billing.billingPlan

  useEffect(() => {
    if (startedRef.current) return
    if (!checkout || !profile || !isSubscriptionPlanKey(checkout)) return
    if (currentPlan === checkout) return
    startedRef.current = true
    void startCheckout(checkout, interval)
  }, [checkout, interval, profile, currentPlan, startCheckout])

  if (isLoading || checkingOutPlanKey) return <Spinner fullPage />

  return (
    <PageShell wide>
      <PageHero
        compact
        title="Your plan"
        lead="See how you are using Auxhr, and upgrade anytime."
      />
      <PlanUsage
        interval={billing.billingInterval}
        planKey={currentPlan}
        billingStatus={billing.billingStatus}
        billingPeriodEnd={billing.billingPeriodEnd}
      />
      <PricingContent variant="dashboard" currentPlan={currentPlan} />
    </PageShell>
  )
}

export default RecruiterPlanPage
