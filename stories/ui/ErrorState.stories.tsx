import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { DisplayError } from '@/components/ui/ErrorState'

const meta: Meta<typeof DisplayError> = {
  title: 'UI/ErrorState',
  component: DisplayError,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof DisplayError>

export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '320px' }}>
        <Story />
      </div>
    ),
  ],
}
