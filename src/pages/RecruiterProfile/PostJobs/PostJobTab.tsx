import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AiConfig from './AiConfig/AiConfig'
import PostJob from './PostJob'
import styles from './PostJobTab.module.scss'

const tabs = [
  {
    id: '1',
    tab: 'jobdetails',
    title: 'Job details',
    description: 'Enter job details',
  },
  {
    id: '2',
    tab: 'aiconfig',
    title: 'AI config',
    description: 'Select AI config',
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
    <div className={styles.page}>
      <h2 className={styles.heading}>Create a new job</h2>
      <p className={styles.subheading}>
        Input information needed to land a role with your organization
      </p>

      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => {
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
            <div key={tab.id} className={tabItemClass}>
              <button
                className={styles.tabButton}
                onClick={() => !isDisabled && setActiveTab(tab.tab)}
                disabled={isDisabled}
                role="tab"
                aria-selected={isActive}>
                <span className={styles.tabTitle}>{tab.title}</span>
                <span className={styles.tabDesc}>{tab.description}</span>
              </button>
            </div>
          )
        })}
      </div>

      <div className={styles.content} role="tabpanel">
        {renderContent()}
      </div>
    </div>
  )
}

export default PostJobTab
