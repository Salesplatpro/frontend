import React, { useState } from 'react'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { dashboardPathForRole } from '@/features/auth/utils/dashboardPath'
import { useSubmitFeedbackMutation } from '@/redux/api/apiSlice'
import { focusFieldByName } from '@/utils/focusField'
import { getErrorMessage } from '@/utils/getErrorMessage'

import styles from './FeedbackPage.module.scss'

const COPY = {
  talent: {
    kicker: 'Talent feedback',
    lead: 'Tell us how job search, applications, and assessments feel in practice. Specific notes help us fix the right things.',
    points: [
      'What made applying or screening harder than it should be',
      'What helped you show your experience clearly',
      'Anything missing from jobs, pipeline, or your dashboard',
    ],
  },
  recruiter: {
    kicker: 'Recruiter feedback',
    lead: 'Tell us how hiring, AI recommendations, and company tools are working for your team. Concrete examples are most useful.',
    points: [
      'Where screening or shortlisting slowed you down',
      'Whether AI recommendations matched what you saw in the CV and answers',
      'Anything missing from jobs, company, or candidate views',
    ],
  },
  admin: {
    kicker: 'Product feedback',
    lead: 'Share what is working in the admin tools and what is getting in the way. We read every note.',
    points: [
      'Broken or confusing admin workflows',
      'Reports or data you expected to see',
      'Anything that should work differently for support',
    ],
  },
} as const

const copyForRole = (role?: string) => {
  if (role === 'recruiter') return COPY.recruiter
  if (role === 'admin') return COPY.admin
  return COPY.talent
}

export const FeedbackPage = () => {
  const userRole = useAuthStore((state) => state.user?.userRole)
  const navigate = useNavigate()
  const homePath = dashboardPathForRole(userRole)
  const copy = copyForRole(userRole)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation()

  const resetForm = () => {
    setSubject('')
    setMessage('')
    setError(null)
    setMessageError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!message.trim()) {
      setMessageError('Please enter a message.')
      focusFieldByName('feedback-message')
      return
    }
    setMessageError(null)
    setError(null)
    try {
      await submitFeedback({
        subject: subject.trim() || undefined,
        message: message.trim(),
      }).unwrap()
      resetForm()
      setSubmitted(true)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to submit feedback right now.'))
    }
  }

  return (
    <PageShell>
      <PageHero
        compact
        kicker={copy.kicker}
        title="Leave us feedback"
        lead={copy.lead}
      />

      {submitted ? (
        <PagePanel>
          <div className={styles.success}>
            <IoCheckmarkCircle className={styles.successIcon} aria-hidden />
            <h2 className={styles.successTitle}>Thanks — we got it</h2>
            <p className={styles.successCopy}>
              Your note is with the team. We use this to improve AuxHR for
              talent and recruiters.
            </p>
            <div className={styles.successActions}>
              <Button type="button" onClick={() => setSubmitted(false)}>
                Send more feedback
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(homePath)}>
                Back to dashboard
              </Button>
            </div>
          </div>
        </PagePanel>
      ) : (
        <div className={styles.layout}>
          <aside className={styles.aside}>
            <div className={styles.asideIcon} aria-hidden>
              <HiOutlineChatBubbleLeftRight size={28} />
            </div>
            <h2 className={styles.asideTitle}>What to include</h2>
            <p className={styles.asideLead}>
              The more specific the example, the faster we can act on it.
            </p>
            <ul className={styles.asideList}>
              {copy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>

          <PagePanel title="Your message">
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="feedback-subject" className={styles.label}>
                  Subject <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  id="feedback-subject"
                  type="text"
                  className={styles.input}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="A short headline for your note"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="feedback-message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="feedback-message"
                  name="feedback-message"
                  className={`${styles.textarea} ${
                    messageError ? styles.invalid : ''
                  }`}
                  rows={8}
                  value={message}
                  aria-invalid={messageError ? true : undefined}
                  onChange={(event) => {
                    setMessage(event.target.value)
                    if (messageError) setMessageError(null)
                  }}
                  placeholder="What happened, where you were, and what you expected instead."
                />
                {messageError && (
                  <p className={styles.error} role="alert">
                    {messageError}
                  </p>
                )}
              </div>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}>
                  Clear
                </Button>
                <Button type="submit" variant="primary" loading={isLoading}>
                  Submit feedback
                </Button>
              </div>
            </form>
          </PagePanel>
        </div>
      )}
    </PageShell>
  )
}
