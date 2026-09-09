import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  useFormikContext,
} from 'formik'
import React, { useState } from 'react'
import { BsBuilding } from 'react-icons/bs'
import * as Yup from 'yup'

import { FormikFocusOnError } from '@/components/forms/FormikFocusOnError'
import { Select } from '@/components/forms/Select'
import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { INDUSTRY_OPTIONS } from '@/features/organizations/constants/industries'
import {
  emailDomainMatchesWebsite,
  extractWebsiteDomain,
  isPublicEmailDomain,
} from '@/features/organizations/utils/emailDomain'

import styles from './CompanyForm.module.scss'

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
  industry: Yup.string().required('Industry is required'),
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required')
    .test(
      'corporate-email',
      'Use a corporate work email, not a personal address (Gmail, Yahoo, etc.)',
      (value) => !!value && !isPublicEmailDomain(value),
    )
    .test(
      'email-matches-website',
      'Contact email domain must match your website domain',
      function (value) {
        const website = this.parent.website?.trim()
        if (!value || !website) return true
        if (emailDomainMatchesWebsite(value, website)) return true
        const websiteDomain = extractWebsiteDomain(website)
        return this.createError({
          message: `Contact email must use @${
            websiteDomain || 'your website domain'
          }`,
        })
      },
    ),
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

const editValidationSchema = Yup.object({
  ...baseShape,
  linkedin: Yup.string(),
})

