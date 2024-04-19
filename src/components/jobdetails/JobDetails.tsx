import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import BreadCrumb from './BreadCrumb'
import JobDetailsHeader from './JobDetailsHeader'
import MajorDetails from './MajorDetails'

const JobDetails = () => {
  return (
    <React.Fragment>
      <div className="job-details">
        <div className="content">
          <BreadCrumb/>
          <JobDetailsHeader/>
          <div className="divider"></div>
          <MajorDetails/>
        </div>
      </div>
    </React.Fragment>
  )
}

export default JobDetails