import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { CheckBox } from '@/components/forms'

const meta: Meta<typeof CheckBox> = {
  title: 'Forms/CheckBox',
  component: CheckBox,
  args: {
    name: 'terms',
    value: 'accepted',
    label: 'I agree to the terms and conditions',
  },
}

export default meta

type Story = StoryObj<typeof CheckBox>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <CheckBox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

export const Checked: Story = {
  args: { checked: true },
}

export const CustomLabelColor: Story = {
  args: { checked: true, color: 'var(--color-primary-strong)' },
}
