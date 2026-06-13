import type { Meta, StoryObj } from '@storybook/react'

import { SearchBox } from '@/components/forms'

const meta: Meta<typeof SearchBox> = {
  title: 'Forms/SearchBox',
  component: SearchBox,
}

export default meta

type Story = StoryObj<typeof SearchBox>

export const Default: Story = {}
