import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog } from '@/components/feedback'
import { Select } from '@/components/forms/Select'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  useDeleteJobMutation,
  useUpdateJobMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { getStatusBadge, JOB_STATUS_OPTIONS } from '../getJobStatus'
import styles from './JobStatusControl.module.scss'

type JobStatusControlProps = {
  jobId: string
  status: string
  aiConfigId?: string | null
}

export const JobStatusControl = ({
  jobId,
  status,
  aiConfigId,
}: JobStatusControlProps) => {
  const navigate = useNavigate()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [updateJob, { isLoading: isUpdatingStatus }] = useUpdateJobMutation()
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const canActivate = !!aiConfigId
  const statusOptions = canActivate
    ? JOB_STATUS_OPTIONS
    : JOB_STATUS_OPTIONS.filter((option) => option.value !== 'active')

  // `status` comes from a query on a different RTK Query API slice than the one
  // `updateJob` invalidates, so it won't refresh on its own after a save —
  // `currentStatus` is the optimistic source of truth the Select renders.
  useEffect(() => {
    setCurrentStatus(status)
  }, [status])

  const handleStatusChange = async (nextStatus: string) => {
    if (nextStatus === currentStatus) return
    const previousStatus = currentStatus
    setCurrentStatus(nextStatus)
    try {
      await updateJob({ jobId, data: { status: nextStatus } }).unwrap()
      notify('success', 'Job status updated')
    } catch (err) {
      setCurrentStatus(previousStatus)
      notify('error', getErrorMessage(err, 'Failed to update job status'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteJob(jobId).unwrap()
      notify('success', 'Job deleted')
      navigate('/recruiterDashboard/myjobposts')
    } catch (err) {
      const apiMessage = getErrorMessage(err, 'Failed to delete job')
      notify('error', apiMessage)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.statusRow}>
        <div className={styles.statusField}>
          <p className={styles.label}>Job Status</p>
          <Select
            options={statusOptions}
            value={currentStatus}
            onChange={(value) => void handleStatusChange(value)}
            disabled={isUpdatingStatus}
          />
          {!canActivate && currentStatus !== 'active' && (
            <p className={styles.aiConfigNote}>
              Add an AI screening configuration before activating this job.
            </p>
          )}
        </div>
        <StatusBadge
          status={currentStatus}
          {...getStatusBadge(currentStatus)}
        />
      </div>

      <div className={styles.dangerZone}>
        <div>
          <p className={styles.dangerTitle}>Delete this job</p>
          <p className={styles.dangerDescription}>
            Permanently remove this job posting and its applications.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={styles.deleteButton}
          onClick={() => setIsDeleteDialogOpen(true)}>
          Delete Job
        </Button>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete this job?"
        message="Deleted jobs cannot be restored later. This will permanently remove the job posting along with its applications and generated questions."
        confirmLabel="Delete Job"
        variant="danger"
        isConfirming={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}
