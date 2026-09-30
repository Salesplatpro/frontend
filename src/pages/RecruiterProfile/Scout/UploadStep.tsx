import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Alert } from '@/components/feedback/Alert'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Button, EmptyState, Spinner } from '@/components/ui'
import { Dropzone } from '@/components/ui/Dropzone/Dropzone'
import { Stepper } from '@/components/ui/Stepper/Stepper'
import { scoutPaths } from '@/features/scout/paths'
import { useScoutStore } from '@/features/scout/store/useScoutStore'
import { MAX_BATCH_SIZE } from '@/features/scout/types'
import {
  useGetScoutCampaignQuery,
  useStartScoutRunMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { SCOUT_STEPS } from './steps'
import styles from './UploadStep.module.scss'

export const UploadStep = () => {
  const navigate = useNavigate()
  const { campaignId } = useParams<{ campaignId: string }>()

  const {
    cvFiles,
    rejectedFiles,
    idempotencyKey,
    addCvFiles,
    removeCvFile,
    clearRejectedFiles,
    resetUpload,
  } = useScoutStore()

  const { data, isLoading, isError } = useGetScoutCampaignQuery(
    { id: campaignId ?? '' },
    { skip: !campaignId },
  )
  const [startRun, { isLoading: isStarting }] = useStartScoutRunMutation()

  if (isLoading) return <Spinner fullPage />

  const campaign = data?.data?.scoutJob
  if (isError || !campaign || !campaignId) {
    return (
      <PageShell>
        <EmptyState
          title="Couldn't load this campaign"
          description="It may have been deleted. Go back to your campaigns and try again."
          action={
            <Button variant="outline" onClick={() => navigate(scoutPaths.root)}>
              Back to campaigns
            </Button>
          }
        />
      </PageShell>
    )
  }

  const submit = async () => {
    if (cvFiles.length === 0) return

    const body = new FormData()
    // One key per upload session. A double-click or a retried request collides on
    // it server-side and returns the run already in flight, so we can never start
    // two runs or be charged twice for the same batch.
    body.append('idempotencyKey', idempotencyKey)
    for (const file of cvFiles) body.append('cv', file)

    try {
      const result = await startRun({ campaignId, body }).unwrap()
      resetUpload()
      navigate(scoutPaths.run(campaignId, result.data.run.id))
    } catch (err) {
      notify('error', getErrorMessage(err, 'Could not start scouting'))
    }
  }

  return (
    <PageShell className={styles.page}>
      <PageHero
        compact
        kicker={campaign.name}
        title="Add the CVs to review"
        lead={`Upload up to ${MAX_BATCH_SIZE} CVs. The AI reads each one against your brief, then hands you the ${campaign.shortlistSize} best matches, ranked.`}
      />

      <Stepper
        steps={SCOUT_STEPS}
        current="upload"
        ariaLabel="Scouting progress"
        selectable={['campaign']}
        onSelect={(step) => {
          if (step === 'campaign') navigate(scoutPaths.editCampaign(campaignId))
        }}
      />

      <Alert variant="info">
        <strong>How we handle these CVs</strong>
        <p className={styles.noticeBody}>
          We store each CV securely so you can reopen it later, and the details
          we read from it (name, contact, skills, experience) are added to the
          SalesPlat talent pool, where other recruiters may also discover this
          candidate. Only upload CVs you have permission to share.
        </p>
      </Alert>

      <Dropzone
        files={cvFiles}
        onAdd={addCvFiles}
        onRemove={removeCvFile}
        accept=".pdf,.doc,.docx"
        maxFiles={MAX_BATCH_SIZE}
        label="Drag CVs here, or click to choose files"
        hint="PDF or Word, up to 5MB each. You can add them one at a time or select a whole folder."
        rejections={rejectedFiles}
        onDismissRejections={clearRejectedFiles}
        disabled={isStarting}
      />

      <div className={styles.footer}>
        <span className={styles.summary}>
          {cvFiles.length === 0
            ? 'No CVs added yet'
            : cvFiles.length === 1
            ? '1 CV ready to review'
            : `${cvFiles.length} CVs ready to review`}
        </span>
        <div className={styles.footerActions}>
          <Button
            variant="outline"
            onClick={() => navigate(scoutPaths.campaign(campaignId))}>
            Back to campaign
          </Button>
          <Button
            onClick={submit}
            loading={isStarting}
            disabled={cvFiles.length === 0}>
            Start scouting
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
