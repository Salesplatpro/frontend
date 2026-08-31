import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'

import AiConfig from './AiConfig/AiConfig'
import PostJob from './PostJob'
import styles from './PostJobTab.module.scss'

const tabs = [
  {
    id: '1',
    tab: 'jobdetails',
    title: 'Job details',
    description: 'Describe the role',
  },
  {
    id: '2',
    tab: 'aiconfig',
    title: 'Screening setup',
    description: 'Configure assessments',
  },
]

const PostJobTab = () => {
  const { jobId } = useParams()
  const [activeTab, setActiveTab] = useState(jobId ? 'aiconfig' : 'jobdetails')

  useEffect(() => {
    setActiveTab(jobId ? 'aiconfig' : 'jobdetails')
  }, [jobId])

  const renderContent = () => {
    switch (activeTab) {
      case 'aiconfig':
        return <AiConfig />
      case 'jobdetails':
        return <PostJob />
      default:
        return <PostJob />
    }
  }

  return (
    <PageShell>
      <PageHero
        compact
        title="Create a job"
        lead="Two steps: describe the role, then choose how applicants are screened."
      />

      <div className={styles.tabList} role="tablist">
        {tabs.map((tab, index) => {
          const isDisabled = tab.tab === 'aiconfig' && !jobId
          const isActive = activeTab === tab.tab
          const tabItemClass = [
            styles.tabItem,
            isActive ? styles.active : '',
            isDisabled ? styles.disabled : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <React.Fragment key={tab.id}>
              {index > 0 ? (
                <span className={styles.tabChain} aria-hidden>
                  /
                </span>
              ) : null}
              <div className={tabItemClass}>
                <button
                  className={styles.tabButton}
                  onClick={() => !isDisabled && setActiveTab(tab.tab)}
                  disabled={isDisabled}
                  role="tab"
                  aria-selected={isActive}>
                  <span className={styles.tabIndex}>{tab.id}</span>
                  <span className={styles.tabCopy}>
                    <span className={styles.tabTitle}>{tab.title}</span>
                    <span className={styles.tabDesc}>{tab.description}</span>
                  </span>
                </button>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      <div className={styles.content} role="tabpanel">
        {renderContent()}
      </div>
    </PageShell>
  )
}

export default PostJobTab
