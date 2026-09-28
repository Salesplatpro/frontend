import React from 'react'
import { FaCheck } from 'react-icons/fa6'

import { workModeNeedsLocation } from '@/components/features/jobs/WorkTypeCheckboxes'
import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import { formatCompensation } from '@/utils/formatCompensation'
import { PostJobFormValues } from '@/utils/jobPostTypes'

import { htmlToPlainText } from '../utils/aiText'
import { jobChecklist } from './jobChecklist'
import styles from './JobPreview.module.scss'

const WORK_MODE_LABEL: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onSite: 'On-site',
}

const toNumber = (value: string) => {
  const parsed = Number(value)
  return value && Number.isFinite(parsed) ? parsed : null
}

type JobPreviewProps = {
  values: PostJobFormValues
  roleName: string
  companyName?: string | null
}

export const JobPreview = ({
  values,
  roleName,
  companyName,
}: JobPreviewProps) => {
  const checklist = jobChecklist(values)
  const doneCount = checklist.filter((item) => item.done).length

  const location = workModeNeedsLocation(values.workMode)
    ? [
        values.location.city.name,
        values.location.state.name,
        values.location.country.name,
      ]
        .filter(Boolean)
        .join(', ')
    : ''
  const pills = [
    ...values.workMode.map((mode) => WORK_MODE_LABEL[mode] ?? mode),
    location,
    values.experienceLevel,
  ].filter(Boolean)
  const pay =
    values.minSalary || values.maxSalary
      ? formatCompensation({
          currency: values.currency || null,
          minSalary: toNumber(values.minSalary),
          maxSalary: toNumber(values.maxSalary),
          compensationPeriod: values.compensationPeriod || null,
        })
      : null

  return (
    <aside className={styles.aside} aria-label="Job post preview">
      <section className={styles.checklist}>
        <p className={styles.checklistTitle}>
          {doneCount} of {checklist.length} done
        </p>
        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={checklist.length}
          aria-valuenow={doneCount}
          aria-label="Job details completed">
          <span
            className={styles.progressFill}
            style={{ width: `${(doneCount / checklist.length) * 100}%` }}
          />
        </div>
        <ul className={styles.checklistItems}>
          {checklist.map((item) => (
            <li
              key={item.key}
              className={item.done ? styles.itemDone : styles.itemTodo}>
              <span className={styles.itemMark} aria-hidden>
                {item.done ? <FaCheck /> : null}
              </span>
              {item.label}
              <span className={styles.srOnly}>
                {item.done ? ' (done)' : ' (to do)'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <p className={styles.kicker}>What candidates will see</p>
        <h3 className={styles.title}>
          {roleName ? capitalizeEachWord(roleName) : 'Job title'}
        </h3>
        {companyName && <p className={styles.company}>{companyName}</p>}
        {pills.length > 0 && (
          <ul className={styles.pills}>
            {pills.map((pill) => (
              <li key={pill} className={styles.pill}>
                {pill}
              </li>
            ))}
          </ul>
        )}
        {pay && <p className={styles.pay}>{pay}</p>}

        <h4 className={styles.sectionTitle}>About the role</h4>
        {htmlToPlainText(values.jobBrief ?? '') ? (
          <RichTextDisplay content={values.jobBrief} className={styles.rich} />
        ) : (
          <p className={styles.placeholder}>Your job brief appears here.</p>
        )}

        <h4 className={styles.sectionTitle}>Requirements</h4>
        {htmlToPlainText(values.requirements ?? '') ? (
          <RichTextDisplay
            content={values.requirements}
            className={styles.rich}
          />
        ) : (
          <p className={styles.placeholder}>Your requirements appear here.</p>
        )}

        {values.skills.length > 0 && (
          <>
            <h4 className={styles.sectionTitle}>Skills</h4>
            <ul className={styles.pills}>
              {values.skills.map((skill) => (
                <li key={skill} className={styles.skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </>
        )}

        {values.goals.length > 0 && (
          <>
            <h4 className={styles.sectionTitle}>Goals</h4>
            <ul className={styles.goals}>
              {values.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </aside>
  )
}
