import React from 'react'
import { BiMessageDetail } from 'react-icons/bi'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { EmptyState } from '@/components/ui/EmptyState'

export const Notification = () => (
  <div className="flex flex-col space-y-12">
    <PageHeaderTitle
      title="Notification"
      description="Stay up to date with your recruiting activity"
    />
    <EmptyState
      icon={<BiMessageDetail size={48} />}
      title="Notifications are coming soon"
      description="We're working on bringing you real-time updates here. Check back later."
    />
  </div>
)
