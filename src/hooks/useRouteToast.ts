import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { notify } from '@/utils/toastNotifications'

type RouteToastState = {
  toast?: {
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }
}

export const useRouteToast = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { toast } = (location.state as RouteToastState) || {}
    if (!toast) return

    notify(toast.type, toast.message)
    navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])
}
