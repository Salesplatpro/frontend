import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  getTalentHasEmbedding,
  reprocessCv,
} from '@/features/profile/services/reprocessCv'
import { getToken } from '@/utils/authUtils'
import { baseUrl } from '@/utils/baseConfig'
import { notify } from '@/utils/toastNotifications'

import styles from './ViewCvPage.module.scss'

export const ViewCvPage = () => {
  const { talentId } = useParams<{ talentId: string }>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEmbedding, setHasEmbedding] = useState(true)
  const [isReprocessing, setIsReprocessing] = useState(false)

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
    getTalentHasEmbedding(talentId)
      .then((value) => {
        if (!cancelled) setHasEmbedding(value)
      })
      .catch(() => {
        // Non-critical — leave the "Re-analyze CV" button hidden if the
        // status check itself fails.
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [talentId])

  const handleReprocess = async () => {
    if (!talentId) return
    setIsReprocessing(true)
    try {
      await reprocessCv(talentId)
      setHasEmbedding(true)
      notify('success', 'CV re-analyzed', { autoClose: 2000 })
    } catch {
      notify('error', 'Failed to re-analyze CV', { autoClose: 2000 })
    } finally {
      setIsReprocessing(false)
    }
  }

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
        <div className={styles.actions}>
          {!hasEmbedding && (
            <Button
              variant="outline"
              size="sm"
              loading={isReprocessing}
              onClick={handleReprocess}>
              Re-analyze CV
            </Button>
          )}
          <a
            className={styles.download}
            href={pdfUrl}
            download="candidate-cv.pdf">
            Download PDF
          </a>
        </div>
      </header>
      <iframe title="Candidate CV" src={pdfUrl} className={styles.frame} />
    </div>
  )
}
