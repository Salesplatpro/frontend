import React, { useState } from 'react'
import { BsBuilding } from 'react-icons/bs'
import { FiDownload } from 'react-icons/fi'
import {
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCreditCard,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { getEmailVerificationBadge } from '@/features/email-verification/utils/getEmailVerificationBadge'
import { useMyOrganizations } from '@/features/organizations/hooks/useMyOrganizations'
import { Organization } from '@/features/organizations/types'
import { getOrganizationStatusBadge } from '@/features/organizations/utils/getOrganizationStatusBadge'
import { getBillingPlanBadge } from '@/features/pricing/utils/getBillingPlanBadge'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getStatusBadge } from '@/pages/RecruiterProfile/getJobStatus'
import {
  useFetchDashboardQuery,
  useFetchRecruiterJobPostQuery,
  useGetScoutJobsQuery,
} from '@/redux/api/recruiter'
import { recruiterJobPostsTypes } from '@/utils/recruiterJobPostsTypes'

import styles from './Profile.module.scss'

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const titleCase = (value?: string | null) => {
  if (!value) return '—'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const CompanyMark: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const [failed, setFailed] = useState(false)
  if (!organization.logoUrl || failed) {
    return (
      <div className={styles.companyLogoFallback}>
        <BsBuilding size={20} />
      </div>
    )
  }
  return (
    <img
      src={organization.logoUrl}
      alt=""
      className={styles.companyLogo}
      onError={() => setFailed(true)}
    />
  )
}

