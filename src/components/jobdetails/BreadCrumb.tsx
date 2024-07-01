import React from 'react'

const BreadCrumb = () => {
  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <a href="" className="tab">
          all jobs
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none">
          <path
            d="M6 12L10 8L6 4"
            stroke="#D0D5DD"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <a href="" className="tab active">
          job details
        </a>
      </div>
    </React.Fragment>
  )
}

export default BreadCrumb
