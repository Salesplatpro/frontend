import useSWRMutation from 'swr/mutation'

import {
  notificationsKey,
  readNotification,
} from '../services/notificationService'

export const useMarkNotificationRead = () => {
  const { trigger } = useSWRMutation(
    notificationsKey,
    async (_key, { arg }: { arg: string }) => readNotification(arg),
  )

  return { markAsRead: trigger }
}
