import useSWRMutation from 'swr/mutation'

import {
  markAllNotificationsRead,
  notificationsKey,
} from '../services/notificationService'

export const useMarkAllNotificationsRead = () => {
  const { trigger, isMutating } = useSWRMutation(notificationsKey, async () =>
    markAllNotificationsRead(),
  )

  return { markAllAsRead: trigger, isMarkingAll: isMutating }
}
