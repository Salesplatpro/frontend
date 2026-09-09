import React, { useState } from 'react'

import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useOrganizationInvites } from '@/features/organizations/hooks/useOrganizationInvites'
import { Organization } from '@/features/organizations/types'
import { isPublicEmailDomain } from '@/features/organizations/utils/emailDomain'

import styles from './InviteTeamPanel.module.scss'

interface InviteTeamPanelProps {
  organization: Organization
}

export const InviteTeamPanel: React.FC<InviteTeamPanelProps> = ({
  organization,
}) => {
  const companyDomain =
    organization.email?.split('@')[1] ?? 'your company domain'
  const canInvite = Boolean(
    organization.email && !isPublicEmailDomain(organization.email),
  )

  const [email, setEmail] = useState('')
  const {
    invites,
    isLoading,
    sendInvite,
    revokeInvite,
    isSending,
    isRevoking,
  } = useOrganizationInvites(canInvite ? organization.id : null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canInvite) return
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
      hint={
        canInvite
          ? `Invite recruiters by email. They must sign up with an @${companyDomain} address to join ${organization.name}.`
          : `Add a corporate work email to ${organization.name} to send join links from here.`
      }>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="invite-email">
          Work email
        </label>
        <div className={styles.row}>
          <input
            id="invite-email"
            type="email"
            className={styles.input}
            placeholder={
              canInvite
                ? `name@${companyDomain}`
                : 'Add a company work email to send invites'
            }
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSending || !canInvite}
          />
          <Button type="submit" loading={isSending} disabled={!canInvite}>
            Send invite
          </Button>
        </div>
      </form>
      {!canInvite && (
        <p className={styles.empty}>
          Invites need a corporate company email (not Gmail, Yahoo, or similar).
          Edit the company details, then you can send a join link from here.
        </p>
      )}

      {canInvite &&
        (invites.length === 0 ? (
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
        ))}
    </PagePanel>
  )
}
