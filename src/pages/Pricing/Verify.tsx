import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Spinner } from '@/components/ui/Spinner'
import { organizationUsageKey } from '@/features/organizations/hooks/useOrganizationUsage'
import { verifyPaidCheckout } from '@/features/pricing/services/checkoutService'
import { getActiveOrganizationBilling } from '@/features/pricing/utils/getActiveOrganizationBilling'
import { getBillingPlanBadge } from '@/features/pricing/utils/getBillingPlanBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Button, DisplayError } from '../../components'
import styles from './Verify.module.scss'

const VerifyPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate } = useProfile()
  const { mutate: globalMutate } = useSWRConfig()
  const [error, setError] = useState<string | null>(null)

  const reference = searchParams.get('reference') || searchParams.get('trxref')

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        notify('error', 'Missing payment reference.')
        navigate('/pricing')
        return
      }

      try {
        await verifyPaidCheckout(reference)

        // Revalidate the profile first — it carries the new plan — then drop the
        // cached usage snapshot, which still holds the pre-purchase limits.
        const refreshed = await mutate()
        const user = refreshed?.data?.user
        if (user?.activeOrganizationId) {
          await globalMutate(organizationUsageKey(user.activeOrganizationId))
        }

        const label = getBillingPlanBadge(
          getActiveOrganizationBilling(user).billingPlan,
        ).status
        notify('success', `Payment verified. You are now on ${label}.`)
        navigate('/recruiterDashboard/plan')
      } catch (err) {
        const message = getErrorMessage(
          err,
          'Payment verification failed. Please try again.',
        )
        setError(message)
        notify('error', message)
      }
    }

    void verify()
  }, [globalMutate, mutate, navigate, reference])

  return (
    <div className={styles.page}>
      {error ? (
        <div className={styles.failure}>
          <DisplayError message={error} />
          <Button onClick={() => navigate('/recruiterDashboard/plan')}>
            Go to Plan
          </Button>
        </div>
      ) : (
        <Spinner fullPage />
      )}
    </div>
  )
}

export default VerifyPaymentPage
