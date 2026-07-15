import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

import FilterByJobs from '@/components/features/jobs/Filter/FilterByJobs'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Heading, Text } from '@/components/ui/Typography'

import profilePics from '../../../assets/profilePics2.webp'
import { useFetchDashboardQuery } from '../../../redux/api/recruiter'
import styles from './RecentCompilation.module.scss'

interface CompilationTypes {
  applicantName: string
  role: string
  cvSimilarityScore: string
  prescreeningScore: string
  personalizedAss: string
  mbtiType: string
}

const METRICS: {
  key: keyof CompilationTypes
  label: string
  isScore?: boolean
}[] = [
  { key: 'cvSimilarityScore', label: 'CV Matching', isScore: true },
  { key: 'prescreeningScore', label: 'Prescreening', isScore: true },
  { key: 'personalizedAss', label: 'Personalised Ass', isScore: true },
  { key: 'mbtiType', label: 'Personality Ass' },
]

const RecentCompilation = () => {
  const [jobId, setJobId] = useState<string | null>(null)
  const [infoData, setInfoData] = useState<CompilationTypes[]>([])

  // Fetching data based on selected jobId
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useFetchDashboardQuery(jobId ? { jobId } : {})

  // Update the state with the fetched data
  useEffect(() => {
    if (dashboardData?.data?.data?.recentCompilations) {
      setInfoData(dashboardData.data.data.recentCompilations)
    }
  }, [dashboardData])

  // Handle filter selection
  const handleFilter = (selectedJobId: string) => {
    setJobId(selectedJobId)
  }

  return (
    <div>
      <div className={styles.header}>
        <Heading level={4}>Recent Compilation</Heading>
        <FilterByJobs onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <Spinner fullPage />
      ) : error ? (
        <Alert severity="error">Error Fetching Data</Alert>
      ) : infoData.length === 0 ? (
        <EmptyState
          title="No compilations yet"
          description="Applicant compilations will show up here once available."
        />
      ) : (
        <div className={styles.list}>
          {infoData.map((row, index) => (
            <Card key={index} className={styles.row}>
              <div className={styles.applicant}>
                <img src={profilePics} alt="avatar" className={styles.avatar} />
                <div>
                  <Text size="fs-md" weight="bolder">
                    {row.applicantName}
                  </Text>
                  <Text size="fs-sm" color="secondary">
                    {row.role}
                  </Text>
                </div>
              </div>

              <div className={styles.metrics}>
                {METRICS.map((metric) => (
                  <div key={metric.key} className={styles.metricRow}>
                    <Text size="fs-sm" color="secondary">
                      {metric.label}
                    </Text>
                    <Text size="fs-sm" weight="bolder">
                      {metric.isScore
                        ? `score ${row[metric.key] || 'nill'}`
                        : row[metric.key] || 'nill'}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentCompilation
