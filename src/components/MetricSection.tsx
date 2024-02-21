import React from 'react'

const MetricSection = () => {
  return (
    <React.Fragment>
      <div className="metrics">
        <div className="inners">
          <div className="texts">
            <h5>Your one-stop-shop for talent acquisition</h5>
            Efficiently list job openings, assess candidates' qualifications, and streamline the entire hiring process with smart automation features.
          </div>

          <div className="infographics">
            <div>
              <h3>$1M</h3>
              <p>Salary worth of Jobs generated every year</p>
            </div>

            <div>
              <h3>100k+</h3>
              <p>Talents reach</p>
            </div>

            <div>
              <h3>20k+</h3>
              <p>Applications processed</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MetricSection