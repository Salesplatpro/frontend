import { httpClient } from '@/features/auth/services/httpClient'

import { AppNotification } from '../types'

export const notificationsKey = '/notifications'

export const fetchNotifications = () =>
  httpClient
    .get<{ data: { notifications: AppNotification[]; unReadCount: number } }>(
      notificationsKey,
    )
    .then((response) => response.data)

// The backend marks a notification read as a side effect of fetching it — no
// separate "mark as read" endpoint exists (see controllers/notification.ts).
export const readNotification = (notificationId: string) =>
  httpClient
    .get<{ data: { notification: AppNotification } }>(
      `${notificationsKey}/${notificationId}`,
    )
    .then((response) => response.data)
