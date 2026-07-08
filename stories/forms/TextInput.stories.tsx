import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { TextInput } from '@/components/forms'

const meta: Meta<typeof TextInput> = {
  title: 'Forms/TextInput',
  component: TextInput,
  args: {
    title: 'Email address',
    label: 'email',
    name: 'email',
    autoComplete: 'email',
    placeholder: 'you@example.com',
  },
}

export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

export const Required: Story = {
  args: { required: true },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

export const Password: Story = {
  args: {
    title: 'Password',
    label: 'password',
    name: 'password',
    autoComplete: 'current-password',
    isPassword: true,
  },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

export const WithError: Story = {
  args: {
    value: 'not-an-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    value: 'disabled@example.com',
    disabled: true,
  },
}
