import React, { useState } from 'react'

import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useOrganizationInvites } from '@/features/organizations/hooks/useOrganizationInvites'
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

  const companyDomain =
    organization.email?.split('@')[1] ?? 'your company domain'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    const sent = await sendInvite(trimmed)
    if (sent) {
      setEmail('')
    }
  }

  if (isLoading) {
    return (
      <PagePanel
        title="Invite team"
        hint={`Send a join link to colleagues with an @${companyDomain} email.`}>
        <Spinner />
      </PagePanel>
    )
  }

  return (
    <PagePanel
      title="Invite team"
      hint={`Invite recruiters by email. They must sign up with an @${companyDomain} address to join ${organization.name}.`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="invite-email">
          Work email
        </label>
        <div className={styles.row}>
          <input
            id="invite-email"
            type="email"
            className={styles.input}
            placeholder={`name@${companyDomain}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSending}
          />
          <Button type="submit" loading={isSending}>
            Send invite
          </Button>
        </div>
      </form>

      {invites.length === 0 ? (
        <p className={styles.empty}>
          No pending invites. Send a link to add teammates without waiting for
          them to request access.
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
