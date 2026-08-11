import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import TextField from '@/components/forms/TextField'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'

export interface CompanyFormValues {
  name: string
  email: string
  phone: string
  address: string
  industry: string
  website: string
  linkedin: string
  facebook: string
  twitter: string
  logoUrl: string
}

export const EMPTY_COMPANY_FORM: CompanyFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  industry: '',
  website: '',
  linkedin: '',
  facebook: '',
  twitter: '',
  logoUrl: '',
}

const urlRule = Yup.string().url('Must be a valid URL starting with http(s)://')

const baseShape = {
  name: Yup.string().required('Company name is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string(),
  industry: Yup.string(),
  facebook: Yup.string(),
  twitter: Yup.string(),
  logoUrl: urlRule,
}

const createValidationSchema = Yup.object({
  ...baseShape,
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
})

// Email and website are locked in edit mode, so they are not validated —
// they are submitted-out entirely by the edit page.
const editValidationSchema = Yup.object({
  ...baseShape,
  linkedin: Yup.string(),
})

interface CompanyFormProps {
  mode: 'create' | 'edit'
  initialValues: CompanyFormValues
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (
    values: CompanyFormValues,
    helpers: { resetForm: () => void },
  ) => void | Promise<void>
  onCancel?: () => void
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  mode,
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const isEdit = mode === 'edit'

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={isEdit ? editValidationSchema : createValidationSchema}
      onSubmit={onSubmit}>
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
          asterick={!isEdit}
          disabled={isEdit}
          placeholder="contact@acme.com"
          hint={
            isEdit
              ? 'Company email cannot be changed after creation.'
              : undefined
          }
        />
        <TextField label="Phone" name="phone" placeholder="+234..." />
        {!isEdit && (
          <Text size="fs-sm" color="secondary">
            Provide a website or a LinkedIn URL (at least one is required).
          </Text>
        )}
        <TextField
          label="Website"
          name="website"
          disabled={isEdit}
          placeholder="https://acme.com"
          hint={
            isEdit ? 'Website cannot be changed after creation.' : undefined
          }
        />
        <TextField
          label="LinkedIn"
          name="linkedin"
          placeholder="https://linkedin.com/company/acme"
        />
        <TextField
          label="Logo URL"
          name="logoUrl"
          placeholder="https://acme.com/logo.png"
          hint="Shown next to your company name on every job you post."
        />
        <TextField
          label="Address"
          name="address"
          asterick
          placeholder="123 Main Street"
        />
        <TextField label="Industry" name="industry" placeholder="Technology" />
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
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Formik>
  )
}
