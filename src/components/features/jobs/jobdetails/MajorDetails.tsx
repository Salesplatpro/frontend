import React from 'react'

import AllDetails from './AllDetails'
import JobPoster from './JobPoster'
import VerticalTabs from './VerticalTabs'

const MajorDetails = () => {
  return (
    <React.Fragment>
      <div className="job-mjr-details">
        <VerticalTabs />
        <AllDetails />
        <JobPoster />
      </div>
    </React.Fragment>
  )
}

export default MajorDetails
