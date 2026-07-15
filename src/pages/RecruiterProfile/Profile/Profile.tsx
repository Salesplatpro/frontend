import React from 'react'
import { CgProfile } from 'react-icons/cg'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { Heading, Text } from '@/components/ui/Typography'

const dummyProfile = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  company: 'Aux HR',
  role: 'Talent Acquisition Lead',
  phone: '+1 (555) 123-4567',
  location: 'Lagos, Nigeria',
}

const fields: { label: string; value: string }[] = [
  { label: 'Company', value: dummyProfile.company },
  { label: 'Role', value: dummyProfile.role },
  { label: 'Email', value: dummyProfile.email },
  { label: 'Phone', value: dummyProfile.phone },
  { label: 'Location', value: dummyProfile.location },
]

export const Profile = () => (
  <div className="flex flex-col space-y-12">
    <PageHeaderTitle
      title="Profile"
      description="Your recruiter account information"
    />
    <Card className="max-w-[600px] p-6 flex flex-col space-y-6">
      <div className="flex items-center space-x-4">
        <CgProfile size={64} />
        <div>
          <Heading level={3}>
            {dummyProfile.firstName} {dummyProfile.lastName}
          </Heading>
          <Text size="fs-sm" color="secondary">
            {dummyProfile.email}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col">
            <Text size="fs-sm" color="secondary">
              {field.label}
            </Text>
            <Text size="fs-md">{field.value}</Text>
          </div>
        ))}
      </div>
    </Card>
  </div>
)
