import React from 'react'
import { BsChatDots } from 'react-icons/bs'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { EmptyState } from '@/components/ui/EmptyState'

export const Chat = () => (
  <div className="flex flex-col space-y-12">
    <PageHeaderTitle
      title="Chat"
      description="Message talents directly from your dashboard"
    />
    <EmptyState
      icon={<BsChatDots size={48} />}
      title="Chat is coming soon"
      description="We're building direct messaging with talents. Check back later."
    />
  </div>
)
