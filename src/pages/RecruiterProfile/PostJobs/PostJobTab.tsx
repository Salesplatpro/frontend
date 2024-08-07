import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AiConfig from './AiConfig'
import PostJob from './PostJob'
import Question from './Question'

const tabs = [
  {
    id: '1',
    tab: 'aiconfig',

    title: 'Ai config',
    description: 'Select your preferred Ai config',
  },
  {
    id: '2',
    tab: 'jobdetails',
    title: 'Job details',
    description: 'Enter job details',
  },
  // {
  //   id: '3',
  //   tab: 'question',

  //   title: 'Question (Optional)',
  //   description: 'Set questions/tests for applicants',
  // },
]

const PostJobTab = () => {
  const { aiConfigId } = useParams()

  const [activeTab, setActiveTab] = useState('aiconfig')

  useEffect(() => {
    if (aiConfigId) {
      setActiveTab('jobdetails')
    } else {
      setActiveTab('aiconfig')
    }
  }, [aiConfigId])

  const renderContent = () => {
    switch (activeTab) {
      case 'aiconfig':
        return <AiConfig />
      case 'jobdetails':
        return <PostJob />
      // case 'question':
      //   return <Question />
      default:
        return <PostJob />
    }
  }

  return (
    <div className="p-4">
      <div>
        <p className="text-[#333333] text-[13px]">Back</p>
        <h2 className="text-[#101828] text-[30px] mt-1 font-bold">
          Create a new job
        </h2>
        <div className="mt-2 flex flex-row space-x-10 items-center justify-center border-b-2">
          {tabs.map((tab, i) => {
            const isDisabled = tab.tab === 'jobdetails' && !aiConfigId
            return (
              <div
                key={i}
                className={`${
                  activeTab === tab.tab
                    ? 'border-blue-600 border-t-4 text-blue-600'
                    : 'border-t-4 text-[#344054]'
                } min-w-[202px] py-2 ${
                  isDisabled ? 'cursor-not-allowed opacity-50' : ''
                }`}>
                <button
                  onClick={() => !isDisabled && setActiveTab(tab.tab)}
                  className={`flex flex-col`}
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

export default PostJobTab

// 66a770225bf1f480d5b3d34a
