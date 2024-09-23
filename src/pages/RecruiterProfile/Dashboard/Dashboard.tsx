import React from 'react'
import ApplicationTracker from './ApplicationTracker'
import RecentApplications from './RecentApplications'
import RecentCompilation from './RecentCompilation'
import DashboardStats from './DashboardStats'

const Dashboard = () => {
  return (
    <div className="w-[80%] mx-auto mt-10">
      <div>
        <ApplicationTracker />
        {/* <DashboardStats /> */}
      </div>
      <div className="mt-7">
        <RecentApplications />
      </div>
      <div className="mt-7">
        <RecentCompilation />
      </div>
    </div>
  )
}

export default Dashboard
