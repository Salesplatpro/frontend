import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

import FilterByJobs from '@/components/features/jobs/Filter/FilterByJobs'
import { Spinner } from '@/components/ui/Spinner'

import profilePics from '../../../assets/profilePics2.webp'
import { useFetchDashboardQuery } from '../../../redux/api/recruiter'

interface CompilationTypes {
  applicantName: string
  role: string
  cvSimilarityScore: string
  prescreeningScore: string
  personalizedAss: string
  mbtiType: string
}
const RecentCompilation = () => {
  const [jobId, setJobId] = useState<string | null>(null)
  const [infoData, setInfoData] = useState<CompilationTypes[]>([])

  // Fetching data based on selected jobId
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useFetchDashboardQuery(jobId ? { jobId } : {})

  // Update the state with the fetched data
  useEffect(() => {
    if (dashboardData?.data?.data?.recentCompilations) {
      setInfoData(dashboardData.data.data.recentCompilations)
    }
  }, [dashboardData])

  // Handle filter selection
  const handleFilter = (selectedJobId: string) => {
    setJobId(selectedJobId)
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold">Recent Compilation</h4>
        <div>
          <FilterByJobs onFilter={handleFilter} />
        </div>
      </div>

      {/* Compilation Data */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner fullPage />
        </div>
      ) : error ? (
        <Alert severity="error">Error Fetching Data</Alert>
      ) : (
        <div className="space-y-8">
          {infoData.length > 0 ? (
            infoData.map((row, index) => (
              <div
                key={index}
                className="flex md:flex-row flex-col justify-between gap-8 p-4 bg-grey-50 rounded-2xl ">
                <div className="flex items-center space-x-4">
                  <img
                    src={profilePics}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-lg font-semibold">{row.applicantName}</p>
                    <p className="text-sm font-medium text-midnight">
                      {row.role}
                    </p>
                  </div>
                </div>

                {/* Right section with metrics */}
                <div className="text-right space-y-2">
                  <div className="flex justify-between md:w-[200px] w-full">
                    <span className="text-black">CV Matching</span>
                    <span className="font-medium">
                      score {row.cvSimilarityScore || 'nill'}
                    </span>
                  </div>
                  <div className="flex justify-between md:w-[200px] w-full">
                    <span className="text-black">Prescreening</span>
                    <span className="font-medium">
                      score {row.prescreeningScore || 'nill'}
                    </span>
                  </div>
                  <div className="flex justify-between md:w-[200px] w-full">
                    <span className="text-black">Personalised Ass</span>
                    <span className="font-medium">
                      score {row.personalizedAss || 'nill'}
                    </span>
                  </div>
                  <div className="flex justify-between md:w-[200px] w-full">
                    <span className="text-black">Personality Ass</span>
                    <span className="font-medium">
                      {row.mbtiType || 'nill'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No compilations available</p>
          )}
        </div>
      )}
    </div>
  )
}

export default RecentCompilation
