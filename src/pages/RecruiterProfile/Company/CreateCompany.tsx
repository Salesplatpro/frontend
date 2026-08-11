import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { useCreateOrganization } from '@/features/organizations/hooks/useCreateOrganization'
import { CreateOrganizationPayload } from '@/features/organizations/types'

import {
  CompanyForm,
  CompanyFormValues,
  EMPTY_COMPANY_FORM,
} from './CompanyForm'

const CreateCompany = () => {
  const navigate = useNavigate()
  const { createOrganization, isCreating } = useCreateOrganization()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: CompanyFormValues) => {
    const payload: CreateOrganizationPayload = { ...values }
    const org = await createOrganization(payload)
    if (org) {
      navigate('/recruiterDashboard/company')
    }
  }

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Create a company"
        description="Add a company to post jobs under. Creating it switches you onto it straight away."
        onBack={goBack}
      />

      <Card className="max-w-[700px] p-6 flex flex-col space-y-6">
        <CompanyForm
          mode="create"
          initialValues={EMPTY_COMPANY_FORM}
          isSubmitting={isCreating}
          submitLabel="Create company"
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      </Card>
    </div>
  )
}

export default CreateCompany
