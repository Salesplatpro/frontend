import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { EditAiConfig } from './EditAiConfig'
import { EditJob } from './EditJob'

const tabs = [
  {
    id: '1',
    tab: 'editjobdetails',
    title: 'Edit Job',
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

  // Active tab always starts with 'editjobdetails'
  const [activeTab, setActiveTab] = useState('editjobdetails')

  // This state controls access to AI Config
  const [aiConfigAccessGranted, setAiConfigAccessGranted] = useState(false)

  const renderContent = () => {
    if (activeTab === 'aiconfig') {
      if (aiConfigAccessGranted) return <EditAiConfig />
    }

    return <EditJob jobId={jobId} />
  }

  return (
    <div className="p-4">
      <div>
        <h2 className="text-[#101828] text-[32px] mt-1 font-bold">Edit Job</h2>
        Modify existing job needed to land a role with your organization
        <p className="text-[#101828] text-[20px] font-medium"></p>
        <div className="mt-8 flex flex-row md:space-x-10 space-x-4 items-center justify-center">
          {tabs.map((tab, i) => {
            const isDisabled = tab.tab === 'aiconfig' && !aiConfigAccessGranted
            return (
              <div
                key={i}
                className={`${
                  activeTab === tab.tab
                    ? 'border-[#006BFF] border-t-4 text-[#006BFF]'
                    : 'border-t-4 text-[#344054]'
                } md:min-w-[232px] w-[232px] md:py-2 py-1 text-[14px] ${
                  isDisabled ? 'cursor-not-allowed opacity-50' : ''
                }`}>
                <button
                  onClick={() => !isDisabled && setActiveTab(tab.tab)}
                  className="flex flex-col w-full text-left"
                  disabled={isDisabled}>
                  <h5 className="font-bold">{tab.title}</h5>
                  <p>{tab.description}</p>
                </button>
              </div>
            )
          })}
        </div>
        {renderContent()}
      </div>
    </div>
  )
}
