import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '../../../components/Loading/Loading'
import { useIndividualJobQuery } from '../../../redux/api/talent'
import { EditJobType } from '../../../utils'
import { notify } from '../../../utils/toastNotifications'
import { EditAiConfig } from './EditAiConfig'
import { EditJob } from './EditJob'
// import { useGetAiConfigQuery, usePatchAiConfigMutation } from '../../../redux/api/recruiter'

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
  const [activeTab, setActiveTab] = useState('editjobdetails')
  const [jobToEdit, setJobToEdit] = useState<EditJobType | null>(null)

  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const aiConfigId = data?.data?.aiConfig || ''

  useEffect(() => {
    if (data) {
      setJobToEdit(data?.data)
    }
    if (error) {
      notify('error', 'DisplayError loading job post')
    }
  }, [data, error])

  if (isLoading) return <Loading />

  const renderContent = () => {
    if (activeTab === 'aiconfig') {
      return <EditAiConfig aiConfigId={aiConfigId} />
    }
    return <EditJob jobId={jobId} jobToEdit={jobToEdit} />
  }

  return (
    <div className="p-4">
      <div>
        <h2 className="text-[#101828] text-[32px] mt-1 font-bold">Edit Job</h2>
        Modify existing job needed to land a role with your organization
        <p className="text-[#101828] text-[20px] font-medium"></p>
        <div className="mt-8 flex flex-row md:space-x-10 space-x-4 items-center justify-center">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`${
                activeTab === tab.tab
                  ? 'border-[#006BFF] border-t-4 text-[#006BFF]'
                  : 'border-t-4 text-[#344054]'
              } md:min-w-[232px] w-[232px] md:py-2 py-1 text-[14px]`}>
              <button
                onClick={() => setActiveTab(tab.tab)}
                className="flex flex-col w-full text-left">
                <h5 className="font-bold">{tab.title}</h5>
                <p>{tab.description}</p>
              </button>
            </div>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  )
}
