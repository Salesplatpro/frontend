import { Form, useFormikContext } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FormikFocusOnError } from '@/components/forms/FormikFocusOnError'
import { LocationSelect } from '@/components/forms/LocationSelect'
import { EMPTY_LOCATION } from '@/components/forms/LocationSelect/useLocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  EXPERIENCE_LEVEL_OPTIONS,
  WORK_MODE_OPTIONS,
} from '@/components/forms/Select/options'
import { Select } from '@/components/forms/Select/Select'
import { TagInput } from '@/components/forms/TagInput/TagInput'
import { TextInput } from '@/components/forms/TextInput'
import { ValidatedForm } from '@/components/forms/ValidatedForm'
import { PageHero } from '@/components/layout/PageHero/PageHero'
import { PageShell } from '@/components/layout/PageShell/PageShell'
import { Button, EmptyState, Spinner } from '@/components/ui'
import { Stepper } from '@/components/ui/Stepper/Stepper'
import { ScoutTextArea } from '@/features/scout/components/ScoutTextArea'
import { scoutPaths } from '@/features/scout/paths'
import { useScoutStore } from '@/features/scout/store/useScoutStore'
import {
  type ScoutCampaignFormValues,
  DEFAULT_SHORTLIST_SIZE,
  MAX_SHORTLIST_SIZE,
  MIN_SHORTLIST_SIZE,
} from '@/features/scout/types'
import { AiFieldActions } from '@/pages/RecruiterProfile/PostJobs/AiAssist/AiFieldActions'
import {
  useCreateScoutCampaignMutation,
  useGetScoutCampaignQuery,
  useUpdateScoutCampaignMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import styles from './CampaignForm.module.scss'
import { SCOUT_STEPS } from './steps'
import { scoutCampaignValidationSchema } from './validationSchema'

const emptyValues: ScoutCampaignFormValues = {
  name: '',
  role: '',
  experienceLevel: '',
  jobBrief: '',
  recruiterGuide: '',
  mustHaveSkills: [],
  niceToHaveSkills: [],
  workMode: '',
  location: { ...EMPTY_LOCATION },
  shortlistSize: DEFAULT_SHORTLIST_SIZE,
}

const SHORTLIST_OPTIONS = Array.from(
  { length: MAX_SHORTLIST_SIZE - MIN_SHORTLIST_SIZE + 1 },
  (_, index) => {
    const value = MIN_SHORTLIST_SIZE + index
    return { value: String(value), label: `${value} candidates` }
  },
)

/**
 * Mirrors the form into the draft store. A component rather than a call inside the
 * render prop, because writing to a store while rendering re-renders forever.
 */
const DraftObserver = ({
  saveDraft,
}: {
  saveDraft: (values: ScoutCampaignFormValues) => void
}) => {
  const { values } = useFormikContext<ScoutCampaignFormValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

export const CampaignForm = () => {
  const navigate = useNavigate()
  const { campaignId } = useParams<{ campaignId: string }>()
  const isEditing = !!campaignId

  const { draft, saveDraft, clearDraft } = useScoutStore()
  // Snapshotted once. Feeding the live draft back into initialValues while
  // `enableReinitialize` is on makes the form reset itself from the value the
  // DraftObserver just wrote, which wipes whatever is being typed.
  const [restoredDraft] = useState(() => draft)
  const [createCampaign, { isLoading: isCreating }] =
    useCreateScoutCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateScoutCampaignMutation()

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError,
  } = useGetScoutCampaignQuery({ id: campaignId ?? '' }, { skip: !isEditing })

  const initialValues = useMemo<ScoutCampaignFormValues>(() => {
    const campaign = existing?.data?.scoutJob
    if (isEditing && campaign) {
      return {
        name: campaign.name ?? '',
        role: campaign.roleId ?? '',
        experienceLevel: campaign.experienceLevel ?? '',
        jobBrief: campaign.jobBrief ?? '',
        recruiterGuide: campaign.recruiterGuide ?? '',
        mustHaveSkills: campaign.mustHaveSkills ?? [],
        niceToHaveSkills: campaign.niceToHaveSkills ?? [],
        workMode: campaign.workMode ?? '',
        location: {
          country: { name: campaign.locationCountry ?? '', isoCode: '' },
          state: { name: campaign.locationState ?? '', isoCode: '' },
          city: { name: campaign.locationCity ?? '', isoCode: '' },
        },
        shortlistSize: campaign.shortlistSize ?? DEFAULT_SHORTLIST_SIZE,
      }
    }
    // A saved draft only applies to a brand-new campaign — restoring it while
    // editing would quietly overwrite the live campaign with someone else's draft.
    return isEditing ? emptyValues : restoredDraft ?? emptyValues
  }, [existing, isEditing, restoredDraft])

  if (isEditing && isLoadingExisting) {
    return <Spinner fullPage />
  }

  if (isEditing && isError) {
    return (
      <PageShell>
        <EmptyState
          title="Couldn't load this campaign"
          description="Refresh the page, or go back to your campaigns and try again."
          action={
            <Button variant="outline" onClick={() => navigate(scoutPaths.root)}>
              Back to campaigns
            </Button>
          }
        />
      </PageShell>
    )
  }

  const submit = async (values: ScoutCampaignFormValues) => {
    const payload = {
      name: values.name.trim(),
      role: values.role,
      jobBrief: values.jobBrief.trim(),
      recruiterGuide: values.recruiterGuide.trim(),
      shortlistSize: Number(values.shortlistSize),
      experienceLevel: values.experienceLevel || null,
      mustHaveSkills: values.mustHaveSkills.length
        ? values.mustHaveSkills
        : null,
      niceToHaveSkills: values.niceToHaveSkills.length
        ? values.niceToHaveSkills
        : null,
      workMode: values.workMode || null,
      locationCountry: values.location?.country?.name || null,
      locationState: values.location?.state?.name || null,
      locationCity: values.location?.city?.name || null,
    }

    try {
      if (isEditing && campaignId) {
        await updateCampaign({ campaignId, data: payload }).unwrap()
        notify('success', 'Campaign updated')
        navigate(scoutPaths.campaign(campaignId))
        return
      }

      const result = await createCampaign(payload).unwrap()
      clearDraft()
      notify('success', 'Campaign created — now add some CVs')
      navigate(scoutPaths.upload(result.data.scoutJob.id))
    } catch (err) {
      notify('error', getErrorMessage(err, 'Could not save this campaign'))
    }
  }

  return (
    <PageShell>
      <PageHero
        compact
        kicker={isEditing ? 'Edit campaign' : 'New campaign'}
        title={isEditing ? 'Edit this campaign' : 'What are you scouting for?'}
        lead="The AI reads every CV you upload against what you describe here, so the more specific you are, the better the shortlist."
      />

      {!isEditing && (
        <Stepper
          steps={SCOUT_STEPS}
          current="campaign"
          ariaLabel="Scouting progress"
        />
      )}

      <ValidatedForm<ScoutCampaignFormValues>
        initialValues={initialValues}
        validationSchema={scoutCampaignValidationSchema}
        enableReinitialize
        onSubmit={submit}>
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => {
          // Feeds the AI-assist chips, which need at least a role or a brief.
          const aiContext = {
            role: values.role,
            experienceLevel: values.experienceLevel,
            jobBrief: values.jobBrief,
          }

          return (
            <Form noValidate className={styles.form}>
              <FormikFocusOnError />
              {!isEditing && <DraftObserver saveDraft={saveDraft} />}

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>The role</h2>
                <p className={styles.sectionHint}>
                  What you are hiring for, and how senior it is.
                </p>

                <div className={styles.grid}>
                  <TextInput
                    title="Campaign name"
                    name="name"
                    label="Campaign name"
                    placeholder="Q1 Enterprise AE hiring"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <p className={styles.fieldHint}>
                    A short name only your team sees, so you can find this
                    campaign again later.
                  </p>
                </div>

                <div className={styles.grid}>
                  <RoleSelect
                    name="role"
                    label="Role you're scouting for"
                    value={values.role}
                    creatable={false}
                    onChange={(value) => setFieldValue('role', value)}
                    error={touched.role ? errors.role : undefined}
                  />
                  <p className={styles.fieldHint}>
                    The job title you are hiring for. The AI uses this to judge
                    how relevant each CV is.
                  </p>
                </div>

                <div className={styles.grid}>
                  <Select
                    name="experienceLevel"
                    label="Seniority you expect"
                    options={EXPERIENCE_LEVEL_OPTIONS}
                    value={values.experienceLevel}
                    onChange={(value) =>
                      setFieldValue('experienceLevel', value)
                    }
                    placeholder="Choose a level..."
                    error={
                      touched.experienceLevel
                        ? errors.experienceLevel
                        : undefined
                    }
                  />
                  <p className={styles.fieldHint}>
                    Roughly how much hands-on experience the role needs.
                    Candidates far outside this range score lower.
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  How the AI should choose
                </h2>
                <p className={styles.sectionHint}>
                  This is what the AI reads every CV against. Write it as you
                  would explain the role to a colleague.
                </p>

                <ScoutTextArea
                  name="jobBrief"
                  label="Job brief"
                  hint="Describe the role in your own words — what they'll do, who they'll work with, and what success looks like. The more you write, the better the matches."
                  placeholder="We need an enterprise account executive to sell our payments platform to Nigerian banks..."
                  maxLength={5000}
                  rows={7}
                  actions={
                    <AiFieldActions
                      field="jobBrief"
                      format="text"
                      value={values.jobBrief}
                      job={aiContext}
                      onApply={(value) => setFieldValue('jobBrief', value)}
                    />
                  }
                />

                <ScoutTextArea
                  name="recruiterGuide"
                  label="How should the AI choose?"
                  hint="Tell the AI what matters most and what to avoid. For example: 'Prioritise people who've sold to banks. Skip agency-only backgrounds.'"
                  placeholder="Prioritise candidates who have closed six-figure deals. Be strict about industry experience..."
                  maxLength={2000}
                  rows={5}
                  actions={
                    <AiFieldActions
                      field="recruiterGuide"
                      format="text"
                      value={values.recruiterGuide}
                      job={aiContext}
                      onApply={(value) =>
                        setFieldValue('recruiterGuide', value)
                      }
                    />
                  }
                />

                <div className={styles.grid}>
                  <TagInput
                    name="mustHaveSkills"
                    label="Must-have skills"
                    value={values.mustHaveSkills}
                    onChange={(value) => setFieldValue('mustHaveSkills', value)}
                    maxTags={15}
                    placeholder="Type a skill and press Enter"
                    error={
                      touched.mustHaveSkills
                        ? (errors.mustHaveSkills as string | undefined)
                        : undefined
                    }
                  />
                  <p className={styles.fieldHint}>
                    Skills a candidate cannot do the job without. Missing one
                    pushes a candidate well down the list.
                  </p>
                </div>

                <div className={styles.grid}>
                  <TagInput
                    name="niceToHaveSkills"
                    label="Nice-to-have skills"
                    value={values.niceToHaveSkills}
                    onChange={(value) =>
                      setFieldValue('niceToHaveSkills', value)
                    }
                    maxTags={15}
                    placeholder="Type a skill and press Enter"
                  />
                  <p className={styles.fieldHint}>
                    Bonus skills. Used to break ties between candidates who
                    otherwise look alike.
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Where and how they work</h2>
                <p className={styles.sectionHint}>
                  Optional. Leave blank if location is not a factor.
                </p>

                <LocationSelect
                  value={values.location}
                  onChange={(value) => setFieldValue('location', value)}
                  countryLabel="Country"
                  stateLabel="State"
                  cityLabel="City"
                />
                <p className={styles.fieldHint}>
                  Used to judge whether a candidate can realistically work this
                  role.
                </p>

                <div className={styles.grid}>
                  <Select
                    name="workMode"
                    label="Work setup"
                    options={WORK_MODE_OPTIONS}
                    value={values.workMode}
                    onChange={(value) => setFieldValue('workMode', value)}
                    placeholder="Choose a setup..."
                  />
                  <p className={styles.fieldHint}>
                    Remote, hybrid or on-site. Candidates who cannot work this
                    way score lower.
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Your shortlist</h2>

                <div className={styles.grid}>
                  <Select
                    name="shortlistSize"
                    label="How many candidates should the AI shortlist?"
                    options={SHORTLIST_OPTIONS}
                    value={String(values.shortlistSize)}
                    onChange={(value) =>
                      setFieldValue('shortlistSize', Number(value))
                    }
                    error={
                      touched.shortlistSize
                        ? (errors.shortlistSize as string | undefined)
                        : undefined
                    }
                  />
                  <p className={styles.fieldHint}>
                    The AI scores every CV you upload, then hands you this many
                    best matches, ranked. You can still see the full list.
                  </p>
                </div>
              </section>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      isEditing && campaignId
                        ? scoutPaths.campaign(campaignId)
                        : scoutPaths.root,
                    )
                  }>
                  Cancel
                </Button>
                <Button type="submit" loading={isCreating || isUpdating}>
                  {isEditing ? 'Save changes' : 'Continue to upload CVs'}
                </Button>
              </div>
            </Form>
          )
        }}
      </ValidatedForm>
    </PageShell>
  )
}
