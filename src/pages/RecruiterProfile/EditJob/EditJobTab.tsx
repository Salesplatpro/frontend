import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { EditJobType } from '@/utils'
import { notify } from '@/utils/toastNotifications'

import tabStyles from '../PostJobs/PostJobTab.module.scss'
import { EditAiConfig } from './EditAiConfig'
import { EditJob } from './EditJob'

const tabs = [
  {
    id: '1',
    tab: 'editjobdetails',
    title: 'Edit job',
    description: 'Edit job details',
  },
  {
    id: '2',
    tab: 'aiconfig',
    title: 'Edit config',
    description: 'Edit AI config',
  },
]

export const EditJobTab = () => {
  const { jobId } = useParams()
  const [activeTab, setActiveTab] = useState('editjobdetails')
  const [jobToEdit, setJobToEdit] = useState<EditJobType | null>(null)

  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const aiConfigId = data?.data?.aiConfig || ''

  useEffect(() => {
    if (data) {
      setJobToEdit(data?.data)
    }
    if (error) {
      notify('error', 'Error loading job post')
    }
  }, [data, error])

  if (isLoading) return <Spinner fullPage />

  const renderContent = () => {
    if (activeTab === 'aiconfig') {
      return <EditAiConfig aiConfigId={aiConfigId} />
    }
    return <EditJob jobId={jobId} jobToEdit={jobToEdit} />
  }

  return (
    <div className={tabStyles.page}>
      <h2 className={tabStyles.heading}>Edit job</h2>
      <p className={tabStyles.subheading}>Modify your existing job post</p>

      <div className={tabStyles.tabList} role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.tab
          const tabItemClass = [
            tabStyles.tabItem,
            isActive ? tabStyles.active : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div key={tab.id} className={tabItemClass}>
              <button
                className={tabStyles.tabButton}
                onClick={() => setActiveTab(tab.tab)}
                role="tab"
                aria-selected={isActive}>
                <span className={tabStyles.tabTitle}>{tab.title}</span>
                <span className={tabStyles.tabDesc}>{tab.description}</span>
              </button>
            </div>
          )
        })}
      </div>

      <div className={tabStyles.content} role="tabpanel">
        {renderContent()}
      </div>
    </div>
  )
}
