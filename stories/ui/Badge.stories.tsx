import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CountBadge, StatusBadge } from '@/components/ui/Badge'

const meta: Meta = {
  title: 'UI/Badge',
}

export default meta

type StatusStory = StoryObj<typeof StatusBadge>
type CountStory = StoryObj<typeof CountBadge>

export const Status: StatusStory = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <StatusBadge
        status="Shortlisted"
        backgroundColor="var(--color-primary-tint)"
        color="var(--color-primary-strong)"
      />
      <StatusBadge
        status="Rejected"
        backgroundColor="var(--color-brand-100)"
        color="var(--color-danger)"
      />
      <StatusBadge
        status="Hired"
        backgroundColor="var(--color-brand-100)"
        color="var(--color-success)"
      />
    </div>
  ),
}

export const Count: CountStory = {
  render: () => <CountBadge item={3} />,
}

export const CountZero: CountStory = {
  name: 'Count (hidden when falsy)',
  render: () => <CountBadge item={undefined} />,
}
