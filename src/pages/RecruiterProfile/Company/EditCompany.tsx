import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { useUpdateOrganization } from '@/features/organizations/hooks/useUpdateOrganization'
import { UpdateOrganizationPayload } from '@/features/organizations/types'

import {
  CompanyForm,
  CompanyFormValues,
  EMPTY_COMPANY_FORM,
} from './CompanyForm'

const EditCompany = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { organizations, isLoading } = useMyOrganizations()
  const { updateOrganization, isUpdating } = useUpdateOrganization()

  const organization = organizations.find((org) => org.id === id)

  const goBack = () => navigate('/recruiterDashboard/company')

  const handleSubmit = async (values: CompanyFormValues) => {
    if (!organization) return
    // email and website are locked server-side too — sending them would be ignored.
    const payload: UpdateOrganizationPayload = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      industry: values.industry,
      linkedin: values.linkedin,
      facebook: values.facebook,
      twitter: values.twitter,
      logoUrl: values.logoUrl,
    }
    const updated = await updateOrganization(organization.id, payload)
    if (updated) {
      navigate('/recruiterDashboard/company')
    }
  }

  const initialValues: CompanyFormValues = organization
    ? {
        ...EMPTY_COMPANY_FORM,
        name: organization.name ?? '',
        email: organization.email ?? '',
        phone: organization.phone ?? '',
        address: organization.address ?? '',
        industry: organization.industry ?? '',
        website: organization.website ?? '',
        linkedin: organization.linkedin ?? '',
        facebook: organization.facebook ?? '',
        twitter: organization.twitter ?? '',
        logoUrl: organization.logoUrl ?? '',
      }
    : EMPTY_COMPANY_FORM

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title={organization ? `Edit ${organization.name}` : 'Edit company'}
        description="Update your company details. Email and website are fixed once a company is created."
        onBack={goBack}
      />

      {isLoading ? (
        <Spinner />
      ) : !organization ? (
        <EmptyState
          title="Company not found"
          description="This company either doesn't exist or isn't one you created."
        />
      ) : (
        <Card className="max-w-[700px] p-6 flex flex-col space-y-6">
          <CompanyForm
            mode="edit"
            initialValues={initialValues}
            isSubmitting={isUpdating}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onCancel={goBack}
          />
        </Card>
      )}
    </div>
  )
}

export default EditCompany
