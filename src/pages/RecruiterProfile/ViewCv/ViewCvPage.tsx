import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getToken } from '@/utils/authUtils'
import { baseUrl } from '@/utils/baseConfig'

import styles from './ViewCvPage.module.scss'

export const ViewCvPage = () => {
  const { talentId } = useParams<{ talentId: string }>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!talentId) {
      setError('Missing talent id')
      setIsLoading(false)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    const load = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${baseUrl}/user/profile/${talentId}/cv`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!response.ok) {
          throw new Error('Failed to load CV')
        }

        const blob = await response.blob()
        if (cancelled) return

        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch {
        if (!cancelled)
          setError('Unable to open this CV. It may not be available yet.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [talentId])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Spinner fullPage />
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div className={styles.page}>
        <div className={styles.message}>{error || 'CV not available'}</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Candidate CV</h1>
          <p className={styles.subtitle}>
            Generated from the extracted resume text for secure recruiter
            review.
          </p>
        </div>
        <a
          className={styles.download}
          href={pdfUrl}
          download="candidate-cv.pdf">
          Download PDF
        </a>
      </header>
      <iframe title="Candidate CV" src={pdfUrl} className={styles.frame} />
    </div>
  )
}
