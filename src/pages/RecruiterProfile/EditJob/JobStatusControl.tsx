import React, { useState } from 'react'
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
}

export const JobStatusControl = ({ jobId, status }: JobStatusControlProps) => {
  const navigate = useNavigate()
  const [selectedStatus, setSelectedStatus] = useState(status)
  const [updateJob, { isLoading: isUpdatingStatus }] = useUpdateJobMutation()
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleUpdateStatus = async () => {
    try {
      await updateJob({ jobId, data: { status: selectedStatus } }).unwrap()
      notify('success', 'Job status updated')
    } catch (err) {
      const apiMessage = getErrorMessage(err, 'Failed to update job status')
      notify('error', apiMessage)
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
            options={JOB_STATUS_OPTIONS}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
        <StatusBadge
          status={selectedStatus}
          {...getStatusBadge(selectedStatus)}
        />
        <Button
          type="button"
          variant="primary"
          size="sm"
          loading={isUpdatingStatus}
          disabled={selectedStatus === status}
          onClick={() => void handleUpdateStatus()}>
          Update Status
        </Button>
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
