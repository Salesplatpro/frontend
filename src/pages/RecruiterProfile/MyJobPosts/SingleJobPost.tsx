import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import Modal from 'react-responsive-modal'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useBulkUpdateApplicationStatus } from '@/features/applications/hooks/useBulkUpdateApplicationStatus'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { notify } from '@/utils/toastNotifications'

import { calculateDaysFromCreation } from '../../../utils'
import styles from './SingleJobPost.module.scss'
import { SingleJobTable } from './SingleJobTable'

export const SingleJobPost = () => {
  const { jobId } = useParams()
  const { data, error, isLoading, mutate } = useJobApplications(jobId)
  const navigate = useNavigate()
  const location = useLocation()
  const jobName = location.state?.jobName
  const postedAt = location.state?.postedAt
  const applications = data?.data?.applications ?? []

  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set())
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')

  const { bulkUpdateStatus, isBulkUpdating } = useBulkUpdateApplicationStatus()
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()

  const clearSelection = () => setSelectedRowKeys(new Set())

  const handleToggleRow = (key: string | number) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev)
      if (next.has(String(key))) {
        next.delete(String(key))
      } else {
        next.add(String(key))
      }
      return next
    })
  }

  const handleToggleAll = (keys: (string | number)[]) => {
    setSelectedRowKeys(new Set(keys.map(String)))
  }

  const handleBulkStatus = async (status: 'shortlisted' | 'rejected') => {
    try {
      const result = await bulkUpdateStatus({
        applicationIds: Array.from(selectedRowKeys),
        status,
      })
      notify('success', `${result.data.updated} talent(s) ${status}`, {
        autoClose: 2000,
      })
      clearSelection()
      await mutate()
    } catch {
      notify('error', `Failed to update talent statuses`, { autoClose: 2000 })
    }
  }

  const handleSendBulkMessage = async () => {
    if (!messageContent.trim()) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    const [firstApplicationId] = Array.from(selectedRowKeys)
    if (!firstApplicationId) return

    try {
      await sendBroadcast({
        application: firstApplicationId,
        content: messageContent,
        talentIds: applications
          .filter((application) => selectedRowKeys.has(application.id))
          .map((application) => application.talent.id),
      })
      notify('success', 'Message sent to selected talents', { autoClose: 2000 })
      setMessageContent('')
      setIsMessageModalOpen(false)
      clearSelection()
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
        <div>Back</div>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.title}>
          {jobName}
          <span className={styles.applicants}>
            {applications.length || 0}{' '}
            {applications.length > 1 ? 'applicants' : 'applicant'}
          </span>
        </div>
        <div>Posted {calculateDaysFromCreation(postedAt)} days ago</div>
      </div>

      {selectedRowKeys.size > 0 && (
        <div className={styles.bulkBar}>
          <div className={styles.bulkBarCount}>
            {selectedRowKeys.size} selected
          </div>
          <div className={styles.bulkBarActions}>
            <Button
              variant="outline"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => handleBulkStatus('rejected')}>
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isBulkUpdating}
              onClick={() => handleBulkStatus('shortlisted')}>
              Shortlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMessageModalOpen(true)}>
              Message
            </Button>
          </div>
        </div>
      )}

      <SingleJobTable
        applications={applications}
        selectedRowKeys={selectedRowKeys}
        onToggleRow={handleToggleRow}
        onToggleAll={handleToggleAll}
      />

      <Modal
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        center>
        <div>
          <h2 className={styles.modalTitle}>
            Message {selectedRowKeys.size} talent
            {selectedRowKeys.size > 1 ? 's' : ''}
          </h2>
          <textarea
            className={styles.modalTextarea}
            placeholder="Type your message..."
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
          />
          <div className={styles.modalActions}>
            <Button
              variant="outline"
              onClick={() => setIsMessageModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isBroadcasting}
              onClick={handleSendBulkMessage}>
              {isBroadcasting ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
