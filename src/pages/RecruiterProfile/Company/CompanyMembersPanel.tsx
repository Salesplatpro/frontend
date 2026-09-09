import React from 'react'

import { PagePanel } from '@/components/layout/PagePanel'
import { Spinner } from '@/components/ui/Spinner'
import { MAX_COMPANY_TEAMMATES } from '@/features/organizations/constants/team'
import { useOrganizationMembers } from '@/features/organizations/hooks/useOrganizationMembers'
import { Organization } from '@/features/organizations/types'

import styles from './CompanyMembersPanel.module.scss'

interface CompanyMembersPanelProps {
  organization: Organization
}

const roleLabel = (role: string) => (role === 'owner' ? 'Creator' : 'Recruiter')

export const CompanyMembersPanel: React.FC<CompanyMembersPanelProps> = ({
  organization,
}) => {
  const { members, isLoading } = useOrganizationMembers(organization.id)

  if (isLoading) {
    return (
      <PagePanel
        title="Team"
        hint={`People who belong to ${organization.name}.`}>
        <Spinner />
      </PagePanel>
    )
  }

  return (
    <PagePanel
      title="Team"
      hint={`The creator plus up to ${MAX_COMPANY_TEAMMATES} recruiters in ${organization.name}.`}>
      {members.length === 0 ? (
        <p className={styles.empty}>
          No one is on this company yet. Invite a recruiter to add them here.
        </p>
      ) : (
        <div className={styles.list}>
          {members.map((member) => {
            const fullName =
              `${member.user.firstName} ${member.user.lastName}`.trim()
            return (
              <article key={member.id} className={styles.card}>
                <div>
                  <div className={styles.nameRow}>
                    <p className={styles.name}>{fullName || 'Recruiter'}</p>
                    <span
                      className={
                        member.role === 'owner'
                          ? styles.ownerChip
                          : styles.memberChip
                      }>
                      {roleLabel(member.role)}
                    </span>
                  </div>
                  <p className={styles.meta}>
                    {member.user.email}
                    {member.workEmail && member.workEmail !== member.user.email
                      ? ` · Work email ${member.workEmail}`
                      : ''}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </PagePanel>
  )
}
