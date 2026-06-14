import React from 'react'

import { Heading, Text } from '@/components/ui/Typography'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

const TalentDashboardHome = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="p-6">
      <Heading level={2}>Welcome back, {user?.firstName}</Heading>
      <Text as="p" color="primary">
        Here&apos;s what&apos;s happening with your job search today.
      </Text>

      <WelcomeModal />
    </div>
  )
}

export default TalentDashboardHome
