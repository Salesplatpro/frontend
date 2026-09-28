import React, { useEffect, useId, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { useTourStore } from '@/features/product-tour'

import styles from './Guide.module.scss'
import { filterGuide } from './guideContent'

const Guide = () => {
  const { hash } = useLocation()
  const [query, setQuery] = useState('')
  const searchId = useId()
  const sections = filterGuide(query)
  const startTour = useTourStore((state) => state.start)

  useEffect(() => {
    if (!hash) return
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!target) return
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }, [hash])

  return (
    <PageShell>
      <PageHero
        compact
        title="Guide"
        lead="Short answers on what each page and field does."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => startTour('recruiter')}>
            Take the tour again
          </Button>
        }
      />

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Guide sections">
          <p className={styles.tocTitle}>On this page</p>
          <ul className={styles.tocList}>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.tocLink}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.content}>
          <label htmlFor={searchId} className={styles.searchLabel}>
            Search the guide
          </label>
          <input
            id={searchId}
            type="search"
            className={styles.search}
            placeholder="e.g. CV match, pay, shortlist"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {sections.length === 0 && (
            <p className={styles.empty} role="status">
              Nothing matches “{query.trim()}”. Try another word.
            </p>
          )}

          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              tabIndex={-1}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
                {section.title}
              </h2>
              <p className={styles.sectionIntro}>{section.intro}</p>
              <dl className={styles.entries}>
                {section.entries.map((entry) => (
                  <div
                    key={entry.id}
                    id={entry.id}
                    tabIndex={-1}
                    className={styles.entry}>
                    <dt className={styles.entryTitle}>{entry.title}</dt>
                    <dd className={styles.entryBody}>
                      {entry.body}
                      {entry.tip && (
                        <span className={styles.tip}>Tip: {entry.tip}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

export default Guide
