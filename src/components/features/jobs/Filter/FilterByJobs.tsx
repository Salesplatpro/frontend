import React, { useState } from 'react'
import { IoFilterOutline } from 'react-icons/io5'

import { useFetchRecruiterJobPostQuery } from '@/redux/api/recruiter'

interface FilterByJobsProps {
  onFilter: (jobId: string) => void
}

interface Job {
  id: string
  role: {
    name: string
  }
}

const FilterByJobs: React.FC<FilterByJobsProps> = ({ onFilter }) => {
  const { data: jobData, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleFilterSelect = (jobId: string) => {
    onFilter(jobId)
    setDropdownVisible(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className="flex items-center space-x-2 px-4 py-2 border border-[#4884DF] rounded-t-lg hover:bg-gray-100">
        <IoFilterOutline className="text-gray-600" />
        <span className="text-grey-700 text-sm font-medium">Filters</span>
      </button>

      {/* Dropdown List */}
      {dropdownVisible && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <p className="p-4">Loading jobs...</p>
          ) : error ? (
            <p className="p-4 text-red-500">Error loading jobs</p>
          ) : (
            <div className="">
              {jobData?.data?.map((job: Job) => (
                <div
                  key={job.id}
                  onClick={() => handleFilterSelect(job.id)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm break-words">
                  {job.role.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterByJobs
