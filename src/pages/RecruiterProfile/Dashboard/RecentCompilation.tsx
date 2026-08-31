import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FilterByJobs from '@/components/features/jobs/Filter/FilterByJobs'
import { PagePanel } from '@/components/layout/PagePanel'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

import { useFetchDashboardQuery } from '../../../redux/api/recruiter'
import styles from './RecentCompilation.module.scss'

interface CompilationTypes {
  applicantName: string
  role: string
  cvSimilarityScore: number | string | null
  prescreeningScore: number | string | null
  personalizedScore?: number | string | null
  personalizedAss?: number | string | null
  mbtiType: string | null
}

const METRICS: {
  key: keyof CompilationTypes
  label: string
  isScore?: boolean
}[] = [
  { key: 'cvSimilarityScore', label: 'CV match', isScore: true },
  { key: 'prescreeningScore', label: 'Prescreening', isScore: true },
  { key: 'personalizedScore', label: 'Personalised', isScore: true },
  { key: 'mbtiType', label: 'Personality', isScore: false },
]

const parseScore = (value?: number | string | null) => {
  if (value == null || value === '') return null
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  const normalized = String(value).trim().toLowerCase()
  if (normalized === 'nill' || normalized === 'null' || normalized === '—') {
    return null
  }
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numeric) ? numeric : null
}

const scoreTone = (score: number | null) => {
  if (score == null) return styles.toneMuted
  if (score >= 75) return styles.toneStrong
  if (score >= 50) return styles.toneMid
  return styles.toneLow
}

const RecentCompilation = () => {
  const navigate = useNavigate()
  const [jobId, setJobId] = useState<string | null>(null)
  const [infoData, setInfoData] = useState<CompilationTypes[]>([])

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useFetchDashboardQuery(jobId ? { jobId } : {})

  useEffect(() => {
    if (dashboardData?.data?.data?.recentCompilations) {
      setInfoData(dashboardData.data.data.recentCompilations)
    }
  }, [dashboardData])

  const handleFilter = (selectedJobId: string) => {
    setJobId(selectedJobId)
  }

  return (
    <PagePanel
      title="Latest applicant scorecards"
      hint="A snapshot of how recent applicants scored on CV match, prescreening, and assessments. Filter by job to focus on one pipeline."
      action={<FilterByJobs onFilter={handleFilter} />}>
      {isLoading ? (
        <Spinner fullPage />
      ) : error ? (
        <Alert severity="error">Error Fetching Data</Alert>
      ) : infoData.length === 0 ? (
        <EmptyState
          title="No scorecards yet"
          description="Once candidates apply and complete stages, their scores appear here so you can shortlist faster."
          action={
            <Button onClick={() => navigate('/recruiterDashboard/myJobPosts')}>
              View job posts
            </Button>
          }
        />
      ) : (
        <div className={styles.list}>
          {infoData.map((row, index) => (
            <article
              key={`${row.applicantName}-${index}`}
              className={styles.row}>
              <div className={styles.applicant}>
                <div className={styles.avatar} aria-hidden>
                  {(row.applicantName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={styles.name}>
                    {row.applicantName || 'Applicant'}
                  </p>
                  <p className={styles.role}>{row.role || 'Role not set'}</p>
                </div>
              </div>

              <div className={styles.metrics}>
                {METRICS.map((metric) => {
                  const raw =
                    metric.key === 'personalizedScore'
                      ? row.personalizedScore ?? row.personalizedAss
                      : row[metric.key]
                  const score = metric.isScore
                    ? parseScore(raw as number | string | null)
                    : null
                  const personality = raw == null ? '' : String(raw).trim()
                  return (
                    <div key={metric.key} className={styles.metric}>
                      <span className={styles.metricLabel}>{metric.label}</span>
                      {metric.isScore ? (
                        <>
                          <div className={styles.track}>
                            <span
                              className={`${styles.fill} ${scoreTone(score)}`}
                              style={{ width: `${Math.min(score ?? 0, 100)}%` }}
                            />
                          </div>
                          <span className={styles.metricValue}>
                            {score == null ? '—' : `${Math.round(score)}%`}
                          </span>
                        </>
                      ) : (
                        <span className={styles.personality}>
                          {personality && personality.toLowerCase() !== 'nill'
                            ? personality
                            : '—'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </PagePanel>
  )
}

export default RecentCompilation
