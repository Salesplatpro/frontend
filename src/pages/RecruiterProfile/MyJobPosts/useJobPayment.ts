import { useState } from 'react'

import { isPayPerUsePlan } from '@/features/pricing/types'
import { getActiveOrganizationBilling } from '@/features/pricing/utils/getActiveOrganizationBilling'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useActivateJobPaymentMutation } from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

export const useJobPayment = () => {
  const { profile } = useProfile()
  const [activateJobPayment] = useActivateJobPaymentMutation()
  const [payingJobId, setPayingJobId] = useState<string | null>(null)

  const isPayPerUse = isPayPerUsePlan(
    getActiveOrganizationBilling(profile).billingPlan,
  )

  // A subscription whose job slots are full also parks activations in
  // pending_payment, so those are payable on any plan. Paying for a draft
  // straight away is only offered on pay-per-use.
  const canPay = (status: string, hasAiConfig: boolean) =>
    status === 'pending_payment' ||
    (isPayPerUse && status === 'draft' && hasAiConfig)

  const payForJob = async (jobId: string) => {
    setPayingJobId(jobId)
    try {
      const response = await activateJobPayment(jobId).unwrap()
      const link = response?.data?.link
      if (!link) {
        throw new Error('No payment link returned')
      }
      window.location.assign(link)
    } catch (err) {
      notify(
        'error',
        getErrorMessage(err, 'Could not start payment. Please try again.'),
      )
      setPayingJobId(null)
    }
  }

  return { canPay, payForJob, payingJobId }
}
