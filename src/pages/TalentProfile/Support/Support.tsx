import React, { useState } from 'react'

import { PageHero, pageHeroStyles } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { useProfile } from '@/features/profile/hooks/useProfile'

import { Button } from '../../../components'
import ProfilePic from '../Profile/ProfilePic'
import styles from './Support.module.scss'

export const Support = () => {
  const { profile: userInfo } = useProfile()
  const maxLength = 40
  const [values, setValues] = useState({
    name: `${userInfo?.firstName} ${userInfo?.lastName}`,
    email: `${userInfo?.email}`,
    role: `${userInfo?.userRole}`,
    message: '',
  })

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    if (newMessage.length <= maxLength) {
      setValues((prev) => ({
        ...prev,
        message: newMessage,
      }))
    }
  }

  return (
    <PageShell>
      <PageHero
        identity={
          <div className={pageHeroStyles.avatarRing}>
            <ProfilePic />
          </div>
        }
        title="Fill Support Form"
        lead="Fill this form with the complaints you have, with correct details. We will get back to you as soon as we can."
      />
      <PagePanel>
        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              maxLength={maxLength}
              className={styles.textarea}
              placeholder="Tell us what is in your mind"
              value={values.message}
              onChange={handleMessageChange}
            />
            <span className={styles.hint}>
              You have {maxLength - values.message.length} characters left
            </span>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                type="text"
                className={styles.readonlyInput}
                value={`${userInfo?.firstName} ${userInfo?.lastName}`}
                disabled
                readOnly
              />
            </div>
            <div className={styles.half}>
              <label htmlFor="role" className={styles.label}>
                Role
              </label>
              <input
                id="role"
                type="text"
                className={styles.readonlyInput}
                value={`${userInfo?.userRole ?? ''}`}
                disabled
                readOnly
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.readonlyInput}
              value={`${userInfo?.email ?? ''}`}
              disabled
              readOnly
            />
          </div>

          {values.message.length > 1 && (
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => setValues((prev) => ({ ...prev, message: '' }))}>
                Cancel
              </Button>
              <Button onClick={() => console.log(values)}>Done</Button>
            </div>
          )}
        </div>
      </PagePanel>
    </PageShell>
  )
}
