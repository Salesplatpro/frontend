import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHero, pageHeroStyles } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { BackButton } from '@/components/ui/BackButton'
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
    <PageShell>
      <BackButton onClick={goBack} />
      <PageHero
        compact
        kicker="New workspace"
        title="Tell us about the company"
        lead="Fill in the essentials first. You can add social links and a logo whenever you have them — the live preview on the right shows how the brand will appear to candidates."
        chips={
          <>
            <span className={pageHeroStyles.chip}>1 Identity</span>
            <span className={pageHeroStyles.chip}>2 Contact</span>
            <span className={pageHeroStyles.chip}>3 Presence</span>
          </>
        }
      />

      <CompanyForm
        mode="create"
        initialValues={EMPTY_COMPANY_FORM}
        isSubmitting={isCreating}
        submitLabel="Create company"
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    </PageShell>
  )
}

export default CreateCompany
