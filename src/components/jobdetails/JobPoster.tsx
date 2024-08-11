import React from 'react'

// @ts-ignore
import cypress from '../../assets/jobpost.png'
// @ts-ignore
import jop2 from '../../assets/jobpost.png'
import JobPost from '../explore/JobPost'

const jobs = [
  {
    title: 'Account Executive',
    description: 'We’re looking for an account executive to join our team.',
    color: '#3538CD',
    image: jop2,
    badge: 'Sales',
    bdbg: '#EEF4FF',
  },

  {
    title: 'SEO Marketing Manager',
    description:
      'We’re looking for an experienced SEO marketing manager to join our team.',
    color: '#C4320A',
    image: jop2,
    badge: 'Marketing',
    bdbg: '#FFF6ED',
  },
]

const JobPoster = () => {
  return (
    <React.Fragment>
      <div className="job-poster">
        <div className="poster-profile">
          <div className="content">
            <div className="limage">
              <img src={cypress} alt="" />
              <h5>Cypress</h5>
            </div>

            <div className="atn-btn">
              <button>View profile</button>
              <button className="apply">Apply</button>
            </div>

            <div className="divider"></div>

            <div className="details">
              <h6>Job type</h6>
              <p>Full-time</p>
            </div>

            <div className="details">
              <h6>Location</h6>
              <p>Melbourne, Australia</p>
            </div>

            <div className="details">
              <h6>Date Posted</h6>
              <p>Aug 15,2023</p>
            </div>
          </div>
        </div>

        <div className="recommended-jobs">
          <div className="content">
            <h4>You may also like</h4>
            <div className="jobs">
              {jobs.map((job, index) => (
                <JobPost
                  title={job.title}
                  description={job.description}
                  badge={job.badge}
                  color={job.color}
                  bdbg={job.bdbg}
                  image={job.image}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default JobPoster
