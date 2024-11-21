import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

import Loading from '../../../components/Loading/Loading'
import { useGetNotificationsQuery } from '../../../redux/api/talent'
import { truncateText } from '../../../utils/truncateTexts'
import { NotificationItem } from './NotificationItem'

interface Sender {
  firstName: string
  lastName: string
}

interface Notification {
  message: string
  createdAt: string
  sender: Sender
}

interface NotificationsResponse {
  notifications: Notification[]
}

const NotificationList: React.FC = () => {
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery({}) as {
    data: { data: NotificationsResponse } | undefined
    isLoading: boolean
    error: any
  }

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [expandedMessages, setExpandedMessages] = useState<boolean[]>([])
  const truncateLimit = 120

  useEffect(() => {
    if (notificationsData?.data?.notifications) {
      setNotifications(notificationsData.data.notifications)
      setExpandedMessages(
        new Array(notificationsData.data.notifications.length).fill(false),
      )
    }
  }, [notificationsData])

  const handleToggleExpand = (index: number) => {
    setExpandedMessages((prevState) =>
      prevState.map((expanded, i) => (i === index ? !expanded : expanded)),
    )
  }

  const handleClearNotification = (index: number) => {
    setNotifications((prevState) => prevState.filter((_, i) => i !== index))
    setExpandedMessages((prevState) => prevState.filter((_, i) => i !== index))
  }

  if (isLoading) return <Loading />

  if (error) return <Alert severity="error">Error Fetching Data</Alert>

  if (notifications.length === 0) {
    return (
      <Alert severity="info">
        You do not have any notifications at the moment
      </Alert>
    )
  }

  return (
    <div className="md:w-[90%] my-12 md:mx-auto mx-8 space-y-7">
      <h2 className="text-2xl font-semibold font-raleway text-black">
        Notification
      </h2>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={index}
          notification={notification}
          isExpanded={expandedMessages[index]}
          onToggleExpand={() => handleToggleExpand(index)}
          onClear={() => handleClearNotification(index)}
          truncateLimit={truncateLimit}
          displayMessage={truncateText(
            notification.message,
            truncateLimit,
            expandedMessages[index],
          )}
        />
      ))}
    </div>
  )
}

export default NotificationList
