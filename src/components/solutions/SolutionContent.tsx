import React from 'react'
import TalentSourcing from './TalentSourcing'

const SolutionContent = () => {
  return (
    <React.Fragment>
      <div className="solution-content">
        <div className="content">
          <div className="solutions">
            <p>Solutions</p>
            <div className="solute">
              <button>all</button>
              <button>Talent Sourcing</button>
              <button>Screening tools</button>
              <button>Job distribution</button>
              <button>Analytics and Reporting</button>
              <button>Candidate experience</button>
              <button>Management</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <TalentSourcing/>
            <TalentSourcing/>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SolutionContent