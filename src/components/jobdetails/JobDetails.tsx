import React from 'react'

import Footer from '../Footer'
import Navbar from '../Navbar'
import BreadCrumb from './BreadCrumb'
import JobDetailsHeader from './JobDetailsHeader'
import MajorDetails from './MajorDetails'

const JobDetails = () => {
  return (
    <React.Fragment>
      <div className="job-details">
        <div className="content">
          <BreadCrumb />
          <JobDetailsHeader />
          <div className="divider"></div>
          <MajorDetails />
        </div>
      </div>
    </React.Fragment>
  )
}

export default JobDetails
