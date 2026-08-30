import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { verifyPaidCheckout } from '@/features/pricing/services/checkoutService'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Button, DisplayError } from '../../components'

const VerifyPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate } = useProfile()
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
        await mutate()
        notify('success', 'Payment verified. You are now on the Paid plan.')
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
  }, [mutate, navigate, reference])

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {error ? (
        <div>
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
