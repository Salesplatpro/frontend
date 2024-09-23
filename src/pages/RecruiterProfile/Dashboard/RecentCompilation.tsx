import React from 'react'
import { FiFilter } from 'react-icons/fi'

const RecentCompilation = () => {
  const rows = [
    {
      name: 'Matthew Elijah',
      role: 'Designer',
      experience: '5 years',
      metrics: {
        cvMatch: '67%',
        preScreening: '67%',
        personalizedAss: '67%',
        personality: 'INTJ',
      },
    },
    {
      name: 'Matthew Elijah',
      role: 'Designer',
      experience: '5 years',
      metrics: {
        cvMatch: '67%',
        preScreening: '67%',
        personalizedAss: '67%',
        personality: 'INTJ',
      },
    },
    {
      name: 'Matthew Elijah',
      role: 'Designer',
      experience: '5 years',
      metrics: {
        cvMatch: '67%',
        preScreening: '67%',
        personalizedAss: '67%',
        personality: 'INTJ',
      },
    },
  ]

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold">Recent Compilation</h4>
        {/* Filter Button */}
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
          <FiFilter className="text-gray-600" />
          <span className="text-gray-600">Filters</span>
        </button>
      </div>
      <div className="space-y-8">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex justify-between p-4 bg-[#F8F8F8] rounded-2xl ">
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/50"
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-lg font-semibold">{row.name}</p>
                <p className="text-sm text-gray-500">{row.role}</p>
                <p className="text-sm text-gray-500">{row.experience}</p>
              </div>
            </div>

            {/* Right section with metrics */}
            <div className="text-right space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">CV Matching</span>
                <span className="font-semibold">{row.metrics.cvMatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prescreening</span>
                <span className="font-semibold">
                  {row.metrics.preScreening}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Personalised Ass</span>
                <span className="font-semibold">
                  {row.metrics.personalizedAss}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Personality Ass</span>
                <span className="font-semibold">{row.metrics.personality}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentCompilation
