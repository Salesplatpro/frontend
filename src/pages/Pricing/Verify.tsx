import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'

import { Button, DisplayError } from '../../components'
import { useVerifyPaymentMutation } from '../../redux/api/apiSlice'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { notify } from '../../utils/toastNotifications'

const VerifyPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifyPayment] = useVerifyPaymentMutation()
  const [error, setError] = useState<string | null>(null)

  const reference = searchParams.get('reference')

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        notify('error', 'Missing payment reference.')
        return navigate('/pricing')
      }

      try {
        const response = await verifyPayment({ reference }).unwrap()
        if (response?.status) {
          notify('success', 'Payment verified successfully!')
          navigate('/pricing')
        } else {
          notify('error', response?.message || 'Verification failed')
          navigate('/pricing')
        }
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Failed to initialize payment. Please try again.',
        )
        setError(message)
        notify('error', message)
        // navigate('/')
      }
    }

    verify()
  }, [reference, verifyPayment, navigate])

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {error ? (
        <div>
          <DisplayError message={error} />
          <Button onClick={() => navigate('/pricing')}>Go Back</Button>
        </div>
      ) : (
        <Spinner fullPage />
      )}
    </div>
  )
}

export default VerifyPaymentPage

// https://auxhr.com/payment/verify?trxref=clmdgkgx3b&reference=clmdgkgx3b   ku2x8rqyau
