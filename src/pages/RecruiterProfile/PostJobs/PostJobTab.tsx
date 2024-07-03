import React, { useState } from 'react'
import PostJob from './PostJob'
import AiConfig from './AiConfig'
import Question from './Question'

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

    title: 'Ai config',
    description: 'Select your preferred Ai config',
  },
  {
    id: '3',
    tab: 'question',

    title: 'Question (Optional)',
    description: 'Set questions/tests for applicants',
  },
]

const PostJobTab = () => {
  const [activeTab, setActiveTab] = useState('jobdetails')

  const renderContent = () => {
    switch (activeTab) {
      case 'jobdetails':
        return <PostJob />
      case 'aiconfig':
        return <AiConfig />
      case 'question':
        return <Question />
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
        <div className="mt-2 flex flex-row justify-between border-b-2">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`${
                activeTab === tab.tab
                  ? 'border-blue-600 border-t-4 text-blue-600'
                  : 'border-t-4 text-[#344054]'
              } min-w-[232px]`}>
              <button
                onClick={() => setActiveTab(tab.tab)}
                className={` flex flex-col`}>
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

export default PostJobTab
