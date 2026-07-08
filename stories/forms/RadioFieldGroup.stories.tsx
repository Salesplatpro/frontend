import type { Meta, StoryObj } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'

import { RadioFieldGroup } from '@/components/forms'

const meta: Meta<typeof RadioFieldGroup> = {
  title: 'Forms/RadioFieldGroup',
  component: RadioFieldGroup,
  args: {
    name: 'workMode',
    label: 'Work mode',
    options: [
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'onsite', label: 'On-site' },
    ],
  },
  decorators: [
    (Story) => (
      <Formik initialValues={{ workMode: 'remote' }} onSubmit={() => {}}>
        <Story />
      </Formik>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof RadioFieldGroup>

export const Default: Story = {}
