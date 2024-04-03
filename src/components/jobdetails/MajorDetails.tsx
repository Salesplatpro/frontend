import React from 'react'
import VerticalTabs from './VerticalTabs'
import AllDetails from './AllDetails'
import JobPoster from './JobPoster'

const MajorDetails = () => {
  return (
    <React.Fragment>
      <div className="job-mjr-details">
        <VerticalTabs/>
        <AllDetails/>
        <JobPoster/>
      </div>
    </React.Fragment>
  )
}

export default MajorDetails