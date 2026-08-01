import React from 'react'
import { CgProfile } from 'react-icons/cg'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Heading, Text } from '@/components/ui/Typography'
import { useProfile } from '@/features/profile/hooks/useProfile'
import {
  useFetchDashboardQuery,
  useFetchRecruiterJobPostQuery,
  useGetScoutJobsQuery,
} from '@/redux/api/recruiter'

export const Profile = () => {
  const { profile, isLoading: isProfileLoading } = useProfile()
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useFetchDashboardQuery({})
  const { data: jobsData, isLoading: isJobsLoading } =
    useFetchRecruiterJobPostQuery({})
  const { data: scoutData, isLoading: isScoutLoading } = useGetScoutJobsQuery({
    limit: 100,
    offset: 0,
  })

  const isLoading =
    isProfileLoading || isDashboardLoading || isJobsLoading || isScoutLoading

  if (isLoading) {
    return <Spinner fullPage />
  }

  const stats = dashboardData?.data?.data
  const jobPosts = Array.isArray(jobsData?.data)
    ? jobsData.data
    : Array.isArray(jobsData?.data?.jobs)
    ? jobsData.data.jobs
    : []
  const scoutJobs = Array.isArray(scoutData?.data?.scoutJobs)
    ? scoutData.data.scoutJobs
    : []

  const fields: { label: string; value: string }[] = [
    { label: 'Company', value: profile?.organization?.name ?? 'Not linked' },
    {
      label: 'Industry',
      value: profile?.organization?.industry ?? '—',
    },
    { label: 'Email', value: profile?.email ?? '—' },
    { label: 'Phone', value: profile?.phone ?? '—' },
    { label: 'Location', value: profile?.country ?? '—' },
    {
      label: 'Member Since',
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : '—',
    },
  ]

  const tiles = [
    { label: 'Job Posts', value: jobPosts.length },
    { label: 'Scout Campaigns', value: scoutJobs.length },
    { label: 'Applications Received', value: stats?.applicationsCount ?? 0 },
    { label: 'Shortlisted', value: stats?.shortlistCount ?? 0 },
    { label: 'Completion Ratio', value: `${stats?.completionRatio ?? 0}%` },
  ]

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Profile"
        description="Your recruiter account information"
      />
      <Card className="max-w-[600px] p-6 flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <CgProfile size={64} />
          )}
          <div>
            <Heading level={3}>
              {profile?.firstName} {profile?.lastName}
            </Heading>
            <Text size="fs-sm" color="secondary">
              {profile?.email}
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col">
              <Text size="fs-sm" color="secondary">
                {field.label}
              </Text>
              <Text size="fs-md">{field.value}</Text>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-[900px]">
        {tiles.map((tile) => (
          <Card key={tile.label} className="flex flex-col gap-1 p-4">
            <Text size="fs-sm" color="secondary">
              {tile.label}
            </Text>
            <Text size="fs-2xl" weight="bolder">
              {tile.value}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  )
}