interface FormFieldProps {
  label: string
  name: keyof CompanyFormValues
  required?: boolean
  disabled?: boolean
  locked?: boolean
  hint?: string
  placeholder?: string
  type?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required,
  disabled,
  locked,
  hint,
  placeholder,
  type = 'text',
}) => (
  <div className={styles.field} data-field={name}>
    <label htmlFor={name} className={styles.label}>
      {label}
      {required && (
        <span className={styles.req} aria-hidden>
          *
        </span>
      )}
      {locked && <span className={styles.lock}>Locked</span>}
    </label>
    <Field name={name}>
      {({ field, meta }: FieldProps<string>) => (
        <input
          {...field}
          id={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={meta.touched && meta.error ? true : undefined}
          aria-describedby={
            meta.touched && meta.error
              ? `${name}-error`
              : hint
              ? `${name}-hint`
              : undefined
          }
          className={`${styles.input} ${
            meta.touched && meta.error ? styles.inputError : ''
          }`}
        />
      )}
    </Field>
    {hint && (
      <p id={`${name}-hint`} className={styles.hint}>
        {hint}
      </p>
    )}
    <ErrorMessage name={name}>
      {(message) => (
        <p id={`${name}-error`} className={styles.error} role="alert">
          {message}
        </p>
      )}
    </ErrorMessage>
  </div>
)

const LogoPreview: React.FC<{ logoUrl: string }> = ({ logoUrl }) => {
  const [failed, setFailed] = useState(false)

  if (!logoUrl || failed) {
    return (
      <div className={styles.logoFallbackOnDark} aria-hidden>
        <BsBuilding size={22} />
      </div>
    )
  }

  return (
    <img
      key={logoUrl}
      src={logoUrl}
      alt=""
      className={styles.logoOnDark}
      onError={() => setFailed(true)}
    />
  )
}

const CompanyPreview: React.FC = () => {
  const { values } = useFormikContext<CompanyFormValues>()
  const displayName = values.name.trim() || 'Your company'
  const presence = values.website.trim() || values.linkedin.trim()

  return (
    <aside className={styles.preview} aria-live="polite">
      <PagePanel>
        <p className={styles.previewLabel}>How it will look</p>
        <div className={styles.previewCard}>
          <LogoPreview
            key={values.logoUrl.trim()}
            logoUrl={values.logoUrl.trim()}
          />
          <div>
            <p className={styles.previewName}>{displayName}</p>
            <p className={styles.previewMeta}>
              {values.industry.trim() || 'Industry not set'}
              {values.address.trim() ? ` · ${values.address.trim()}` : ''}
            </p>
            {presence ? (
              <a
                className={styles.previewLink}
                href={presence}
                target="_blank"
                rel="noreferrer">
                {presence}
              </a>
            ) : (
              <p className={styles.previewEmpty}>
                Add a website or LinkedIn so candidates can find you.
              </p>
            )}
          </div>
        </div>
      </PagePanel>
    </aside>
  )
}

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
      <div className={styles.layout}>
        <Form className={styles.form} noValidate>
          <FormikFocusOnError />
          <PagePanel>
            <div className={styles.sectionHead}>
              <span className={styles.step}>1</span>
              <div>
                <h2 className={styles.sectionTitle}>Company identity</h2>
                <p className={styles.sectionHint}>
                  This is the name and location candidates see on your jobs.
                </p>
              </div>
            </div>
            <div className={styles.grid}>
              <FormField
                label="Company name"
                name="name"
                required
                placeholder="Acme Inc."
              />
              <Field name="industry">
                {({ field, form, meta }: FieldProps<string>) => (
                  <div className={styles.field} data-field="industry">
                    <Select
                      name="industry"
                      label="Industry"
                      required={!isEdit}
                      placeholder="Select an industry"
                      options={INDUSTRY_OPTIONS}
                      value={field.value}
                      onChange={(value) =>
                        form.setFieldValue('industry', value)
                      }
                      error={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  </div>
                )}
              </Field>
              <div className={styles.span2}>
                <FormField
                  label="Address"
                  name="address"
                  required
                  placeholder="123 Main Street, Lagos"
                />
              </div>
            </div>
          </PagePanel>

          <PagePanel>
            <div className={styles.sectionHead}>
              <span className={styles.step}>2</span>
              <div>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <p className={styles.sectionHint}>
                  Used for verification and so the team can reach you.
                </p>
              </div>
            </div>
            <div className={styles.grid}>
              <FormField
                label="Email"
                name="email"
                type="email"
                required={!isEdit}
                disabled={isEdit}
                locked={isEdit}
                placeholder="contact@acme.com"
                hint={
                  isEdit
                    ? 'Email cannot be changed after the company is created.'
                    : 'Use a work email on the same domain as your website (e.g. name@acme.com for acme.com).'
                }
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+234..."
              />
            </div>
          </PagePanel>

          <PagePanel>
            <div className={styles.sectionHead}>
              <span className={styles.step}>3</span>
              <div>
                <h2 className={styles.sectionTitle}>Online presence</h2>
                <p className={styles.sectionHint}>
                  Help candidates recognise your brand and confirm you are real.
                </p>
              </div>
            </div>
            {!isEdit && (
              <p className={styles.callout}>
                Provide a website or a LinkedIn page — at least one is required.
              </p>
            )}
            <div className={styles.grid}>
              <FormField
                label="Website"
                name="website"
                disabled={isEdit}
                locked={isEdit}
                placeholder="https://acme.com"
                hint={
                  isEdit
                    ? 'Website cannot be changed after the company is created.'
                    : undefined
                }
              />
              <FormField
                label="LinkedIn"
                name="linkedin"
                placeholder="https://linkedin.com/company/acme"
              />
              <div className={styles.span2}>
                <FormField
                  label="Logo URL"
                  name="logoUrl"
                  placeholder="https://acme.com/logo.png"
                  hint="Paste a public image URL. It appears next to your company name on jobs."
                />
              </div>
              <FormField
                label="X (Twitter)"
                name="twitter"
                placeholder="https://x.com/acme"
              />
              <FormField
                label="Facebook"
                name="facebook"
                placeholder="https://facebook.com/acme"
              />
            </div>
          </PagePanel>

          <div className={styles.actions}>
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
        <CompanyPreview />
      </div>
    </Formik>
  )
}
