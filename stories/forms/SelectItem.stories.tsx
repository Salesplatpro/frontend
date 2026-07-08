import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { SelectItem } from '@/components/forms'

const meta: Meta<typeof SelectItem> = {
  title: 'Forms/SelectItem',
  component: SelectItem,
  args: {
    title: 'Select an option',
  },
}

export default meta

type Story = StoryObj<typeof SelectItem>

export const Closed: Story = {
  args: { toggle: false },
}

export const Open: Story = {
  args: { toggle: true },
  render: (args) => (
    <SelectItem {...args}>
      <div style={{ padding: '0.5rem' }}>Option A</div>
      <div style={{ padding: '0.5rem' }}>Option B</div>
      <div style={{ padding: '0.5rem' }}>Option C</div>
    </SelectItem>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <SelectItem
        title="Select an option"
        toggle={open}
        onClick={() => setOpen((prev) => !prev)}>
        <div style={{ padding: '0.5rem' }}>Option A</div>
        <div style={{ padding: '0.5rem' }}>Option B</div>
        <div style={{ padding: '0.5rem' }}>Option C</div>
      </SelectItem>
    )
  },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'Locked option' },
}
