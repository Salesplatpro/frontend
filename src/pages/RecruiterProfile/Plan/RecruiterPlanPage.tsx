import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Spinner } from '@/components/ui/Spinner'
import { PlanUsage } from '@/features/pricing/components/PlanUsage'
import { PricingContent } from '@/features/pricing/components/PricingContent'
import { usePaidCheckout } from '@/features/pricing/hooks/usePaidCheckout'
import { BillingInterval } from '@/features/pricing/types'
import { useProfile } from '@/features/profile/hooks/useProfile'

const RecruiterPlanPage: React.FC = () => {
  const { profile, isLoading } = useProfile()
  const [params] = useSearchParams()
  const { startCheckout, isCheckingOut } = usePaidCheckout()
  const startedRef = useRef(false)

  const checkout = params.get('checkout')
  const interval = (
    params.get('interval') === 'annually' ? 'annually' : 'monthly'
  ) as BillingInterval

  useEffect(() => {
    if (startedRef.current) return
    if (checkout !== 'paid' || !profile || profile.billingPlan === 'paid')
      return
    startedRef.current = true
    void startCheckout(interval)
  }, [checkout, interval, profile, startCheckout])

  if (isLoading || isCheckingOut) return <Spinner fullPage />

  const isPaid = profile?.billingPlan === 'paid'

  return (
    <PageShell wide>
      <PageHero
        compact
        title={isPaid ? 'Your plan' : 'Choose a plan'}
        lead={
          isPaid
            ? 'See how you are using Auxhr on your current subscription.'
            : 'Upgrade to post more jobs and unlock recruiter tools.'
        }
      />
      {isPaid ? (
        <PlanUsage interval={profile?.billingInterval} />
      ) : (
        <PricingContent variant="dashboard" currentPlan="free" />
      )}
    </PageShell>
  )
}

export default RecruiterPlanPage