export const Profile = () => {
  const { profile, isLoading: isProfileLoading } = useProfile()
  const { organizations, isLoading: isOrgsLoading } = useMyOrganizations()
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useFetchDashboardQuery({})
  const { data: jobsData, isLoading: isJobsLoading } =
    useFetchRecruiterJobPostQuery({ limit: 50 })
  const { data: scoutData, isLoading: isScoutLoading } = useGetScoutJobsQuery({
    limit: 100,
    offset: 0,
  })

  if (isProfileLoading) {
    return <Spinner fullPage />
  }

  const stats = dashboardData?.data?.data
  const jobPosts: recruiterJobPostsTypes[] = Array.isArray(jobsData?.data)
    ? jobsData.data
    : Array.isArray(jobsData?.data?.jobs)
    ? jobsData.data.jobs
    : []
  const scoutJobs = Array.isArray(scoutData?.data?.scoutJobs)
    ? scoutData.data.scoutJobs
    : []

  const fullName = `${profile?.firstName ?? ''} ${
    profile?.lastName ?? ''
  }`.trim()
  const location = [profile?.country, profile?.locationCity]
    .filter(Boolean)
    .join(' · ')
  const activeOrg =
    organizations.find((org) => org.id === profile?.activeOrganizationId) ??
    profile?.activeOrganization ??
    null
  const verificationBadge = getEmailVerificationBadge(profile?.emailVerifiedAt)
  const planBadge = getBillingPlanBadge(profile?.billingPlan)
  const isPaid = profile?.billingPlan === 'paid'
  const orgBadge = activeOrg
    ? getOrganizationStatusBadge(activeOrg.status)
    : null

  const tiles = [
    {
      label: 'Job posts',
      value: isJobsLoading ? '—' : jobPosts.length,
      icon: <HiOutlineBriefcase size={18} />,
    },
    {
      label: 'Scout campaigns',
      value: isScoutLoading ? '—' : scoutJobs.length,
      icon: <FiDownload size={18} />,
    },
    {
      label: 'Applications',
      value: isDashboardLoading ? '—' : stats?.applicationsCount ?? 0,
      icon: <HiOutlineUserGroup size={18} />,
    },
    {
      label: 'Shortlisted',
      value: isDashboardLoading ? '—' : stats?.shortlistCount ?? 0,
      icon: <HiOutlineChartBar size={18} />,
    },
    {
      label: 'Pipeline completion',
      value: isDashboardLoading ? '—' : `${stats?.completionRatio ?? 0}%`,
      icon: <HiOutlineChartBar size={18} />,
    },
    {
      label: 'Companies',
      value: isOrgsLoading ? '—' : organizations.length,
      icon: <HiOutlineOfficeBuilding size={18} />,
    },
  ]

  const details = [
    { label: 'Email', value: profile?.email ?? '—' },
    { label: 'Account role', value: 'Recruiter' },
    { label: 'Location', value: location || '—' },
    { label: 'Member since', value: formatDate(profile?.createdAt) },
    {
      label: 'Account status',
      value: profile?.active === false ? 'Inactive' : 'Active',
    },
    {
      label: 'Billing interval',
      value: isPaid ? titleCase(profile?.billingInterval) : 'Not subscribed',
    },
    { label: 'Billing status', value: titleCase(profile?.billingStatus) },
    { label: 'Last updated', value: formatDate(profile?.updatedAt) },
  ]

  const recentJobs = jobPosts.slice(0, 4)
  const recentScouts = scoutJobs.slice(0, 4)

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title="My Profile"
        description="Your recruiter identity, hiring activity, and workspace at a glance"
      />

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroTop}>
          <div className={styles.identity}>
            <div className={styles.avatarRing}>
              <Avatar
                firstName={profile?.firstName}
                lastName={profile?.lastName}
                size="lg"
              />
            </div>
            <div className={styles.heroCopy}>
              <h1>{fullName || 'Recruiter'}</h1>
              <p className={styles.roleLine}>
                Hiring on Auxhr
                {activeOrg?.name ? ` for ${activeOrg.name}` : ''}
              </p>
              <div className={styles.heroPills}>
                <StatusBadge {...verificationBadge} showDot />
                <StatusBadge
                  status={isPaid ? 'Paid plan' : planBadge.status}
                  backgroundColor={planBadge.backgroundColor}
                  color={planBadge.color}
                  showDot
                />
              </div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.actionBtn} to="/recruiterDashboard/plan">
              <HiOutlineCreditCard size={16} />
              Plan & billing
            </Link>
            <Link className={styles.ghostBtn} to="/recruiterDashboard/company">
              <HiOutlineOfficeBuilding size={16} />
              Companies
            </Link>
            <Link className={styles.ghostBtn} to="/recruiterDashboard/postjob">
              <HiOutlineBriefcase size={16} />
              Post a job
            </Link>
          </div>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Workspace</span>
            <span className={styles.metaValue}>
              {activeOrg?.name ?? 'No active company'}
            </span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Email</span>
            <span className={styles.metaValue}>{profile?.email ?? '—'}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Joined</span>
            <span className={styles.metaValue}>
              {formatDate(profile?.createdAt)}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.statsGrid}>
        {tiles.map((tile) => (
          <div key={tile.label} className={styles.statCard}>
            <span className={styles.statIcon}>{tile.icon}</span>
            <span className={styles.statValue}>{tile.value}</span>
            <span className={styles.statLabel}>{tile.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.columns}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Account details</h2>
          </div>
          <div className={styles.detailGrid}>
            {details.map((item) => (
              <div key={item.label} className={styles.detailItem}>
                <span className={styles.detailLabel}>{item.label}</span>
                <span className={styles.detailValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Active company</h2>
            <Link className={styles.panelLink} to="/recruiterDashboard/company">
              Manage
            </Link>
          </div>
          {activeOrg ? (
            <div className={styles.companyCard}>
              <CompanyMark organization={activeOrg} />
              <div>
                <p className={styles.companyName}>{activeOrg.name}</p>
                <p className={styles.companyMeta}>
                  {activeOrg.industry || 'Industry not set'}
                  {activeOrg.address ? ` · ${activeOrg.address}` : ''}
                </p>
                {orgBadge && (
                  <StatusBadge
                    status={titleCase(activeOrg.status)}
                    backgroundColor={orgBadge.backgroundColor}
                    color={orgBadge.color}
                    showDot
                  />
                )}
                <div className={styles.companyFacts}>
                  {activeOrg.email && <span>{activeOrg.email}</span>}
                  {activeOrg.website && <span>{activeOrg.website}</span>}
                  {activeOrg.phone && <span>{activeOrg.phone}</span>}
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.empty}>
              You have not selected an active company yet. Create one to post
              jobs under your brand.
            </p>
          )}
        </section>
      </div>

      <div className={styles.columns}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent job posts</h2>
            <Link
              className={styles.panelLink}
              to="/recruiterDashboard/myJobPosts">
              View all
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className={styles.empty}>No job posts yet.</p>
          ) : (
            <div className={styles.list}>
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  className={styles.listRow}
                  to={`/recruiterDashboard/singleJobPost/${job.id}`}>
                  <div>
                    <p className={styles.listTitle}>
                      {job.role?.name ?? 'Untitled role'}
                    </p>
                    <p className={styles.listSub}>
                      {job.organization?.name ?? 'Company'}
                      {' · '}
                      {job.noOfApplicants ?? 0} applicants
                      {' · '}
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    status={titleCase(job.status ?? 'draft')}
                    {...getStatusBadge(job.status ?? 'draft')}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Scout campaigns</h2>
            <Link className={styles.panelLink} to="/recruiterDashboard/scout">
              View all
            </Link>
          </div>
          {recentScouts.length === 0 ? (
            <p className={styles.empty}>No scout campaigns yet.</p>
          ) : (
            <div className={styles.list}>
              {recentScouts.map(
                (scout: {
                  id: string
                  name?: string
                  role?: { name?: string } | null
                  createdAt?: string
                }) => (
                  <Link
                    key={scout.id}
                    className={styles.listRow}
                    to={`/recruiterDashboard/scout/${scout.id}`}>
                    <div>
                      <p className={styles.listTitle}>
                        {scout.name || scout.role?.name || 'Scout campaign'}
                      </p>
                      <p className={styles.listSub}>
                        Created {formatDate(scout.createdAt)}
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
