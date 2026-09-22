import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { initiatePaidCheckout } from '../services/checkoutService'
import { BillingInterval } from '../types'

const loginPathForCheckout = (planKey: string, interval: BillingInterval) =>
  `/login?next=${encodeURIComponent(
    `/recruiterDashboard/plan?checkout=${planKey}&interval=${interval}`,
  )}`

export const usePaidCheckout = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  const startCheckout = useCallback(
    async (planKey: string, interval: BillingInterval) => {
      if (!isLoggedIn || userRole !== 'recruiter') {
        navigate(loginPathForCheckout(planKey, interval))
        return
      }

      setIsCheckingOut(true)
      try {
        const response = await initiatePaidCheckout(planKey, interval)
        const link = response.data?.link
        if (!link) {
          throw new Error('No checkout link returned')
        }
        window.location.assign(link)
      } catch (error) {
        notify(
          'error',
          getErrorMessage(error, 'Could not start checkout. Please try again.'),
        )
        setIsCheckingOut(false)
      }
    },
    [isLoggedIn, navigate, userRole],
  )

  return { startCheckout, isCheckingOut }
}
