import React from 'react'
import { Link } from 'react-router-dom'

const SolutionHeader = () => {
  return (
    <React.Fragment>
      <div className="solution-header">
        <div className="content">
          <div className="main-texts">
            <p>Products and solutions</p>
            <h3 data-testId="heading">All you need to find the best talents</h3>
          </div>

          <p className="supporting-text">
            Untitled is a technology company that builds infrastructure for your
            startup, so you don&#39;t have to. Businesses of every size—from new
            startups to public companies—use our software to manage their
            businesses.
          </p>
          <Link to="/pricing">
            <button>Check out our pricing</button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SolutionHeader
