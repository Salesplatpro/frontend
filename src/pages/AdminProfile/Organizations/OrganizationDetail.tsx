import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Text } from '@/components/ui/Typography'
import {
  deleteAdminOrganization,
  fetchAdminOrganization,
  rejectAdminOrganization,
  verifyAdminOrganization,
} from '@/features/admin/services/adminService'
import { AdminOrganization } from '@/features/admin/types'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import styles from './OrganizationDetail.module.scss'

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <Text size="fs-sm" color="secondary">
      {label}
    </Text>
    <Text size="fs-md">{value || '—'}</Text>
  </div>
)

const OrganizationDetail = () => {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const [organization, setOrganization] = useState<AdminOrganization | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const load = useCallback(async () => {
    if (!organizationId) return
    setIsLoading(true)
    try {
      const data = await fetchAdminOrganization(organizationId)
      setOrganization(data)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to load organization'))
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    void load()
  }, [load])

  const handleVerify = async () => {
    if (!organizationId) return
    setIsUpdating(true)
    try {
      await verifyAdminOrganization(organizationId)
      notify('success', 'Organization verified')
      await load()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to verify organization'))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!organizationId) return
    setIsUpdating(true)
    try {
      await rejectAdminOrganization(organizationId)
      notify('success', 'Organization rejected')
      await load()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to reject organization'))
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!organizationId || !organization) return
    setIsDeleting(true)
    try {
      await deleteAdminOrganization(organizationId)
      notify('success', `${organization.name} permanently deleted`)
      setConfirmDelete(false)
      navigate('/adminDashboard/organizations')
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to delete organization'))
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (!organization) {
    return null
  }

  return (
    <div className="flex flex-col space-y-6">
      <PageHeaderTitle
        title={organization.name}
        description="Verify this company against the email, website, and social details the recruiter provided."
        onBack={() => navigate('/adminDashboard/organizations')}
      />

      <Card className="max-w-[700px] p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <StatusBadge
            status={organization.status}
            {...getOrganizationStatusBadge(organization.status)}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={organization.status === 'verified' || isUpdating}
              onClick={handleVerify}>
              Verify
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={organization.status === 'rejected' || isUpdating}
              onClick={handleReject}>
              Reject
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isUpdating || isDeleting}
              onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Owner"
            value={
              organization.owner
                ? `${organization.owner.firstName} ${organization.owner.lastName} (${organization.owner.email})`
                : '—'
            }
          />
          <Field label="Email" value={organization.email ?? ''} />
          <Field label="Phone" value={organization.phone ?? ''} />
          <Field label="Industry" value={organization.industry ?? ''} />
          <Field label="Website" value={organization.website ?? ''} />
          <Field label="LinkedIn" value={organization.linkedin ?? ''} />
          <Field label="Twitter" value={organization.twitter ?? ''} />
          <Field label="Facebook" value={organization.facebook ?? ''} />
          <Field label="Address" value={organization.address ?? ''} />
          <Field
            label="Submitted"
            value={new Date(organization.createdAt).toLocaleDateString()}
          />
          <Field
            label="Verified at"
            value={
              organization.verifiedAt
                ? new Date(organization.verifiedAt).toLocaleDateString()
                : ''
            }
          />
        </div>
      </Card>

      <Card className="max-w-[700px] p-6 flex flex-col space-y-4">
        <div>
          <Text size="fs-lg" weight="bold">
            Team
          </Text>
          <Text size="fs-sm" color="secondary">
            The company creator and recruiters who belong to this company.
          </Text>
        </div>
        {(organization.members ?? []).length === 0 && !organization.owner ? (
          <Text size="fs-sm" color="secondary">
            No team members recorded for this company.
          </Text>
        ) : (organization.members ?? []).length === 0 && organization.owner ? (
          <article className={styles.member}>
            <div>
              <p className={styles.memberName}>
                {`${organization.owner.firstName} ${organization.owner.lastName}`.trim() ||
                  'Creator'}
              </p>
              <p className={styles.memberEmail}>{organization.owner.email}</p>
            </div>
            <span className={styles.ownerChip}>Creator</span>
          </article>
        ) : (
          <div className={styles.list}>
            {(organization.members ?? []).map((member) => {
              const fullName =
                `${member.user.firstName} ${member.user.lastName}`.trim()
              const isOwner = member.role === 'owner'
              return (
                <article key={member.id} className={styles.member}>
                  <div>
                    <p className={styles.memberName}>
                      {fullName || (isOwner ? 'Creator' : 'Recruiter')}
                    </p>
                    <p className={styles.memberEmail}>
                      {member.user.email}
                      {member.workEmail &&
                      member.workEmail !== member.user.email
                        ? ` · ${member.workEmail}`
                        : ''}
                    </p>
                  </div>
                  <span
                    className={isOwner ? styles.ownerChip : styles.memberChip}>
                    {isOwner ? 'Creator' : 'Recruiter'}
                  </span>
                </article>
              )
            })}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Permanently delete this company?"
        message={`Deleting "${organization.name}" removes the company, every job posted under it, and team memberships. Recruiter accounts are not deleted. This cannot be undone.`}
        confirmLabel="Delete company"
        variant="danger"
        isConfirming={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}

export default OrganizationDetail
