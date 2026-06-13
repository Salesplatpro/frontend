import type { Meta, StoryObj } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'

import { PhoneNumberInput } from '@/components/forms'

const meta: Meta<typeof PhoneNumberInput> = {
  title: 'Forms/PhoneNumberInput',
  component: PhoneNumberInput,
  args: {
    name: 'phone',
    label: 'Phone number',
  },
  decorators: [
    (Story) => (
      <Formik initialValues={{ phone: '' }} onSubmit={() => {}}>
        <Story />
      </Formik>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof PhoneNumberInput>

export const Default: Story = {}

export const WithoutLabel: Story = {
  args: { label: undefined },
}
