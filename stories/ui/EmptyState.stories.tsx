import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    title: 'No applications yet',
    description:
      'Applications for this job will appear here once candidates apply.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No jobs posted',
    description: 'Get started by creating your first job posting.',
    action: <Button size="sm">Post a job</Button>,
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Nothing to show',
  },
}
