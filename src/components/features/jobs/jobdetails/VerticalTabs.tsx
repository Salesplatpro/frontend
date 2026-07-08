import React from 'react'

const VerticalTabs = () => {
  return (
    <React.Fragment>
      <div className="job-v-tabs">
        <h4>Jump to</h4>
        <div className="tabs">
          <button>Your role</button>
          <button>Responsibilities</button>
          <button>Requirements</button>
          <button>Nice to have</button>
          <button>Renumeration</button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default VerticalTabs
