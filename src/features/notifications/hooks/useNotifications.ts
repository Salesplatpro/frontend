import useSWR from 'swr'

import {
  fetchNotifications,
  notificationsKey,
} from '../services/notificationService'

export const useNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR(
    notificationsKey,
    fetchNotifications,
  )

  return {
    notifications: data?.data.notifications ?? [],
    unReadCount: data?.data.unReadCount ?? 0,
    error,
    isLoading,
    mutate,
  }
}
