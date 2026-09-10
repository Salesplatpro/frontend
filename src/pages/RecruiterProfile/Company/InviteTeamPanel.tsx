import React, { useState } from 'react'

import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { MAX_COMPANY_TEAMMATES } from '@/features/organizations/constants/team'
import { useOrganizationInvites } from '@/features/organizations/hooks/useOrganizationInvites'
import { useOrganizationMembers } from '@/features/organizations/hooks/useOrganizationMembers'
import { Organization } from '@/features/organizations/types'

import styles from './InviteTeamPanel.module.scss'

interface InviteTeamPanelProps {
  organization: Organization
}

export const InviteTeamPanel: React.FC<InviteTeamPanelProps> = ({
  organization,
}) => {
  const [email, setEmail] = useState('')
  const {
    invites,
    isLoading,
    sendInvite,
    revokeInvite,
    isSending,
    isRevoking,
  } = useOrganizationInvites(organization.id)
  const { members } = useOrganizationMembers(organization.id)

  const teammateCount = members.filter(
    (member) => member.role !== 'owner',
  ).length
  const pendingCount = invites.length
  const seatsUsed = teammateCount + pendingCount
  const seatsRemaining = Math.max(0, MAX_COMPANY_TEAMMATES - seatsUsed)
  const isFull = seatsRemaining === 0

  const companyDomain =
    organization.domain ??
    organization.email?.split('@')[1] ??
    'your company domain'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || isFull) return
    const sent = await sendInvite(trimmed)
    if (sent) {
      setEmail('')
    }
  }

  return (
    <PagePanel
      title="Invite team"
      hint={`Invite up to ${MAX_COMPANY_TEAMMATES} recruiters in addition to you, the creator. ${seatsRemaining} seat${
        seatsRemaining === 1 ? '' : 's'
      } remaining.`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="invite-email">
          Work email
        </label>
        <div className={styles.row}>
          <input
            id="invite-email"
            name="invite-email"
            type="email"
            autoComplete="email"
            className={styles.input}
            placeholder={`name@${companyDomain}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSending || isFull}
          />
          <Button type="submit" loading={isSending} disabled={isFull}>
            Send invite
          </Button>
        </div>
      </form>

      {isLoading ? (
        <Spinner />
      ) : invites.length === 0 ? (
        <p className={styles.empty}>
          {isFull
            ? `This company already has ${MAX_COMPANY_TEAMMATES} recruiters plus the creator.`
            : 'No pending invites. Send a link to add teammates without waiting for them to request access.'}
        </p>
      ) : (
        <div className={styles.list}>
          {invites.map((invite) => (
            <article key={invite.id} className={styles.card}>
              <div>
                <p className={styles.email}>{invite.email}</p>
                <p className={styles.meta}>
                  Sent{' '}
                  {new Date(invite.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' · '}
                  Expires{' '}
                  {new Date(invite.expiresAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isRevoking}
                onClick={() => revokeInvite(invite.id)}>
                Revoke
              </Button>
            </article>
          ))}
        </div>
      )}
    </PagePanel>
  )
}
