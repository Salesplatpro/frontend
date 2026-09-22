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
  isFreePlan,
  isSubscriptionPlanKey,
} from '@/features/pricing/types'
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
    if (!checkout || !profile || !isSubscriptionPlanKey(checkout)) return
    if (profile.billingPlan === checkout) return
    startedRef.current = true
    void startCheckout(checkout, interval)
  }, [checkout, interval, profile, startCheckout])

  if (isLoading || isCheckingOut) return <Spinner fullPage />

  const onPaidPlan = !isFreePlan(profile?.billingPlan)
  const currentPlan = profile?.billingPlan ?? 'free'

  return (
    <PageShell wide>
      <PageHero
        compact
        title={onPaidPlan ? 'Your plan' : 'Choose a plan'}
        lead={
          onPaidPlan
            ? 'See how you are using Auxhr on your current subscription.'
            : 'Upgrade to post more jobs and unlock recruiter tools.'
        }
      />
      {onPaidPlan ? (
        <PlanUsage interval={profile?.billingInterval} planKey={currentPlan} />
      ) : (
        <PricingContent variant="dashboard" currentPlan={currentPlan} />
      )}
    </PageShell>
  )
}

export default RecruiterPlanPage
