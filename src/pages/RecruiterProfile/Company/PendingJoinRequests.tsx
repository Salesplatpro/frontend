import React from 'react'

import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useOrganizationJoinRequests } from '@/features/organizations/hooks/useOrganizationJoinRequests'
import { Organization } from '@/features/organizations/types'

import styles from './PendingJoinRequests.module.scss'

interface PendingJoinRequestsProps {
  organization: Organization
}

export const PendingJoinRequests: React.FC<PendingJoinRequestsProps> = ({
  organization,
}) => {
  const { joinRequests, isLoading, approve, reject, isApproving, isRejecting } =
    useOrganizationJoinRequests(organization.id)

  if (isLoading) {
    return (
      <PagePanel
        title="Team join requests"
        hint={`Review recruiters requesting access to ${organization.name}.`}>
        <Spinner />
      </PagePanel>
    )
  }

  return (
    <PagePanel
      title="Team join requests"
      hint={`Approve recruiters whose work email matches @${
        organization.email?.split('@')[1] ?? 'your company domain'
      }.`}>
      {joinRequests.length === 0 ? (
        <p className={styles.empty}>
          No pending join requests. Recruiters with a matching corporate email
          can request to join once your company is verified.
        </p>
      ) : (
        <div className={styles.pendingList}>
          {joinRequests.map((request) => {
            const fullName =
              `${request.user.firstName} ${request.user.lastName}`.trim()
            const isBusy = isApproving || isRejecting

            return (
              <article key={request.id} className={styles.requestCard}>
                <div className={styles.requestMain}>
                  <h3 className={styles.requestName}>
                    {fullName || 'Recruiter'}
                  </h3>
                  <p className={styles.requestMeta}>
                    Requested to join as a team recruiter
                  </p>
                  <div className={styles.requestFacts}>
                    <span>Work email: {request.workEmail}</span>
                    <span>Account: {request.user.email}</span>
                    <span>
                      Requested{' '}
                      {new Date(request.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.requestActions}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => reject(request.id)}>
                    Reject
                  </Button>
                  <Button
                    type="button"
                    loading={isBusy}
                    disabled={isBusy}
                    onClick={() => approve(request.id)}>
                    Approve
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </PagePanel>
  )
}
