import React from 'react'

import {
  workModeNeedsLocation,
  WorkTypeCheckboxes,
} from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  LocationSelect,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  COMPENSATION_PERIOD_OPTIONS,
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
} from '@/components/forms/Select'
import { TagInput } from '@/components/forms/TagInput/TagInput'
import TextField from '@/components/forms/TextField'
import { Button } from '@/components/ui/Button'
import { PostJobFormValues } from '@/utils/jobPostTypes'

import styles from './PostJob.module.scss'

type FormikErrorsLike = Partial<Record<keyof PostJobFormValues, unknown>> & {
  location?: { country?: { name?: string } }
}
type FormikTouchedLike = Partial<Record<keyof PostJobFormValues, unknown>> & {
  location?: { country?: unknown }
}

type JobDetailsFieldsProps = {
  values: PostJobFormValues
  errors: FormikErrorsLike
  touched: FormikTouchedLike
  setFieldValue: (key: keyof PostJobFormValues, value: unknown) => void
  roleDisabled?: boolean
  onGenerateWithAI?: () => void
  isGeneratingWithAI?: boolean
}

export const JobDetailsFields = ({
  values,
  errors,
  touched,
  setFieldValue,
  roleDisabled,
  onGenerateWithAI,
  isGeneratingWithAI,
}: JobDetailsFieldsProps) => (
  <>
    {/* Section 1: Job Overview */}
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Role overview</h3>
      <p className={styles.sectionNote}>
        Start with the role. You can generate a brief with AI, then edit it
        before publishing.
      </p>
      <div className={styles.fieldGroup}>
        <RoleSelect
          label="Role"
          required
          name="role"
          value={values.role}
          onChange={(value) => setFieldValue('role', value)}
          creatable={!roleDisabled}
          disabled={roleDisabled}
          error={
            touched.role && typeof errors.role === 'string'
              ? (errors.role as string)
              : undefined
          }
        />
      </div>

      {onGenerateWithAI && (
        <div className={styles.fieldGroup}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={isGeneratingWithAI}
            disabled={!values.role}
            onClick={onGenerateWithAI}>
            Generate with AI
          </Button>
          {!values.role && (
            <p className={styles.sectionNote}>
              Select a role above to generate a job brief, requirements, skills,
              and goals.
            </p>
          )}
        </div>
      )}

      <div className={styles.fieldGroup}>
        <TextField
          label="Job Brief"
          asterick
          name="jobBrief"
          placeholder="Describe the role in up to 600 words"
          type="textarea"
          MAX_WORDS={600}
          tooltip="What the candidate reads first. Be specific about the work, team, and outcomes — this also drives AI screening questions and CV matching."
        />
      </div>
    </section>

    {/* Section 2: Requirements */}
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Requirements</h3>

      <div className={styles.fieldGroup}>
        <TextField
          label="Job Requirements"
          asterick
          name="requirements"
          placeholder="List the qualifications and skills needed"
          type="textarea"
          tooltip="Must-haves and nice-to-haves. CV match and personalized questions are grounded in this text."
        />
      </div>

      <div className={styles.fieldGroup}>
        <Select
          label="Experience Level"
          required
          options={EXPERIENCE_LEVEL_OPTIONS}
          value={values.experienceLevel}
          onChange={(value) => setFieldValue('experienceLevel', value)}
          placeholder="Select experience level"
          error={
            touched.experienceLevel &&
            typeof errors.experienceLevel === 'string'
              ? (errors.experienceLevel as string)
              : undefined
          }
        />
      </div>
    </section>

    {/* Section 3: Work & Location */}
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Work &amp; Location</h3>

      <div className={styles.fieldGroup}>
        <p className={styles.label}>
          Work Mode<span className={styles.required}>*</span>
        </p>
        <WorkTypeCheckboxes
          value={values.workMode}
          onChange={(value) => {
            setFieldValue('workMode', value)
            if (!workModeNeedsLocation(value)) {
              setFieldValue('location', { ...EMPTY_LOCATION })
            }
          }}
          error={
            touched.workMode && typeof errors.workMode === 'string'
              ? (errors.workMode as string)
              : undefined
          }
        />
      </div>

      {workModeNeedsLocation(values.workMode) && (
        <>
          <p className={styles.sectionNote}>
            Only Country is required — State/Province and Region/City are
            optional.
          </p>
          <div className={styles.fieldGroup}>
            <LocationSelect
              value={values.location}
              onChange={(location) => setFieldValue('location', location)}
              stateLabel="State/Province (Optional)"
              cityLabel="Region/City (Optional)"
              countryRequired
              errors={{
                country:
                  touched.location?.country &&
                  typeof errors.location?.country?.name === 'string'
                    ? errors.location?.country?.name
                    : undefined,
              }}
            />
          </div>
        </>
      )}
    </section>

    {/* Section 4: Compensation */}
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Compensation</h3>

      <div className={styles.compensationRow}>
        <div className={styles.compensationFieldThird}>
          <Select
            label="Currency"
            required
            options={CURRENCY_OPTIONS}
            value={values.currency}
            onChange={(value) => setFieldValue('currency', value)}
            placeholder="Select currency"
          />
          {Boolean(touched.currency) && typeof errors.currency === 'string' && (
            <div className={styles.errorText}>{errors.currency}</div>
          )}
        </div>

        <div className={styles.compensationFieldThird}>
          <TextField
            label="Min Salary"
            asterick
            name="minSalary"
            placeholder="e.g. 300000"
            tooltip="Lowest compensation you will offer in the selected currency and period. Shown to candidates on the job post."
          />
        </div>

        <div className={styles.compensationFieldThird}>
          <TextField
            label="Max Salary"
            name="maxSalary"
            placeholder="e.g. 600000"
            tooltip="Optional upper bound. Leave blank if you prefer not to publish a range ceiling."
          />
        </div>

        <div className={styles.compensationFieldThird}>
          <Select
            label="Compensation Period"
            required
            options={COMPENSATION_PERIOD_OPTIONS}
            value={values.compensationPeriod}
            onChange={(value) => setFieldValue('compensationPeriod', value)}
            placeholder="Select period"
          />
          {Boolean(touched.compensationPeriod) &&
            typeof errors.compensationPeriod === 'string' && (
              <div className={styles.errorText}>
                {errors.compensationPeriod}
              </div>
            )}
        </div>
      </div>
    </section>

    {/* Section 5: Goals & Skills */}
    <section className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Goals &amp; Skills</h3>

      <div className={styles.fieldGroup}>
        <TagInput
          label="Required Skills"
          required
          value={values.skills}
          onChange={(tags) => setFieldValue('skills', tags)}
          placeholder="Type a skill and press Enter"
          maxLength={250}
          error={
            touched.skills && typeof errors.skills === 'string'
              ? (errors.skills as string)
              : undefined
          }
        />
      </div>

      <div className={styles.fieldGroup}>
        <TagInput
          label="Top Goals"
          required
          value={values.goals}
          onChange={(tags) => setFieldValue('goals', tags)}
          placeholder="Type a goal and press Enter"
          maxLength={250}
          error={
            touched.goals && typeof errors.goals === 'string'
              ? (errors.goals as string)
              : undefined
          }
        />
      </div>
    </section>
  </>
)
