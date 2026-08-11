import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsBuilding } from 'react-icons/bs'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Text } from '@/components/ui/Typography'
import { useDeleteOrganization } from '@/features/organizations/hooks/useDeleteOrganization'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { useSwitchOrganization } from '@/features/organizations/hooks/useSwitchOrganization'
import { Organization } from '@/features/organizations/types'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'

const CompanyLogo: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const [failed, setFailed] = useState(false)

  if (!organization.logoUrl || failed) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded bg-grey-100 text-grey-600 shrink-0">
        <BsBuilding size={18} />
      </div>
    )
  }

  return (
    <img
      src={organization.logoUrl}
      alt={`${organization.name} logo`}
      onError={() => setFailed(true)}
      className="w-10 h-10 rounded object-contain bg-grey-100 shrink-0"
    />
  )
}

const Company = () => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { organizations, isLoading } = useMyOrganizations()
  const { switchOrganization, isSwitching } = useSwitchOrganization()
  const { deleteOrganization, isDeleting } = useDeleteOrganization()

  const [pendingDelete, setPendingDelete] = useState<Organization | null>(null)

  const handleDelete = async () => {
    if (!pendingDelete) return
    const removed = await deleteOrganization(pendingDelete.id)
    if (removed) {
      setPendingDelete(null)
    }
  }

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Companies"
        description="Manage the companies you post jobs for. Every job you create belongs to whichever company you're currently on."
      />

      <Card className="max-w-[900px] p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Text size="fs-md" weight="bolder">
            Your companies
          </Text>
          <Button
            size="sm"
            icon={<AiOutlinePlus size={16} />}
            onClick={() => navigate('/recruiterDashboard/company/new')}>
            Create company
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : organizations.length === 0 ? (
          <EmptyState
            title="No companies yet"
            description="Create a company to start posting jobs."
            icon={<BsBuilding size={28} />}
            action={
              <Button
                onClick={() => navigate('/recruiterDashboard/company/new')}>
                Create company
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col space-y-3">
            {organizations.map((org) => {
              const isActive = org.id === profile?.activeOrganizationId
              return (
                <div
                  key={org.id}
                  className="flex flex-wrap items-center justify-between gap-4 border border-grey-200 rounded p-3">
                  <div className="flex items-center space-x-3">
                    <CompanyLogo organization={org} />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-3">
                        <Text size="fs-md" weight="bolder">
                          {org.name}
                        </Text>
                        <StatusBadge
                          status={org.status}
                          {...getOrganizationStatusBadge(org.status)}
                        />
                      </div>
                      {org.industry && (
                        <Text size="fs-sm" color="secondary">
                          {org.industry}
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Text size="fs-sm" color="secondary">
                        Active
                      </Text>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={isSwitching}
                        onClick={() => switchOrganization(org.id)}>
                        Switch to this company
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FiEdit2 size={14} />}
                      onClick={() =>
                        navigate(`/recruiterDashboard/company/${org.id}/edit`)
                      }>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FiTrash2 size={14} />}
                      onClick={() => setPendingDelete(org)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

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
    </div>
  )
}

export default Company
