import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAdminTalentProfile } from '@/features/admin/hooks/useAdminTalentProfile'
import { useAdminTalentMessaging } from '@/features/messaging/hooks/useAdminTalentMessaging'
import { DisplayMessage } from '@/pages/RecruiterProfile/MyJobPosts/Messaging/DisplayMessage'
import { notify } from '@/utils/toastNotifications'
import { viewCandidateCv } from '@/utils/viewCandidateCv'

import styles from './TalentDetail.module.scss'

const TalentDetail = () => {
  const { talentId } = useParams()
  const navigate = useNavigate()
  const [isLoadingCv, setIsLoadingCv] = useState(false)
  const [messageContent, setMessageContent] = useState('')

  const { talent, isLoading } = useAdminTalentProfile(talentId)

  const {
    messages,
    isLoading: isMessagesLoading,
    sendMessage,
    isSending,
  } = useAdminTalentMessaging(talentId ?? '')

  const handleViewCv = async () => {
    if (!talent) return
    setIsLoadingCv(true)
    try {
      await viewCandidateCv({
        cvUrl: talent.cvUrl,
        talentId: talent.id,
        notFoundMessage: 'This talent has no CV on file',
      })
    } finally {
      setIsLoadingCv(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    try {
      await sendMessage(messageContent)
      setMessageContent('')
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  if (isLoading) return <Spinner fullPage />
  if (!talent) return null

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title={`${talent.firstName} ${talent.lastName}`}
        description={talent.email}
        onBack={() => navigate('/adminDashboard/talents')}
      />

      <PagePanel
        title="Profile"
        action={
          <Button
            variant="outline"
            size="sm"
            loading={isLoadingCv}
            onClick={() => void handleViewCv()}>
            View talent CV
          </Button>
        }>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Experience</span>
            <span className={styles.infoValue}>{talent.experience ?? '—'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Prescreening score</span>
            <span className={styles.infoValue}>
              {talent.prescreeningScore ?? '—'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Role(s)</span>
            <span className={styles.infoValue}>
              {talent.userRoles?.map((role) => role.name).join(', ') || '—'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Location</span>
            <span className={styles.infoValue}>
              {[
                talent.locationCity,
                talent.locationState,
                talent.locationCountry,
              ]
                .filter(Boolean)
                .join(', ') || '—'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Joined</span>
            <span className={styles.infoValue}>
              {new Date(talent.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>CV on file</span>
            <span className={styles.infoValue}>
              {talent.cvFileName ?? (talent.cvUploadedAt ? 'Uploaded' : '—')}
            </span>
          </div>
        </div>
        {talent.bio ? <p className={styles.bio}>{talent.bio}</p> : null}
      </PagePanel>

      <PagePanel title="Message this talent">
        <div className={styles.messages}>
          {isMessagesLoading ? (
            <Spinner />
          ) : (
            <DisplayMessage messages={messages} />
          )}
        </div>
        <div className={styles.composer}>
          <textarea
            className={styles.textarea}
            placeholder="Write a message to this talent…"
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
          />
          <div className={styles.composerActions}>
            <Button
              variant="primary"
              loading={isSending}
              onClick={() => void handleSendMessage()}>
              Send
            </Button>
          </div>
        </div>
      </PagePanel>
    </div>
  )
}

export default TalentDetail
