import React, { useState } from 'react'
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

const titleCase = (value?: string | null) => {
  if (!value) return '—'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const Company = () => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { organizations, isLoading } = useMyOrganizations()
  const { switchOrganization, isSwitching } = useSwitchOrganization()
  const { deleteOrganization, isDeleting } = useDeleteOrganization()

  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null)

  const activeOrg =
    organizations.find((org) => org.id === profile?.activeOrganizationId) ??
    profile?.activeOrganization ??
    null

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
            ? 'This is the brand candidates will see on new jobs. Create another company if you hire for a different organisation.'
            : 'Create a company to start posting jobs under your brand. You can add more later and switch between them.'
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
            {activeOrg && (
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
              Add your first company so job posts, applications, and candidate
              messages sit under the right brand.
            </p>
            <Button onClick={() => navigate('/recruiterDashboard/company/new')}>
              Create company
            </Button>
          </div>
        ) : (
          <div className={styles.list}>
            {organizations.map((org) => {
              const isActive = org.id === profile?.activeOrganizationId
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
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() =>
                        navigate(`/recruiterDashboard/company/${org.id}/edit`)
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
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </PagePanel>

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
