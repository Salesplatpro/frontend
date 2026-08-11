import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import TextField from '@/components/forms/TextField'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Heading, Text } from '@/components/ui/Typography'
import { useCreateOrganization } from '@/features/organizations/hooks/useCreateOrganization'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { useSwitchOrganization } from '@/features/organizations/hooks/useSwitchOrganization'
import { CreateOrganizationPayload } from '@/features/organizations/types'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'

const DEFAULT_VALUES: CreateOrganizationPayload = {
  name: '',
  email: '',
  phone: '',
  address: '',
  industry: '',
  website: '',
  facebook: '',
  linkedin: '',
  twitter: '',
}

const validationSchema = Yup.object({
  name: Yup.string().required('Company name is required'),
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  website: Yup.string().test(
    'website-or-linkedin',
    'Provide a website or a LinkedIn URL',
    function (value) {
      return !!value || !!this.parent.linkedin
    },
  ),
  linkedin: Yup.string().test(
    'website-or-linkedin',
    'Provide a website or a LinkedIn URL',
    function (value) {
      return !!value || !!this.parent.website
    },
  ),
  address: Yup.string().required('Address is required'),
  phone: Yup.string(),
  industry: Yup.string(),
  facebook: Yup.string(),
  twitter: Yup.string(),
})

const Company = () => {
  const { profile } = useProfile()
  const { organizations, isLoading } = useMyOrganizations()
  const { createOrganization, isCreating } = useCreateOrganization()
  const { switchOrganization, isSwitching } = useSwitchOrganization()

  const handleSubmit = async (
    values: CreateOrganizationPayload,
    { resetForm }: { resetForm: () => void },
  ) => {
    const org = await createOrganization(values)
    if (org) {
      resetForm()
    }
  }

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Company"
        description="Create and manage the companies you post jobs for. Every job you create belongs to whichever company you're currently on."
      />

      <Card className="max-w-[700px] p-6 flex flex-col space-y-6">
        <Heading level={3}>Your companies</Heading>
        {isLoading ? (
          <Spinner />
        ) : organizations.length === 0 ? (
          <Text color="secondary">
            You haven&apos;t created a company yet. Create one below to start
            posting jobs.
          </Text>
        ) : (
          <div className="flex flex-col space-y-3">
            {organizations.map((org) => {
              const isActive = org.id === profile?.activeOrganizationId
              return (
                <div
                  key={org.id}
                  className="flex items-center justify-between border border-grey-200 rounded p-3">
                  <div className="flex items-center space-x-3">
                    <Text size="fs-md" weight="bolder">
                      {org.name}
                    </Text>
                    <StatusBadge
                      status={org.status}
                      {...getOrganizationStatusBadge(org.status)}
                    />
                  </div>
                  {isActive ? (
                    <Text size="fs-sm" color="secondary">
                      Active
                    </Text>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={isSwitching}
                      onClick={() => switchOrganization(org.id)}>
                      Switch to this company
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card className="max-w-[700px] p-6 flex flex-col space-y-6">
        <Heading level={3}>Add a company</Heading>
        <Formik
          initialValues={DEFAULT_VALUES}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          <Form className="flex flex-col">
            <TextField
              label="Company name"
              name="name"
              asterick
              placeholder="Acme Inc."
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              asterick
              placeholder="contact@acme.com"
            />
            <TextField label="Phone" name="phone" placeholder="+234..." />
            <Text size="fs-sm" color="secondary">
              Provide a website or a LinkedIn URL (at least one is required).
            </Text>
            <TextField
              label="Website"
              name="website"
              placeholder="https://acme.com"
            />
            <TextField
              label="LinkedIn"
              name="linkedin"
              placeholder="https://linkedin.com/company/acme"
            />
            <TextField
              label="Address"
              name="address"
              asterick
              placeholder="123 Main Street"
            />
            <TextField
              label="Industry"
              name="industry"
              placeholder="Technology"
            />
            <TextField
              label="Twitter"
              name="twitter"
              placeholder="https://twitter.com/acme"
            />
            <TextField
              label="Facebook"
              name="facebook"
              placeholder="https://facebook.com/acme"
            />
            <Button type="submit" loading={isCreating} className="self-start">
              Create company
            </Button>
          </Form>
        </Formik>
      </Card>
    </div>
  )
}

export default Company
