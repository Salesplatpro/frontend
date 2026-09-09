import React, { useMemo, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsBuilding } from 'react-icons/bs'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { HeroAction, HeroGhost, PageHero } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useDeleteOrganization } from '@/features/organizations/hooks/useDeleteOrganization'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { useSwitchOrganization } from '@/features/organizations/hooks/useSwitchOrganization'
import { Organization } from '@/features/organizations/types'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './Company.module.scss'
import { CompanyLogo } from './CompanyLogo'
import { JoinCompanyModal } from './JoinCompanyModal'
import { PendingJoinRequests } from './PendingJoinRequests'

const titleCase = (value?: string | null) => {
  if (!value) return '—'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const isPublicEmailDomain = (email?: string | null) => {
  const domain = email?.split('@')[1]?.toLowerCase() ?? ''
  const publicDomains = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
  ])
  return publicDomains.has(domain)
}

const Company = () => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { organizations, isLoading } = useMyOrganizations()
  const { switchOrganization, isSwitching } = useSwitchOrganization()
  const { deleteOrganization, isDeleting } = useDeleteOrganization()

  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  const activeOrg =
    organizations.find((org) => org.id === profile?.activeOrganizationId) ??
    profile?.activeOrganization ??
    null

  const ownedOrganizations = useMemo(
    () => organizations.filter((org) => org.ownerId === profile?.id),
    [organizations, profile?.id],
  )

  const joinReviewOrg = useMemo(() => {
    const verifiedOwned = ownedOrganizations.filter(
      (org) =>
        org.status === 'verified' &&
        org.email &&
        !isPublicEmailDomain(org.email),
    )
    if (activeOrg && verifiedOwned.some((org) => org.id === activeOrg.id)) {
      return activeOrg
    }
    return verifiedOwned[0] ?? null
  }, [ownedOrganizations, activeOrg])

  const handleDelete = async () => {
    if (!pendingDelete) return
    const removed = await deleteOrganization(pendingDelete.id)
    if (removed) {
      setPendingDelete(null)
    }
  }

  return (
    <PageShell>
      <PageHero
        identity={
          activeOrg ? (
            <CompanyLogo
              name={activeOrg.name}
              logoUrl={activeOrg.logoUrl}
              size="lg"
              onDark
            />
          ) : (
            <CompanyLogo name="Company" size="lg" onDark />
          )
        }
        title={activeOrg?.name ?? 'No active company'}
        lead={
          activeOrg
            ? 'This is the brand candidates will see on new jobs. Create another company or join a verified team with a matching corporate email.'
            : 'Create a company or join a verified team to start posting jobs under your brand.'
        }
        pills={
          activeOrg ? (
            <StatusBadge
              status={titleCase(activeOrg.status)}
              {...getOrganizationStatusBadge(activeOrg.status)}
              showDot
            />
          ) : undefined
        }
        actions={
          <>
            <HeroAction
              onClick={() => navigate('/recruiterDashboard/company/new')}>
              <AiOutlinePlus size={16} />
              Create company
            </HeroAction>
            <HeroGhost onClick={() => setIsJoinModalOpen(true)}>
              <BsBuilding size={14} />
              Join company
            </HeroGhost>
            {activeOrg && activeOrg.ownerId === profile?.id && (
              <HeroGhost
                onClick={() =>
                  navigate(`/recruiterDashboard/company/${activeOrg.id}/edit`)
                }>
                <FiEdit2 size={14} />
                Edit details
              </HeroGhost>
            )}
          </>
        }
        meta={[
          {
            label: 'Active workspace',
            value: activeOrg?.name ?? 'Not selected',
          },
          { label: 'Industry', value: activeOrg?.industry || 'Not set' },
          { label: 'Companies', value: organizations.length },
        ]}
      />

      {joinReviewOrg && <PendingJoinRequests organization={joinReviewOrg} />}

      <PagePanel
        title="Your companies"
        hint="Switch to the company you want jobs to belong to, then post or edit as usual.">
        {isLoading ? (
          <Spinner />
        ) : organizations.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <BsBuilding size={24} />
            </div>
            <p className={styles.emptyTitle}>No companies yet</p>
            <p className={styles.emptyCopy}>
              Add your first company or join a verified team with a matching
              corporate email so job posts, applications, and candidate messages
              sit under the right brand.
            </p>
            <div className={styles.emptyActions}>
              <Button
                onClick={() => navigate('/recruiterDashboard/company/new')}>
                Create company
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsJoinModalOpen(true)}>
                Join company
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {organizations.map((org) => {
              const isActive = org.id === profile?.activeOrganizationId
              const isOwner = org.ownerId === profile?.id
              return (
                <article
                  key={org.id}
                  className={`${styles.card} ${
                    isActive ? styles.cardActive : ''
                  }`}>
                  <div className={styles.cardMain}>
                    <CompanyLogo name={org.name} logoUrl={org.logoUrl} />
                    <div className={styles.cardBody}>
                      <div className={styles.nameRow}>
                        <h3 className={styles.name}>{org.name}</h3>
                        {isActive && (
                          <span className={styles.activeChip}>Working as</span>
                        )}
                        {!isOwner && (
                          <span className={styles.memberChip}>Team member</span>
                        )}
                        <StatusBadge
                          status={titleCase(org.status)}
                          {...getOrganizationStatusBadge(org.status)}
                        />
                      </div>
                      <p className={styles.meta}>
                        {org.industry || 'Industry not set'}
                        {org.address ? ` · ${org.address}` : ''}
                      </p>
                      <div className={styles.facts}>
                        {org.email && <span>{org.email}</span>}
                        {org.website && <span>{org.website}</span>}
                        {org.phone && <span>{org.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    {!isActive && (
                      <button
                        type="button"
                        className={styles.switchBtn}
                        disabled={isSwitching}
                        onClick={() => switchOrganization(org.id)}>
                        Work as this company
                      </button>
                    )}
                    {isOwner && (
                      <>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() =>
                            navigate(
                              `/recruiterDashboard/company/${org.id}/edit`,
                            )
                          }>
                          <FiEdit2 size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setPendingDelete(org)}>
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </PagePanel>

      <JoinCompanyModal
        open={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        variant="danger"
        title={`Delete ${pendingDelete?.name ?? 'company'}?`}
        message="This permanently deletes the company along with every job posted under it, and all applications, assessments and messages on those jobs. This cannot be undone."
        confirmLabel="Delete company"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </PageShell>
  )
}

export default Company
