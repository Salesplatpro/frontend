import React from 'react'

// @ts-ignore
import arrowIcon from '../../assets/Iconarrow.svg'
import TalentSourcing from './TalentSourcing'

const SolutionContent = () => {
  return (
    <React.Fragment>
      <div className="solution-content">
        <div className="content">
          <div className="solutions">
            <p>Solutions</p>
            <div className="solute">
              <div className="custom-select-container">
                <select className="custom-select">
                  <option value="" disabled selected hidden>
                    All
                  </option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
                <img src={arrowIcon} alt="" />
              </div>
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
            <TalentSourcing />
            <TalentSourcing />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SolutionContent
